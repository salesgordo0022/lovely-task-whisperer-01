import { useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

export function useSystemOptimization() {
  const { toast } = useToast();

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    // Monitor memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
        console.warn('High memory usage detected:', memoryInfo.usedJSHeapSize);
      }
    }

    // Monitor slow operations
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) { // 100ms threshold
          console.warn('Slow operation detected:', entry.name, entry.duration);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => observer.disconnect();
  }, []);

  // Error boundary for runtime errors
  const handleUnhandledRejection = useCallback((event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error
    toast({
      title: "Erro de Sistema",
      description: "Ocorreu um erro inesperado. Tentando recuperar...",
      variant: "destructive",
    });
    
    event.preventDefault();
  }, [toast]);

  const handleError = useCallback((event: ErrorEvent) => {
    console.error('Runtime error:', event.error);
    
    // Show user-friendly error for critical issues
    if (event.error?.message?.includes('ChunkLoadError') || 
        event.error?.message?.includes('Loading chunk')) {
      toast({
        title: "Erro de Carregamento",
        description: "Por favor, recarregue a página.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // System optimization
  const optimizeSystem = useCallback(() => {
    // Clear old cache entries
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old-') || name.includes('v1-')) {
            caches.delete(name);
          }
        });
      });
    }

    // Clean up old localStorage entries
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('debug-') || key.startsWith('temp-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Could not clean localStorage:', error);
    }

    // Request garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }, []);

  // Initialize system optimization
  useEffect(() => {
    const cleanup = monitorPerformance();
    
    // Add error listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    // Run optimization on page load
    optimizeSystem();
    
    // Run optimization periodically (every 10 minutes)
    const interval = setInterval(optimizeSystem, 10 * 60 * 1000);
    
    return () => {
      cleanup?.();
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      clearInterval(interval);
    };
  }, [monitorPerformance, handleUnhandledRejection, handleError, optimizeSystem]);

  return {
    optimizeSystem,
    monitorPerformance,
  };
}