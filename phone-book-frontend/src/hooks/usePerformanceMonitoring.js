import { useEffect, useCallback } from 'react';

export const usePerformanceMonitoring = () => {
  
  const measureApiCall = useCallback((apiName, startTime) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log performance metrics
    if (process.env.NODE_ENV === 'production') {
      // In production, send to monitoring service
      console.log(`API_PERFORMANCE: ${apiName} took ${duration.toFixed(2)}ms`);
    } else {
      console.log(`🚀 ${apiName}: ${duration.toFixed(2)}ms`);
    }
    
    // Alert if API call is too slow
    if (duration > 5000) {
      console.warn(`⚠️ Slow API call detected: ${apiName} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, []);

  const measurePageLoad = useCallback((pageName) => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart;
      
      console.log(`📊 Page Performance - ${pageName}:`);
      console.log(`  - Total Load Time: ${loadTime.toFixed(2)}ms`);
      console.log(`  - DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
      
      // Alert if page load is too slow
      if (loadTime > 3000) {
        console.warn(`⚠️ Slow page load: ${pageName} took ${loadTime.toFixed(2)}ms`);
      }
    }
  }, []);

  const measureComponentRender = useCallback((componentName, renderFunction) => {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16) { // More than one frame at 60fps
      console.warn(`⚠️ Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }, []);

  const trackUserInteraction = useCallback((action, element) => {
    const timestamp = new Date().toISOString();
    
    if (process.env.NODE_ENV === 'production') {
      // In production, send to analytics
      console.log(`USER_INTERACTION: ${action} on ${element} at ${timestamp}`);
    }
  }, []);

  const trackError = useCallback((error, context) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('🚨 Error tracked:', errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, send to error tracking service
      // Example: Sentry, LogRocket, etc.
    }
  }, []);

  // Monitor Core Web Vitals
  useEffect(() => {
    if ('web-vital' in window) {
      // This would integrate with web-vitals library
      // For now, we'll use basic performance API
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`📊 LCP: ${entry.startTime.toFixed(2)}ms`);
            if (entry.startTime > 2500) {
              console.warn('⚠️ Poor LCP score');
            }
          }
          
          if (entry.entryType === 'first-input') {
            console.log(`📊 FID: ${entry.processingStart - entry.startTime}ms`);
            if (entry.processingStart - entry.startTime > 100) {
              console.warn('⚠️ Poor FID score');
            }
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (e) {
        // Browser doesn't support these metrics
      }
      
      return () => observer.disconnect();
    }
  }, []);

  return {
    measureApiCall,
    measurePageLoad,
    measureComponentRender,
    trackUserInteraction,
    trackError
  };
};