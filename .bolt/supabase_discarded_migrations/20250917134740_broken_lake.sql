@@ .. @@
 -- Insert default metric definitions
-INSERT INTO metric_definitions (metric_type, display_name, description, dimension, unit, target_value) VALUES
-  ('providers_registered', 'Providers Registered', 'Number of healthcare providers registered', 'productivity', 'count', 50),
-  ('bulk_imports_completed', 'Bulk Imports Completed', 'Number of successful bulk import operations', 'productivity', 'count', 10),
-  ('records_processed', 'Records Processed', 'Total number of records processed through imports', 'productivity', 'count', 1000),
-  ('data_validation_rate', 'Data Validation Rate', 'Percentage of records that pass validation', 'quality', 'percentage', 95),
-  ('processing_time_avg', 'Average Processing Time', 'Average time to process import jobs', 'efficiency', 'minutes', 5),
-  ('system_logins', 'System Logins', 'Number of times user logged into the system', 'engagement', 'count', 20),
-  ('session_duration_avg', 'Average Session Duration', 'Average time spent in the system per session', 'engagement', 'minutes', 30),
-  ('feature_usage_rate', 'Feature Usage Rate', 'Number of different features used', 'engagement', 'count', 8),
-  ('specialty_coverage', 'Specialty Coverage', 'Number of different specialties managed', 'coverage', 'count', 15),
-  ('ai_extraction_accuracy', 'AI Extraction Accuracy', 'Accuracy rate of AI-powered data extraction', 'ai_performance', 'percentage', 90),
-  ('duplicate_detection_rate', 'Duplicate Detection Rate', 'Rate of successful duplicate detection', 'quality', 'percentage', 85),
-  ('compliance_score', 'Compliance Score', 'Overall compliance with data standards', 'compliance', 'percentage', 100)
-ON CONFLICT DO NOTHING;
+INSERT INTO metric_definitions (metric_type, display_name, description, dimension, unit, target_value) 
+SELECT * FROM (VALUES
+  ('providers_registered', 'Providers Registered', 'Number of healthcare providers registered', 'productivity', 'count', 50),
+  ('bulk_imports_completed', 'Bulk Imports Completed', 'Number of successful bulk import operations', 'productivity', 'count', 10),
+  ('records_processed', 'Records Processed', 'Total number of records processed through imports', 'productivity', 'count', 1000),
+  ('data_validation_rate', 'Data Validation Rate', 'Percentage of records that pass validation', 'quality', 'percentage', 95),
+  ('processing_time_avg', 'Average Processing Time', 'Average time to process import jobs', 'efficiency', 'minutes', 5),
+  ('system_logins', 'System Logins', 'Number of times user logged into the system', 'engagement', 'count', 20),
+  ('session_duration_avg', 'Average Session Duration', 'Average time spent in the system per session', 'engagement', 'minutes', 30),
+  ('feature_usage_rate', 'Feature Usage Rate', 'Number of different features used', 'engagement', 'count', 8),
+  ('specialty_coverage', 'Specialty Coverage', 'Number of different specialties managed', 'coverage', 'count', 15),
+  ('ai_extraction_accuracy', 'AI Extraction Accuracy', 'Accuracy rate of AI-powered data extraction', 'ai_performance', 'percentage', 90),
+  ('duplicate_detection_rate', 'Duplicate Detection Rate', 'Rate of successful duplicate detection', 'quality', 'percentage', 85),
+  ('compliance_score', 'Compliance Score', 'Overall compliance with data standards', 'compliance', 'percentage', 100)
+) AS new_metrics(metric_type, display_name, description, dimension, unit, target_value)
+WHERE NOT EXISTS (
+  SELECT 1 FROM metric_definitions WHERE metric_definitions.metric_type = new_metrics.metric_type
+);