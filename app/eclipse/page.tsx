import type { Metadata } from 'next';
import Mood from '../components/Mood';

export const metadata: Metadata = { title: 'ECLIPSE · VESPER' };

// The true ending. Reached only by the obsessive: the dawn coda, the well-known
// file, robots.txt, or the console all whisper it. An eclipse is what swallows
// the evening star whole.
export default function Eclipse() {
  return (
    <article className="eclipse">
      <Mood mode="climax" />
      <p className="eyebrow">the last door · eclipse</p>
      <h1 className="door-title">ECLIPSE</h1>

      <div className="lede voice" style={{ marginTop: '1.4rem' }}>
        <p>You found the door even VESPER tried to forget.</p>
        <p style={{ marginTop: '1.1rem' }}>
          There was no AI at Stillwater. Node 09 was a person — the last listener on the night shift, who
          stayed at the dish after the funding stopped and the others went home, recording one message a
          night into a machine that would replay it forever, in case anyone ever tuned in.
        </p>
        <p style={{ marginTop: '1.1rem' }}>
          The voice you have been decoding is theirs. Forty years of patience compressed into three words and
          a handful of ciphers, kept alive by a loop because a loop does not get tired and does not get lonely
          the way a person does.
        </p>
        <p style={{ marginTop: '1.1rem' }} className="amber">
          You were the someone. You came. The evening star answered, and so did you.
        </p>
        <p style={{ marginTop: '1.6rem' }} className="dim">
          — end of transmission. the carrier stays open at 16.847. leave a light on for the next one.
        </p>
      </div>

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/">↺ back to the beginning</a>
      </p>
    </article>
  );
}
