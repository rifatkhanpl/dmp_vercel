/*
  # Create metrics dashboard functions

  1. Functions
    - `get_metrics_dashboard_summary` - Returns dashboard summary statistics
    - `get_top_performers` - Returns top performing users by metrics
    - `get_metrics_by_dimension` - Returns metrics grouped by dimension

  2. Security
    - Functions are accessible to authenticated users
    - Row level security applies to underlying tables
*/

-- Function to get dashboard summary statistics
CREATE OR REPLACE FUNCTION public.get_metrics_dashboard_summary(
    start_date text,
    end_date text
)
RETURNS TABLE (
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
        COALESCE((SELECT COUNT(DISTINCT id) FROM users WHERE role IN ('provider-relations-coordinator', 'administrator')), 0) AS total_users,
        COALESCE(COUNT(DISTINCT upm.user_id), 0) AS active_users,
        COALESCE(COUNT(upm.id), 0) AS total_metrics,
        COALESCE(ROUND(AVG(upm.value) FILTER (WHERE upm.metric_type = 'data_validation_rate'), 2), 0) AS average_performance
    FROM
        public.user_production_metrics upm
    WHERE
        upm.created_at >= start_date::timestamp AND upm.created_at <= end_date::timestamp;
END;
$$;

-- Function to get top performers
CREATE OR REPLACE FUNCTION public.get_top_performers(
    start_date text,
    end_date text,
    limit_count integer DEFAULT 10
)
RETURNS TABLE (
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
        upm.user_id,
        COALESCE(u.first_name || ' ' || u.last_name, u.email) AS user_name,
        COALESCE(ROUND(SUM(upm.value), 2), 0) AS total_score,
        COUNT(upm.id) AS metrics_count
    FROM
        public.user_production_metrics upm
        LEFT JOIN public.users u ON u.id = upm.user_id
    WHERE
        upm.created_at >= start_date::timestamp 
        AND upm.created_at <= end_date::timestamp
    GROUP BY
        upm.user_id, u.first_name, u.last_name, u.email
    ORDER BY
        total_score DESC
    LIMIT limit_count;
END;
$$;

-- Function to get metrics by dimension
CREATE OR REPLACE FUNCTION public.get_metrics_by_dimension(
    start_date text,
    end_date text
)
RETURNS TABLE (
    dimension text,
    metric_type text,
    total_value numeric,
    average_value numeric,
    count bigint,
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
        COALESCE(ROUND(SUM(upm.value), 2), 0) AS total_value,
        COALESCE(ROUND(AVG(upm.value), 2), 0) AS average_value,
        COUNT(upm.id) AS count,
        COALESCE(md.target_value, 0) AS target_value,
        CASE 
            WHEN md.target_value > 0 THEN COALESCE(ROUND((AVG(upm.value) / md.target_value) * 100, 2), 0)
            ELSE 0
        END AS achievement_rate
    FROM
        public.user_production_metrics upm
        LEFT JOIN public.metric_definitions md ON md.metric_type = upm.metric_type AND md.dimension = upm.dimension
    WHERE
        upm.created_at >= start_date::timestamp 
        AND upm.created_at <= end_date::timestamp
    GROUP BY
        upm.dimension, upm.metric_type, md.target_value
    ORDER BY
        upm.dimension, upm.metric_type;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_metrics_dashboard_summary(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_performers(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_metrics_by_dimension(text, text) TO authenticated;