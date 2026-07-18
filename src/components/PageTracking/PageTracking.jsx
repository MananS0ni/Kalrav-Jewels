import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTracking = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.gtag && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
};

export default PageTracking;
