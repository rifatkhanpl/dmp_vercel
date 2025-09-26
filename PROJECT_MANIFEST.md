# PracticeLink Residents/Fellows Data Management Portal (RF-DMP) - Project Export Manifest

## Project Overview
**Project Name:** PracticeLink Residents/Fellows Data Management Portal (RF-DMP)  
**Version:** 1.0.0  
**Export Date:** January 2025  
**Description:** Secure residents/fellows data collection platform for PracticeLink's Provider Relations & Development Team

## Technology Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** Auth0 + Mock Development Auth
- **Database:** Supabase (PostgreSQL)
- **Email Service:** Resend API
- **State Management:** React Context API
- **Routing:** React Router DOM v7
- **Form Validation:** Zod
- **Testing:** Vitest (configured)

## File Structure & Manifest

### Root Configuration Files
```
├── package.json                    # Frontend dependencies and scripts
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript configuration (root)
├── tsconfig.app.json               # TypeScript app configuration
├── tsconfig.node.json              # TypeScript node configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── eslint.config.js                # ESLint configuration
├── vitest.config.ts                # Vitest testing configuration
├── vercel.json                     # Vercel deployment configuration
├── .env                            # Environment variables (Auth0, Supabase)
├── README.md                       # Project documentation
├── AUTH0_SETUP.md                  # Auth0 setup instructions
├── DEVELOPMENT_GUIDELINES.md       # Development best practices
└── robots.txt                     # Search engine directives (blocks all)
```

### Public Assets
```
public/
├── robots.txt                      # SEO/crawler blocking
├── vite.svg                        # Vite logo
├── image.png                       # Project images
├── image copy.png                  # Additional project images
├── image copy copy.png             # Additional project images
├── image copy copy copy.png        # Additional project images
├── image copy copy copy copy.png   # Additional project images
└── image copy copy copy copy copy.png # Additional project images
```

### Source Code Structure
```
src/
├── main.tsx                        # Application entry point with Auth0 provider
├── App.tsx                         # Main app component with routing
├── App.css                         # Legacy CSS (minimal usage)
├── index.css                       # Tailwind CSS imports
└── vite-env.d.ts                   # Vite type definitions
```

### Type Definitions
```
src/types/
├── dmp.ts                          # DMP-specific types (ResidentFellow, ImportJob, etc.)
├── user.ts                         # User and authentication types
├── navigation.ts                   # Navigation and bookmark types
├── gme.ts                          # GME institution and program types
└── metrics.ts                      # Production metrics types
```

### Configuration & Services
```
src/config/
└── auth0.ts                        # Auth0 configuration

src/services/
├── supabaseClient.ts               # Supabase client configuration
├── dmpService.ts                   # DMP business logic and validation
├── validationService.ts            # Data validation service
├── emailService.ts                 # Email service (Resend API)
├── errorService.ts                 # Centralized error handling
└── metricsService.ts               # Production metrics service
```

### Validation & Security
```
src/schemas/
└── dmpSchemas.ts                   # Zod validation schemas

src/utils/
└── security.ts                    # Security utilities and input sanitization
```

### React Contexts
```
src/contexts/
├── AuthContext.tsx                 # Authentication context (Auth0 + mock)
└── BookmarkContext.tsx             # User bookmarks context
```

### Custom Hooks
```
src/hooks/
├── useDebounce.ts                  # Debouncing hook for search/input
└── useAsyncOperation.ts            # Async operation handling hook
```

### UI Components
```
src/components/ui/
├── Toast.tsx                       # Global toast notifications
├── ProgressBar.tsx                 # Progress bar component
├── ConfirmDialog.tsx               # Confirmation dialog modal
└── LoadingSpinner.tsx              # Loading spinner and overlay
```

### Authentication Components
```
src/components/Auth/
├── SignIn.tsx                      # Sign in page with Auth0 integration
├── SignUp.tsx                      # Sign up page
├── LoginForm.tsx                   # Login form component
├── RegistrationForm.tsx            # Registration form component
├── ForgotPassword.tsx              # Password reset page
├── PasswordReset.tsx               # Password reset form
└── EmailVerification.tsx           # Email verification page
```

