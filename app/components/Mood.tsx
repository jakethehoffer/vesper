'use client';

import { useEffect } from 'react';
import { setVesper, type VesperMode } from '@/lib/bus';

// Sets the carrier wave's ambient mood for a page, then releases it on exit.
export default function Mood({ mode }: { mode: VesperMode }) {
  useEffect(() => {
    setVesper(mode);
    return () => setVesper('idle');
  }, [mode]);
  return null;
}
