@@ .. @@
       program_name = 'Internal Medicine Residency Program',
       institution = 'UCLA Medical Center',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2024-06-30'
         ELSE '2026-06-30'
-      END,
+      END)::date,
       practice_address_1 = '757 Westwood Plaza',
@@ .. @@
       program_name = 'Emergency Medicine Residency Program',
       institution = 'Johns Hopkins Hospital',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2024-06-30'
         ELSE '2026-06-30'
-      END,
+      END)::date,
       practice_address_1 = '1800 Orleans St',
@@ .. @@
       program_name = 'Family Medicine Residency Program',
       institution = 'Massachusetts General Hospital',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2024-06-30'
         ELSE '2026-06-30'
-      END,
+      END)::date,
       practice_address_1 = '55 Fruit St',
@@ .. @@
       program_name = 'Pediatrics Residency Program',
       institution = 'Boston Children''s Hospital',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2024-06-30'
         ELSE '2026-06-30'
-      END,
+      END)::date,
       practice_address_1 = '300 Longwood Ave',
@@ .. @@
       program_name = 'Surgery Residency Program',
       institution = 'Mayo Clinic',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         WHEN pgy_year = 'PGY-4' THEN '2020-07-01'
         WHEN pgy_year = 'PGY-5' THEN '2019-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2028-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2027-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-4' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-5' THEN '2024-06-30'
         ELSE '2028-06-30'
-      END,
+      END)::date,
       practice_address_1 = '200 First St SW',
@@ .. @@
       program_name = 'Cardiology Fellowship Program',
       institution = 'Stanford University Medical Center',
       program_type = 'Fellowship',
-      training_start_date = '2023-07-01',
-      training_end_date = '2024-06-30',
+      training_start_date = '2023-07-01'::date,
+      training_end_date = '2024-06-30'::date,
       practice_address_1 = '300 Pasteur Dr',
@@ .. @@
       program_name = 'Psychiatry Residency Program',
       institution = 'University of Michigan Medical Center',
       program_type = 'Residency',
-      training_start_date = CASE 
+      training_start_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2023-07-01'
         WHEN pgy_year = 'PGY-2' THEN '2022-07-01'
         WHEN pgy_year = 'PGY-3' THEN '2021-07-01'
         WHEN pgy_year = 'PGY-4' THEN '2020-07-01'
         ELSE '2023-07-01'
-      END,
-      training_end_date = CASE 
+      END)::date,
+      training_end_date = (CASE 
         WHEN pgy_year = 'PGY-1' THEN '2027-06-30'
         WHEN pgy_year = 'PGY-2' THEN '2026-06-30'
         WHEN pgy_year = 'PGY-3' THEN '2025-06-30'
         WHEN pgy_year = 'PGY-4' THEN '2024-06-30'
         ELSE '2027-06-30'
-      END,
+      END)::date,
       practice_address_1 = '1500 E Medical Center Dr',