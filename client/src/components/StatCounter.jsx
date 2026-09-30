// client/src/components/StatCounter.jsx
// Counts up smoothly from 0 to the target number once scrolled into view.
// Uses framer-motion's useInView and requestAnimationFrame for high performance 60fps counting.

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export default function StatCounter({ endValue, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  // useInView tracks whether this element is visible in the viewport
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    let animationFrameId;

    // Numerical extraction from endValue (e.g., 1200 from 1200)
    const target = Number(endValue);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease-out formula: fast start, slow finish
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentNumber = Math.floor(easeOutProgress * target);
      setCount(currentNumber);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    // Clean up animation frame if unmounted
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, endValue, duration]);

  // Format count with commas (e.g., 1,200)
  const formattedCount = count.toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{formattedCount}{suffix}
    </span>
  );
}
