/*
  # Create DMP Private Schema

  1. New Schema
    - `dmp` schema for all Data Management Platform tables
    
  2. New Tables in dmp schema
    - `users` - System authentication and role management
    - `healthcare_providers` - Main HCP data with full provider information  
    - `import_jobs` - Track all data import operations and status
    - `validation_errors` - Store detailed validation issues from imports
    - `duplicate_candidates` - Manage duplicate detection workflow
    - `mapping_profiles` - Save field mapping configurations for reuse
    - `gme_programs` - Graduate Medical Education programs database
    - `bookmarks` - User navigation bookmarks
    - `audit_log` - Complete audit trail for compliance
    - `provider_assignments` - Track which users manage which providers
    - `user_specialties` - User specialty and state assignments
    
  3. Security
    - Enable RLS on all tables
    - Role-based policies for coordinators vs administrators
    - Audit triggers for change tracking
    - Performance indexes for search and filtering
    
  4. Functions
    - Audit logging function
    - Timestamp update function
    - Auto-assignment function
    
  5. Views
    - Provider summary view
    - User statistics view
    - Import job summary view
*/

-- Create the dmp schema
CREATE SCHEMA IF NOT EXISTS dmp;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to update last_modified timestamp
CREATE OR REPLACE FUNCTION dmp.update_last_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_modified_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit logging function
CREATE OR REPLACE FUNCTION dmp.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO dmp.audit_log (table_name, record_id, action, old_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, OLD.id::text, TG_OP, to_jsonb(OLD), auth.uid(), now());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO dmp.audit_log (table_name, record_id, action, old_values, new_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid(), now());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO dmp.audit_log (table_name, record_id, action, new_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(NEW), auth.uid(), now());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Auto-assignment function for providers
CREATE OR REPLACE FUNCTION dmp.auto_assign_provider()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign provider to users based on specialty matches
  INSERT INTO dmp.provider_assignments (provider_id, user_id, assigned_by, assigned_at)
  SELECT 
    NEW.id,
    us.user_id,
    auth.uid(),
    now()
  FROM dmp.user_specialties us
  WHERE us.specialty_type = 'specialty' 
    AND us.specialty_name = NEW.primary_specialty
    AND NOT EXISTS (
      SELECT 1 FROM dmp.provider_assignments pa 
      WHERE pa.provider_id = NEW.id AND pa.user_id = us.user_id
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CORE TABLES
-- =============================================

-- Users table for authentication and role management
CREATE TABLE IF NOT EXISTS dmp.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('provider-relations-coordinator', 'administrator')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  is_email_verified boolean DEFAULT false,
  phone text,
  department text,
  location text,
  password_hash text,
  verification_token text,
  reset_token text,
  reset_token_expires_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Healthcare Providers table - main data repository
CREATE TABLE IF NOT EXISTS dmp.healthcare_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Required fields
  npi text UNIQUE NOT NULL CHECK (npi ~ '^\d{10}$'),
  first_name text NOT NULL,
  last_name text NOT NULL,
  credentials text NOT NULL,
  
  -- Optional personal info
  middle_name text,
  gender text CHECK (gender IN ('M', 'F', 'Other')),
  date_of_birth date,
  email text,
  phone text,
  alternate_phone text,
  
  -- Practice address (required)
  practice_address_1 text NOT NULL,
  practice_address_2 text,
  practice_city text NOT NULL,
  practice_state text NOT NULL CHECK (length(practice_state) = 2),
  practice_zip text NOT NULL CHECK (practice_zip ~ '^\d{5}(-\d{4})?$'),
  
  -- Mailing address (required)
  mailing_address_1 text NOT NULL,
  mailing_address_2 text,
  mailing_city text NOT NULL,
  mailing_state text NOT NULL CHECK (length(mailing_state) = 2),
  mailing_zip text NOT NULL CHECK (mailing_zip ~ '^\d{5}(-\d{4})?$'),
  
  -- Professional information
  primary_specialty text NOT NULL,
  secondary_specialty text,
  taxonomy_code text,
  
  -- License information (required)
  license_state text NOT NULL CHECK (length(license_state) = 2),
  license_number text NOT NULL,
  license_issue_date date,
  license_expire_date date,
  
  -- Board certification
  board_name text,
  certificate_name text,
  certification_start_date date,
  
  -- GME Training
  program_name text,
  institution text,
  program_type text CHECK (program_type IN ('Residency', 'Fellowship')),
  training_start_date date,
  training_end_date date,
  pgy_year text,
  
  -- Additional identifiers
  dea_number text,
  medicare_number text,
  medicaid_number text,
  sole_proprietor boolean DEFAULT false,
  
  -- Provenance tracking (required)
  source_type text NOT NULL CHECK (source_type IN ('Template', 'AI-Map', 'URL')),
  source_artifact text,
  source_url text,
  source_fetch_date timestamptz,
  source_hash text,
  
  -- Status and metadata
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'approved', 'rejected')),
  duplicate_of uuid REFERENCES dmp.healthcare_providers(id),
  entered_by uuid REFERENCES dmp.users(id),
  entered_at timestamptz DEFAULT now(),
  last_modified_by uuid REFERENCES dmp.users(id),
  last_modified_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_license_dates CHECK (
    license_expire_date IS NULL OR 
    license_issue_date IS NULL OR 
    license_expire_date > license_issue_date
  ),
  CONSTRAINT valid_training_dates CHECK (
    training_end_date IS NULL OR 
    training_start_date IS NULL OR 
    training_end_date > training_start_date
  )
);

