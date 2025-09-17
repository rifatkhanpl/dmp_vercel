/*
  # Link Healthcare Providers to GME Programs

  1. Updates
    - Link existing healthcare providers to appropriate GME programs
    - Update program names, institutions, and training details
    - Set realistic PGY years and training dates
    - Align practice addresses with training institutions

  2. Program Assignments
    - Maps providers to programs based on specialty matching
    - Updates institutional affiliations
    - Sets appropriate training timelines

  3. Data Consistency
    - Ensures realistic training dates and PGY assignments
    - Updates practice addresses to match institutions
    - Maintains data integrity across related tables
*/

-- Update healthcare providers with GME program information and realistic training data
UPDATE healthcare_providers 
SET 
  program_name = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN 'Internal Medicine Residency Program'
    WHEN primary_specialty = 'Emergency Medicine' THEN 'Emergency Medicine Residency Program'
    WHEN primary_specialty = 'Family Medicine' THEN 'Family Medicine Residency Program'
    WHEN primary_specialty = 'Pediatrics' THEN 'Pediatrics Residency Program'
    WHEN primary_specialty = 'Surgery' THEN 'General Surgery Residency Program'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'Orthopedic Surgery Residency Program'
    WHEN primary_specialty = 'Cardiology' THEN 'Cardiology Fellowship Program'
    WHEN primary_specialty = 'Gastroenterology' THEN 'Gastroenterology Fellowship Program'
    WHEN primary_specialty = 'Pulmonology' THEN 'Pulmonology Fellowship Program'
    WHEN primary_specialty = 'Neurology' THEN 'Neurology Residency Program'
    WHEN primary_specialty = 'Psychiatry' THEN 'Psychiatry Residency Program'
    WHEN primary_specialty = 'Radiology' THEN 'Diagnostic Radiology Residency Program'
    WHEN primary_specialty = 'Anesthesiology' THEN 'Anesthesiology Residency Program'
    WHEN primary_specialty = 'Physical Therapy' THEN 'Physical Therapy Program'
    WHEN primary_specialty = 'Psychology' THEN 'Psychology Training Program'
    ELSE program_name
  END,
  
  institution = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN 'UCLA Medical Center'
    WHEN primary_specialty = 'Emergency Medicine' THEN 'Johns Hopkins Hospital'
    WHEN primary_specialty = 'Family Medicine' THEN 'Massachusetts General Hospital'
    WHEN primary_specialty = 'Pediatrics' THEN 'Boston Children''s Hospital'
    WHEN primary_specialty = 'Surgery' THEN 'Mayo Clinic'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'Hospital for Special Surgery'
    WHEN primary_specialty = 'Cardiology' THEN 'Stanford University Medical Center'
    WHEN primary_specialty = 'Gastroenterology' THEN 'University of Michigan Medical Center'
    WHEN primary_specialty = 'Pulmonology' THEN 'Yale-New Haven Hospital'
    WHEN primary_specialty = 'Neurology' THEN 'Washington University School of Medicine'
    WHEN primary_specialty = 'Psychiatry' THEN 'McLean Hospital'
    WHEN primary_specialty = 'Radiology' THEN 'University of Pennsylvania Health System'
    WHEN primary_specialty = 'Anesthesiology' THEN 'Brigham and Women''s Hospital'
    WHEN primary_specialty = 'Physical Therapy' THEN 'Emory University Hospital'
    WHEN primary_specialty = 'Psychology' THEN 'University of Colorado Hospital'
    ELSE institution
  END,
  
  program_type = CASE 
    WHEN primary_specialty IN ('Cardiology', 'Gastroenterology', 'Pulmonology', 'Pediatric Surgery', 'Infectious Diseases', 'Endocrinology') THEN 'Fellowship'
    ELSE 'Residency'
  END,
  
  pgy_year = CASE 
    WHEN primary_specialty IN ('Cardiology', 'Gastroenterology', 'Pulmonology', 'Pediatric Surgery', 'Infectious Diseases', 'Endocrinology') THEN 'Fellow'
    WHEN primary_specialty = 'Surgery' THEN 
      CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'PGY-1'
        WHEN 1 THEN 'PGY-2'
        WHEN 2 THEN 'PGY-3'
        WHEN 3 THEN 'PGY-4'
        ELSE 'PGY-5'
      END
    ELSE 
      CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'PGY-1'
        WHEN 1 THEN 'PGY-2'
        ELSE 'PGY-3'
      END
  END,
  
  training_start_date = (CASE 
    WHEN primary_specialty IN ('Cardiology', 'Gastroenterology', 'Pulmonology', 'Pediatric Surgery', 'Infectious Diseases', 'Endocrinology') THEN '2023-07-01'
    WHEN primary_specialty = 'Surgery' THEN 
      CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN '2023-07-01'
        WHEN 1 THEN '2022-07-01'
        WHEN 2 THEN '2021-07-01'
        WHEN 3 THEN '2020-07-01'
        ELSE '2019-07-01'
      END
    ELSE 
      CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN '2023-07-01'
        WHEN 1 THEN '2022-07-01'
        ELSE '2021-07-01'
      END
  END)::date,
  
  training_end_date = (CASE 
    WHEN primary_specialty IN ('Cardiology', 'Gastroenterology', 'Pulmonology', 'Pediatric Surgery', 'Infectious Diseases', 'Endocrinology') THEN '2024-06-30'
    WHEN primary_specialty = 'Surgery' THEN 
      CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN '2028-06-30'
        WHEN 1 THEN '2027-06-30'
        WHEN 2 THEN '2026-06-30'
        WHEN 3 THEN '2025-06-30'
        ELSE '2024-06-30'
      END
    ELSE 
      CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN '2026-06-30'
        WHEN 1 THEN '2025-06-30'
        ELSE '2024-06-30'
      END
  END)::date,
  
  -- Update practice addresses to match institutions
  practice_address_1 = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN '757 Westwood Plaza'
    WHEN primary_specialty = 'Emergency Medicine' THEN '1800 Orleans St'
    WHEN primary_specialty = 'Family Medicine' THEN '55 Fruit St'
    WHEN primary_specialty = 'Pediatrics' THEN '300 Longwood Ave'
    WHEN primary_specialty = 'Surgery' THEN '200 First St SW'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN '535 E 70th St'
    WHEN primary_specialty = 'Cardiology' THEN '300 Pasteur Dr'
    WHEN primary_specialty = 'Gastroenterology' THEN '1500 E Medical Center Dr'
    WHEN primary_specialty = 'Pulmonology' THEN '20 York St'
    WHEN primary_specialty = 'Neurology' THEN '660 S Euclid Ave'
    WHEN primary_specialty = 'Psychiatry' THEN '115 Mill St'
    WHEN primary_specialty = 'Radiology' THEN '3400 Spruce St'
    WHEN primary_specialty = 'Anesthesiology' THEN '75 Francis St'
    WHEN primary_specialty = 'Physical Therapy' THEN '1364 Clifton Rd NE'
    WHEN primary_specialty = 'Psychology' THEN '12401 E 17th Ave'
    ELSE practice_address_1
  END,
  
  practice_city = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN 'Los Angeles'
    WHEN primary_specialty = 'Emergency Medicine' THEN 'Baltimore'
    WHEN primary_specialty = 'Family Medicine' THEN 'Boston'
    WHEN primary_specialty = 'Pediatrics' THEN 'Boston'
    WHEN primary_specialty = 'Surgery' THEN 'Rochester'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'New York'
    WHEN primary_specialty = 'Cardiology' THEN 'Stanford'
    WHEN primary_specialty = 'Gastroenterology' THEN 'Ann Arbor'
    WHEN primary_specialty = 'Pulmonology' THEN 'New Haven'
    WHEN primary_specialty = 'Neurology' THEN 'St. Louis'
    WHEN primary_specialty = 'Psychiatry' THEN 'Belmont'
    WHEN primary_specialty = 'Radiology' THEN 'Philadelphia'
    WHEN primary_specialty = 'Anesthesiology' THEN 'Boston'
    WHEN primary_specialty = 'Physical Therapy' THEN 'Atlanta'
    WHEN primary_specialty = 'Psychology' THEN 'Aurora'
    ELSE practice_city
  END,
  
  practice_state = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN 'CA'
    WHEN primary_specialty = 'Emergency Medicine' THEN 'MD'
    WHEN primary_specialty = 'Family Medicine' THEN 'MA'
    WHEN primary_specialty = 'Pediatrics' THEN 'MA'
    WHEN primary_specialty = 'Surgery' THEN 'MN'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN 'NY'
    WHEN primary_specialty = 'Cardiology' THEN 'CA'
    WHEN primary_specialty = 'Gastroenterology' THEN 'MI'
    WHEN primary_specialty = 'Pulmonology' THEN 'CT'
    WHEN primary_specialty = 'Neurology' THEN 'MO'
    WHEN primary_specialty = 'Psychiatry' THEN 'MA'
    WHEN primary_specialty = 'Radiology' THEN 'PA'
    WHEN primary_specialty = 'Anesthesiology' THEN 'MA'
    WHEN primary_specialty = 'Physical Therapy' THEN 'GA'
    WHEN primary_specialty = 'Psychology' THEN 'CO'
    ELSE practice_state
  END,
  
  practice_zip = CASE 
    WHEN primary_specialty = 'Internal Medicine' THEN '90095'
    WHEN primary_specialty = 'Emergency Medicine' THEN '21287'
    WHEN primary_specialty = 'Family Medicine' THEN '02114'
    WHEN primary_specialty = 'Pediatrics' THEN '02115'
    WHEN primary_specialty = 'Surgery' THEN '55905'
    WHEN primary_specialty = 'Orthopedic Surgery' THEN '10021'
    WHEN primary_specialty = 'Cardiology' THEN '94305'
    WHEN primary_specialty = 'Gastroenterology' THEN '48109'
    WHEN primary_specialty = 'Pulmonology' THEN '06510'
    WHEN primary_specialty = 'Neurology' THEN '63110'
    WHEN primary_specialty = 'Psychiatry' THEN '02478'
    WHEN primary_specialty = 'Radiology' THEN '19104'
    WHEN primary_specialty = 'Anesthesiology' THEN '02115'
    WHEN primary_specialty = 'Physical Therapy' THEN '30322'
    WHEN primary_specialty = 'Psychology' THEN '80045'
    ELSE practice_zip
  END

WHERE primary_specialty IN (
  'Internal Medicine', 'Emergency Medicine', 'Family Medicine', 'Pediatrics', 'Surgery',
  'Orthopedic Surgery', 'Cardiology', 'Gastroenterology', 'Pulmonology', 'Neurology',
  'Psychiatry', 'Radiology', 'Anesthesiology', 'Physical Therapy', 'Psychology'
);