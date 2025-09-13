// supabase/functions/parse-hcp-data/index.ts

// ---------- Types ----------
interface Provider {
  name: string;
  specialty: string;
  pgyYear: string;
  confidence: number;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  rawText?: string | null;
}

// ---------- CORS ----------
const DEFAULT_ALLOW_HEADERS =
  "authorization, content-type, apikey, x-client-info";

const corsBase = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function allowHeadersFrom(req: Request) {
  return req.headers.get("Access-Control-Request-Headers") ?? DEFAULT_ALLOW_HEADERS;
}

function jsonResponse(
  req: Request,
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsBase,
      "Access-Control-Allow-Headers": allowHeadersFrom(req),
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

// ---------- Env ----------
function getEnvOrThrow(key: string): string {
  const val = Deno.env.get(key);
  if (!val) throw new Error(`Missing required env: ${key}`);
  return val;
}

// ---------- URL fetch ----------
async function fetchUrlContent(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 12_000);

  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HCP-Parser/1.0)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const html = await res.text();

    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to fetch URL content: ${msg}`);
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Degree filters ----------
const MAJOR_DEG_RE = /\b(M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?)\b/i; // MBBS / MD / DO
function hasAllowedDegree(s: string): boolean {
  return MAJOR_DEG_RE.test(s);
}
function containsAllowedDegreeText(s?: string | null): boolean {
  return !!s && MAJOR_DEG_RE.test(s);
}

// ---------- Deterministic SLU IM parser ----------
function currentAcademicYearStart(d = new Date()): number {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1; // 1..12
  // Academic year starts in July
  return m >= 7 ? y : y - 1;
}

// IM = 3 years. Class year ~ AYStart + (3 - PGY + 1)
function pgyFromClassYear(
  classYear: number,
  asOf = new Date(),
  programYears = 3,
): string {
  const ayStart = currentAcademicYearStart(asOf);
  const delta = classYear - ayStart; // 3->PGY-1, 2->PGY-2, 1->PGY-3 (for IM)
  const pgy = programYears - delta + 1;
  const clamped = Math.min(Math.max(pgy, 1), programYears);
  return `PGY-${clamped}`;
}

function cleanNameDegrees(line: string): { name: string; degrees: string[] } {
  const degRe = /\b(M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?|Ph\.?D\.?)\b/gi;
  const degrees = (line.match(degRe) || [])
    .map((s) => s.replace(/\./g, "").toUpperCase());
  const idx = line.search(degRe);
  let name = (idx >= 0 ? line.slice(0, idx) : line).trim();
  name = name.replace(/[,\s"”]+$/g, "").replace(/^[“"]+/g, "").trim();
  return { name, degrees };
}

const STOP_MARKERS = [
  "SLU Medicine Next Steps",
  "Request Info",
  "Apply",
  "Give",
  "Quick Links",
  "Saint Louis University",
  "Higher purpose. Greater good.",
];

function stripFooterSections(text: string): string {
  let out = text;
  for (const m of STOP_MARKERS) {
    const i = out.indexOf(m);
    if (i > -1) {
      out = out.slice(0, i);
      break;
    }
  }
  return out;
}

function normalizeForSLU(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\s+(Headshot of\s+)/g, "\n$1")
    .replace(/\s+(Undergraduate school:)/g, "\n$1")
    .replace(/\s+(Graduate school:)/g, "\n$1")
    .replace(/\s+(Medical school:)/g, "\n$1")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function isSchoolLine(s: string) {
  return /^(Undergraduate|Graduate|Medical) school:/i.test(s);
}
function isJunkHeading(s: string) {
  return /(SLU Medicine Next Steps|Request Info|Apply|Give|Quick Links|Higher purpose\. Greater good\.)/i.test(s);
}

function parseSluInternalMedHousestaff(raw: string, asOf = new Date()): Provider[] {
  const text0 = stripFooterSections(raw);
  const text = normalizeForSLU(text0);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentClass: number | null = null;
  let currentTrack: "Categorical" | "Preliminary" | null = null;

  const out: Provider[] = [];
  let pendingHeadshotName: string | null = null;

  // Name line can omit degrees; we filter with hasAllowedDegree() separately
  const nameLineRe =
    /^([A-Z][A-Za-z .'"-]+?)(?:,\s*(?:M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?|Ph\.?D\.?)(?:\s*,\s*(?:M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?|Ph\.?D\.?))*)?$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Class markers
    const classMatch = line.match(/Class of\s+(\d{4})/i);
    if (classMatch) {
      currentClass = parseInt(classMatch[1], 10);
      currentTrack = null;
      continue;
    }

    // Subsections
    if (/^Categorical Residents?$/i.test(line) || /^Categorical residents$/i.test(line)) {
      currentTrack = "Categorical";
      continue;
    }
    if (/^Preliminary Residents?$/i.test(line)) {
      currentTrack = "Preliminary";
      continue;
    }

    // Headshot cue
    const hs = line.match(/^Headshot of\s+(.+?)$/i);
    if (hs) {
      pendingHeadshotName = hs[1].trim();
      continue;
    }

    // Name line candidate
    if (nameLineRe.test(line)) {
      const candidate = line;

      // Degree filter: allow if candidate OR pending headshot contains MD/DO/MBBS
      if (!hasAllowedDegree(candidate)) {
        if (!(pendingHeadshotName && hasAllowedDegree(pendingHeadshotName))) {
          continue; // skip (no allowed degree)
        }
      }
      pendingHeadshotName = null;

      const { name } = cleanNameDegrees(candidate);
      if (!name || !currentClass) continue;

      let pgy = pgyFromClassYear(currentClass, asOf);
      if (currentTrack === "Preliminary") pgy = "PGY-1";

      const snippetLines = [candidate];
      for (let k = 1; k <= 2 && i + k < lines.length; k++) {
        const look = lines[i + k];
        if (isSchoolLine(look) && !isJunkHeading(look)) snippetLines.push(look);
        else break;
      }
      const rawText = snippetLines.join(" | ").slice(0, 180);

      out.push({
        name,
        specialty: "Internal Medicine",
        pgyYear: pgy,
        confidence: 0.92,
        email: null,
        phone: null,
        location: null,
        rawText,
      });
      continue;
    }

    // Fallback for dangling headshot (only if headshot line had allowed degree)
    if (pendingHeadshotName && hasAllowedDegree(pendingHeadshotName)) {
      const { name } = cleanNameDegrees(pendingHeadshotName);
      if (name && currentClass) {
        let pgy = pgyFromClassYear(currentClass, asOf);
        if (currentTrack === "Preliminary") pgy = "PGY-1";
        out.push({
          name,
          specialty: "Internal Medicine",
          pgyYear: pgy,
          confidence: 0.7,
          email: null,
          phone: null,
          location: null,
          rawText: `Headshot of ${pendingHeadshotName}`,
        });
      }
      pendingHeadshotName = null;
    }
  }

  // Dedupe (name + pgy + specialty)
  const key = (p: Provider) =>
    `${p.name.toLowerCase()}|${p.pgyYear.toLowerCase()}|${p.specialty.toLowerCase()}`;
  const map = new Map<string, Provider>();
  for (const p of out) {
    const k = key(p);
    if (!map.has(k)) map.set(k, p);
  }
  return Array.from(map.values());
}

// ---------- Dedupe (shared) ----------
function normalizeName(n: string | undefined) {
  return (n ?? "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeProviders(providers: Provider[]): Provider[] {
  const seen = new Map<string, Provider>();
  for (const p of providers) {
    const key =
      `${normalizeName(p.name)}|${(p.specialty ?? "").toLowerCase().trim()}|${(p.pgyYear ?? "").toLowerCase().trim()}`;
    const prev = seen.get(key);
    if (!prev) {
      seen.set(key, p);
    } else {
      if ((p.confidence ?? 0) > (prev.confidence ?? 0)) {
        seen.set(key, { ...p, rawText: p.rawText ?? prev.rawText });
      } else if (!prev.rawText && p.rawText) {
        seen.set(key, { ...prev, rawText: p.rawText });
      }
    }
  }
  return Array.from(seen.values());
}

// ---------- Chunking for LLM fallback ----------
function normalizeForChunking(text: string): string {
  let t = stripFooterSections(text);
  t = t.replace(/\s+(Headshot of\s+)/g, "\n$1");
  t = t.replace(/\s+((?:Undergraduate|Graduate) school:)/g, "\n$1");
  t = t.replace(/\s+(Medical school:)/g, "\n$1");
  t = t.replace(/\s+((?:PGY|R\d|Resident|Fellow)\b)/gi, "\n$1");
  t = t.replace(/\n{2,}/g, "\n");
  return t.trim();
}

function chunkText(input: string, maxChars = 6_000): string[] {
  if (input.length <= maxChars) return [input];

  const chunks: string[] = [];
  let start = 0;
  while (start < input.length) {
    let end = Math.min(start + maxChars, input.length);
    const boundary = input.lastIndexOf("\n", end);
    if (boundary > start + maxChars * 0.6) end = boundary;
    chunks.push(input.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

// ---------- JSON salvage (rare truncation) ----------
function tryParseJsonObjectStrict(s: string): any {
  return JSON.parse(s);
}
function tryParseJsonObjectSalvage(s: string): any | null {
  const i = s.lastIndexOf("}");
  if (i > 0) {
    try {
      return JSON.parse(s.slice(0, i + 1));
    } catch {}
  }
  return null;
}

// ---------- OpenAI (per chunk) ----------
async function parseChunkWithOpenAI(text: string): Promise<Provider[]> {
  const OPENAI_API_KEY = getEnvOrThrow("OPENAI_API_KEY");

  const system =
    "You are a medical data extraction specialist. Return ONLY valid JSON per response_format.";
  const user = `
