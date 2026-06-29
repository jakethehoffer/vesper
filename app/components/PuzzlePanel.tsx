'use client';

import { useState } from 'react';
import { setVesper } from '@/lib/bus';
import { saveSolved, type Fragment } from '@/lib/progress';

interface VerifyResult {
  ok: boolean;
  message?: string;
  reveal?: string;
  link?: string;
  fragment?: Fragment;
}

export default function PuzzlePanel({
  stage,
  placeholder = 'speak the word',
}: {
  stage: number;
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [reply, setReply] = useState<{ tone: 'bad' | 'good' | ''; text: string }>({ tone: '', text: '' });
  const [done, setDone] = useState<VerifyResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || done) return;
    const answer = value.trim();
    if (!answer) return;
    setBusy(true);
    setVesper('speak');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ stage, answer }),
      });
      const data = (await res.json()) as VerifyResult;
      if (data.ok) {
        saveSolved(stage, data.fragment);
        setVesper('success');
        setReply({ tone: 'good', text: data.message ?? 'yes.' });
        setDone(data);
      } else {
        setVesper('error');
        setReply({ tone: 'bad', text: data.message ?? 'no. not that.' });
        setShake(true);
        setTimeout(() => setShake(false), 420);
      }
    } catch {
      setVesper('error');
      setReply({ tone: 'bad', text: 'the line went dead. say it again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form className={`field ${shake ? 'shake' : ''}`} onSubmit={submit}>
        <span className="prompt">›</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={!!done}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-label="your answer"
        />
        <button className="btn" type="submit" disabled={busy || !!done}>
          {busy ? '…' : 'transmit'}
        </button>
      </form>

      {reply.text && <p className={`utterance ${reply.tone}`} style={{ marginTop: '1.1rem' }}>{reply.text}</p>}

      {done?.reveal && (
        <div className="reveal">
          {done.fragment && (
            <p style={{ marginBottom: '0.9rem' }}>
              <span className="fragment">fragment recovered · {done.fragment}</span>
            </p>
          )}
          <a href={done.reveal}>{done.link ?? 'the next door →'}</a>
        </div>
      )}
    </div>
  );
}
