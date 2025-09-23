// supabase/functions/parse-hcp-data/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ---------- Types ----------
interface ParsedResident {
  name: string;
  specialty: string;
  pgyYear: string;
  confidence: number;
  email?: string;
  phone?: string;
  location?: string;
  rawText?: string;
}

interface ParseRequest {
  type: 'text' | 'url';
  content: string;
  specialtyHint?: string;
  allowedDegreesOnly?: boolean;
}

// ---------- CORS ----------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info"
};

function jsonResponse(body: any, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders
    }
  });
}

// ---------- Environment ----------
function getEnvOrThrow(key: string): string {
  const val = Deno.env.get(key);
  if (!val) {
    throw new Error(`Missing required environment variable: ${key}. Please set it in your Supabase project settings.`);
  }
  return val;
}

// ---------- HTML Processing ----------
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function htmlToStructuredText(html: string): string {
  let text = html;
  
  // Keep noscript content
  text = text.replace(/<noscript[^>]*>([\s\S]*?)<\/noscript>/gi, " $1 ");
  
  // Extract alt text from images
  text = text.replace(/<img[^>]*\balt=["']([^"']+)["'][^>]*>/gi, (_, alt) => `\n${alt}\n`);
  
  // Remove scripts and styles
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  
  // Convert block elements to newlines
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/(p|div|section|article|header|footer|li|h[1-6]|tr)>/gi, "\n");
  text = text.replace(/<(ul|ol|table|thead|tbody|tr)\b[^>]*>/gi, "\n");
  text = text.replace(/<(h[1-6])\b[^>]*>/gi, "\n");
  
  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  
  // Decode entities and clean up whitespace
  text = decodeEntities(text);
  text = text.replace(/\u00a0/g, " "); // Non-breaking spaces
  text = text.replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{2,}/g, "\n");
  text = text.replace(/[ \t]{2,}/g, " ");
  
  return text.trim();
}

// ---------- URL Fetching ----------
async function fetchUrlContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HCP-Parser/2.2)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    return htmlToStructuredText(html);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch URL content: ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

// ---------- Text Processing ----------
const DEGREE_REGEX = /\b(M\.?B\.?B\.?S\.?|M\.?D\.?|D\.?O\.?)\b/i;

function hasAllowedDegree(text: string): boolean {
  return !!text && DEGREE_REGEX.test(text);
}

function normalizeName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyStaff(text: string): boolean {
  if (!text) return false;
  return /(program director|associate program director|faculty|coordinator|DIO\b|chief|attending|professor)/i.test(text);
}

function inferPGYFromText(text: string): string | null {
  if (!text) return null;
  const match = text.match(/\bPGY[-–\s]?([1-5])\b/i);
  if (match) return `PGY-${match[1]}`;
  
  // Check for year indicators
  const yearMatch = text.match(/\b(first|second|third|fourth|fifth)\s+year\b/i);
  if (yearMatch) {
    const yearMap: Record<string, string> = {
      'first': 'PGY-1',
      'second': 'PGY-2', 
      'third': 'PGY-3',
      'fourth': 'PGY-4',
      'fifth': 'PGY-5'
    };
    return yearMap[yearMatch[1].toLowerCase()] || null;
  }
  
  return null;
}

function dedupeProviders(providers: ParsedResident[]): ParsedResident[] {
  const seen = new Map<string, ParsedResident>();
  
  for (const provider of providers) {
    const key = `${normalizeName(provider.name)}|${(provider.specialty || "").toLowerCase().trim()}|${(provider.pgyYear || "").toLowerCase().trim()}`;
    const existing = seen.get(key);
    
    if (!existing) {
      seen.set(key, provider);
    } else if ((provider.confidence || 0) > (existing.confidence || 0)) {
      seen.set(key, {
        ...provider,
        rawText: provider.rawText || existing.rawText
      });
    } else if (!existing.rawText && provider.rawText) {
      seen.set(key, {
        ...existing,
        rawText: provider.rawText
      });
    }
  }
  
  return Array.from(seen.values());
}

// ---------- Text Chunking ----------
function normalizeForChunking(text: string): string {
  let normalized = text;
  
  // Add line breaks around common section headers
  normalized = normalized.replace(/\s+(Headshot of\s+[^\n]+)\s+/gi, "\n$1\n");
  normalized = normalized.replace(/\s+(Class of\s+\d{4})/gi, "\n$1\n");
  normalized = normalized.replace(/\s+(Categorical Residents?|Categorical|Preliminary Residents?|Medicine\/Pediatrics|Interns)\b/gi, "\n$1\n");
  normalized = normalized.replace(/\s+(PGY\s*[1-5]\b)/gi, "\n$1\n");
  normalized = normalized.replace(/\s+(Meet The Residents?)/i, "\n$1\n");
  
  // Clean up multiple newlines
  normalized = normalized.replace(/\n{2,}/g, "\n");
  
  return normalized.trim();
}

