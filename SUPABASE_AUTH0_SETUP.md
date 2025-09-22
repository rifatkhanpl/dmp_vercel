# Supabase Edge Function Setup for Auth0 Management API

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Supabase project created
- Auth0 account with admin access

## Step 1: Create Machine-to-Machine Application in Auth0

1. Go to Auth0 Dashboard → Applications
2. Click "Create Application"
3. Choose "Machine to Machine Applications"
4. Select "Auth0 Management API"
5. Grant these scopes:
   - `read:users`
   - `update:users`
   - `delete:users`
   - `update:users_app_metadata`
   - `create:users`
   - `read:user_idp_tokens`
6. Save the credentials:
   - Domain: `dev-c4u34lk8e3qzwt8q.us.auth0.com`
   - Client ID: (your M2M client ID)
   - Client Secret: (your M2M client secret)

## Step 2: Deploy Supabase Edge Function

1. **Link your Supabase project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. **Set environment variables:**
   ```bash
   supabase secrets set AUTH0_DOMAIN=dev-c4u34lk8e3qzwt8q.us.auth0.com
   supabase secrets set AUTH0_M2M_CLIENT_ID=your_m2m_client_id_here
   supabase secrets set AUTH0_M2M_CLIENT_SECRET=your_m2m_client_secret_here
   ```

3. **Deploy the function:**
   ```bash
   supabase functions deploy auth0-users
   ```

4. **Test the function:**
   ```bash
   # Get users
   curl -L -X GET 'https://your-project-ref.supabase.co/functions/v1/auth0-users' \
     -H 'Authorization: Bearer YOUR_ANON_KEY'

   # Get specific user
   curl -L -X GET 'https://your-project-ref.supabase.co/functions/v1/auth0-users/USER_ID' \
     -H 'Authorization: Bearer YOUR_ANON_KEY'
   ```

## Step 3: Update Frontend Environment

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Use in User Management

The User Management page will now automatically fetch real Auth0 users through the Supabase Edge Function.

## API Endpoints

The Edge Function provides these endpoints:

- `GET /auth0-users` - List all users (with pagination)
  - Query params: `page`, `per_page`
- `GET /auth0-users/{userId}` - Get specific user
- `PATCH /auth0-users/{userId}` - Update user
- `DELETE /auth0-users/{userId}` - Delete user
- `POST /auth0-users/{userId}/block` - Block user
- `POST /auth0-users/{userId}/unblock` - Unblock user
- `POST /auth0-users` - Create new user

## Security Notes

- The Edge Function validates that requests include a valid Supabase auth token
- Auth0 M2M credentials are stored securely as Supabase secrets
- Never expose M2M credentials in frontend code
- Consider adding additional role checks in the Edge Function

## Troubleshooting

1. **"AUTH0_M2M_CLIENT_ID is not defined"**
   - Make sure you've set the secrets using `supabase secrets set`

2. **"Failed to get management token"**
   - Verify your M2M application has the correct scopes
   - Check that the client ID and secret are correct

3. **CORS errors**
   - The Edge Function includes CORS headers
   - Make sure you're using the correct Supabase project URL

## Local Development

To test the Edge Function locally:

```bash
# Start local Supabase
supabase start

# Serve the function locally
supabase functions serve auth0-users --env-file supabase/functions/auth0-users/.env.local

# Test locally
curl -L -X GET 'http://localhost:54321/functions/v1/auth0-users' \
  -H 'Authorization: Bearer YOUR_LOCAL_ANON_KEY'
```