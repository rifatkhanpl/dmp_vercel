/*
  # Link Healthcare Providers to GME Programs

  1. Updates
    - Update existing healthcare_providers records to link with GME programs
    - Match providers to programs based on specialty and institution
    - Add realistic program names and institutions
    - Update training dates and PGY years

  2. Data Relationships
    - Links providers to appropriate residency/fellowship programs
    - Ensures specialty alignment between providers and programs
    - Adds realistic training timelines
*/

-- Update providers to link with GME programs based on specialty matching

-- Internal Medicine providers -> UCLA Internal Medicine Residency
UPDATE healthcare_providers 
SET 
  program_name = 'Internal Medicine Residency Program',
  institution = 'UCLA Medical Center',
  program_type = 'Residency',
  training_start_date = '2021-07-01',
  training_end_date = '2024-06-30',
  pgy_year = 'PGY-3'
WHERE primary_specialty = 'Internal Medicine' 
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Internal Medicine' 
    LIMIT 3
  );

-- Emergency Medicine providers -> Johns Hopkins Emergency Medicine
UPDATE healthcare_providers 
SET 
  program_name = 'Emergency Medicine Residency Program',
  institution = 'Johns Hopkins Hospital',
  program_type = 'Residency',
  training_start_date = '2022-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-2'
WHERE primary_specialty = 'Emergency Medicine'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Emergency Medicine' 
    LIMIT 2
  );

-- Family Medicine providers -> Harvard Family Medicine
UPDATE healthcare_providers 
SET 
  program_name = 'Family Medicine Residency Program',
  institution = 'Massachusetts General Hospital',
  program_type = 'Residency',
  training_start_date = '2021-07-01',
  training_end_date = '2024-06-30',
  pgy_year = 'PGY-3'
WHERE primary_specialty = 'Family Medicine'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Family Medicine' 
    LIMIT 2
  );

-- Pediatrics providers -> Boston Children's Hospital
UPDATE healthcare_providers 
SET 
  program_name = 'Pediatrics Residency Program',
  institution = 'Boston Children''s Hospital',
  program_type = 'Residency',
  training_start_date = '2022-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-2'
WHERE primary_specialty = 'Pediatrics'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Pediatrics' 
    LIMIT 2
  );

-- Surgery providers -> Mayo Clinic Surgery
UPDATE healthcare_providers 
SET 
  program_name = 'General Surgery Residency Program',
  institution = 'Mayo Clinic',
  program_type = 'Residency',
  training_start_date = '2020-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-4'
WHERE primary_specialty ILIKE '%surgery%'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty ILIKE '%surgery%' 
    LIMIT 2
  );

-- Cardiology providers -> Stanford Cardiology Fellowship
UPDATE healthcare_providers 
SET 
  program_name = 'Cardiovascular Disease Fellowship Program',
  institution = 'Stanford University Medical Center',
  program_type = 'Fellowship',
  training_start_date = '2023-07-01',
  training_end_date = '2024-06-30',
  pgy_year = 'Fellow-1'
WHERE primary_specialty = 'Cardiology'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Cardiology' 
    LIMIT 1
  );

-- Neurology providers -> University of Michigan Neurology
UPDATE healthcare_providers 
SET 
  program_name = 'Neurology Residency Program',
  institution = 'University of Michigan Medical Center',
  program_type = 'Residency',
  training_start_date = '2021-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-3'
WHERE primary_specialty = 'Neurology'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Neurology' 
    LIMIT 1
  );

-- Psychiatry providers -> Yale Psychiatry
UPDATE healthcare_providers 
SET 
  program_name = 'Psychiatry Residency Program',
  institution = 'Yale School of Medicine',
  program_type = 'Residency',
  training_start_date = '2021-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-3'
WHERE primary_specialty = 'Psychiatry'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Psychiatry' 
    LIMIT 1
  );

-- Radiology providers -> University of Pennsylvania Radiology
UPDATE healthcare_providers 
SET 
  program_name = 'Diagnostic Radiology Residency Program',
  institution = 'University of Pennsylvania Health System',
  program_type = 'Residency',
  training_start_date = '2020-07-01',
  training_end_date = '2024-06-30',
  pgy_year = 'PGY-4'
WHERE primary_specialty = 'Radiology'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Radiology' 
    LIMIT 1
  );

-- Anesthesiology providers -> Washington University Anesthesiology
UPDATE healthcare_providers 
SET 
  program_name = 'Anesthesiology Residency Program',
  institution = 'Washington University School of Medicine',
  program_type = 'Residency',
  training_start_date = '2021-07-01',
  training_end_date = '2025-06-30',
  pgy_year = 'PGY-3'
WHERE primary_specialty = 'Anesthesiology'
  AND id IN (
    SELECT id FROM healthcare_providers 
    WHERE primary_specialty = 'Anesthesiology' 
    LIMIT 1
  );

