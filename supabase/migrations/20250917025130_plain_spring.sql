/*
  # Create GME Business Review Data Table

  1. New Tables
    - `gme_business_review_data`
      - `id` (uuid, primary key)
      - `program_name` (text) - Name of the GME program
      - `institution` (text) - Institution/hospital name
      - `specialty` (text) - Medical specialty
      - `program_type` (text) - Residency or Fellowship
      - `city` (text) - Program location city
      - `state` (text) - Program location state
      - `positions` (integer) - Number of positions available
      - `program_director` (text) - Program director name
      - `website` (text) - Program website URL
      - `application_deadline` (text) - Application deadline
      - `match_date` (text) - Match date
      - `established_year` (integer) - Year program was established
      - `accreditation` (text) - Accreditation body (ACGME, AOA, etc.)
      - `duration_years` (integer) - Program duration in years
      - `salary_pgy1` (integer) - PGY-1 salary
      - `salary_pgy2` (integer) - PGY-2 salary
      - `salary_pgy3` (integer) - PGY-3 salary
      - `benefits` (text[]) - Array of benefits offered
      - `rotations` (text[]) - Array of clinical rotations
      - `requirements` (text[]) - Array of application requirements
      - `statistics` (jsonb) - Program statistics and metrics
      - `fellowship_placements` (text[]) - Recent fellowship placements
      - `contact_email` (text) - Program contact email
      - `contact_phone` (text) - Program contact phone
      - `description` (text) - Program description
      - `source_file` (text) - Source file name for audit trail
      - `imported_by` (uuid) - User who imported the data
      - `imported_at` (timestamptz) - Import timestamp
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `gme_business_review_data` table
    - Add policy for authenticated users to read data
    - Add policy for administrators to manage data

  3. Indexes
    - Index on program_name for search
    - Index on institution for filtering
    - Index on specialty for filtering
    - Index on state for geographic filtering
    - Composite index for search functionality
</*/

CREATE TABLE IF NOT EXISTS gme_business_review_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name text NOT NULL,
  institution text NOT NULL,
  specialty text NOT NULL,
  program_type text CHECK (program_type IN ('Residency', 'Fellowship')),
  city text NOT NULL,
  state text NOT NULL CHECK (length(state) = 2),
  positions integer DEFAULT 0,
  program_director text,
  website text,
  application_deadline text,
  match_date text,
  established_year integer CHECK (established_year >= 1900 AND established_year <= 2100),
  accreditation text DEFAULT 'ACGME',
  duration_years integer CHECK (duration_years >= 1 AND duration_years <= 10),
  salary_pgy1 integer CHECK (salary_pgy1 >= 0),
  salary_pgy2 integer CHECK (salary_pgy2 >= 0),
  salary_pgy3 integer CHECK (salary_pgy3 >= 0),
  benefits text[],
  rotations text[],
  requirements text[],
  statistics jsonb DEFAULT '{}',
  fellowship_placements text[],
  contact_email text,
  contact_phone text,
  description text,
  source_file text,
  imported_by uuid,
  imported_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE gme_business_review_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read GME business review data"
  ON gme_business_review_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Administrators can manage GME business review data"
  ON gme_business_review_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'administrator'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gme_business_review_program_name 
  ON gme_business_review_data (program_name);

CREATE INDEX IF NOT EXISTS idx_gme_business_review_institution 
  ON gme_business_review_data (institution);

CREATE INDEX IF NOT EXISTS idx_gme_business_review_specialty 
  ON gme_business_review_data (specialty);

CREATE INDEX IF NOT EXISTS idx_gme_business_review_state 
  ON gme_business_review_data (state);

CREATE INDEX IF NOT EXISTS idx_gme_business_review_program_type 
  ON gme_business_review_data (program_type);

-- Create composite index for search functionality
CREATE INDEX IF NOT EXISTS idx_gme_business_review_search 
  ON gme_business_review_data 
  USING gin ((program_name || ' ' || institution || ' ' || specialty) gin_trgm_ops);

-- Create foreign key constraint for imported_by
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gme_business_review_data_imported_by_fkey'
  ) THEN
    ALTER TABLE gme_business_review_data 
    ADD CONSTRAINT gme_business_review_data_imported_by_fkey 
    FOREIGN KEY (imported_by) REFERENCES users(id);
  END IF;
END $$;

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_gme_business_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gme_business_review_timestamp
  BEFORE UPDATE ON gme_business_review_data
  FOR EACH ROW
  EXECUTE FUNCTION update_gme_business_review_timestamp();