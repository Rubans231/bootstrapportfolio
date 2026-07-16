import { Link } from "react-router-dom";

export default function Japan() {
  return (
    <section className="japan-page">
      <div className="section-heading">
        <h2>
          05 — <span className="jp">日本語</span>
        </h2>
      </div>
      <h1 className="japan-title">Working toward Japan</h1>

      <div className="japan-badge">
        <span className="japan-dot" />
        JLPT N2 attempted — results expected Aug / Sep 2026
      </div>

      <div className="japan-prose">
        <p>
          I'm building toward working in Japan. I sat the N2 exam and I'm waiting on
          results, so I'll say this plainly rather than overstate it: I'm N2-<em>prepping</em>,
          not N2-certified, until that's actually confirmed.
        </p>
        <p>
          This isn't a recent addition to my profile. My personal notes vault has 16
          dedicated Japanese-study notes — basics, grammar, and kanji tracking from N5
          through N3 and into N2 territory — sitting right alongside my LLM and DSA
          notes. You can see them for real, linked into the rest of my brain, on the{" "}
          <Link to="/notes?focus=japanese">notes graph</Link>.
        </p>
        <p>
          Why Japan: a lot of the tooling, research, and media I care about already comes
          from there — including most of what's on rotation in my headphones. I'd rather
          be upfront that this is a work in progress than dress it up as more finished
          than it is.
        </p>
      </div>
    </section>
  );
}