-- Update any remaining providers with generic programs
UPDATE healthcare_providers 
SET 
  program_name = CASE 
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'Orthopedic Surgery Residency Program'
    WHEN primary_specialty = 'Dermatology' THEN 'Dermatology Residency Program'
    WHEN primary_specialty = 'Ophthalmology' THEN 'Ophthalmology Residency Program'
    WHEN primary_specialty = 'Pathology' THEN 'Pathology Residency Program'
    WHEN primary_specialty = 'Physical Medicine and Rehabilitation' THEN 'PM&R Residency Program'
    ELSE primary_specialty || ' Residency Program'
  END,
  institution = CASE 
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'Hospital for Special Surgery'
    WHEN primary_specialty = 'Dermatology' THEN 'University of Colorado Hospital'
    WHEN primary_specialty = 'Ophthalmology' THEN 'Emory University Hospital'
    WHEN primary_specialty = 'Pathology' THEN 'University of Chicago Medical Center'
    WHEN primary_specialty = 'Physical Medicine and Rehabilitation' THEN 'Northwestern Memorial Hospital'
    ELSE 'Academic Medical Center'
  END,
  program_type = CASE 
    WHEN primary_specialty IN ('Cardiology', 'Gastroenterology', 'Pulmonology', 'Endocrinology', 'Infectious Diseases') THEN 'Fellowship'
    ELSE 'Residency'
  END,
  training_start_date = CASE 
    WHEN program_type = 'Fellowship' THEN '2023-07-01'
    ELSE '2021-07-01'
  END,
  training_end_date = CASE 
    WHEN program_type = 'Fellowship' THEN '2024-06-30'
    WHEN primary_specialty IN ('Surgery', 'Orthopedic Surgery', 'Neurosurgery') THEN '2026-06-30'
    ELSE '2024-06-30'
  END,
  pgy_year = CASE 
    WHEN program_type = 'Fellowship' THEN 'Fellow-1'
    WHEN primary_specialty IN ('Surgery', 'Orthopedic Surgery', 'Neurosurgery') THEN 'PGY-4'
    ELSE 'PGY-3'
  END
WHERE program_name IS NULL OR program_name = '';

-- Update practice addresses to match institutions for realism
UPDATE healthcare_providers 
SET 
  practice_address_1 = CASE 
    WHEN institution = 'UCLA Medical Center' THEN '757 Westwood Plaza'
    WHEN institution = 'Johns Hopkins Hospital' THEN '1800 Orleans St'
    WHEN institution = 'Massachusetts General Hospital' THEN '55 Fruit St'
    WHEN institution = 'Boston Children''s Hospital' THEN '300 Longwood Ave'
    WHEN institution = 'Mayo Clinic' THEN '200 First St SW'
    WHEN institution = 'Stanford University Medical Center' THEN '300 Pasteur Dr'
    WHEN institution = 'University of Michigan Medical Center' THEN '1500 E Medical Center Dr'
    WHEN institution = 'Yale School of Medicine' THEN '333 Cedar St'
    WHEN institution = 'University of Pennsylvania Health System' THEN '3400 Spruce St'
    WHEN institution = 'Washington University School of Medicine' THEN '660 S Euclid Ave'
    WHEN institution = 'Hospital for Special Surgery' THEN '535 E 70th St'
    WHEN institution = 'University of Colorado Hospital' THEN '12605 E 16th Ave'
    WHEN institution = 'Emory University Hospital' THEN '1364 Clifton Rd NE'
    WHEN institution = 'University of Chicago Medical Center' THEN '5841 S Maryland Ave'
    WHEN institution = 'Northwestern Memorial Hospital' THEN '251 E Huron St'
    ELSE practice_address_1
  END,
  practice_city = CASE 
    WHEN institution = 'UCLA Medical Center' THEN 'Los Angeles'
    WHEN institution = 'Johns Hopkins Hospital' THEN 'Baltimore'
    WHEN institution = 'Massachusetts General Hospital' THEN 'Boston'
    WHEN institution = 'Boston Children''s Hospital' THEN 'Boston'
    WHEN institution = 'Mayo Clinic' THEN 'Rochester'
    WHEN institution = 'Stanford University Medical Center' THEN 'Stanford'
    WHEN institution = 'University of Michigan Medical Center' THEN 'Ann Arbor'
    WHEN institution = 'Yale School of Medicine' THEN 'New Haven'
    WHEN institution = 'University of Pennsylvania Health System' THEN 'Philadelphia'
    WHEN institution = 'Washington University School of Medicine' THEN 'St. Louis'
    WHEN institution = 'Hospital for Special Surgery' THEN 'New York'
    WHEN institution = 'University of Colorado Hospital' THEN 'Aurora'
    WHEN institution = 'Emory University Hospital' THEN 'Atlanta'
    WHEN institution = 'University of Chicago Medical Center' THEN 'Chicago'
    WHEN institution = 'Northwestern Memorial Hospital' THEN 'Chicago'
    ELSE practice_city
  END,
  practice_state = CASE 
    WHEN institution = 'UCLA Medical Center' THEN 'CA'
    WHEN institution = 'Johns Hopkins Hospital' THEN 'MD'
    WHEN institution = 'Massachusetts General Hospital' THEN 'MA'
    WHEN institution = 'Boston Children''s Hospital' THEN 'MA'
    WHEN institution = 'Mayo Clinic' THEN 'MN'
    WHEN institution = 'Stanford University Medical Center' THEN 'CA'
    WHEN institution = 'University of Michigan Medical Center' THEN 'MI'
    WHEN institution = 'Yale School of Medicine' THEN 'CT'
    WHEN institution = 'University of Pennsylvania Health System' THEN 'PA'
    WHEN institution = 'Washington University School of Medicine' THEN 'MO'
    WHEN institution = 'Hospital for Special Surgery' THEN 'NY'
    WHEN institution = 'University of Colorado Hospital' THEN 'CO'
    WHEN institution = 'Emory University Hospital' THEN 'GA'
    WHEN institution = 'University of Chicago Medical Center' THEN 'IL'
    WHEN institution = 'Northwestern Memorial Hospital' THEN 'IL'
    ELSE practice_state
  END
WHERE institution IS NOT NULL;