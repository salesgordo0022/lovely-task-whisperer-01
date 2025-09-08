import { useCallback, useMemo, useRef } from 'react';

export function usePerformanceOptimization() {
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Debounce para evitar chamadas excessivas
  const debounce = useCallback((key: string, func: () => void, delay: number = 300) => {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }
    
    debounceTimers.current[key] = setTimeout(() => {
      func();
      delete debounceTimers.current[key];
    }, delay);
  }, []);

  // Throttle para limitur execuções
  const throttle = useCallback((func: () => void, limit: number = 100) => {
    let inThrottle = false;
    return () => {
      if (!inThrottle) {
        func();
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Memoização inteligente para arrays
  const memoizeArray = useCallback(<T>(array: T[], keyFn?: (item: T) => string | number) => {
    return useMemo(() => {
      if (keyFn) {
        return array.sort((a, b) => {
          const keyA = keyFn(a);
          const keyB = keyFn(b);
          return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
        });
      }
      return array;
    }, [array, keyFn]);
  }, []);

  // Cleanup automático
  const cleanup = useCallback(() => {
    Object.values(debounceTimers.current).forEach(timer => {
      clearTimeout(timer);
    });
    debounceTimers.current = {};
  }, []);

  return {
    debounce,
    throttle,
    memoizeArray,
    cleanup
  };
}