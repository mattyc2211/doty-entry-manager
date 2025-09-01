-- Create analytics tables for tracking user behavior and form interactions

-- Page views tracking
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_seconds INTEGER DEFAULT 0
);

-- Form analytics tracking
CREATE TABLE public.form_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  form_step TEXT NOT NULL,
  entry_type TEXT, -- 'competition' or 'catering'
  action TEXT NOT NULL, -- 'enter', 'exit', 'next', 'prev', 'error'
  step_duration_seconds INTEGER DEFAULT 0,
  total_form_duration_seconds INTEGER DEFAULT 0,
  error_field TEXT,
  error_message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User sessions tracking
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_duration_seconds INTEGER DEFAULT 0,
  pages_visited INTEGER DEFAULT 0,
  form_completed BOOLEAN DEFAULT false,
  form_abandoned_at_step TEXT,
  submission_id TEXT, -- Links to successful submission
  device_type TEXT,
  browser TEXT,
  screen_resolution TEXT,
  country TEXT,
  city TEXT
);

-- Form abandonment tracking
CREATE TABLE public.form_abandonment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  abandoned_step TEXT NOT NULL,
  entry_type TEXT,
  time_before_abandonment_seconds INTEGER,
  last_active_field TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_abandonment ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (analytics data)
CREATE POLICY "Allow public insert on page_views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on page_views" 
ON public.page_views 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on form_analytics" 
ON public.form_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on form_analytics" 
ON public.form_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on user_sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on user_sessions" 
ON public.user_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public update on user_sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public insert on form_abandonment" 
ON public.form_abandonment 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on form_abandonment" 
ON public.form_abandonment 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_timestamp ON public.page_views(timestamp);
CREATE INDEX idx_form_analytics_session_id ON public.form_analytics(session_id);
CREATE INDEX idx_form_analytics_timestamp ON public.form_analytics(timestamp);
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_user_sessions_started_at ON public.user_sessions(started_at);
CREATE INDEX idx_form_abandonment_session_id ON public.form_abandonment(session_id);

-- Create function to calculate analytics metrics
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