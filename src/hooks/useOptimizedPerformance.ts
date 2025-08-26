import { useCallback, useMemo, useRef } from 'react';

// Debounce hook for search and input optimization
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]) as T;
};

// Throttle hook for scroll and resize events
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  limit: number
): T => {
  const inThrottle = useRef(false);

  return useCallback((...args: Parameters<T>) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      setTimeout(() => (inThrottle.current = false), limit);
    }
  }, [callback, limit]) as T;
};

// Memoized component props to prevent unnecessary re-renders
export const useMemoizedProps = <T extends object>(props: T): T => {
  return useMemo(() => props, [JSON.stringify(props)]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const isIntersecting = useRef(false);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  };

  const observer = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    return new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting;
    }, defaultOptions);
  }, []);

  return { isIntersecting: isIntersecting.current, observer };
};