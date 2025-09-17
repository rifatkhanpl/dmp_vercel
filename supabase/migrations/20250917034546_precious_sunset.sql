/*
  # User Production Metrics System

  1. New Tables
    - `user_production_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `metric_type` (text, type of metric)
      - `dimension` (text, categorization dimension)
      - `attribute` (text, specific attribute)
      - `value` (numeric, metric value)
      - `unit` (text, unit of measurement)
      - `period_start` (timestamp, period start)
      - `period_end` (timestamp, period end)
      - `metadata` (jsonb, additional context)
      - `created_at` (timestamp)

    - `metric_definitions`
      - `id` (uuid, primary key)
      - `metric_type` (text, unique metric identifier)
      - `display_name` (text, human-readable name)
      - `description` (text, metric description)
      - `dimension` (text, categorization)
      - `unit` (text, unit of measurement)
      - `calculation_method` (text, how it's calculated)
      - `target_value` (numeric, target/goal value)
      - `is_active` (boolean, whether metric is tracked)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add audit triggers

  3. Indexes
    - Performance indexes for common queries
    - Composite indexes for filtering and sorting
*/

-- Create metric definitions table
CREATE TABLE IF NOT EXISTS metric_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  dimension text NOT NULL,
  unit text NOT NULL DEFAULT 'count',
  calculation_method text,
  target_value numeric,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user production metrics table
CREATE TABLE IF NOT EXISTS user_production_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  dimension text NOT NULL,
  attribute text,
  value numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'count',
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE metric_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_production_metrics ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_user_id ON user_production_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_metric_type ON user_production_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_dimension ON user_production_metrics(dimension);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_period ON user_production_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_value ON user_production_metrics(value);
CREATE INDEX IF NOT EXISTS idx_user_production_metrics_composite ON user_production_metrics(user_id, metric_type, dimension, period_start);

CREATE INDEX IF NOT EXISTS idx_metric_definitions_dimension ON metric_definitions(dimension);
CREATE INDEX IF NOT EXISTS idx_metric_definitions_active ON metric_definitions(is_active);

-- Add constraints
ALTER TABLE user_production_metrics 
ADD CONSTRAINT valid_period_dates 
CHECK (period_end > period_start);

ALTER TABLE user_production_metrics 
ADD CONSTRAINT valid_value 
CHECK (value >= 0);

ALTER TABLE metric_definitions 
ADD CONSTRAINT valid_target_value 
CHECK (target_value IS NULL OR target_value >= 0);

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
    WHERE users.id = uid() AND users.role = 'administrator'
  ));

-- RLS Policies for user_production_metrics
CREATE POLICY "Users can read own metrics"
  ON user_production_metrics
  FOR SELECT
  TO authenticated
  USING (
    user_id = uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'administrator'
    )
  );

CREATE POLICY "Users can insert own metrics"
  ON user_production_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = uid());

CREATE POLICY "Users can update own metrics"
  ON user_production_metrics
  FOR UPDATE
  TO authenticated
  USING (
    user_id = uid() OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() AND users.role = 'administrator'
    )
  );

CREATE POLICY "Administrators can manage all metrics"
  ON user_production_metrics
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = uid() AND users.role = 'administrator'
  ));

-- Add update timestamp triggers
CREATE TRIGGER update_metric_definitions_timestamp
  BEFORE UPDATE ON metric_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified();

CREATE TRIGGER update_user_production_metrics_timestamp
  BEFORE UPDATE ON user_production_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified();

-- Add audit triggers
CREATE TRIGGER audit_metric_definitions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON metric_definitions
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_user_production_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_production_metrics
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();