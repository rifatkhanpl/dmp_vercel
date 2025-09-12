# Auth0 Setup Guide for PracticeLink DMP

This guide will help you set up Auth0 authentication for the PracticeLink Data Management Portal.

## Prerequisites

- An Auth0 account (sign up at https://auth0.com)
- Node.js and npm installed
- Access to the project repository

## Step 1: Create an Auth0 Application

1. Log in to your Auth0 Dashboard
2. Navigate to **Applications** > **Applications**
3. Click **Create Application**
4. Enter a name (e.g., "PracticeLink DMP")
5. Select **Single Page Web Applications**
6. Click **Create**

## Step 2: Configure Application Settings

In your Auth0 application settings:

### Basic Information
- Note down your **Domain** and **Client ID**

### Application URIs
Configure the following URLs (adjust for your environment):

**Allowed Callback URLs:**
```
http://localhost:5173/dashboard,
https://your-production-domain.com/dashboard
```

**Allowed Logout URLs:**
```
http://localhost:5173,
https://your-production-domain.com
```

**Allowed Web Origins:**
```
http://localhost:5173,
https://your-production-domain.com
```

**Allowed Origins (CORS):**
```
http://localhost:5173,
https://your-production-domain.com
```

Click **Save Changes**

## Step 3: Create an API (Optional - for backend protection)

If you want to protect your backend API:

1. Navigate to **Applications** > **APIs**
2. Click **Create API**
3. Enter:
   - Name: "PracticeLink DMP API"
   - Identifier: `https://api.practicelink-dmp.com` (or your API URL)
   - Signing Algorithm: RS256
4. Click **Create**

## Step 4: Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.practicelink-dmp.com  # Optional, if using API

# Server Configuration (existing)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@practicelink.com
FRONTEND_URL=http://localhost:5173
PORT=3001
```

Replace the values with your actual Auth0 credentials.

## Step 5: Set Up User Roles (Optional)

To manage user roles in Auth0:

1. Navigate to **User Management** > **Roles**
2. Create roles:
   - `provider-relations-coordinator`
   - `administrator`
3. Assign roles to users as needed

### Add Role to ID Token

1. Navigate to **Auth Pipeline** > **Rules** (or **Actions** > **Flows** > **Login** for newer tenants)
2. Create a new Rule/Action:

```javascript
// For Rules (older Auth0 tenants)
function addRoleToToken(user, context, callback) {
  const namespace = 'https://practicelink.com/';
  context.idToken[namespace + 'role'] = user.app_metadata.role || 'provider-relations-coordinator';
  callback(null, user, context);
}

// For Actions (newer Auth0 tenants)
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://practicelink.com/';
  const role = event.user.app_metadata?.role || 'provider-relations-coordinator';
  api.idToken.setCustomClaim(namespace + 'role', role);
};
```

## Step 6: Customize Auth0 Login Page (Optional)

1. Navigate to **Branding** > **Universal Login**
2. Customize colors, logo, and text to match PracticeLink branding
3. Enable **New Universal Login Experience** for a better UI

## Step 7: Run the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Visit http://localhost:5173
4. Click "Sign in with Auth0"
5. Create an account or sign in

## Step 8: Production Deployment

For production:

1. Update environment variables with production values
2. Update Auth0 application settings with production URLs
3. Enable appropriate security features in Auth0:
   - Anomaly Detection
   - Brute Force Protection
   - Breached Password Detection

## Troubleshooting

### Common Issues

1. **Login redirects to wrong URL**
   - Check Allowed Callback URLs in Auth0 settings
   - Verify `redirectUri` in auth0.ts config

2. **CORS errors**
   - Add your domain to Allowed Web Origins
   - Check Allowed Origins (CORS) settings

3. **User data not appearing**
   - Ensure user metadata is properly set in Auth0
   - Check token claims and namespace configuration

4. **Logout not working**
   - Verify Allowed Logout URLs
   - Check logout implementation uses correct returnTo URL

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific configurations** for dev/staging/production
3. **Enable MFA** for Auth0 administrator accounts
4. **Regularly rotate** client secrets (if using confidential clients)
5. **Monitor** Auth0 logs for suspicious activity
6. **Implement** rate limiting and anomaly detection

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Security Best Practices](https://auth0.com/docs/secure)
- [Auth0 Dashboard](https://manage.auth0.com)

## Support

For issues specific to this implementation, please contact the development team.
For Auth0-specific issues, visit [Auth0 Support](https://support.auth0.com).