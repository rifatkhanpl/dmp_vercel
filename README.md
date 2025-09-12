# PracticeLink Data Collection Portal

A secure data collection platform for PracticeLink's Provider Relations & Development Team.

## Features

- **Secure Authentication**: Role-based access control with email verification
- **HCP Registration**: Comprehensive healthcare provider registration system
- **Data Management**: Tools for managing provider data and records
- **Analytics Dashboard**: Overview of system metrics and activity
- **Email Verification**: Powered by Resend API for reliable email delivery

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Resend API account (for email functionality)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. Set up environment variables:
   ```bash
   # Frontend
   cp .env.example .env
   
   # Backend
   cp server/.env.example server/.env
   ```

5. Configure your Resend API key in `server/.env`:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   ```

6. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

7. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

## Email Configuration

This application uses [Resend](https://resend.com) for email delivery. To set up email functionality:

1. **Create a Resend account** at https://resend.com
2. **Generate an API key** in your Resend dashboard
3. **Add your API key** to `server/.env` as `RESEND_API_KEY`
4. **Verify your sending domain** in Resend (required for production)
5. **Update FROM_EMAIL** in `server/.env` to use your verified domain

### Domain Verification (Production)

For production use, you must verify your sending domain:

1. Go to your Resend dashboard
2. Add your domain (e.g., `practicelink.com`)
3. Add the required DNS records
4. Update `FROM_EMAIL` to use your verified domain

### Email Templates

The application includes professionally designed email templates for:
- Account verification emails with PracticeLink branding
- Password reset emails (future feature)
- Responsive HTML design
- Security notices and expiration warnings

## Architecture

### Frontend (React + TypeScript)
- **Port**: 5173 (Vite dev server)
- **Authentication**: Context-based auth system
- **UI**: Tailwind CSS with Lucide React icons
- **Email**: API calls to backend server

### Backend (Node.js + Express)
- **Port**: 3001
- **Email Service**: Resend API integration
- **Security**: CORS enabled, domain validation
- **API Endpoints**:
  - `POST /api/send-verification-email`
  - `POST /api/send-password-reset-email`
  - `GET /api/health`

## User Roles

- **Provider Relations Data Coordinator**: Can register HCPs and manage data
- **Administrator/Manager**: Full system access including user management

## Security Features

- Email domain restriction (@practicelink.com only)
- Email verification required for account activation
- Role-based access control
- Secure token-based verification system
- 24-hour token expiration for security
- Server-side email processing (API keys never exposed to client)

## Demo Accounts

For testing purposes, the following demo accounts are available:

- **Coordinator**: coordinator@practicelink.com / password
- **Administrator**: admin@practicelink.com / password

## Development

```bash
# Start backend server (in server/ directory)
npm run dev

# Start frontend (in root directory)
npm run dev

# Build frontend for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (defaults to localhost:3001) |
| `VITE_APP_URL` | Frontend URL | No (defaults to localhost:5173) |

### Backend (server/.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Resend API key for email functionality | Yes |
| `FROM_EMAIL` | Sender email address (must be verified domain) | Yes |
| `PORT` | Server port | No (defaults to 3001) |
| `FRONTEND_URL` | Frontend URL for CORS | No (defaults to localhost:5173) |

## Deployment

### Frontend
Deploy to any static hosting service (Vercel, Netlify, etc.)

### Backend
Deploy to any Node.js hosting service (Railway, Render, Heroku, etc.)

Make sure to:
1. Set all required environment variables
2. Verify your sending domain in Resend
3. Update CORS settings for production URLs

## Contributing

This is a private internal tool for PracticeLink's Provider Relations & Development Team. Access is restricted to authorized personnel only.

## License

Private and confidential. All rights reserved by PracticeLink.