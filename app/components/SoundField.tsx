'use client';

import { useEffect, useRef, useState } from 'react';
import { onVesper, type VesperMode } from '@/lib/bus';

// Opt-in ambient sound. A numbers-station ARG should have a carrier you can
// actually hear: a faint detuned hum, a breath of shortwave hiss, and short
// tones that answer the same bus events the oscilloscope reacts to. Default
// off, built only after a user gesture so nothing ever autoplays.
interface Field {
  ctx: AudioContext;
  master: GainNode;
  teardown: () => void;
}

export default function SoundField() {
  const [on, setOn] = useState(false);
  const ref = useRef<Field | null>(null);

  const start = () => {
    if (ref.current) return;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // carrier: two near-unison sines beating slowly, low-passed
      const hum = ctx.createGain();
      hum.gain.value = 0.05;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 320;
      hum.connect(lp);
      lp.connect(master);
      const o1 = ctx.createOscillator();
      o1.type = 'sine';
      o1.frequency.value = 110;
      const o2 = ctx.createOscillator();
      o2.type = 'sine';
      o2.frequency.value = 110.4;
      o1.connect(hum);
      o2.connect(hum);
      o1.start();
      o2.start();

      // a slow breath so the hum is never static
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(hum.gain);
      lfo.start();

      // shortwave hiss: band-passed noise, very quiet
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const noiseBp = ctx.createBiquadFilter();
      noiseBp.type = 'bandpass';
      noiseBp.frequency.value = 1400;
      noiseBp.Q.value = 0.6;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.012;
      noise.connect(noiseBp);
      noiseBp.connect(noiseGain);
      noiseGain.connect(master);
      noise.start();

      master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2);

      ref.current = {
        ctx,
        master,
        teardown: () => {
          try { o1.stop(); o2.stop(); lfo.stop(); noise.stop(); } catch { /* already stopped */ }
        },
      };
    } catch {
      ref.current = null;
    }
  };

  const stop = () => {
    const f = ref.current;
    if (!f) return;
    ref.current = null;
    try {
      f.master.gain.linearRampToValueAtTime(0, f.ctx.currentTime + 0.4);
      window.setTimeout(() => {
        f.teardown();
        f.ctx.close().catch(() => {});
      }, 500);
    } catch { /* ignore */ }
  };

  // short tones answering bus events
  const ping = (mode: VesperMode) => {
    const f = ref.current;
    if (!f) return;
    const { ctx, master } = f;
    const t = ctx.currentTime;
    const tone = (freq: number, dur: number, type: OscillatorType, peak = 0.08, delay = 0) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + delay);
      g.gain.linearRampToValueAtTime(peak, t + delay + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + dur);
      o.connect(g);
      g.connect(master);
      o.start(t + delay);
      o.stop(t + delay + dur + 0.03);
    };
    if (mode === 'success') { tone(528, 0.5, 'sine', 0.09); tone(792, 0.6, 'sine', 0.06, 0.12); }
    else if (mode === 'error') { tone(120, 0.55, 'sawtooth', 0.06); tone(94, 0.7, 'sawtooth', 0.05, 0.05); }
    else if (mode === 'speak') { tone(440, 0.05, 'sine', 0.025); }
    else if (mode === 'climax') { tone(330, 1.4, 'sine', 0.05); tone(495, 1.6, 'sine', 0.04, 0.2); tone(660, 1.8, 'sine', 0.03, 0.45); }
  };

  useEffect(() => onVesper((m) => ping(m)), []);
  useEffect(() => () => stop(), []);

  const toggle = () => {
    setOn((prev) => {
      const next = !prev;
      if (next) start();
      else stop();
      return next;
    });
  };

  return (
    <button className="sound-toggle" onClick={toggle} aria-pressed={on} aria-label={on ? 'mute sound' : 'enable sound'}>
      <span className={`sound-dot ${on ? 'on' : ''}`} aria-hidden="true" />
      {on ? 'sound' : 'sound off'}
    </button>
  );
}
