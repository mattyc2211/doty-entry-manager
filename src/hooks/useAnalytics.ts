import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a unique session ID for the current session
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device type based on screen width
const getDeviceType = () => {
  const width = window.screen.width;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get browser name from user agent
const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
};

export const useAnalytics = () => {
  const [sessionId] = useState(() => {
    // Try to get existing session ID from sessionStorage first
    const existingSessionId = sessionStorage.getItem('analytics_session_id');
    if (existingSessionId) return existingSessionId;
    
    // Generate new session ID and store it
    const newSessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', newSessionId);
    return newSessionId;
  });

  const sessionStartTime = useRef(Date.now());
  const pageStartTime = useRef(Date.now());
  const isSessionTracked = useRef(false);

  // Initialize session tracking
  useEffect(() => {
    if (!isSessionTracked.current) {
      initializeSession();
      isSessionTracked.current = true;
    }

    // Track page unload for session duration
    const handleBeforeUnload = () => {
      updateSessionDuration();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const initializeSession = async () => {
    try {
      await supabase.from('user_sessions').insert({
        session_id: sessionId,
        device_type: getDeviceType(),
        browser: getBrowserName(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        pages_visited: 1
      });
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  const updateSessionDuration = async () => {
    const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    try {
      await supabase
        .from('user_sessions')
        .update({
          total_duration_seconds: duration,
          ended_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error updating session duration:', error);
    }
  };

  const trackPageView = useCallback(async (pagePath: string, pageTitle?: string) => {
    pageStartTime.current = Date.now();
    
    try {
      await supabase.from('page_views').insert({
        session_id: sessionId,
        page_path: pagePath,
        page_title: pageTitle || document.title,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        device_type: getDeviceType(),
        browser: getBrowserName()
      });

      // Update pages visited count
      await supabase
        .from('user_sessions')
        .update({ pages_visited: (await getCurrentPagesVisited()) + 1 })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [sessionId]);

  const trackFormStep = useCallback(async (
    step: string,
    action: 'enter' | 'exit' | 'next' | 'prev' | 'error',
    entryType?: 'competition' | 'catering',
    stepDuration?: number,
    totalFormDuration?: number,
    errorField?: string,
    errorMessage?: string
  ) => {
    try {
      await supabase.from('form_analytics').insert({
        session_id: sessionId,
        form_step: step,
        entry_type: entryType,
        action,
        step_duration_seconds: stepDuration || 0,
        total_form_duration_seconds: totalFormDuration || 0,
        error_field: errorField,
        error_message: errorMessage
      });
    } catch (error) {
      console.error('Error tracking form step:', error);
    }
  }, [sessionId]);

  const trackFormAbandonment = useCallback(async (
    abandonedStep: string,
    entryType?: 'competition' | 'catering',
    timeBeforeAbandonment?: number,
    lastActiveField?: string
  ) => {
    try {
      await supabase.from('form_abandonment').insert({
        session_id: sessionId,
        abandoned_step: abandonedStep,
        entry_type: entryType,
        time_before_abandonment_seconds: timeBeforeAbandonment || 0,
        last_active_field: lastActiveField
      });
    } catch (error) {
      console.error('Error tracking form abandonment:', error);
    }
  }, [sessionId]);

  const trackFormCompletion = useCallback(async (submissionId: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({
          form_completed: true,
          submission_id: submissionId
        })
        .eq('session_id', sessionId);
    } catch (error) {
      console.error('Error tracking form completion:', error);
    }
  }, [sessionId]);

  const getCurrentPagesVisited = async (): Promise<number> => {
    try {
      const { data } = await supabase
        .from('user_sessions')
        .select('pages_visited')
        .eq('session_id', sessionId)
        .single();
      return data?.pages_visited || 0;
    } catch {
      return 0;
    }
  };

  return {
    sessionId,
    trackPageView,
    trackFormStep,
    trackFormAbandonment,
    trackFormCompletion,
    updateSessionDuration
  };
};