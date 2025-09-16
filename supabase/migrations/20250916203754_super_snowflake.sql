/*
  # Create DMP Database Schema

  1. New Tables
    - `users` - System users with roles and authentication
    - `healthcare_providers` - Main HCP data with full provider information
    - `import_jobs` - Track data import operations and their status
    - `validation_errors` - Store validation issues from imports
    - `duplicate_candidates` - Track potential duplicate records for review
    - `mapping_profiles` - Save field mapping configurations for reuse
    - `gme_programs` - Graduate Medical Education programs
    - `bookmarks` - User bookmarks for quick navigation
    - `audit_log` - Track all data changes for compliance

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure user data with proper isolation

  3. Features
    - Full provenance tracking for all data
    - Comprehensive validation and error tracking
    - Support for multiple import methods (Template, AI-Map, URL)
    - Duplicate detection and resolution workflow
    - User role management and permissions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table for authentication and role management
CREATE TABLE IF NOT EXISTS users (
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

-- Healthcare Providers table - main data store
CREATE TABLE IF NOT EXISTS healthcare_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Required fields
  npi text NOT NULL UNIQUE CHECK (npi ~ '^\d{10}$'),
  first_name text NOT NULL,
  last_name text NOT NULL,
  credentials text NOT NULL,
  
  -- Optional personal info
  middle_name text,
  gender text CHECK (gender IN ('M', 'F', 'Other')),
  date_of_birth date,
  
  -- Contact information
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
  
  -- Provenance tracking (required for compliance)
  source_type text NOT NULL CHECK (source_type IN ('Template', 'AI-Map', 'URL')),
  source_artifact text,
  source_url text,
  source_fetch_date timestamptz,
  source_hash text,
  
  -- Status and workflow
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'approved', 'rejected')),
  duplicate_of uuid REFERENCES healthcare_providers(id),
  
  -- Audit fields
  entered_by uuid REFERENCES users(id),
  entered_at timestamptz DEFAULT now(),
  last_modified_by uuid REFERENCES users(id),
  last_modified_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_license_dates CHECK (license_expire_date IS NULL OR license_issue_date IS NULL OR license_expire_date > license_issue_date),
  CONSTRAINT valid_training_dates CHECK (training_end_date IS NULL OR training_start_date IS NULL OR training_end_date > training_start_date)
);

-- Import Jobs table - track all data import operations
CREATE TABLE IF NOT EXISTS import_jobs (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('template', 'ai-map', 'url')),
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'partial')),
  
  -- Source information
  file_name text,
  source_url text,
  file_size bigint,
  file_hash text,
  
  -- Processing results
  total_records integer DEFAULT 0,
  success_count integer DEFAULT 0,
  error_count integer DEFAULT 0,
  warning_count integer DEFAULT 0,
  
  -- Metadata
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  processing_time_ms integer,
  
  -- Additional data
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Validation Errors table - store detailed validation issues
CREATE TABLE IF NOT EXISTS validation_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id text REFERENCES import_jobs(id) ON DELETE CASCADE,
  row_number integer NOT NULL,
  field_name text NOT NULL,
  error_message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('error', 'warning')),
  field_value text,
  created_at timestamptz DEFAULT now()
);

-- Duplicate Candidates table - manage duplicate detection workflow
CREATE TABLE IF NOT EXISTS duplicate_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  existing_provider_id uuid REFERENCES healthcare_providers(id),
  incoming_data jsonb NOT NULL,
  match_type text NOT NULL CHECK (match_type IN ('npi', 'name-dob', 'fuzzy')),
  confidence numeric(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  suggested_action text NOT NULL CHECK (suggested_action IN ('merge', 'skip', 'create-new')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  resolved_by uuid REFERENCES users(id),
  resolved_at timestamptz,
  resolution_action text CHECK (resolution_action IN ('merge', 'skip', 'create-new')),
  created_at timestamptz DEFAULT now()
);

-- Mapping Profiles table - save field mapping configurations
CREATE TABLE IF NOT EXISTS mapping_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL,
  field_mappings jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence numeric(3,2) NOT NULL DEFAULT 0.0 CHECK (confidence >= 0 AND confidence <= 1),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  usage_count integer DEFAULT 0
);

-- GME Programs table - Graduate Medical Education programs
CREATE TABLE IF NOT EXISTS gme_programs (
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
  statistics jsonb DEFAULT '{}'::jsonb,
  fellowship_placements text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookmarks table - user navigation bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  icon text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Audit Log table - track all data changes for compliance
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values jsonb,
  new_values jsonb,
  changed_by uuid REFERENCES users(id),
  changed_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Provider Assignments table - track which users manage which providers
CREATE TABLE IF NOT EXISTS provider_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES healthcare_providers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(provider_id, user_id)
);

-- User Specialties table - track user specialty assignments
CREATE TABLE IF NOT EXISTS user_specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  specialty_type text NOT NULL CHECK (specialty_type IN ('profession', 'specialty', 'subspecialty', 'state')),
  specialty_name text NOT NULL,
  category text,
  assigned_by uuid REFERENCES users(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, specialty_type, specialty_name)
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapping_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gme_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_specialties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Administrators can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

CREATE POLICY "Administrators can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

-- RLS Policies for healthcare_providers table
CREATE POLICY "Users can read healthcare providers"
  ON healthcare_providers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert healthcare providers"
  ON healthcare_providers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update assigned providers"
  ON healthcare_providers
  FOR UPDATE
  TO authenticated
  USING (
    entered_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    ) OR
    EXISTS (
      SELECT 1 FROM provider_assignments 
      WHERE provider_id = healthcare_providers.id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for import_jobs table
CREATE POLICY "Users can read own import jobs"
  ON import_jobs
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

CREATE POLICY "Users can create import jobs"
  ON import_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
  );

-- RLS Policies for validation_errors table
CREATE POLICY "Users can read validation errors for their jobs"
  ON validation_errors
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM import_jobs 
      WHERE id = validation_errors.import_job_id 
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid() 
          AND role = 'administrator'
        )
      )
    )
  );

-- RLS Policies for duplicate_candidates table
CREATE POLICY "Users can read duplicate candidates"
  ON duplicate_candidates
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can resolve duplicates"
  ON duplicate_candidates
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

-- RLS Policies for mapping_profiles table
CREATE POLICY "Users can read mapping profiles"
  ON mapping_profiles
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

CREATE POLICY "Users can create mapping profiles"
  ON mapping_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
  );

-- RLS Policies for gme_programs table
CREATE POLICY "Users can read GME programs"
  ON gme_programs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Administrators can manage GME programs"
  ON gme_programs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

-- RLS Policies for bookmarks table
CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for audit_log table
CREATE POLICY "Administrators can read audit log"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

-- RLS Policies for provider_assignments table
CREATE POLICY "Users can read provider assignments"
  ON provider_assignments
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

CREATE POLICY "Administrators can manage provider assignments"
  ON provider_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

-- RLS Policies for user_specialties table
CREATE POLICY "Users can read own specialties"
  ON user_specialties
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'administrator'
    )
  );

CREATE POLICY "Users can manage own specialties"
  ON user_specialties
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_npi ON healthcare_providers(npi);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_name ON healthcare_providers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_specialty ON healthcare_providers(primary_specialty);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_state ON healthcare_providers(practice_state);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_status ON healthcare_providers(status);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_source ON healthcare_providers(source_type);
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_entered_by ON healthcare_providers(entered_by);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

CREATE INDEX IF NOT EXISTS idx_import_jobs_type ON import_jobs(type);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON import_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_by ON import_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_import_jobs_created_at ON import_jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_validation_errors_job ON validation_errors(import_job_id);
CREATE INDEX IF NOT EXISTS idx_validation_errors_severity ON validation_errors(severity);

CREATE INDEX IF NOT EXISTS idx_duplicate_candidates_status ON duplicate_candidates(status);
CREATE INDEX IF NOT EXISTS idx_duplicate_candidates_existing ON duplicate_candidates(existing_provider_id);

CREATE INDEX IF NOT EXISTS idx_gme_programs_specialty ON gme_programs(specialty);
CREATE INDEX IF NOT EXISTS idx_gme_programs_state ON gme_programs(state);
CREATE INDEX IF NOT EXISTS idx_gme_programs_type ON gme_programs(program_type);
CREATE INDEX IF NOT EXISTS idx_gme_programs_institution ON gme_programs(institution);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_provider ON provider_assignments(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_assignments_user ON provider_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_specialties_user ON user_specialties(user_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_healthcare_providers_search 
  ON healthcare_providers 
  USING gin((first_name || ' ' || last_name || ' ' || primary_specialty) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_gme_programs_search 
  ON gme_programs 
  USING gin((program_name || ' ' || institution || ' ' || specialty) gin_trgm_ops);

-- Functions for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, OLD.id::text, TG_OP, to_jsonb(OLD), auth.uid(), now());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid(), now());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by, changed_at)
    VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, to_jsonb(NEW), auth.uid(), now());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for key tables
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_healthcare_providers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Function to update last_modified_at timestamp
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS trigger AS $$
BEGIN
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_healthcare_providers_timestamp
  BEFORE UPDATE ON healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION update_last_modified();

CREATE TRIGGER update_users_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_last_modified();

-- Function to automatically assign providers to users based on specialties
CREATE OR REPLACE FUNCTION auto_assign_provider()
RETURNS trigger AS $$
BEGIN
  -- Auto-assign to users with matching specialty assignments
  INSERT INTO provider_assignments (provider_id, user_id, assigned_by, assigned_at)
  SELECT 
    NEW.id,
    us.user_id,
    NEW.entered_by,
    now()
  FROM user_specialties us
  WHERE us.specialty_type = 'specialty'
    AND us.specialty_name = NEW.primary_specialty
    AND NOT EXISTS (
      SELECT 1 FROM provider_assignments pa 
      WHERE pa.provider_id = NEW.id AND pa.user_id = us.user_id
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-assignment
CREATE TRIGGER auto_assign_provider_trigger
  AFTER INSERT ON healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION auto_assign_provider();

-- Insert sample GME programs
INSERT INTO gme_programs (
  program_name, institution, specialty, city, state, program_type, 
  positions, program_director, website, email, phone, established,
  duration, application_deadline, match_date
) VALUES 
(
  'Internal Medicine Residency Program',
  'UCLA Medical Center',
  'Internal Medicine',
  'Los Angeles',
  'CA',
  'Residency',
  45,
  'Dr. Sarah Johnson, MD',
  'https://ucla.edu/internal-medicine',
  'internal.medicine@ucla.edu',
  '(310) 825-6301',
  1965,
  '3 years',
  'October 15, 2024',
  'March 15, 2025'
),
(
  'Emergency Medicine Residency Program',
  'Johns Hopkins Hospital',
  'Emergency Medicine',
  'Baltimore',
  'MD',
  'Residency',
  36,
  'Dr. Michael Chen, MD',
  'https://hopkinsmedicine.org/emergency',
  'emergency@jhmi.edu',
  '(410) 955-5000',
  1978,
  '4 years',
  'October 15, 2024',
  'March 15, 2025'
),
(
  'Cardiology Fellowship Program',
  'Mayo Clinic',
  'Cardiology',
  'Rochester',
  'MN',
  'Fellowship',
  12,
  'Dr. Emily Rodriguez, MD',
  'https://mayoclinic.org/cardiology',
  'cardiology@mayo.edu',
  '(507) 284-2511',
  1985,
  '1 year',
  'January 15, 2025',
  'June 15, 2025'
),
(
  'Family Medicine Residency Program',
  'University of Texas Southwestern',
  'Family Medicine',
  'Dallas',
  'TX',
  'Residency',
  24,
  'Dr. David Wilson, MD',
  'https://utsouthwestern.edu/family-medicine',
  'family.medicine@utsouthwestern.edu',
  '(214) 648-3111',
  1972,
  '3 years',
  'October 15, 2024',
  'March 15, 2025'
),
(
  'Pediatrics Residency Program',
  'Boston Children''s Hospital',
  'Pediatrics',
  'Boston',
  'MA',
  'Residency',
  42,
  'Dr. Lisa Thompson, MD',
  'https://childrenshospital.org/pediatrics',
  'pediatrics@childrens.harvard.edu',
  '(617) 355-6000',
  1960,
  '3 years',
  'October 15, 2024',
  'March 15, 2025'
)
ON CONFLICT DO NOTHING;

-- Create views for common queries
CREATE OR REPLACE VIEW provider_summary AS
SELECT 
  hp.id,
  hp.first_name || ' ' || hp.last_name || ', ' || hp.credentials AS full_name,
  hp.primary_specialty,
  hp.practice_city || ', ' || hp.practice_state AS location,
  hp.email,
  hp.phone,
  hp.npi,
  hp.status,
  hp.source_type,
  hp.entered_at,
  u.first_name || ' ' || u.last_name AS entered_by_name,
  COUNT(pa.user_id) AS assigned_users_count
FROM healthcare_providers hp
LEFT JOIN users u ON hp.entered_by = u.id
LEFT JOIN provider_assignments pa ON hp.id = pa.provider_id
GROUP BY hp.id, u.first_name, u.last_name;

CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.first_name || ' ' || u.last_name AS full_name,
  u.email,
  u.role,
  u.status,
  u.last_login_at,
  COUNT(DISTINCT hp.id) AS providers_entered,
  COUNT(DISTINCT pa.provider_id) AS providers_assigned,
  COUNT(DISTINCT ij.id) AS import_jobs_created
FROM users u
LEFT JOIN healthcare_providers hp ON u.id = hp.entered_by
LEFT JOIN provider_assignments pa ON u.id = pa.user_id
LEFT JOIN import_jobs ij ON u.id = ij.created_by
GROUP BY u.id;

CREATE OR REPLACE VIEW import_job_summary AS
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
  u.first_name || ' ' || u.last_name AS created_by_name,
  COUNT(ve.id) AS total_validation_errors
FROM import_jobs ij
LEFT JOIN users u ON ij.created_by = u.id
LEFT JOIN validation_errors ve ON ij.id = ve.import_job_id
GROUP BY ij.id, u.first_name, u.last_name;