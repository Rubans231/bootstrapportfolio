import AsciiArt from "../components/AsciiArt";
import pcSetup from "../assets/PC_setup.jpg";

interface Field {
  key: string;
  value: string;
}

const FIELDS: Field[] = [
  { key: "os", value: "NaranderOS 3.0 (Arch Linux x86_64)" },
  { key: "role", value: "ML / LLM engineer, GenAI systems" },
  { key: "target", value: "Japan — JLPT N2 attempted, results Aug/Sep 2026" },
  { key: "education", value: "B.E. CSE, CSI College of Engineering, Ketti — 2026" },
  { key: "languages", value: "English (fluent), Tamil (native), 日本語 (N2 prepping)" },
  { key: "stack", value: "Python, TypeScript/React, Docker, Shell, PyTorch" },
  { key: "wm", value: "Hyprland (Wayland)" },
  { key: "shell / term", value: "zsh · kitty" },
  { key: "theme", value: "Tokyonight-Dark, copper accents" },
  { key: "listening to", value: "Ado / Yorushika / Tuki. — jpop, mostly" },
  { key: "currently playing", value: "Clair Obscur: Expedition 33" },
];

export default function About() {
  return (
    <section className="about-page">
      <div className="section-heading">
        <h2>03 — whoami</h2>
      </div>

      <div className="about-card">
        <div className="about-ascii">
          <AsciiArt />
        </div>

        <div className="about-fields">
          <p className="about-handle">
            narander<span className="accent-char">@</span>rubans
          </p>
          <div className="about-divider" />
          <dl className="about-dl">
            {FIELDS.map((f) => (
              <div key={f.key} className="about-dl-row">
                <dt>{f.key}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="about-prose">
        <p>
          I mess around with LLMs and also partially go insane trying to learn kanji —
          that's genuinely the most accurate one-line summary of my life right now.
        </p>
        <p>
          I'd rather sit in a terminal reading logs than debug a notebook. I built my own
          Rofi/mpv/yt-dlp media stack because I use it every day and the stock tools
          weren't quite it. Systems debugging is my favorite kind of problem — give me a
          command line and a log file over a black-box error any day.
        </p>
        <p>
          Right now most of my energy outside of shipped work goes toward two things:
          getting good enough at Japanese to actually work there, and making sure every
          project I ship is something I'd be proud to have themed the same way I theme my
          desktop.
        </p>
      </div>

      <figure className="about-photo">
        <img src={pcSetup} alt="My desk and rig, running the rice shown in this site" />
        <figcaption>the actual desk this site was built on</figcaption>
      </figure>

      <div className="about-contact">
        <h3>get in touch</h3>
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
            <a
              href="https://linkedin.com/in/narander-rubans"
              target="_blank"
              rel="noreferrer"
            >
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
