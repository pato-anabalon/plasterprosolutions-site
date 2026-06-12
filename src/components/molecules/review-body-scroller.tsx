"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

type ReviewBodyScrollerProps = {
  body: string;
  className?: string;
  tone?: "dark" | "light";
};

const autoScrollPixelsPerSecond = 14;

export function ReviewBodyScroller({
  body,
  className = "",
  tone = "dark",
}: ReviewBodyScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const isDark = tone === "dark";

  const paragraphs = useMemo(
    () => body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [body],
  );

  const stopAutoScroll = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = null;
    lastFrameTimeRef.current = null;
  }, []);

  const canAutoScroll = useCallback(() => {
    if (typeof window.matchMedia !== "function") {
      return true;
    }

    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const startAutoScroll = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller || frameRef.current !== null || !canAutoScroll()) {
      return;
    }

    if (scroller.scrollHeight <= scroller.clientHeight + 1) {
      return;
    }

    const step = (timestamp: number) => {
      const activeScroller = scrollerRef.current;

      if (!activeScroller) {
        stopAutoScroll();
        return;
      }

      const maxScrollTop = activeScroller.scrollHeight - activeScroller.clientHeight;

      if (maxScrollTop <= 0 || activeScroller.scrollTop >= maxScrollTop) {
        stopAutoScroll();
        return;
      }

      const lastFrameTime = lastFrameTimeRef.current ?? timestamp;
      const elapsedSeconds = (timestamp - lastFrameTime) / 1000;

      lastFrameTimeRef.current = timestamp;
      scrollPositionRef.current = Math.min(
        maxScrollTop,
        scrollPositionRef.current + elapsedSeconds * autoScrollPixelsPerSecond,
      );
      activeScroller.scrollTop = scrollPositionRef.current;
      frameRef.current = window.requestAnimationFrame(step);
    };

    scrollPositionRef.current = scroller.scrollTop;
    frameRef.current = window.requestAnimationFrame(step);
  }, [canAutoScroll, stopAutoScroll]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return undefined;
    }

    const updateOverflow = () => {
      setHasOverflow(scroller.scrollHeight > scroller.clientHeight + 1);
    };

    updateOverflow();
    window.addEventListener("resize", updateOverflow);

    return () => {
      stopAutoScroll();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [body, stopAutoScroll]);

  const scrollbarClasses = isDark
    ? "[&::-webkit-scrollbar-thumb]:bg-white/24 [&::-webkit-scrollbar-track]:bg-white/8"
    : "[&::-webkit-scrollbar-thumb]:bg-charcoal/24 [&::-webkit-scrollbar-track]:bg-charcoal/8";
  const fadeClasses = isDark
    ? "from-[rgb(38_36_33)] group-hover:from-[rgb(42_40_38)]"
    : "from-surface";

  return (
    <div className="relative mt-4">
      <div
        ref={scrollerRef}
        aria-label="Review text"
        className={`pretty h-40 overflow-y-auto pr-3 text-base font-bold leading-7 outline-none [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full ${scrollbarClasses} focus-visible:ring-2 focus-visible:ring-spicy-orange/70 ${className}`}
        data-testid="review-card-body"
        onBlur={stopAutoScroll}
        onFocus={startAutoScroll}
        onMouseEnter={startAutoScroll}
        onMouseLeave={stopAutoScroll}
        tabIndex={0}
      >
        {paragraphs.map((paragraph, paragraphIndex) => (
          <p className={paragraphIndex === 0 ? "" : "mt-4"} key={paragraphIndex}>
            {paragraph.split("\n").map((line, lineIndex, lines) => (
              <Fragment key={`${paragraphIndex}-${lineIndex}`}>
                {line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
      {hasOverflow ? (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t ${fadeClasses} to-transparent`}
        />
      ) : null}
    </div>
  );
}
