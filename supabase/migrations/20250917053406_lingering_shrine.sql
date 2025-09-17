/*
  # Create user production metrics system

  1. New Tables
    - `user_production_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `metric_type` (text, type of metric)
      - `dimension` (text, metric dimension/category)
      - `attribute` (text, optional attribute)
      - `value` (numeric, metric value)
      - `unit` (text, unit of measurement)
      - `period_start` (timestamptz, period start)
      - `period_end` (timestamptz, period end)
      - `metadata` (jsonb, additional data)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `metric_definitions`
      - `id` (uuid, primary key)
      - `metric_type` (text, unique metric type)
      - `display_name` (text, human readable name)
      - `description` (text, metric description)
      - `dimension` (text, metric dimension)
      - `unit` (text, unit of measurement)
      - `calculation_method` (text, how metric is calculated)
      - `target_value` (numeric, target/goal value)
      - `is_active` (boolean, whether metric is active)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add indexes for performance

  3. Functions
    - Create RPC functions for dashboard metrics
    - Add trigger functions for timestamps
*/

-- Create user_production_metrics table
CREATE TABLE IF NOT EXISTS user_production_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  dimension text NOT NULL DEFAULT 'general',
  attribute text,
  value numeric NOT NULL,
  unit text NOT NULL DEFAULT 'count',
  period_start timestamptz NOT NULL DEFAULT now(),
  period_end timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create metric_definitions table
CREATE TABLE IF NOT EXISTS metric_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  dimension text NOT NULL DEFAULT 'general',
  unit text NOT NULL DEFAULT 'count',
  calculation_method text DEFAULT 'sum',
  target_value numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_production_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_definitions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_user_id ON user_production_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_metric_type ON user_production_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_dimension ON user_production_metrics(dimension);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_created_at ON user_production_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_period ON user_production_metrics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_metric_definitions_metric_type ON metric_definitions(metric_type);
CREATE INDEX IF NOT EXISTS idx_metric_definitions_dimension ON metric_definitions(dimension);
CREATE INDEX IF NOT EXISTS idx_metric_definitions_active ON metric_definitions(is_active);

-- RLS Policies for user_production_metrics
CREATE POLICY "Users can read own metrics"
  ON user_production_metrics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  ));

CREATE POLICY "Users can insert own metrics"
  ON user_production_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own metrics"
  ON user_production_metrics
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  ));

CREATE POLICY "Administrators can delete metrics"
  ON user_production_metrics
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  ));

-- RLS Policies for metric_definitions
CREATE POLICY "Users can read metric definitions"
  ON metric_definitions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Administrators can manage metric definitions"
  ON metric_definitions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'administrator'
  ));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_metrics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_user_production_metrics_timestamp
  BEFORE UPDATE ON user_production_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_metrics_timestamp();

CREATE TRIGGER update_metric_definitions_timestamp
  BEFORE UPDATE ON metric_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_metrics_timestamp();

-- Create RPC function for dashboard summary
CREATE OR REPLACE FUNCTION get_metrics_dashboard_summary(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS TABLE(
  total_users bigint,
  active_users bigint,
  total_metrics bigint,
  average_performance numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT u.id) FROM users u WHERE u.status = 'active')::bigint as total_users,
    (SELECT COUNT(DISTINCT upm.user_id) 
     FROM user_production_metrics upm 
     WHERE upm.created_at >= start_date AND upm.created_at <= end_date)::bigint as active_users,
    (SELECT COUNT(*) 
     FROM user_production_metrics upm 
     WHERE upm.created_at >= start_date AND upm.created_at <= end_date)::bigint as total_metrics,
    (SELECT COALESCE(AVG(upm.value), 0) 
     FROM user_production_metrics upm 
     WHERE upm.created_at >= start_date AND upm.created_at <= end_date 
     AND upm.unit = 'count')::numeric as average_performance;
END;
$$;

-- Create RPC function for top performers
CREATE OR REPLACE FUNCTION get_top_performers(
  start_date timestamptz,
  end_date timestamptz,
  limit_count integer DEFAULT 10
)
RETURNS TABLE(
  user_id uuid,
  user_name text,
  total_score numeric,
  metrics_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    (u.first_name || ' ' || u.last_name) as user_name,
    COALESCE(SUM(upm.value), 0) as total_score,
    COUNT(upm.id) as metrics_count
  FROM users u
  LEFT JOIN user_production_metrics upm ON u.id = upm.user_id 
    AND upm.created_at >= start_date 
    AND upm.created_at <= end_date
  WHERE u.status = 'active'
  GROUP BY u.id, u.first_name, u.last_name
  ORDER BY total_score DESC
  LIMIT limit_count;
END;
$$;

-- Create RPC function for dimension summaries
CREATE OR REPLACE FUNCTION get_dimension_summaries(
  start_date timestamptz,
  end_date timestamptz
)
RETURNS TABLE(
  dimension text,
  metric_type text,
  total_value numeric,
  avg_value numeric,
  count_records bigint,
  target_value numeric,
  achievement_rate numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    upm.dimension,
    upm.metric_type,
    SUM(upm.value) as total_value,
    AVG(upm.value) as avg_value,
    COUNT(upm.id) as count_records,
    md.target_value,
    CASE 
      WHEN md.target_value IS NOT NULL AND md.target_value > 0 
      THEN (AVG(upm.value) / md.target_value * 100)
      ELSE NULL 
    END as achievement_rate
  FROM user_production_metrics upm
  LEFT JOIN metric_definitions md ON upm.metric_type = md.metric_type
  WHERE upm.created_at >= start_date AND upm.created_at <= end_date
  GROUP BY upm.dimension, upm.metric_type, md.target_value
  ORDER BY upm.dimension, total_value DESC;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_metrics_dashboard_summary(timestamptz, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_performers(timestamptz, timestamptz, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dimension_summaries(timestamptz, timestamptz) TO authenticated;

-- Insert some default metric definitions
INSERT INTO metric_definitions (metric_type, display_name, description, dimension, unit, target_value) VALUES
  ('providers_registered', 'Providers Registered', 'Number of healthcare providers registered', 'productivity', 'count', 50),
  ('profiles_updated', 'Profiles Updated', 'Number of provider profiles updated', 'productivity', 'count', 25),
  ('search_queries', 'Search Queries', 'Number of search queries performed', 'engagement', 'count', 100),
  ('bulk_imports_completed', 'Bulk Imports Completed', 'Number of bulk import jobs completed', 'productivity', 'count', 5),
  ('records_processed', 'Records Processed', 'Total number of records processed', 'productivity', 'count', 1000),
  ('processing_time_avg', 'Average Processing Time', 'Average time to process records', 'efficiency', 'minutes', 5),
  ('data_validation_rate', 'Data Validation Rate', 'Percentage of data that passes validation', 'quality', 'percentage', 95),
  ('system_logins', 'System Logins', 'Number of times user logged into system', 'engagement', 'count', 20),
  ('session_duration_avg', 'Average Session Duration', 'Average time spent in system per session', 'engagement', 'minutes', 30),
  ('feature_usage_rate', 'Feature Usage Rate', 'Number of different features used', 'engagement', 'count', 10),
  ('specialty_coverage', 'Specialty Coverage', 'Number of different specialties covered', 'coverage', 'count', 20)
ON CONFLICT (metric_type) DO NOTHING;