function chunkText(input: string, maxChars = 5500): string[] {
  if (input.length <= maxChars) return [input];
  
  const chunks: string[] = [];
  let start = 0;
  
  while (start < input.length) {
    let end = Math.min(start + maxChars, input.length);
    
    // Try to break at a natural boundary
    const boundary = input.lastIndexOf("\n", end);
    if (boundary > start + maxChars * 0.6) {
      end = boundary;
    }
    
    chunks.push(input.slice(start, end).trim());
    start = end;
  }
  
  return chunks.filter(Boolean);
}

// ---------- OpenAI Integration ----------
async function parseChunkWithOpenAI(text: string, options: {
  specialtyHint?: string;
  allowedDegreesOnly?: boolean;
}): Promise<ParsedResident[]> {
  const OPENAI_API_KEY = getEnvOrThrow("OPENAI_API_KEY");
  
  const systemPrompt = "You extract resident/fellow (trainee) records from medical program pages. Respond with STRICT JSON only (no markdown, no code fences).";
  
  const hints: string[] = [];
  if (options.specialtyHint) {
    hints.push(`Specialty hint: ${options.specialtyHint}`);
  }
  if (options.allowedDegreesOnly) {
    hints.push("Only include entries with MD, DO, or MBBS near the name.");
  }
  hints.push("IMPORTANT: For each provider, include 'rawText' that is a VERBATIM substring (≤120 chars) from the input.");
  
  const userPrompt = `
Extract TRAINEE records (residents/fellows only; ignore staff/faculty/coordinators/directors).

Schema:
{"providers":[{"name":string,"specialty":string,"pgyYear":string,"confidence":number,"email":string|null,"phone":string|null,"location":string|null,"rawText":string|null}]}

Rules:
- Output MINIFIED JSON (no spaces or newlines). No markdown. No code fences.
- Include ONLY trainees (residents/fellows).
- ${options.allowedDegreesOnly ? "Require MD, DO, or MBBS near the name." : "Prefer MD/DO/MBBS if present."}
- If PGY appears (e.g., PGY1/PGY-2) use it; else infer cautiously or leave empty.
- "rawText" must be a VERBATIM substring (≤120 chars) from the input.
- confidence ∈ [0,1].
- Return AT MOST 20 providers for this chunk.
- If none found, return {"providers":[]}.

${hints.length ? `Hints:\n${hints.map(h => `- ${h}`).join('\n')}` : ""}

Text:
${text}
  `.trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0,
      max_tokens: 1400,
      response_format: { type: "json_object" }
    })
  });

  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${responseText}`);
  }

  let envelope: any;
  try {
    envelope = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON response from OpenAI: ${responseText.slice(0, 400)}`);
  }

  const content = envelope?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`No content in OpenAI response: ${responseText.slice(0, 400)}`);
  }

  // Parse the JSON content
  let extracted: any;
  try {
    extracted = JSON.parse(content);
  } catch {
    // Try to fix truncated JSON
    const lastBrace = content.lastIndexOf("}");
    if (lastBrace > 0) {
      try {
        extracted = JSON.parse(content.slice(0, lastBrace + 1));
      } catch {
        throw new Error(`Model returned invalid JSON: ${content.slice(0, 400)}`);
      }
    } else {
      throw new Error(`Model returned invalid JSON: ${content.slice(0, 400)}`);
    }
  }

  let providers = Array.isArray(extracted?.providers) ? extracted.providers : [];
  
  // Normalize and validate providers
  providers = providers.map((p: any): ParsedResident => {
    const provider: ParsedResident = {
      name: String(p?.name || "").trim(),
      specialty: String(p?.specialty || options.specialtyHint || "").trim(),
      pgyYear: String(p?.pgyYear || "").trim(),
      confidence: typeof p?.confidence === "number" ? p.confidence : 0.8,
      email: p?.email || null,
      phone: p?.phone || null,
      location: p?.location || null,
      rawText: p?.rawText || null
    };
    
    // Try to infer PGY from rawText if not provided
    if (!provider.pgyYear && provider.rawText) {
      const inferredPGY = inferPGYFromText(provider.rawText);
      if (inferredPGY) provider.pgyYear = inferredPGY;
    }
    
    return provider;
  });

  // Filter out staff-like entries
  providers = providers.filter(p => !isLikelyStaff(p.rawText));
  
  return providers;
}

