# Auth0 Setup Instructions

## Important: Auth0 Application Configuration

To use Auth0 authentication, you need to configure your Auth0 application with these settings:

### 1. Application Settings in Auth0 Dashboard

Navigate to your Auth0 Dashboard > Applications > Your App and configure:

#### Application Type
Make sure the application type is set to **Single Page Application (SPA)**

#### Allowed Callback URLs
Add these URLs (one per line):
```
http://localhost:5173/callback
https://your-production-domain.com/callback
```

#### Allowed Logout URLs
```
http://localhost:5173
https://your-production-domain.com
```

#### Allowed Web Origins
```
http://localhost:5173
https://your-production-domain.com
```

#### Allowed Origins (CORS)
```
http://localhost:5173
https://your-production-domain.com
```

### 2. API Configuration (Optional)

If you want to use Auth0 with an API:

1. Create an API in Auth0 Dashboard
2. Set the identifier to: `https://api.practicelink-dmp.com`
3. Enable RBAC (Role-Based Access Control)
4. Add custom claims for roles if needed

### 3. Environment Variables

Make sure your `.env` file contains:
```
VITE_AUTH0_DOMAIN=dev-c4u34lk8e3qzwt8q.us.auth0.com
VITE_AUTH0_CLIENT_ID=Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4
# VITE_AUTH0_AUDIENCE=https://api.practicelink-dmp.com  # Optional - only if you have an API
```

### 4. Save Changes in Auth0 Dashboard!

**IMPORTANT**: After adding these URLs, scroll down and click 'Save Changes' button.

### 5. Testing Auth0

1. Go to http://localhost:5173/signin
2. Click 'Switch to Auth0'
3. A debug panel will appear in bottom-right
4. Click 'Test Auth0 Login' in the debug panel
5. Check browser console (F12) for any errors

### Common Issues and Solutions

#### Issue: "redirect_uri mismatch"
- Ensure callback URLs exactly match in Auth0 dashboard
- Must include `/callback` path

#### Issue: "Invalid audience"
- Check if API audience is correctly configured
- Verify environment variable `VITE_AUTH0_AUDIENCE`

#### Issue: Infinite redirect loops
- Check that `skipRedirectCallback` is properly configured
- Ensure callback route is properly handled

### Current Configuration
- Domain: dev-c4u34lk8e3qzwt8q.us.auth0.com ✅ **VALID TENANT** (PracticeLink®)
- Client ID: Aha8XFlrZi7rMcOzb4Jaz3GQ9jFEC6M4
- Audience: Not configured (for basic authentication)

### Fixed Issues
✅ Proper redirect URI configuration (`/callback`)
✅ Environment variables properly set
✅ Callback handling with timeout protection
✅ Error handling and display
✅ Skip redirect callback configuration

