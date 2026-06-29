'use client';

import { useEffect } from 'react';

// For the ones who open devtools. Every good ARG rewards the console.
export default function ConsoleSignal() {
  useEffect(() => {
    const w = window as unknown as { __vesper?: boolean };
    if (w.__vesper) return;
    w.__vesper = true;

    const head = 'color:#6fd0dc;font-family:monospace;font-size:13px;font-weight:bold';
    const dim = 'color:#9aa39f;font-family:monospace';
    const amber = 'color:#d7b36b;font-family:monospace';
    const cyan = 'color:#6fd0dc;font-family:monospace';

    /* eslint-disable no-console */
    console.log('%c V E S P E R  ·  node 09 ·  STILLWATER ARCHIVE', head);
    console.log('%cYou found the console. Good. We keep things here the screen is too afraid to say.', dim);
    console.log('%cthe first door turns thirteen. shift my letters back, then say its name to the dark.', amber);
    console.log('%cthe carrier is always open: %cfetch("/api/signal").then(r=>r.json()).then(console.log)', dim, cyan);
    console.log('%cand the headers carry more than they admit. read X-Vesper-Carrier.', dim);
    /* eslint-enable no-console */
  }, []);

  return null;
}