// ---------- Evidence Validation ----------
function evidenceFilter(providers: ParsedResident[], sourceText: string, allowedDegreesOnly: boolean): ParsedResident[] {
  const validated: ParsedResident[] = [];
  
  for (const provider of providers) {
    const name = provider.name?.trim();
    if (!name) continue;
    
    // Check if name appears in source text
    const nameRegex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const match = sourceText.match(nameRegex);
    
    if (!match || typeof match.index !== "number") continue;
    
    const matchIndex = match.index;
    
    // Check for degree requirement
    if (allowedDegreesOnly) {
      const window = sourceText.slice(
        Math.max(0, matchIndex - 20),
        Math.min(sourceText.length, matchIndex + name.length + 100)
      );
      if (!DEGREE_REGEX.test(window)) continue;
    }
    
    // Validate or generate rawText
    let rawText = provider.rawText;
    if (!rawText || !sourceText.includes(rawText)) {
      const start = Math.max(0, matchIndex - 60);
      const end = Math.min(sourceText.length, matchIndex + 60);
      rawText = sourceText.slice(start, end).replace(/\s+/g, " ").trim();
    }
    
    // Skip if looks like staff
    if (isLikelyStaff(rawText)) continue;
    
    // Infer PGY if missing
    let pgyYear = provider.pgyYear?.trim() || "";
    if (!pgyYear) {
      pgyYear = inferPGYFromText(rawText) || "";
    }
    
    validated.push({
      ...provider,
      rawText,
      pgyYear
    });
  }
  
  return validated;
}

// ---------- Main Processing Function ----------
async function parseWithOpenAI(text: string, options: {
  specialtyHint?: string;
  allowedDegreesOnly?: boolean;
}): Promise<ParsedResident[]> {
  const MAX_INPUT_LENGTH = 70000;
  
  // Truncate if too long
  let processedText = text.length > MAX_INPUT_LENGTH 
    ? text.slice(0, MAX_INPUT_LENGTH) + "..." 
    : text;
  
  processedText = normalizeForChunking(processedText);
  
  // Split into manageable chunks
  const chunks = chunkText(processedText, 5500);
  const allProviders: ParsedResident[] = [];
  
  for (const chunk of chunks) {
    if (!chunk || chunk.trim().length < 40) continue;
    
    try {
      const chunkProviders = await parseChunkWithOpenAI(chunk, options);
      allProviders.push(...chunkProviders);
    } catch (error) {
      console.warn("Chunk processing warning:", error instanceof Error ? error.message : String(error));
      // Continue processing other chunks
    }
  }
  
  // Deduplicate providers
  let mergedProviders = dedupeProviders(allProviders);
  
  // Apply evidence filtering
  mergedProviders = evidenceFilter(mergedProviders, processedText, options.allowedDegreesOnly || false);
  
  // Final degree filter if required
  if (options.allowedDegreesOnly) {
    mergedProviders = mergedProviders.filter(p => 
      hasAllowedDegree(p.name) || hasAllowedDegree(p.rawText || "")
    );
  }
  
  return mergedProviders;
}

// ---------- Main Handler ----------
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
  
  try {
    // Parse request body
    let body: ParseRequest;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ 
        error: "Invalid JSON in request body" 
      }, 400);
    }
    
    const { type, content, specialtyHint, allowedDegreesOnly } = body;
    
    // Validate required fields
    if (!type || !content) {
      return jsonResponse({
        error: "Missing required fields",
        details: "Expected { type: 'text'|'url', content: string, specialtyHint?, allowedDegreesOnly? }"
      }, 400);
    }
    
    if (type !== "text" && type !== "url") {
      return jsonResponse({
        error: "Invalid type",
        details: "Type must be 'text' or 'url'"
      }, 400);
    }
    
    // Get text content
    let textContent = content;
    if (type === "url") {
      try {
        textContent = await fetchUrlContent(content);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return jsonResponse({
          error: "Failed to fetch URL content",
          details: message
        }, 400);
      }
    }
    
    // Validate content length
    if (!textContent || textContent.trim().length < 10) {
      return jsonResponse({
        error: "Content too short",
        details: "Content must be at least 10 characters long"
      }, 400);
    }
    
    // Process with OpenAI
    const providers = await parseWithOpenAI(textContent, {
      specialtyHint,
      allowedDegreesOnly: allowedDegreesOnly !== false // Default to true
    });
    
    return jsonResponse({
      success: true,
      providers,
      processedLength: textContent.length,
      sourceType: type,
      parser: "openai-gpt4o-mini",
      specialtyHint: specialtyHint || null,
      allowedDegreesOnly: allowedDegreesOnly !== false
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Edge function error:", message);
    
    // Determine appropriate status code
    const isConfigError = /Missing required environment variable|not configured/i.test(message);
    const isOpenAIError = /OpenAI API error 4\d{2}/.test(message);
    const isValidationError = /Invalid|truncated|non-JSON/i.test(message);
    
    const status = (isConfigError || isOpenAIError || isValidationError) ? 400 : 500;
    
    return jsonResponse({
      error: status === 400 ? "Bad request" : "Internal server error",
      details: message,
      timestamp: new Date().toISOString()
    }, status);
  }
});