-- Import Jobs table for tracking data imports
CREATE TABLE IF NOT EXISTS dmp.import_jobs (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('template', 'ai-map', 'url')),
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'partial')),
  file_name text,
  source_url text,
  file_size bigint,
  file_hash text,
  total_records integer DEFAULT 0,
  success_count integer DEFAULT 0,
  error_count integer DEFAULT 0,
  warning_count integer DEFAULT 0,
  created_by uuid REFERENCES dmp.users(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  processing_time_ms integer,
  metadata jsonb DEFAULT '{}'
);

-- Validation Errors table for detailed error tracking
CREATE TABLE IF NOT EXISTS dmp.validation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id text REFERENCES dmp.import_jobs(id) ON DELETE CASCADE,
  row_number integer NOT NULL,
  field_name text NOT NULL,
  error_message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('error', 'warning')),
  field_value text,
  created_at timestamptz DEFAULT now()
);

-- Duplicate Candidates table for managing duplicates
CREATE TABLE IF NOT EXISTS dmp.duplicate_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  existing_provider_id uuid REFERENCES dmp.healthcare_providers(id),
  incoming_data jsonb NOT NULL,
  match_type text NOT NULL CHECK (match_type IN ('npi', 'name-dob', 'fuzzy')),
  confidence numeric(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  suggested_action text NOT NULL CHECK (suggested_action IN ('merge', 'skip', 'create-new')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  resolved_by uuid REFERENCES dmp.users(id),
  resolved_at timestamptz,
  resolution_action text CHECK (resolution_action IN ('merge', 'skip', 'create-new')),
  created_at timestamptz DEFAULT now()
);

-- Mapping Profiles table for saving field mappings
CREATE TABLE IF NOT EXISTS dmp.mapping_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL,
  field_mappings jsonb NOT NULL DEFAULT '{}',
  confidence numeric(3,2) NOT NULL DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
  created_by uuid REFERENCES dmp.users(id),
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  usage_count integer DEFAULT 0
);

-- GME Programs table for residency/fellowship programs
CREATE TABLE IF NOT EXISTS dmp.gme_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  institution text NOT NULL,
  profession text NOT NULL DEFAULT 'Physician',
  specialty text NOT NULL,
  subspecialty text,
  city text NOT NULL,
  state text NOT NULL CHECK (length(state) = 2),
  program_type text NOT NULL CHECK (program_type IN ('Residency', 'Fellowship')),
  accreditation text NOT NULL DEFAULT 'ACGME',
  positions integer NOT NULL DEFAULT 0,
  program_director text,
  associate_director text,
  website text,
  email text,
  phone text,
  description text,
  established integer,
  duration text,
  application_deadline text,
  interview_season text,
  match_date text,
  salary_pgy1 integer,
  salary_pgy2 integer,
  salary_pgy3 integer,
  benefits text[],
  rotations text[],
  requirements text[],
  statistics jsonb DEFAULT '{}',
  fellowship_placements text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookmarks table for user navigation
CREATE TABLE IF NOT EXISTS dmp.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES dmp.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  icon text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Audit Log table for compliance tracking
CREATE TABLE IF NOT EXISTS dmp.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES dmp.users(id),
  changed_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Provider Assignments table for user-provider relationships
CREATE TABLE IF NOT EXISTS dmp.provider_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES dmp.healthcare_providers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES dmp.users(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES dmp.users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

-- User Specialties table for assignment management
CREATE TABLE IF NOT EXISTS dmp.user_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES dmp.users(id) ON DELETE CASCADE,
  specialty_type text NOT NULL CHECK (specialty_type IN ('profession', 'specialty', 'subspecialty', 'state')),
  specialty_name text NOT NULL,
  category text,
  assigned_by uuid REFERENCES dmp.users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, specialty_type, specialty_name)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON dmp.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON dmp.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON dmp.users(status);

