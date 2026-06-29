'use client';

import { useEffect, useState } from 'react';
import PuzzlePanel from './PuzzlePanel';
import { getProgress, type Fragment } from '@/lib/progress';

const ORDER: Fragment[] = ['EVENING', 'STAR', 'ANSWERS'];

export default function Convergence() {
  const [have, setHave] = useState<Fragment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHave(getProgress().fragments);
    setMounted(true);
  }, []);

  return (
    <>
      <div className="frag-row">
        {ORDER.map((f) => {
          const lit = mounted && have.includes(f);
          return (
            <span key={f} className={`fragment ${lit ? '' : 'missing'}`}>
              {lit ? f : '— — —'}
            </span>
          );
        })}
      </div>

      {mounted && have.length < ORDER.length && (
        <p className="utterance bad" style={{ marginTop: '1.3rem' }}>
          some lights are still dark. you can guess the sentence — but i would rather you earned every word.
          the fragments you are missing are behind doors you have not opened yet.
        </p>
      )}

      <div style={{ marginTop: '1.6rem' }}>
        <PuzzlePanel stage={4} placeholder="say the whole of it" />
      </div>
    </>
  );
}
