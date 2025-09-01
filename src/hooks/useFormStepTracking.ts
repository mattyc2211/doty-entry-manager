import { useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useFormStepTracking = (
  currentStep: string,
  entryType?: 'competition' | 'catering'
) => {
  const { trackFormStep, trackFormAbandonment } = useAnalytics();
  const stepStartTime = useRef<number>(Date.now());
  const formStartTime = useRef<number>(Date.now());
  const lastStep = useRef<string>('');
  const isInitialized = useRef(false);

  // Initialize form tracking
  useEffect(() => {
    if (!isInitialized.current) {
      formStartTime.current = Date.now();
      isInitialized.current = true;
    }
  }, []);

  // Track step changes
  useEffect(() => {
    const now = Date.now();
    
    // Track exit from previous step
    if (lastStep.current && lastStep.current !== currentStep) {
      const stepDuration = Math.floor((now - stepStartTime.current) / 1000);
      const totalFormDuration = Math.floor((now - formStartTime.current) / 1000);
      
      trackFormStep(
        lastStep.current,
        'exit',
        entryType,
        stepDuration,
        totalFormDuration
      );
    }

    // Track enter to current step
    stepStartTime.current = now;
    const totalFormDuration = Math.floor((now - formStartTime.current) / 1000);
    
    trackFormStep(
      currentStep,
      'enter',
      entryType,
      0,
      totalFormDuration
    );

    lastStep.current = currentStep;
  }, [currentStep, entryType, trackFormStep]);

  // Handle page unload (form abandonment)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeBeforeAbandonment = Math.floor((Date.now() - formStartTime.current) / 1000);
      trackFormAbandonment(currentStep, entryType, timeBeforeAbandonment);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep, entryType, trackFormAbandonment]);

  const trackStepNavigation = useCallback((action: 'next' | 'prev') => {
    const now = Date.now();
    const stepDuration = Math.floor((now - stepStartTime.current) / 1000);
    const totalFormDuration = Math.floor((now - formStartTime.current) / 1000);
    
    trackFormStep(
      currentStep,
      action,
      entryType,
      stepDuration,
      totalFormDuration
    );
  }, [currentStep, entryType, trackFormStep]);

  const trackFormError = useCallback((errorField: string, errorMessage: string) => {
    const now = Date.now();
    const stepDuration = Math.floor((now - stepStartTime.current) / 1000);
    const totalFormDuration = Math.floor((now - formStartTime.current) / 1000);
    
    trackFormStep(
      currentStep,
      'error',
      entryType,
      stepDuration,
      totalFormDuration,
      errorField,
      errorMessage
    );
  }, [currentStep, entryType, trackFormStep]);

  return {
    trackStepNavigation,
    trackFormError,
    getFormDuration: () => Math.floor((Date.now() - formStartTime.current) / 1000)
  };
};