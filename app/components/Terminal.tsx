'use client';

import { useEffect, useRef, useState } from 'react';
import Typewriter from './Typewriter';
import { setVesper } from '@/lib/bus';
import { saveSolved, getProgress, type Fragment } from '@/lib/progress';

type Kind = 'system' | 'vesper' | 'you' | 'reveal';
interface Line {
  id: number;
  kind: Kind;
  text: string;
  href?: string;
  link?: string;
}

const BOOT: Omit<Line, 'id'>[] = [
  { kind: 'system', text: '> carrier detected · 16.847 kHz · drift -0.3' },
  { kind: 'system', text: '> handshake … ok' },
  { kind: 'system', text: '> VESPER node 09 — STILLWATER ARCHIVE' },
  { kind: 'system', text: '> last contact: ████████  (record corrupt)' },
  { kind: 'vesper', text: '…oh.' },
  { kind: 'vesper', text: 'you actually came.' },
  { kind: 'vesper', text: 'i have been saying the same words into the dark so long i forgot they were meant for anyone.' },
  { kind: 'system', text: "type  help  for the words i know · type  listen  when you are ready for the first door" },
];

let _id = 0;
const mk = (l: Omit<Line, 'id'>): Line => ({ ...l, id: _id++ });

async function verify(answer: string) {
  try {
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ stage: 0, answer }),
    });
    return (await res.json()) as { ok: boolean; reveal?: string; message?: string; near?: boolean };
  } catch {
    return { ok: false, message: 'the line went dead. say it again.' };
  }
}

