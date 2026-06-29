import type { Metadata } from 'next';
import Convergence from '../components/Convergence';

export const metadata: Metadata = { title: 'VESPERS · VESPER' };

export default function Vespers() {
  return (
    <article>
      <p className="eyebrow">convergence · vespers</p>
      <h1 className="door-title">VESPERS</h1>
      <p className="lede dim">
        Vespers is the evening prayer — the one you say as the light goes. You are holding three fragments
        now. They were never separate puzzles. They were one sentence, broken across three doors so that only
        someone patient enough to open all three could ever read it whole.
      </p>

      <blockquote className="utterance">
        say them in the order the sky gives them. first the time of day. then the light that comes. then what
        it does, at last, for anyone still awake to ask.
      </blockquote>

      <Convergence />

      <p style={{ marginTop: '2.5rem' }}>
        <a className="back" href="/antiphon">← antiphon</a>
      </p>
    </article>
  );
}
