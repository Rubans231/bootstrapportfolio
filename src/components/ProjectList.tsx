import { useState } from "react";
import { projects } from "../data/projects";

const STATUS_LABEL: Record<string, string> = {
  shipped: "shipped",
  "in-progress": "in progress",
  archived: "archived",
};

export default function ProjectList() {
  const [openSlug, setOpenSlug] = useState<string | null>(projects[0]?.slug ?? null);

  return (
    <section id="projects" className="projects" aria-label="Projects">
      <div className="section-heading">
        <h2>02 — projects</h2>
        <span className="section-count">{projects.length} tracked</span>
      </div>

      <ul className="project-list">
        {projects.map((p) => {
          const open = openSlug === p.slug;
          return (
            <li key={p.slug} className="project-item">
              <button
                onClick={() => setOpenSlug(open ? null : p.slug)}
                className="project-row"
                aria-expanded={open}
              >
                <span className="project-index">{p.index}</span>
                <span className="project-titles">
                  <span className="project-title">{p.title}</span>
                  <span className="project-tagline">{p.tagline}</span>
                </span>
                <span className="project-status">{STATUS_LABEL[p.status]}</span>
                <span className={`project-chevron ${open ? "open" : ""}`} aria-hidden>
                  &#9656;
                </span>
              </button>

              {open && (
                <div className="project-detail">
                  <div>
                    <p className="project-description">{p.description}</p>
                    {p.note && <p className="project-note">{p.note}</p>}
                    <div className="project-stack">
                      {p.stack.map((s) => (
                        <span key={s} className="stack-pill">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.repo && (
                    <div className="project-link-wrap">
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        view repo &#8599;
                      </a>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
