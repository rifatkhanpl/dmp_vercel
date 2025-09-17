/*
  # Populate Metric Definitions

  1. Data Population
    - Standard production metrics for healthcare provider management
    - Organized by dimensions (productivity, quality, efficiency, engagement)
    - Includes targets and calculation methods

  2. Metric Categories
    - Provider Management metrics
    - Data Quality metrics
    - System Usage metrics
    - Performance metrics
*/

-- Insert standard metric definitions
INSERT INTO metric_definitions (metric_type, display_name, description, dimension, unit, calculation_method, target_value, is_active) VALUES
-- Productivity Metrics
('providers_registered', 'Providers Registered', 'Number of healthcare providers registered in the system', 'productivity', 'count', 'Sum of new provider registrations', 50, true),
('bulk_imports_completed', 'Bulk Imports Completed', 'Number of successful bulk import operations', 'productivity', 'count', 'Count of completed import jobs', 5, true),
('records_processed', 'Records Processed', 'Total number of records processed through all import methods', 'productivity', 'count', 'Sum of all processed records', 200, true),
('profiles_updated', 'Profiles Updated', 'Number of provider profiles updated or modified', 'productivity', 'count', 'Count of profile update operations', 30, true),
('duplicates_resolved', 'Duplicates Resolved', 'Number of duplicate records identified and resolved', 'productivity', 'count', 'Count of duplicate resolution actions', 10, true),

-- Quality Metrics
('data_validation_rate', 'Data Validation Rate', 'Percentage of records passing validation checks', 'quality', 'percentage', 'Valid records / Total records * 100', 95, true),
('error_rate', 'Error Rate', 'Percentage of records with validation errors', 'quality', 'percentage', 'Error records / Total records * 100', 5, true),
('completeness_score', 'Profile Completeness Score', 'Average completeness percentage of provider profiles', 'quality', 'percentage', 'Average of profile completion percentages', 90, true),
('accuracy_score', 'Data Accuracy Score', 'Percentage of accurate data based on verification checks', 'quality', 'percentage', 'Verified accurate records / Total verified * 100', 98, true),

-- Efficiency Metrics
('processing_time_avg', 'Average Processing Time', 'Average time to process import jobs', 'efficiency', 'minutes', 'Total processing time / Number of jobs', 15, true),
('time_to_resolution', 'Time to Resolution', 'Average time to resolve data issues or duplicates', 'efficiency', 'hours', 'Total resolution time / Number of resolutions', 24, true),
('automation_rate', 'Automation Rate', 'Percentage of tasks completed through automated processes', 'efficiency', 'percentage', 'Automated tasks / Total tasks * 100', 70, true),

-- Engagement Metrics
('system_logins', 'System Logins', 'Number of times user logged into the system', 'engagement', 'count', 'Count of login sessions', 20, true),
('session_duration_avg', 'Average Session Duration', 'Average time spent in the system per session', 'engagement', 'minutes', 'Total session time / Number of sessions', 45, true),
('feature_usage_rate', 'Feature Usage Rate', 'Percentage of available features actively used', 'engagement', 'percentage', 'Used features / Total features * 100', 60, true),
('help_requests', 'Help Requests', 'Number of support or help requests submitted', 'engagement', 'count', 'Count of help/support tickets', 2, true),

-- Specialty-Specific Metrics
('specialty_coverage', 'Specialty Coverage', 'Number of unique medical specialties managed', 'coverage', 'count', 'Count of distinct specialties in managed providers', 15, true),
('geographic_coverage', 'Geographic Coverage', 'Number of unique states/regions covered', 'coverage', 'count', 'Count of distinct states in managed providers', 5, true),
('program_affiliations', 'Program Affiliations', 'Number of GME programs with affiliated providers', 'coverage', 'count', 'Count of distinct programs with residents/fellows', 10, true),

-- Advanced Metrics
('ai_accuracy_rate', 'AI Parsing Accuracy', 'Accuracy rate of AI-assisted data extraction', 'ai_performance', 'percentage', 'Correct AI extractions / Total AI extractions * 100', 85, true),
('url_extraction_success', 'URL Extraction Success Rate', 'Success rate of URL-based data extraction', 'ai_performance', 'percentage', 'Successful URL extractions / Total attempts * 100', 80, true),
('mapping_confidence_avg', 'Average Mapping Confidence', 'Average confidence score for AI field mappings', 'ai_performance', 'percentage', 'Sum of confidence scores / Number of mappings * 100', 90, true),

-- Compliance Metrics
('audit_compliance_rate', 'Audit Compliance Rate', 'Percentage of records meeting audit requirements', 'compliance', 'percentage', 'Compliant records / Total records * 100', 100, true),
('data_retention_compliance', 'Data Retention Compliance', 'Compliance with data retention policies', 'compliance', 'percentage', 'Compliant retention actions / Total actions * 100', 100, true),
('security_incidents', 'Security Incidents', 'Number of security-related incidents or violations', 'compliance', 'count', 'Count of security incidents', 0, true);