-- Healthcare Providers indexes
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_npi ON dmp.healthcare_providers(npi);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_name ON dmp.healthcare_providers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_specialty ON dmp.healthcare_providers(primary_specialty);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_state ON dmp.healthcare_providers(practice_state);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_status ON dmp.healthcare_providers(status);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_source ON dmp.healthcare_providers(source_type);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_entered_by ON dmp.healthcare_providers(entered_by);

-- Full-text search index for providers
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_search ON dmp.healthcare_providers 
USING gin((first_name || ' ' || last_name || ' ' || primary_specialty) gin_trgm_ops);

-- Import Jobs indexes
CREATE INDEX IF NOT EXISTS idx_import_jobs_type ON dmp.import_jobs(type);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON dmp.import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_by ON dmp.import_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON dmp.import_jobs(created_at);

-- Validation Errors indexes
CREATE INDEX IF NOT EXISTS idx_validation_errors_job ON dmp.validation_errors(import_job_id);
CREATE INDEX IF NOT EXISTS idx_validation_errors_severity ON dmp.validation_errors(severity);

-- Duplicate Candidates indexes
CREATE INDEX IF NOT EXISTS idx_duplicate_candidates_existing ON dmp.duplicate_candidates(existing_provider_id);
CREATE INDEX IF NOT EXISTS idx_duplicate_candidates_status ON dmp.duplicate_candidates(status);

-- GME Programs indexes
CREATE INDEX IF NOT EXISTS idx_gme_programs_specialty ON dmp.gme_programs(specialty);
CREATE INDEX IF NOT EXISTS idx_gme_programs_state ON dmp.gme_programs(state);
CREATE INDEX IF NOT EXISTS idx_gme_programs_type ON dmp.gme_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_gme_programs_institution ON dmp.gme_programs(institution);

-- Full-text search index for GME programs
CREATE INDEX IF NOT EXISTS idx_gme_programs_search ON dmp.gme_programs 
USING gin((program_name || ' ' || institution || ' ' || specialty) gin_trgm_ops);

-- Provider Assignments indexes
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider ON dmp.provider_assignments(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_user ON dmp.provider_assignments(user_id);

-- User Specialties indexes
CREATE INDEX IF NOT EXISTS idx_user_specialties_user ON dmp.user_specialties(user_id);

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON dmp.bookmarks(user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE dmp.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.validation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.mapping_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.gme_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.provider_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmp.user_specialties ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Users policies
CREATE POLICY "Users can read own data" ON dmp.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Administrators can read all users" ON dmp.users
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid() AND role = 'administrator'
  ));

CREATE POLICY "Administrators can manage users" ON dmp.users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid() AND role = 'administrator'
  ));

-- Healthcare Providers policies
CREATE POLICY "Users can read healthcare providers" ON dmp.healthcare_providers
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert healthcare providers" ON dmp.healthcare_providers
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update assigned providers" ON dmp.healthcare_providers
  FOR UPDATE TO authenticated
  USING (
    entered_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM dmp.users 
      WHERE id = auth.uid() AND role = 'administrator'
    ) OR
    EXISTS (
      SELECT 1 FROM dmp.provider_assignments 
      WHERE provider_id = healthcare_providers.id AND user_id = auth.uid()
    )
  );

-- Import Jobs policies
CREATE POLICY "Users can create import jobs" ON dmp.import_jobs
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can read own import jobs" ON dmp.import_jobs
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM dmp.users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- Validation Errors policies
CREATE POLICY "Users can read validation errors for their jobs" ON dmp.validation_errors
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.import_jobs 
    WHERE id = validation_errors.import_job_id 
    AND (
      created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM dmp.users 
        WHERE id = auth.uid() AND role = 'administrator'
      )
    )
  ));

-- Duplicate Candidates policies
CREATE POLICY "Users can read duplicate candidates" ON dmp.duplicate_candidates
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid()
  ));

CREATE POLICY "Users can resolve duplicates" ON dmp.duplicate_candidates
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid()
  ));

-- Mapping Profiles policies
CREATE POLICY "Users can create mapping profiles" ON dmp.mapping_profiles
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can read mapping profiles" ON dmp.mapping_profiles
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM dmp.users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

-- GME Programs policies
CREATE POLICY "Users can read GME programs" ON dmp.gme_programs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid()
  ));

CREATE POLICY "Administrators can manage GME programs" ON dmp.gme_programs
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid() AND role = 'administrator'
  ));

