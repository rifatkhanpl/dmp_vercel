// supabase/functions/parse-hcp-data/index.ts
// ---------- Types ----------
// ---------- CORS ----------
const DEFAULT_ALLOW_HEADERS = "authorization, content-type, apikey, x-client-info";
const corsBase = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
};
function allowHeadersFrom(req) {
  return req.headers.get("Access-Control-Request-Headers") ?? DEFAULT_ALLOW_HEADERS;
}
function jsonResponse(req, body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsBase,
      "Access-Control-Allow-Headers": allowHeadersFrom(req),
      "Content-Type": "application/json",
      ...extraHeaders
    }
  });
}
// ---------- Env ----------
function getEnvOrThrow(key) {
  const val = Deno.env.get(key);
  if (!val) throw new Error(`Missing required env: ${key}`);
  return val;
}
// ---------- HTML → Text (preserve alt text & line breaks) ----------
function decodeEntities(s) {
  return s.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}
function htmlToStructuredText(html) {
  let t = html;
  // Keep <noscript> content
  t = t.replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, " $1 ");
  // Inject IMG alt text into stream (e.g., Headshot of Name, M.D.)
  t = t.replace(/<img[^>]*\balt=["']([^"']+)["'][^>]*>/gi, (_, alt)=>`\n${alt}\n`);
  // Remove scripts/styles
  t = t.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  t = t.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Convert boundaries to newlines BEFORE stripping tags
  t = t.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|section|article|header|footer|li|h[1-6]|tr)>/gi, "\n").replace(/<(ul|ol|table|thead|tbody|tr)\b[^>]*>/gi, "\n").replace(/<(h[1-6])\b[^>]*>/gi, "\n");
  // Strip remaining tags, decode & clean
  t = t.replace(/<[^>]+>/g, " ");
  t = decodeEntities(t).replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{2,}/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
  return t;
}
// ---------- URL fetch ----------
async function fetchUrlContent(url) {
  const ctrl = new AbortController();
  const timeout = setTimeout(()=>ctrl.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HCP-Parser/2.1)",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const html = await res.text();
    return htmlToStructuredText(html);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch URL content: ${msg}`);
  } finally{
    clearTimeout(timeout);
  }
}
// ---------- Filters / Utils ----------
const DEG_RE = /\b(M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?)\b/i; // MBBS / MD / DO
function hasAllowedDegree(s) {
  return !!s && DEG_RE.test(s);
}
function normalizeName(n) {
  return (n ?? "").toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
}
function dedupeProviders(providers) {
  const seen = new Map();
  for (const p of providers){
    const key = `${normalizeName(p.name)}|${(p.specialty ?? "").toLowerCase().trim()}|${(p.pgyYear ?? "").toLowerCase().trim()}`;
    const prev = seen.get(key);
    if (!prev) {
      seen.set(key, p);
    } else {
      if ((p.confidence ?? 0) > (prev.confidence ?? 0)) {
        seen.set(key, {
          ...p,
          rawText: p.rawText ?? prev.rawText
        });
      } else if (!prev.rawText && p.rawText) {
        seen.set(key, {
          ...prev,
          rawText
        });
      }
    }
  }
  return Array.from(seen.values());
}
function isLikelyStaff(text) {
  if (!text) return false;
  return /(program director|associate program director|faculty|coordinator|DIO\b)/i.test(text);
}
function inferPGYFromText(s) {
  if (!s) return null;
  const m = s.match(/\bPGY[-–\s]?([123])\b/i);
  return m ? `PGY-${m[1]}` : null;
}
// Try to recover degree evidence from the source text near a name
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function makeNameRegex(name) {
  // tolerate quotes/nicknames and variable spaces
  const pattern = escapeRegex(name).replace(/\s+/g, "\\s+");
  return new RegExp(pattern, "i");
}
function snippetAround(text, idx, span = 120) {
  const start = Math.max(0, idx - Math.floor(span / 2));
  const end = Math.min(text.length, idx + Math.floor(span / 2));
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}
function ensureDegreeEvidence(providers, sourceText, allowedOnly) {
  if (!allowedOnly) return providers;
  const out = [];
  for (const p of providers){
    const already = hasAllowedDegree(p.name) || hasAllowedDegree(p.rawText);
    if (already) {
      out.push(p);
      continue;
    }
    // search for degree near the person's name in the source text
    const re = makeNameRegex(p.name);
    const m = sourceText.match(re);
    if (m && typeof m.index === "number") {
      // look forward a bit for degree token
      const lookStart = m.index;
      const lookEnd = Math.min(sourceText.length, lookStart + p.name.length + 80);
      const window = sourceText.slice(lookStart, lookEnd);
      if (DEG_RE.test(window)) {
        // keep and attach snippet
        out.push({
          ...p,
          rawText: p.rawText ?? snippetAround(sourceText, lookStart),
          confidence: Math.max(p.confidence ?? 0.8, 0.85)
        });
        continue;
      }
    }
  // no degree found -> drop
  }
  return out;
}
// ---------- Section & Chunking ----------
function normalizeForChunking(text) {
  let t = text;
  t = t.replace(/\s+(Headshot of\s+[^\n]+)\s+/gi, "\n$1\n");
  t = t.replace(/\s+(Class of\s+\d{4})/gi, "\n$1\n");
  // broader headers to match more sites
  t = t.replace(/\s+(Categorical Residents?|Categorical|Preliminary Residents?|Medicine\/Pediatrics|Interns)\b/gi, "\n$1\n");
  t = t.replace(/\s+(PGY\s*[123]\b)/gi, "\n$1\n");
  t = t.replace(/\s+(Meet The Residents?)/i, "\n$1\n");
  t = t.replace(/\n{2,}/g, "\n");
  return t.trim();
}
function splitByProgramSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let buf = [];
  const isSectionHeader = (s)=>/^Class of\s+\d{4}$/i.test(s) || /^Categorical Residents?$/i.test(s) || /^Categorical$/i.test(s) || /^Preliminary Residents?$/i.test(s) || /^Medicine\/Pediatrics$/i.test(s) || /^Interns$/i.test(s) || /^Meet The Residents?$/i.test(s);
  for (const raw of lines){
    const line = raw.trim();
    if (!line) continue;
    if (isSectionHeader(line)) {
      if (buf.length) sections.push(buf.join("\n").trim());
      buf = [
        line
      ];
    } else {
      buf.push(line);
    }
  }
  if (buf.length) sections.push(buf.join("\n").trim());
  return sections.filter((s)=>s.split("\n").length >= 5);
}
function chunkText(input, maxChars = 5_500) {
  if (input.length <= maxChars) return [
    input
  ];
  const chunks = [];
  let start = 0;
  while(start < input.length){
    let end = Math.min(start + maxChars, input.length);
    const boundary = input.lastIndexOf("\n", end);
    if (boundary > start + maxChars * 0.6) end = boundary;
    chunks.push(input.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}
// ---------- OpenAI (per chunk) ----------
async function parseChunkWithOpenAI(text, opts) {
  const OPENAI_API_KEY = getEnvOrThrow("OPENAI_API_KEY");
  // AY anchor to help with PGY inference if the site uses "Class of YYYY"
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const academicYearStart = month >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
  const system = "You extract resident/fellow (trainee) records from program pages. Respond with STRICT JSON only (no markdown, no code fences).";
  const hintLines = [];
  if (opts.specialtyHint) hintLines.push(`Specialty hint: ${opts.specialtyHint}`);
  if (opts.allowedDegreesOnly) hintLines.push("Only include entries with MD, DO, or MBBS near the name.");
  hintLines.push(`Academic year starts in July; current AY anchor: ${academicYearStart}. If 'Class of YYYY' is present for 3-year programs (IM/FM), map roughly: AY+(3->PGY-1, 2->PGY-2, 1->PGY-3). If unclear, leave pgyYear empty or infer from explicit PGY tags.`);
  const user = `
Extract TRAINEE records (residents/fellows only; ignore staff/faculty/coordinators/directors) from the text.

Schema:
{"providers":[{"name":string,"specialty":string,"pgyYear":string,"confidence":number,"email":string|null,"phone":string|null,"location":string|null,"rawText":string|null}]}

Rules:
- Output MINIFIED JSON (no spaces or newlines). No markdown. No code fences.
- Include ONLY trainees.
- ${opts.allowedDegreesOnly ? "Require MD, DO, or MBBS near the name." : "Prefer MD/DO/MBBS if present."}
- If PGY appears (e.g., PGY1/PGY-2) use it; else you may infer from nearby 'Class of YYYY' headers per the hint; otherwise leave empty.
- Use the specialty hint unless the text clearly indicates another specialty.
- Keep rawText ≤120 chars if included.
- confidence ∈ [0,1].
- Return AT MOST 20 providers for this chunk.
- If none found, return {"providers":[]}.

${hintLines.length ? `Hints:${hintLines.map((h)=>`\n- ${h}`).join("")}` : ""}

Text:
${text}
  `.trim();
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: system
        },
        {
          role: "user",
          content: user
        }
      ],
      temperature: 0,
      max_tokens: 1400,
      response_format: {
        type: "json_object"
      }
    })
  });
  const bodyText = await resp.text();
  if (!resp.ok) throw new Error(`OpenAI ${resp.status}: ${bodyText}`);
  let envelope;
  try {
    envelope = JSON.parse(bodyText);
  } catch  {
    throw new Error(`Unexpected OpenAI payload (non-JSON envelope): ${bodyText.slice(0, 400)}`);
  }
  const content = envelope?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`Unexpected OpenAI payload (missing content): ${bodyText.slice(0, 400)}`);
  }
  // Strict parse
  let extracted;
  try {
    extracted = JSON.parse(content);
  } catch  {
    const i = content.lastIndexOf("}");
    if (i > 0) {
      try {
        extracted = JSON.parse(content.slice(0, i + 1));
      } catch  {
        const hint = content.length > 400 ? content.slice(0, 400) + "…" : content;
        throw new Error(`Model returned non-JSON content: ${hint}`);
      }
    } else {
      const hint = content.length > 400 ? content.slice(0, 400) + "…" : content;
      throw new Error(`Model returned non-JSON content: ${hint}`);
    }
  }
  let providers = Array.isArray(extracted?.providers) ? extracted.providers : [];
  // Normalize
  providers = providers.map((p)=>{
    const out = {
      name: String(p?.name ?? "").trim(),
      specialty: String(p?.specialty ?? opts.specialtyHint ?? "").trim(),
      pgyYear: String(p?.pgyYear ?? "").trim(),
      confidence: typeof p?.confidence === "number" ? p.confidence : 0.8,
      email: p?.email ?? null,
      phone: p?.phone ?? null,
      location: p?.location ?? null,
      rawText: p?.rawText ?? null
    };
    if (!out.pgyYear) {
      const maybe = inferPGYFromText(out.rawText);
      if (maybe) out.pgyYear = maybe;
    }
    return out;
  });
  // Exclude staff-like snippets
  providers = providers.filter((p)=>!isLikelyStaff(p.rawText));
  return providers;
}
// ---------- AI-only orchestrator ----------
async function parseWithOpenAIAll(text, opts) {
  const MAX_INPUT_LEN = 70_000;
  let t = text.length > MAX_INPUT_LEN ? text.slice(0, MAX_INPUT_LEN) + "..." : text;
  t = normalizeForChunking(t);
  const sections = splitByProgramSections(t);
  const all = [];
  for (const section of sections){
    const chunks = chunkText(section, 5_500);
    for (const chunk of chunks){
      if (!chunk || chunk.trim().length < 40) continue;
      try {
        const batch = await parseChunkWithOpenAI(chunk, opts);
        all.push(...batch);
      } catch (err) {
        console.warn("Section chunk parse warning:", err instanceof Error ? err.message : String(err));
      }
    }
  }
  // Dedupe first
  let merged = dedupeProviders(all);
  // Degree recovery against the full normalized text (so we can keep legit MD/DO/MBBS like "Samantha Knopp, MD")
  merged = ensureDegreeEvidence(merged, t, opts.allowedDegreesOnly);
  // Final degree filter (should no-op for recovered entries)
  if (opts.allowedDegreesOnly) {
    merged = merged.filter((p)=>hasAllowedDegree(p.name) || hasAllowedDegree(p.rawText));
  }
  return merged;
}
// ---------- Handler (AI-only) ----------
Deno.serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsBase,
        "Access-Control-Allow-Headers": allowHeadersFrom(req)
      }
    });
  }
  if (req.method !== "POST") {
    return jsonResponse(req, {
      error: "Method not allowed"
    }, 405);
  }
  try {
    const body = await req.json().catch(()=>({}));
    const type = body.type;
    const content = body.content;
    const specialtyHint = (body.specialtyHint ?? "").trim() || undefined;
    const allowedDegreesOnly = body.allowedDegreesOnly !== false; // default true
    if (!type || !content || type !== "text" && type !== "url") {
      return jsonResponse(req, {
        error: "Missing or invalid fields",
        details: "Expected { type: 'text'|'url', content: string, specialtyHint?, allowedDegreesOnly? }"
      }, 400);
    }
    let textContent = content;
    if (type === "url") {
      try {
        textContent = await fetchUrlContent(content);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return jsonResponse(req, {
          error: "Failed to fetch URL content",
          details: msg
        }, 400);
      }
    }
    const providers = await parseWithOpenAIAll(textContent, {
      specialtyHint,
      allowedDegreesOnly
    });
    return jsonResponse(req, {
      success: true,
      providers,
      processedLength: textContent.length,
      sourceType: type,
      parser: "llm-only",
      specialtyHint: specialtyHint ?? null,
      allowedDegreesOnly
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isConfig = /Missing required env|not configured/i.test(msg);
    const isOpenAI4xx = /OpenAI 4\d{2}/.test(msg);
    const isTruncated = /truncated|non-JSON content|Unexpected OpenAI payload/i.test(msg);
    const status = isConfig || isOpenAI4xx || isTruncated ? 400 : 500;
    console.error("Edge function error:", msg);
    return jsonResponse(req, {
      error: status === 400 ? "Bad request" : "Internal server error",
      details: msg
    }, status);
  }
});
