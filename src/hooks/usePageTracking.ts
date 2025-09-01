import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';

export const usePageTracking = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Get page title based on route
    const getPageTitle = (pathname: string) => {
      switch (pathname) {
        case '/':
          return 'NZ Premier Dog Show - Home';
        case '/entry':
          return 'Entry Form - NZ Premier Dog Show';
        case '/qualified-participants':
          return 'Qualified Participants - NZ Premier Dog Show';
        case '/about-show':
          return 'About Show - NZ Premier Dog Show';
        case '/sponsors':
          return 'Sponsors - NZ Premier Dog Show';
        case '/admin':
          return 'Admin Dashboard - NZ Premier Dog Show';
        default:
          return 'NZ Premier Dog Show';
      }
    };

    const pageTitle = getPageTitle(location.pathname);
    trackPageView(location.pathname, pageTitle);
  }, [location.pathname, trackPageView]);
};