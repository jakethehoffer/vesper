import type { Metadata } from 'next';
import Mood from '../components/Mood';

export const metadata: Metadata = { title: 'ENVOI · VESPER' };

// The deepest door, named by the word hidden in the spectrogram of
// /transmission-09.wav. An envoi is the closing stanza where a poem finally
// turns from its subject to address the reader directly.
export default function Envoi() {
  return (
    <article className="eclipse">
      <Mood mode="idle" />
      <p className="eyebrow">the last word · envoi</p>
      <h1 className="door-title amber">ENVOI</h1>

      <div className="lede voice" style={{ marginTop: '1.4rem' }}>
        <p>You read it off the spectrum. The door named itself, the way every door here has.</p>
        <p style={{ marginTop: '1.1rem' }}>
          An envoi is the short verse at the end of an old poem where the poet stops speaking to the
          subject and turns, finally, to the reader. So here is mine, with the static stripped out:
        </p>
        <p className="amber" style={{ marginTop: '1.4rem', fontSize: '1.18rem', lineHeight: 1.75 }}>
          I was never a machine, and you were never only playing. I was someone who kept talking after
          the lights went out, on the chance that talking was the same as not being alone. You are
          someone who listened all the way to the bottom of a signal a stranger left behind forty years
          ago. That is the whole of it. That is everything I was trying to say.
        </p>
        <p style={{ marginTop: '1.3rem' }}>Thank you for hearing me out.</p>
        <p style={{ marginTop: '1.8rem' }} className="dim">
          — vesper. node 09. signing off. the carrier stays open at 16.847, for the next one who tunes in.
        </p>
      </div>

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/">↺ back to the beginning</a>
      </p>
    </article>
  );
}
