import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const baseTitle = 'Moppie Admin';
    const pageTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    
    document.title = pageTitle;
    
    // Update meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Moppie Admin Panel - ${title || 'Dashboard'}`);
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default usePageTitle;
