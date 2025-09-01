-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_analytics_summary(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  total_sessions BIGINT,
  total_page_views BIGINT,
  avg_session_duration NUMERIC,
  form_completion_rate NUMERIC,
  most_abandoned_step TEXT,
  peak_hour INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH session_stats AS (
    SELECT 
      COUNT(*) as session_count,
      AVG(total_duration_seconds) as avg_duration,
      SUM(CASE WHEN form_completed THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC * 100 as completion_rate
    FROM user_sessions 
    WHERE started_at BETWEEN start_date AND end_date + INTERVAL '1 day'
  ),
  page_view_stats AS (
    SELECT COUNT(*) as page_view_count
    FROM page_views 
    WHERE timestamp BETWEEN start_date AND end_date + INTERVAL '1 day'
  ),
  abandonment_stats AS (
    SELECT 
      abandoned_step,
      COUNT(*) as abandonment_count,
      ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rn
    FROM form_abandonment 
    WHERE timestamp BETWEEN start_date AND end_date + INTERVAL '1 day'
    GROUP BY abandoned_step
  ),
  peak_hour_stats AS (
    SELECT 
      EXTRACT(HOUR FROM timestamp) as hour,
      COUNT(*) as hour_count,
      ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rn
    FROM page_views 
    WHERE timestamp BETWEEN start_date AND end_date + INTERVAL '1 day'
    GROUP BY EXTRACT(HOUR FROM timestamp)
  )
  SELECT 
    ss.session_count,
    pvs.page_view_count,
    ROUND(ss.avg_duration, 2),
    ROUND(ss.completion_rate, 2),
    COALESCE(abs.abandoned_step, 'None'),
    COALESCE(phs.hour::INTEGER, 0)
  FROM session_stats ss
  CROSS JOIN page_view_stats pvs
  LEFT JOIN abandonment_stats abs ON abs.rn = 1
  LEFT JOIN peak_hour_stats phs ON phs.rn = 1;
END;
$$;