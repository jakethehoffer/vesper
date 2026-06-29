'use client';

import CarrierWave from './CarrierWave';
import FrameChrome from './FrameChrome';
import ConsoleSignal from './ConsoleSignal';

export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="scene">
      <ConsoleSignal />
      <FrameChrome />
      <main className="stage">{children}</main>
      <CarrierWave />
    </div>
  );
}
