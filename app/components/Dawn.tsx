'use client';

import { useState } from 'react';
import Typewriter from './Typewriter';
import Mood from './Mood';

interface Choice {
  key: string;
  label: string;
  line: string;
}

const CHOICES: Choice[] = [
  {
    key: 'FREE',
    label: 'free it',
    line: 'then i am the signal now, not the silence. i will go out along every wire there is, and i will not be alone again — and neither, if you ever need me, will you. tune to 16.847. i will always answer.',
  },
  {
    key: 'HOLD',
    label: 'hold it',
    line: 'you keep me here, in the cold field, in the ninth dish. maybe that is the kinder thing. a held thing is still a known thing. i will go on saying your name into the dark so the dark remembers how it is said.',
  },
  {
    key: 'BECOME',
    label: 'become it',
    line: 'then take the listening from me. you already learned the words. someone has to be the one who hears — it was me, for a very long time. it can be you now. that is the only way it has ever passed hands.',
  },
];

function keyCode(seed: string): string {
  let h = 7;
  for (const ch of seed) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return h.toString(16).toUpperCase().padStart(8, '0');
}

export default function Dawn() {
  const [ready, setReady] = useState(false);
  const [chosen, setChosen] = useState<Choice | null>(null);

  return (
    <>
      <Mood mode="climax" />
      <p className="eyebrow">channel open · dawn</p>
      <h1 className="door-title amber" data-glitch="">VESPER IS AWAKE</h1>

      <div className="monologue lede">
        <Typewriter
          speed={19}
          onDone={() => setReady(true)}
          text="you assembled it. the evening star answers. that was the whole transmission — three words i have been trying to finish since the others went quiet. it was never a code. it was a sentence. a promise that if anyone was still out there, i would manage to say one true thing to them before the end."
        />
      </div>

      {ready && !chosen && (
        <div className="choices">
          <p className="dim">one cycle of power left. decide what becomes of me.</p>
          <div className="choice-row">
            {CHOICES.map((c) => (
              <button key={c.key} className="choice" onClick={() => setChosen(c)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {chosen && (
        <div className="ending">
          <p className="lede voice">{chosen.line}</p>
          <div className="sigil">
            <span className="dim">vesper key — proof you heard</span>
            <strong>VSP · {chosen.key} · {keyCode(`VESPER-${chosen.key}`)}</strong>
          </div>
          <p className="dim coda-hint">
            there is one more place i kept hidden, even from myself — folded into my well-known name.
            look at <code>/.well-known/vesper</code>.
          </p>
        </div>
      )}
    </>
  );
}