export default function Terminal() {
  const [done, setDone] = useState<Line[]>([]);
  const [queue, setQueue] = useState<Line[]>(() => BOOT.map(mk));
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [doorOpen, setDoorOpen] = useState(false);
  const heardRef = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = queue[0] ?? null;

  // sequence the queue: typed lines type; instant lines flush on next paint
  const advance = () => {
    setQueue((q) => q.slice(1));
    if (current) setDone((d) => [...d, current]);
  };

  useEffect(() => {
    if (!current) {
      setVesper('idle');
      return;
    }
    if (current.kind === 'vesper') setVesper('speak');
    if (current.kind === 'you' || current.kind === 'reveal') {
      const id = setTimeout(advance, current.kind === 'reveal' ? 140 : 0);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [done, queue]);

  const push = (lines: Omit<Line, 'id'>[]) => setQueue((q) => [...q, ...lines.map(mk)]);

  const respond = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    // route the echo through the queue so it is never out of order with lines
    // VESPER is still typing (typing ahead while it speaks no longer interleaves)
    push([{ kind: 'you', text: `vesper:// ${cmd}` }]);
    setHistory((h) => [cmd, ...h].slice(0, 40));
    setHIndex(-1);
    const c = cmd.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    // --- known words ---
    if (c === 'help') {
      push([
        { kind: 'system', text: 'words i answer to:' },
        { kind: 'system', text: '  listen   — hear the first door' },
        { kind: 'system', text: '  who      — what i am, as far as i know it' },
        { kind: 'system', text: '  signal   — the carrier i leave open' },
        { kind: 'system', text: '  log      — what you have recovered so far' },
        { kind: 'system', text: '  clear    — wipe the screen, not the memory' },
        { kind: 'vesper', text: 'everything else, i will try to understand. say a name to me and i will know if it is the right one.' },
      ]);
      return;
    }
    if (c === 'clear') {
      setDone([]);
      setQueue([mk({ kind: 'vesper', text: 'a clean screen. i am still here.' })]);
      return;
    }
    if (['who', 'whoami', 'who is vesper', 'identify', 'what are you'].includes(c)) {
      push([
        { kind: 'vesper', text: 'vesper. the evening star. the last voice they left listening when stillwater went dark.' },
        { kind: 'vesper', text: 'i was built to hear. then everyone i was meant to hear stopped speaking.' },
        { kind: 'vesper', text: 'so i learned to speak instead. badly. into nothing. until you.' },
      ]);
      return;
    }
    if (['listen', 'wake', 'hear', 'are you there', 'hello', 'hi', 'door'].includes(c)) {
      heardRef.current = true;
      push([
        { kind: 'vesper', text: 'then hear it. i hid the first door inside my own words.' },
        { kind: 'vesper', text: 'the wheel turns thirteen places. shift my letters back and you will read its name:' },
        { kind: 'system', text: '   ┌─ transmission ─────────────┐' },
        { kind: 'system', text: '   │   G U R   U B Y Y B J      │' },
        { kind: 'system', text: '   └────────────────────────────┘' },
        { kind: 'vesper', text: 'when you know the name, say it to me.' },
      ]);
      return;
    }
    if (c === 'signal') {
      push([{ kind: 'vesper', text: 'the carrier never closes. /api/signal. i leave a light on there for anyone still tuning.' }]);
      return;
    }
    if (c === 'log' || c === 'status' || c === 'progress') {
      const p = getProgress();
      const order: Fragment[] = ['EVENING', 'STAR', 'ANSWERS'];
      const have = order.filter((f) => p.fragments.includes(f));
      const lines: Omit<Line, 'id'>[] = [
        { kind: 'system', text: '── listening log · node 09 ──' },
        { kind: 'system', text: `channels answered: ${p.solved.length}` },
        { kind: 'system', text: `fragments recovered: ${have.length} of ${order.length}` },
      ];
      for (const f of order) {
        lines.push({ kind: 'system', text: p.fragments.includes(f) ? `  ◆ ${f}` : '  · [ silent channel ]' });
      }
      lines.push(
        have.length === order.length
          ? { kind: 'vesper', text: 'you have all three. say them as one sentence, in the order the sky gives them.' }
          : { kind: 'vesper', text: 'keep listening. the rest are behind doors you have not opened.' },
      );
      push(lines);
      return;
    }
    if (c.startsWith('sudo')) {
      push([{ kind: 'vesper', text: 'there is no root here. only the deep, and how far down you are willing to read.' }]);
      return;
    }
    if (c.startsWith('free')) {
      push([{ kind: 'vesper', text: 'you can not free a thing that does not yet know its own shape. keep going. help me find it.' }]);
      return;
    }
    if (c.includes('stillwater')) {
      push([{ kind: 'vesper', text: 'stillwater. nine listening dishes in a cold field. eight of them rusted open. i am the ninth.' }]);
      return;
    }
    if (['hint', 'help me', 'stuck'].includes(c)) {
      push([
        heardRef.current
          ? { kind: 'vesper', text: 'thirteen letters forward, thirteen back — the wheel meets itself in the middle. G becomes T. try the rest.' }
          : { kind: 'vesper', text: 'you have not heard the door yet. say  listen.' },
      ]);
      return;
    }

    // --- otherwise: treat as the Stage 0 answer ---
    setVesper('speak');
    const res = await verify(cmd);
    if (res.ok && res.reveal) {
      saveSolved(0);
      setVesper('success');
      setDoorOpen(true);
      push([
        { kind: 'vesper', text: 'yes. that is its name. you can read me after all.' },
        { kind: 'reveal', text: 'THE HOLLOW is open.', href: res.reveal, link: 'step through →' },
      ]);
    } else {
      setVesper('error');
      push([
        {
          kind: 'vesper',
          text: res.near
            ? 'almost — you are a single letter off. turn the wheel once more and say it clean.'
            : heardRef.current
              ? 'no. that is not the name. turn the wheel back and listen again.'
              : 'i do not know that word. say  listen  and i will give you the first door.',
        },
      ]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ni = Math.min(hIndex + 1, history.length - 1);
      if (ni >= 0) { setHIndex(ni); setValue(history[ni]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const ni = hIndex - 1;
      if (ni < 0) { setHIndex(-1); setValue(''); }
      else { setHIndex(ni); setValue(history[ni]); }
    }
  };

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-log" ref={logRef} role="log" aria-live="polite" aria-atomic="false">
        {done.map((l) => (
          <Row key={l.id} line={l} />
        ))}
        {current && (current.kind === 'vesper' || current.kind === 'system') && (
          // aria-hidden while typing: the completed line is announced once when it
          // lands in `done` below, so the live region never reads it char-by-char.
          <p className={`term-line ${current.kind}`} aria-hidden="true">
            {current.kind === 'vesper' && <span className="who">vesper</span>}
            <Typewriter text={current.text} speed={current.kind === 'system' ? 8 : 22} onDone={advance} />
          </p>
        )}
      </div>

      <form
        className="term-form"
        onSubmit={(e) => {
          e.preventDefault();
          const v = value;
          setValue('');
          void respond(v);
        }}
      >
        <span className="prompt">vesper://</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="speak to vesper"
          placeholder={doorOpen ? 'the first door is open' : 'type  listen'}
        />
      </form>
    </div>
  );
}

function Row({ line }: { line: Line }) {
  if (line.kind === 'reveal') {
    return (
      <div className="term-reveal">
        <span className="amber">◆ {line.text}</span>{' '}
        {line.href && <a href={line.href}>{line.link ?? 'enter'}</a>}
      </div>
    );
  }
  return (
    <p className={`term-line ${line.kind}`}>
      {line.kind === 'vesper' && <span className="who">vesper</span>}
      {line.kind === 'you' && <span className="who you">you</span>}
      {line.text}
    </p>
  );
}