Extract healthcare provider records from the text and return JSON only.

Schema:
{ "providers": [ { "name": string, "specialty": string, "pgyYear": string,
  "confidence": number, "email": string|null, "phone": string|null,
  "location": string|null, "rawText": string|null } ] }

Rules:
- Return AT MOST 40 providers for this chunk.
- Prefer rows that explicitly show MD, DO, or MBBS in the text.
- Omit any fields whose value would be null.
- "rawText" must be a source snippet ≤ 120 characters, or omit it.
- "confidence" must be between 0 and 1.
- If none found, return { "providers": [] }.

Text:
${text}
  `.trim();

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      max_tokens: 900,
      response_format: { type: "json_object" },
    }),
  });

  const bodyText = await resp.text();

  if (!resp.ok) {
    throw new Error(`OpenAI ${resp.status}: ${bodyText}`);
  }

  let envelope: any;
  try {
    envelope = JSON.parse(bodyText);
  } catch {
    throw new Error(`Unexpected OpenAI payload (non-JSON envelope): ${bodyText.slice(0, 400)}`);
  }

  const content = envelope?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`Unexpected OpenAI payload (missing content): ${bodyText.slice(0, 400)}`);
  }

  let extracted: any;
  try {
    extracted = tryParseJsonObjectStrict(content);
  } catch {
    const salvaged = tryParseJsonObjectSalvage(content);
    if (salvaged) {
      extracted = salvaged;
      console.warn("parse warning: salvaged truncated JSON");
    } else {
      const hint = content.length > 400 ? content.slice(0, 400) + "…" : content;
      throw new Error(`Model returned truncated or non-JSON content: ${hint}`);
    }
  }

  let providers: Provider[] = Array.isArray(extracted?.providers)
    ? extracted.providers
    : [];

  // Normalize and enforce degree filter for LLM results using name or rawText
  providers = providers
    .map((p) => {
      if (p && typeof p.pgyYear !== "string") p.pgyYear = String(p.pgyYear ?? "");
      if (p && typeof p.specialty !== "string") p.specialty = String(p.specialty ?? "");
      if (p && typeof p.name !== "string") p.name = String(p.name ?? "");
      return p;
    })
    .filter((p) =>
      containsAllowedDegreeText(p.name) || containsAllowedDegreeText(p.rawText)
    );

  return providers;
}

async function parseWithOpenAIAll(text: string): Promise<Provider[]> {
  const MAX_INPUT_LEN = 50_000;
  let t = text;
  if (t.length > MAX_INPUT_LEN) t = t.slice(0, MAX_INPUT_LEN) + "...";

  t = normalizeForChunking(t);
  const chunks = chunkText(t, 6_000);

  const all: Provider[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk || chunk.trim().length < 40) continue;

    try {
      const providers = await parseChunkWithOpenAI(chunk);
      all.push(...providers);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Chunk ${i + 1}/${chunks.length} parse warning:`, msg);
    }
  }

  return dedupeProviders(all);
}

