"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VirtualListProps<T> {
  items: readonly T[];
  /** Fixed row height in px — keeps scroll math exact and avoids layout shift. */
  rowHeight: number;
  /** Viewport height of the scroll container in px. */
  height?: number;
  overscan?: number;
  getKey: (item: T) => string;
  header?: ReactNode;
  renderRow: (item: T) => ReactNode;
  /** Accessible name for the list. */
  label: string;
  className?: string;
  /** Called with the first visible index (rAF-throttled, no React render). */
  onVisibleStart?: (index: number) => void;
}

/**
 * Windowed list built on TanStack Virtual. Only the rows inside the viewport
 * (+ `overscan`) exist in the DOM, regardless of `items.length`.
 */
export function VirtualList<T>({
  items,
  rowHeight,
  height = 480,
  overscan = 8,
  getKey,
  header,
  renderRow,
  label,
  className,
  onVisibleStart,
}: VirtualListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan,
    getItemKey: (index) => getKey(items[index] as T),
  });

  // Reset to the top whenever the dataset changes (new search / filter).
  // biome-ignore lint/correctness/useExhaustiveDependencies: only react to item count
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [items.length]);

  // requestAnimationFrame-throttled scroll observer. The latest index lives in a
  // ref/callback, so scrolling never triggers a React render in this component.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !onVisibleStart) return;
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        onVisibleStart(Math.floor(el.scrollTop / rowHeight));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [onVisibleStart, rowHeight]);

  return (
    <div
      className={cn("overflow-hidden rounded-2xl border bg-card", className)}
    >
      {header}
      <div
        ref={scrollRef}
        style={{ height, overflowY: "auto", contain: "strict" }}
      >
        <ul
          aria-label={label}
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            height: virtualizer.getTotalSize(),
            position: "relative",
            width: "100%",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <li
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {renderRow(items[virtualRow.index] as T)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
