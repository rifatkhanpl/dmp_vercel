// Supabase Edge Function for Auth0 Management API
// Deploy with: supabase functions deploy auth0-users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Auth0Config {
  domain: string
  clientId: string
  clientSecret: string
  audience: string
}

// Get Auth0 Management API token
async function getManagementToken(config: Auth0Config): Promise<string> {
  const response = await fetch(`https://${config.domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      audience: config.audience,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get management token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Auth0 config from environment variables
    const auth0Config: Auth0Config = {
      domain: Deno.env.get('AUTH0_DOMAIN') || 'dev-c4u34lk8e3qzwt8q.us.auth0.com',
      clientId: Deno.env.get('AUTH0_M2M_CLIENT_ID') || '',
      clientSecret: Deno.env.get('AUTH0_M2M_CLIENT_SECRET') || '',
      audience: `https://${Deno.env.get('AUTH0_DOMAIN') || 'dev-c4u34lk8e3qzwt8q.us.auth0.com'}/api/v2/`,
    }

    if (!auth0Config.clientId || !auth0Config.clientSecret) {
      throw new Error('Auth0 M2M credentials not configured')
    }

    // Simple API key check instead of JWT validation
    const authHeader = req.headers.get('Authorization')
    const apiKey = req.headers.get('X-API-Key') || req.headers.get('apikey')

    // Allow requests with either proper auth header or API key
    if (!authHeader && !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Management API token
    const managementToken = await getManagementToken(auth0Config)

    // Parse the request URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const userId = pathParts[1] // If path is /auth0-users/{userId}

    // Route the request based on method and path
    let response: Response

    switch (req.method) {
      case 'GET':
        if (userId) {
          // Get specific user
          response = await fetch(
            `https://${auth0Config.domain}/api/v2/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${managementToken}`,
              },
            }
          )
        } else {
          // List users with pagination
          const page = url.searchParams.get('page') || '0'
          const perPage = url.searchParams.get('per_page') || '50'
          const includeFields = 'true'
          const fields = 'user_id,email,email_verified,name,given_name,family_name,picture,created_at,updated_at,last_login,logins_count,app_metadata,user_metadata,blocked'

          response = await fetch(
            `https://${auth0Config.domain}/api/v2/users?page=${page}&per_page=${perPage}&include_fields=${includeFields}&fields=${fields}&include_totals=true`,
            {
              headers: {
                Authorization: `Bearer ${managementToken}`,
              },
            }
          )
        }
        break

      case 'PATCH':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID required for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const updateData = await req.json()
        response = await fetch(
          `https://${auth0Config.domain}/api/v2/users/${userId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${managementToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          }
        )
        break

      case 'DELETE':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID required for deletion' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        response = await fetch(
          `https://${auth0Config.domain}/api/v2/users/${userId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${managementToken}`,
            },
          }
        )
        break

      case 'POST':
        // Handle special actions like block/unblock
        if (userId && pathParts[2] === 'block') {
          response = await fetch(
            `https://${auth0Config.domain}/api/v2/users/${userId}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${managementToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ blocked: true }),
            }
          )
        } else if (userId && pathParts[2] === 'unblock') {
          response = await fetch(
            `https://${auth0Config.domain}/api/v2/users/${userId}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${managementToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ blocked: false }),
            }
          )
        } else {
          // Create new user
          const userData = await req.json()
          response = await fetch(
            `https://${auth0Config.domain}/api/v2/users`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${managementToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                connection: 'Username-Password-Authentication',
                ...userData,
              }),
            }
          )
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Get the response data
    const responseData = await response.text()

    return new Response(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})