### Layout Components
```
src/components/Layout/
├── Layout.tsx                      # Main layout wrapper
├── Header.tsx                      # Application header with user menu
├── Sidebar.tsx                     # Navigation sidebar
├── Footer.tsx                      # Application footer
└── Breadcrumb.tsx                  # Breadcrumb navigation
```

### Core Application Pages
```
src/components/Pages/
├── LandingPage.tsx                 # Public landing page
├── Dashboard.tsx                   # Main dashboard
├── HCPRegistration.tsx             # Resident/fellow registration form
├── BulkImport.tsx                  # Bulk import with file upload and AI parsing
├── Search.tsx                      # Resident/fellow search and management
├── HCPDetail.tsx                   # Resident/fellow detail view
├── UserManagement.tsx              # User management (admin only)
├── AddUser.tsx                     # Add new user form
├── UserProfile.tsx                 # User profile page
├── UserSettings.tsx                # User settings and assignments
├── ProviderProfile.tsx             # Resident/fellow profile page
└── Analytics.tsx                   # Comprehensive analytics dashboard
```

### GME (Graduate Medical Education) Pages
```
src/components/Pages/
├── GMEProgramSearch.tsx            # GME program search and management
├── GMEProgramDetail.tsx            # GME program detail view
├── GMEInstitutionSearch.tsx        # GME institution search
└── GMEInstitutionDetail.tsx        # GME institution detail view
```

### DMP (Data Management Platform) Pages
```
src/components/Pages/
├── DMPDashboard.tsx                # DMP main dashboard
├── TemplateUpload.tsx              # Template-based file upload
├── AIMapping.tsx                   # AI-assisted field mapping
├── URLExtraction.tsx               # URL content extraction
├── JobConsole.tsx                  # Import job monitoring
├── DuplicateReview.tsx             # Duplicate record resolution
└── DataExport.tsx                  # Data export functionality
```

### Metrics & Analytics Pages
```
src/components/Pages/
├── MetricsDashboard.tsx            # Production metrics dashboard
└── MetricsSearch.tsx               # Metrics search and management
```

### Error Handling
```
src/components/
└── ErrorBoundary.tsx               # React error boundary component
```

### Backend Server
```
server/
├── package.json                    # Backend dependencies
├── package-lock.json               # Backend dependency lock
├── .env.example                    # Environment variables template
└── server.js                       # Express server with email functionality
```

### Database Schema
```
supabase/
├── functions/
│   └── parse-hcp-data/
│       └── index.ts                # Edge function for AI parsing
└── migrations/
    ├── 20250916203754_super_snowflake.sql
    ├── 20250916204319_round_bread.sql
    ├── 20250917025130_plain_spring.sql
    ├── 20250917025434_rough_limit.sql
    ├── 20250917030442_lucky_disk.sql
    ├── 20250917051315_old_bush.sql
    ├── 20250917053406_lingering_shrine.sql
    └── create_user_production_metrics.sql # Production metrics schema
```

### Data Files
```
data/
├── v_gme_business_review_rows (2).csv
└── UDB‑GME v0.1 — Business Review Data Table (3).xlsx
```

## Key Features Implemented

### 1. Authentication & Authorization
- **Auth0 Integration:** Production-ready authentication
- **Mock Development Auth:** Local development authentication
- **Role-based Access Control:** Administrator vs Coordinator permissions
- **Email Verification:** Resend API integration

### 2. Residents/Fellows Management
- **Individual Registration:** Comprehensive resident/fellow registration forms
- **Bulk Import:** CSV/Excel file processing with validation
- **AI-Assisted Import:** Text and URL parsing with OpenAI
- **Search & Filter:** Advanced resident/fellow search capabilities
- **Data Validation:** Zod schemas with business rule validation

### 3. GME (Graduate Medical Education) Management
- **Institution Management:** Search, view, and manage GME institutions
- **Program Management:** Residency and fellowship program tracking
- **Relationship Mapping:** Link residents/fellows to programs and institutions
- **Comprehensive Analytics:** Institution, program, and trainee analytics

