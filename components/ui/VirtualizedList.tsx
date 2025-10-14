import React, { useState, useRef, useCallback } from 'react';

interface VirtualizedListProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
}

export function VirtualizedList<T extends { id: string | number }>({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;

  let startNode = Math.floor(scrollTop / itemHeight);
  let visibleNodeCount = 0;
  if (containerRef.current) {
      // Use clientHeight which is the inner height of the scrolling container
      visibleNodeCount = Math.ceil(containerRef.current.clientHeight / itemHeight);
  } else {
      // Fallback for initial render before ref is available
      visibleNodeCount = 10;
  }

  const startIndex = Math.max(0, startNode - overscan);
  const endIndex = Math.min(items.length - 1, startNode + visibleNodeCount + overscan);

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      item: items[i],
      style: {
        position: 'absolute' as const,
        top: `${i * itemHeight}px`,
        width: '100%',
        height: `${itemHeight}px`,
      },
    });
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: '100%', overflowY: 'auto', position: 'relative' }}
      className="inner-scroll"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, style }) => (
          <div key={item.id} style={style}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}