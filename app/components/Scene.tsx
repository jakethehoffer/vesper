'use client';

import CarrierWave from './CarrierWave';
import FrameChrome from './FrameChrome';
import ConsoleSignal from './ConsoleSignal';
import SoundField from './SoundField';

export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="scene">
      <ConsoleSignal />
      <FrameChrome />
      <SoundField />
      <main className="stage">{children}</main>
      <CarrierWave />
    </div>
  );
}