### 4. Data Management Platform (DMP)
- **Template Upload:** Standardized CSV/Excel import
- **AI Field Mapping:** Intelligent field mapping for arbitrary formats
- **URL Extraction:** Compliant web scraping from educational institutions
- **Job Console:** Import job monitoring and error tracking
- **Duplicate Resolution:** AI-powered duplicate detection and resolution

### 5. Analytics & Reporting
- **Multi-dimensional Analytics:** Institutions, Programs, Residents/Fellows analytics
- **Production Metrics:** User performance and productivity tracking
- **Export Capabilities:** CSV, JSON, and Excel export functionality
- **Real-time Dashboards:** Live metrics and activity feeds

### 6. Security & Compliance
- **Input Sanitization:** XSS and injection prevention
- **File Validation:** Secure file upload with type checking
- **URL Compliance:** Robots.txt checking and domain restrictions
- **Audit Logging:** Complete provenance tracking
- **Error Handling:** Comprehensive error boundary and logging

### 7. User Experience
- **Responsive Design:** Mobile-first responsive layout
- **Progressive Enhancement:** Graceful degradation
- **Loading States:** Proper loading indicators and overlays
- **Error Recovery:** User-friendly error messages and recovery options
- **Accessibility:** ARIA labels and keyboard navigation

## Environment Variables Required

### Frontend (.env)
```
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier (optional)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Backend (server/.env)
```
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@practicelink.com
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Supabase Edge Functions
```
OPENAI_API_KEY=your-openai-api-key (for AI parsing functionality)
```

## Database Schema Summary

### Core Tables
- **users** - User accounts and authentication
- **healthcare_providers** - Healthcare provider records
- **import_jobs** - Import job tracking
- **validation_errors** - Data validation errors
- **duplicate_candidates** - Duplicate detection results
- **mapping_profiles** - AI mapping profiles
- **gme_programs** - GME program data
- **gme_business_review_data** - Business review data
- **bookmarks** - User bookmarks
- **audit_log** - System audit trail
- **provider_assignments** - Provider-user assignments
- **user_specialties** - User specialty assignments
- **user_production_metrics** - Production metrics
- **metric_definitions** - Metric definitions

### Views
- **provider_summary** - Provider summary view
- **user_stats** - User statistics view
- **import_job_summary** - Import job summary view

## Deployment Configuration

### Frontend Deployment
- **Platform:** Vercel (configured)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment:** Node.js 18+

### Backend Deployment
- **Platform:** Any Node.js hosting (Railway, Render, Heroku)
- **Runtime:** Node.js 18+
- **Dependencies:** Express, CORS, Resend, dotenv

### Database
- **Platform:** Supabase (PostgreSQL)
- **Features:** Row Level Security, Edge Functions, Real-time subscriptions
- **Migrations:** Automated via Supabase CLI

## Security Features
- **Email Domain Restriction:** @practicelink.com only
- **Input Sanitization:** XSS and injection prevention
- **File Upload Security:** Type validation and size limits
- **URL Extraction Compliance:** Educational institution restrictions
- **Audit Logging:** Complete activity tracking
- **Role-based Permissions:** Granular access control

## Development Features
- **Hot Reload:** Vite development server
- **Type Safety:** Full TypeScript coverage
- **Code Quality:** ESLint + strict TypeScript rules
- **Error Boundaries:** React error boundary implementation
- **Mock Data:** Development-friendly mock authentication and data

## Production Readiness
- **Error Handling:** Comprehensive error management
- **Performance:** Optimized builds and lazy loading
- **SEO:** Proper meta tags and robots.txt
- **Security Headers:** CSP and security configurations
- **Monitoring:** Error logging and user activity tracking

---

**Total Files:** 100+ source files  
**Lines of Code:** ~15,000+ lines  
**Database Tables:** 12 core tables + 3 views  
**API Endpoints:** 20+ REST endpoints + 1 edge function  
**UI Components:** 50+ React components  

This manifest represents a complete, production-ready residents/fellows data management platform with comprehensive features for managing institutions, programs, and residents/fellows in the GME ecosystem.