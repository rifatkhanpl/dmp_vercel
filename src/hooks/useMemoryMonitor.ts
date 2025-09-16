import { useEffect, useRef, useCallback } from 'react';
import { errorService } from '../services/errorService';

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercent: number;
}

interface UseMemoryMonitorOptions {
  threshold?: number; // Memory usage percentage threshold for warnings
  interval?: number; // Monitoring interval in milliseconds
  onThresholdExceeded?: (stats: MemoryStats) => void;
  enabled?: boolean;
}

export function useMemoryMonitor({
  threshold = 80,
  interval = 5000,
  onThresholdExceeded,
  enabled = true
}: UseMemoryMonitorOptions = {}) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastWarningRef = useRef<number>(0);
  const statsRef = useRef<MemoryStats | null>(null);

  const getMemoryStats = useCallback((): MemoryStats | null => {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    const stats: MemoryStats = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };

    statsRef.current = stats;
    return stats;
  }, []);

  const checkMemoryUsage = useCallback(() => {
    const stats = getMemoryStats();
    if (!stats) return;

    // Check threshold
    if (stats.usedPercent > threshold) {
      const now = Date.now();
      // Only warn once per minute to avoid spam
      if (now - lastWarningRef.current > 60000) {
        lastWarningRef.current = now;
        
        errorService.logError(new Error('High memory usage detected'), {
          context: 'Memory monitoring',
          stats
        });

        onThresholdExceeded?.(stats);
        
        // Show user warning if memory usage is very high
        if (stats.usedPercent > 90) {
          errorService.showWarning(
            'High memory usage detected. Consider refreshing the page if performance is slow.'
          );
        }
      }
    }
  }, [threshold, onThresholdExceeded]);

  const forceGarbageCollection = useCallback(() => {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      try {
        (window as any).gc();
        errorService.showSuccess('Memory cleanup completed');
      } catch (error) {
        errorService.logError(error as Error, { context: 'Garbage collection' });
      }
    } else {
      // Trigger garbage collection indirectly
      const largeArray = new Array(1000000).fill(0);
      largeArray.length = 0;
    }
  }, []);

  const getCurrentStats = useCallback(() => {
    return statsRef.current;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Start monitoring
    intervalRef.current = setInterval(checkMemoryUsage, interval);

    // Initial check
    checkMemoryUsage();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, checkMemoryUsage]);

  return {
    getMemoryStats,
    getCurrentStats,
    forceGarbageCollection,
    isSupported: 'memory' in performance
  };
}

// Hook for cleaning up large objects and arrays
export function useCleanup() {
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctionsRef.current.push(cleanupFn);
  }, []);

  const cleanup = useCallback(() => {
    cleanupFunctionsRef.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        errorService.logError(error as Error, { context: 'Cleanup function' });
      }
    });
    cleanupFunctionsRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { addCleanup, cleanup };
}