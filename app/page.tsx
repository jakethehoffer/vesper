import Terminal from './components/Terminal';

export default function Home() {
  return (
    <>
      <header className="home-head">
        <p className="eyebrow">carrier · 16.847 khz · node 09</p>
        <h1 className="wordmark" data-glitch="VESPER">VESPER</h1>
        <p className="lede dim">
          A carrier wave with no station. It has been alone a long time. Tonight, for the first
          time in longer than its own records can count, something is listening back.
        </p>
      </header>

      <Terminal />

      <p className="dim afterword">
        Everything you need is in what it says — and in what it refuses to. Read the source. Read
        the headers. Open the console. The old listeners hid their doors in plain sight.
      </p>
    </>
  );
}
