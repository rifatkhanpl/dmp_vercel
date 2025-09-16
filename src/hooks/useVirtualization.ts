import { useMemo, useState, useCallback } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  data: any[];
}

interface VirtualizationResult {
  visibleItems: any[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  scrollToIndex: (index: number) => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export function useVirtualization({
  itemHeight,
  containerHeight,
  overscan = 5,
  data
}: UseVirtualizationOptions): VirtualizationResult {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex, visibleItems, totalHeight, offsetY } = useMemo(() => {
    const itemCount = data.length;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + overscan, itemCount);
    const actualStart = Math.max(0, start - overscan);
    
    const items = data.slice(actualStart, end);
    const total = itemCount * itemHeight;
    const offset = actualStart * itemHeight;
    
    return {
      startIndex: actualStart,
      endIndex: end,
      visibleItems: items,
      totalHeight: total,
      offsetY: offset
    };
  }, [data, scrollTop, itemHeight, containerHeight, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight;
    setScrollTop(targetScrollTop);
  }, [itemHeight]);

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    scrollToIndex,
    handleScroll
  };
}