-- Bookmarks policies
CREATE POLICY "Users can manage own bookmarks" ON dmp.bookmarks
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Audit Log policies
CREATE POLICY "Administrators can read audit log" ON dmp.audit_log
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid() AND role = 'administrator'
  ));

-- Provider Assignments policies
CREATE POLICY "Users can read provider assignments" ON dmp.provider_assignments
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM dmp.users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Administrators can manage provider assignments" ON dmp.provider_assignments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM dmp.users 
    WHERE id = auth.uid() AND role = 'administrator'
  ));

-- User Specialties policies
CREATE POLICY "Users can read own specialties" ON dmp.user_specialties
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM dmp.users 
      WHERE id = auth.uid() AND role = 'administrator'
    )
  );

CREATE POLICY "Users can manage own specialties" ON dmp.user_specialties
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamp triggers
CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON dmp.users
  FOR EACH ROW EXECUTE FUNCTION dmp.update_last_modified();

CREATE TRIGGER update_healthcare_providers_timestamp
  BEFORE UPDATE ON dmp.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION dmp.update_last_modified();

-- Audit triggers
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON dmp.users
  FOR EACH ROW EXECUTE FUNCTION dmp.audit_trigger_function();

CREATE TRIGGER audit_healthcare_providers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON dmp.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION dmp.audit_trigger_function();

-- Auto-assignment trigger
CREATE TRIGGER auto_assign_provider_trigger
  AFTER INSERT ON dmp.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION dmp.auto_assign_provider();

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- Provider summary view
CREATE OR REPLACE VIEW dmp.provider_summary AS
SELECT 
  hp.id,
  hp.first_name || ' ' || hp.last_name || COALESCE(', ' || hp.credentials, '') as full_name,
  hp.primary_specialty,
  hp.practice_city || ', ' || hp.practice_state as location,
  hp.email,
  hp.phone,
  hp.npi,
  hp.status,
  hp.source_type,
  hp.entered_at,
  u.first_name || ' ' || u.last_name as entered_by_name,
  COUNT(pa.user_id) as assigned_users_count
FROM dmp.healthcare_providers hp
LEFT JOIN dmp.users u ON hp.entered_by = u.id
LEFT JOIN dmp.provider_assignments pa ON hp.id = pa.provider_id
GROUP BY hp.id, u.first_name, u.last_name;

-- User statistics view
CREATE OR REPLACE VIEW dmp.user_stats AS
SELECT 
  u.id,
  u.first_name || ' ' || u.last_name as full_name,
  u.email,
  u.role,
  u.status,
  u.last_login_at,
  COUNT(DISTINCT hp.id) as providers_entered,
  COUNT(DISTINCT pa.provider_id) as providers_assigned,
  COUNT(DISTINCT ij.id) as import_jobs_created
FROM dmp.users u
LEFT JOIN dmp.healthcare_providers hp ON u.id = hp.entered_by
LEFT JOIN dmp.provider_assignments pa ON u.id = pa.user_id
LEFT JOIN dmp.import_jobs ij ON u.id = ij.created_by
GROUP BY u.id;

-- Import job summary view
CREATE OR REPLACE VIEW dmp.import_job_summary AS
SELECT 
  ij.id,
  ij.type,
  ij.status,
  ij.file_name,
  ij.source_url,
  ij.total_records,
  ij.success_count,
  ij.error_count,
  ij.warning_count,
  ij.created_at,
  ij.completed_at,
  u.first_name || ' ' || u.last_name as created_by_name,
  COUNT(ve.id) as total_validation_errors
FROM dmp.import_jobs ij
LEFT JOIN dmp.users u ON ij.created_by = u.id
LEFT JOIN dmp.validation_errors ve ON ij.id = ve.import_job_id
GROUP BY ij.id, u.first_name, u.last_name;

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================

-- Insert sample admin user (optional - remove in production)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dmp.users WHERE email = 'admin@practicelink.com') THEN
    INSERT INTO dmp.users (
      first_name, last_name, email, role, status, is_email_verified
    ) VALUES (
      'System', 'Administrator', 'admin@practicelink.com', 'administrator', 'active', true
    );
  END IF;
END $$;

-- Insert sample coordinator user (optional - remove in production)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dmp.users WHERE email = 'coordinator@practicelink.com') THEN
    INSERT INTO dmp.users (
      first_name, last_name, email, role, status, is_email_verified
    ) VALUES (
      'Data', 'Coordinator', 'coordinator@practicelink.com', 'provider-relations-coordinator', 'active', true
    );
  END IF;
END $$;