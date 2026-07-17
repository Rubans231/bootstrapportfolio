import { Link } from "react-router-dom";
import { useLang } from "../../lib/i18n";
import QuoteRotator from "../../components/QuoteRotator";
import AboutParallaxBackground from "../../components/about/AboutParallaxBackground";
import RMPCBackground from "../../components/about/RMPCBackground";
import pcSetup from "../../assets/PC_setup.jpg";

import "../../styles/about.css";

export default function AboutPage() {
  const { t } = useLang();

  return (
    <section className="about-page">
      <AboutParallaxBackground />
      <RMPCBackground />

      <header className="about-hero">
        <p className="about-eyebrow">whoami</p>
        <h1>narander rubans</h1>
        <p className="about-role">ML / LLM engineer &middot; terminal native &middot; building toward Japan</p>
        <p className="about-lede">
          I mess around with LLMs and also partially go insane trying to learn kanji —
          that's the most accurate one-line summary I've got. Everything below is the
          long version.
        </p>
        <QuoteRotator />
      </header>

      {/* ---------------- How I work ---------------- */}
      <div className="about-section">
        <h2>{t("about.how")}</h2>
        <p>
          I'd rather read a log file than trust a dashboard. Most of the tooling I use
          daily — a Rofi/mpv/yt-dlp media client, an MPD↔MPV sync daemon that keeps
          lyric videos frame-accurate against FLAC audio — exists because the stock
          tools weren't quite it, and I liked the debugging more than I disliked the
          yak-shaving. That instinct is basically how I approach everything I build: I
          want to know <em>why</em> something works, not just that it does. Arch Linux
          and Hyprland aren't an aesthetic choice so much as a symptom of that.
        </p>
      </div>

      {/* ---------------- GenAI depth ---------------- */}
      <div className="about-section">
        <h2>{t("about.genai")}</h2>
        <p>
          I've been building generative image and video pipelines since 2020 — the
          Stable Diffusion 1.5 era — which means I've lived through most of the shifts
          since: AUTOMATIC1111 to ComfyUI, EBSynth-era style transfer to native
          spatio-temporal diffusion, LoRA training tuned to fit on consumer GPUs. It's
          less "I read a paper on diffusion models" and more time actually spent
          getting pipelines to behave. That's also where the Virtual Try-On and video
          projects on the <Link to="/projects">Projects</Link> page come from.
        </p>
      </div>

      {/* ---------------- Japan ---------------- */}
      <div className="about-section">
        <h2>{t("about.japan")}</h2>
        <p>
          Working in Japan is the plan, not the pitch. I sat the JLPT N2 and I'm
          waiting on results — due Aug/Sept 2026 — so I'll say it plainly: I'm
          N2-<em>prepping</em>, not N2-certified, until that's actually confirmed. It's
          also not a recent addition to the résumé — my notes vault has 16 dedicated
          Japanese-study notes sitting right next to my ML and systems notes, and
          you're welcome to check that for yourself rather than take my word for it:{" "}
          <Link to="/?focus=japanese">see them on the Knowledge Base graph</Link>.
        </p>
      </div>

      {/* ---------------- Off the clock ---------------- */}
      <div className="about-section">
        <h2>{t("about.offclock")}</h2>
        <dl className="offclock-grid">
          <div>
            <dt>listening to</dt>
            <dd>Ado, Yorushika, Tuki. — jpop, mostly</dd>
          </div>
          <div>
            <dt>currently playing</dt>
            <dd>Clair Obscur: Expedition 33</dd>
          </div>
          <div>
            <dt>on the shelf</dt>
            <dd>DMC, Detroit: Become Human, The Walking Dead (Telltale)</dd>
          </div>
        </dl>
        <p className="offclock-note">
          Mostly narrative-heavy, atmosphere-first games — probably the same instinct
          that keeps my desktop themed down to the terminal font.
        </p>
      </div>

      {/* ---------------- Desk Setup ---------------- */}
      <div className="about-section">
        <h2>{t("about.desk")}</h2>
        <figure className="about-photo">
          <img src={pcSetup} alt="My desk and rig, running the theme shown on this site" />
          <figcaption>the rig this site was built on</figcaption>
        </figure>
      </div>

      {/* ---------------- Contact ---------------- */}
      <div className="about-section about-contact">
        <h2>{t("about.contact")}</h2>
        <ul>
          <li>
            <a href="mailto:naranderrubans@gmail.com">naranderrubans@gmail.com</a>
          </li>
          <li>
            <a href="https://github.com/Rubans231" target="_blank" rel="noreferrer">
              github.com/Rubans231
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/narander-rubans" target="_blank" rel="noreferrer">
              linkedin.com/in/narander-rubans
            </a>
          </li>
          <li>
            <a href="/resume/Narander-Rubans-Resume.pdf" target="_blank" rel="noreferrer">
              resume (PDF)
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
