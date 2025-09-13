/*
  # AI-Powered HCP Data Parser

  1. New Edge Function
    - `parse-hcp-data` - Processes text or URL content to extract healthcare provider information
    - Uses OpenAI GPT-4 for intelligent data extraction
    - Returns structured JSON with provider details

  2. Features
    - Text content parsing for resident/fellow information
    - URL content fetching and parsing
    - Confidence scoring for extracted data
    - Error handling and validation

  3. Security
    - OpenAI API key stored securely in environment variables
    - Input validation and sanitization
    - Rate limiting considerations
*/

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface ParsedProvider {
  name: string;
  specialty: string;
  pgyYear: string;
  confidence: number;
  rawText?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface ParseRequest {
  type: 'text' | 'url';
  content: string;
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HCP-Parser/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Basic HTML to text conversion (remove tags, scripts, styles)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return textContent;
  } catch (error) {
    throw new Error(`Failed to fetch URL content: ${error.message}`);
  }
}

async function parseWithOpenAI(content: string): Promise<ParsedProvider[]> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable in your Supabase project settings under Edge Functions.');
  }

  const prompt = `
You are an expert at extracting healthcare provider information from text content. 
Please analyze the following text and extract information about medical residents, fellows, or healthcare providers.

For each provider found, extract:
- Full name (first and last name)
- Medical specialty (e.g., Internal Medicine, Cardiology, Emergency Medicine)
- PGY year or training level (e.g., PGY-1, PGY-2, Fellow, Attending)
- Email address (if available)
- Phone number (if available)
- Location/hospital (if available)

Return the results as a JSON array with this exact structure:
[
  {
    "name": "Dr. John Smith",
    "specialty": "Internal Medicine",
    "pgyYear": "PGY-2",
    "confidence": 0.95,
    "email": "john.smith@hospital.com",
    "phone": "(555) 123-4567",
    "location": "General Hospital",
    "rawText": "original text snippet where this was found"
  }
]

Confidence should be a number between 0 and 1 indicating how certain you are about the extraction.
Only include providers where you have at least a name and some medical context.
If no providers are found, return an empty array [].

Text to analyze:
${content}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical data extraction specialist. Extract healthcare provider information accurately and return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { type, content }: ParseRequest = await req.json();

    if (!type || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type and content' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let textContent = content;

    // If type is URL, fetch the content first
    if (type === 'url') {
      try {
        textContent = await fetchUrlContent(content);
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            error: 'Failed to fetch URL content', 
            details: error.message 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Limit content length to prevent excessive API costs
    if (textContent.length > 50000) {
      textContent = textContent.substring(0, 50000) + '...';
    }

    // Parse with OpenAI
    const providers = await parseWithOpenAI(textContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        providers,
        processedLength: textContent.length,
        sourceType: type
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});