// ---------- Main handler ----------
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsBase,
        "Access-Control-Allow-Headers": allowHeadersFrom(req),
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(req, { error: "Method not allowed" }, 405);
  }

  try {
    const { type, content } = await req.json().catch(() => ({} as any));

    if (!type || !content || (type !== "text" && type !== "url")) {
      return jsonResponse(
        req,
        { error: "Missing or invalid fields", details: "Expected { type: 'text'|'url', content: string }" },
        400,
      );
    }

    let textContent: string = content;
    if (type === "url") {
      try {
        textContent = await fetchUrlContent(content);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return jsonResponse(
          req,
          { error: "Failed to fetch URL content", details: msg },
          400,
        );
      }
    }

    // 1) Deterministic SLU parser first
    const deterministic = parseSluInternalMedHousestaff(textContent);

    // If we got a decent haul, return it immediately
    if (deterministic.length >= 10) {
      return jsonResponse(req, {
        success: true,
        providers: deterministic,
        processedLength: textContent.length,
        sourceType: type,
        parser: "deterministic-slu-im",
      });
    }

    // 2) LLM fallback; merge & dedupe; enforce degree filter on merged set too (defense in depth)
    const aiProviders = await parseWithOpenAIAll(textContent);
    const merged = dedupeProviders([...deterministic, ...aiProviders]);
    const filtered = merged.filter(
      (p) => containsAllowedDegreeText(p.name) || containsAllowedDegreeText(p.rawText),
    );

    return jsonResponse(req, {
      success: true,
      providers: filtered,
      processedLength: textContent.length,
      sourceType: type,
      parser: deterministic.length ? "deterministic-slu-im" : "slim+llm",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isConfig = /Missing required env|not configured/i.test(msg);
    const isOpenAI4xx = /OpenAI 4\d{2}/.test(msg);
    const isTruncated = /truncated|non-JSON content|Unexpected OpenAI payload/i.test(msg);
    const status = (isConfig || isOpenAI4xx || isTruncated) ? 400 : 500;

    console.error("Edge function error:", msg);

    return jsonResponse(
      req,
      { error: status === 400 ? "Bad request" : "Internal server error", details: msg },
      status,
    );
  }
});
