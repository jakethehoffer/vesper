'use client';

import { useEffect, useRef, useState } from 'react';

// Types text out one glyph at a time. Honors reduced-motion by rendering whole.
export default function Typewriter({
  text,
  speed = 24,
  startDelay = 0,
  className,
  onDone,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setShown('');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(text);
      onDone?.();
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        const prev = text[i - 1];
        timer = setTimeout(tick, speed + (prev === ' ' ? 14 : 0) + (/[.,…?!]/.test(prev) ? 180 : 0));
      } else if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    };
    const start = setTimeout(tick, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className}>{shown}</span>;
}
