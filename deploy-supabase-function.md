# Deploy Auth0 Edge Function to Supabase

## Quick Deploy Steps

### 1. Login to Supabase CLI
```bash
npx supabase login
```
This will open your browser. Login and it will authenticate the CLI.

### 2. Link your Supabase project
```bash
npx supabase link --project-ref eionkwtlzkjsabstiycy
```

### 3. First, you need to get Auth0 M2M credentials

Go to Auth0 Dashboard:
1. Navigate to Applications → Create Application
2. Name: "Supabase Management API"
3. Type: Machine to Machine
4. Select API: Auth0 Management API
5. Scopes to grant:
   - `read:users`
   - `update:users`
   - `delete:users`
   - `create:users`
   - `update:users_app_metadata`

6. Copy the Client ID and Client Secret

### 4. Set the secrets in Supabase
```bash
# Replace with your actual M2M credentials
npx supabase secrets set AUTH0_DOMAIN=dev-c4u34lk8e3qzwt8q.us.auth0.com
npx supabase secrets set AUTH0_M2M_CLIENT_ID=YOUR_M2M_CLIENT_ID_HERE
npx supabase secrets set AUTH0_M2M_CLIENT_SECRET=YOUR_M2M_CLIENT_SECRET_HERE
```

### 5. Deploy the function
```bash
npx supabase functions deploy auth0-users
```

### 6. Test the function
```bash
# Get your service role key from Supabase dashboard
curl -L -X GET 'https://eionkwtlzkjsabstiycy.supabase.co/functions/v1/auth0-users' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Alternative: Deploy via Supabase Dashboard

If CLI doesn't work, you can deploy via the dashboard:

1. Go to https://supabase.com/dashboard/project/eionkwtlzkjsabstiycy/functions
2. Click "Create a new function"
3. Name: `auth0-users`
4. Copy the code from `supabase/functions/auth0-users/index.ts`
5. Add environment variables:
   - `AUTH0_DOMAIN`
   - `AUTH0_M2M_CLIENT_ID`
   - `AUTH0_M2M_CLIENT_SECRET`
6. Deploy

## Verify Deployment

Once deployed, the User Management page should automatically start showing Auth0 users!