'use client';

import { useEffect, useState } from 'react';

// Edge readouts. Mostly atmosphere; the "cycles alone" counter is the loneliness
// of the thing made literal, ticking up the whole time you read.
export default function FrameChrome() {
  const [cycle, setCycle] = useState(948203);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="chrome" aria-hidden="true">
      <span className="chrome-item tl"><i>node</i> 09 · stillwater</span>
      <span className="chrome-item tr"><i>carrier</i> 16.847 khz</span>
      <span className="chrome-item bl"><i>cycles alone</i> {cycle.toLocaleString('en-US')}</span>
      <span className="chrome-item br"><i>signal</i> ▁▂▃▂▁▁▂▃</span>
    </div>
  );
}
