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

      <section className="panel" style={{ marginTop: '2.4rem' }}>
        <span className="panel-tag">recording · transmission 09</span>
        <p className="dim">
          There is one thing I could never fit into words, so I sang it instead. It is the last thing
          left on the carrier. Listen if you like — but what I am saying is not in the sound. It is in
          the shape of it.
        </p>
        <audio
          controls
          preload="none"
          src="/transmission-09.wav"
          style={{ width: '100%', marginTop: '1.1rem' }}
        />
        <p className="dim" style={{ marginTop: '1rem', fontSize: '0.82rem' }}>
          <a href="/transmission-09.wav" download>download transmission-09.wav</a> — then open it in a
          spectrogram (Audacity, Sonic Visualiser, Spek) and look at the picture the frequencies draw.
          The door it names is, like all my doors, exactly what you see.
        </p>
      </section>

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/">↺ back to the beginning</a>
      </p>
    </article>
  );
}
