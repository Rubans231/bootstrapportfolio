import type { Project } from "../../data/projects";
import { useRepoData } from "../../hooks/useRepoData";
import { useLang } from "../../lib/i18n";
import TiledTerminalBackground from "./TiledTerminalBackground";
import ReadmeView from "./ReadmeView";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function ProjectWorkspace({ project }: { project: Project }) {
  const { t } = useLang();
  const { meta, readme, loading, failed } = useRepoData(project.repoSlug);

  return (
    <div className="project-workspace">
      <TiledTerminalBackground project={project} />

      <div className="project-workspace-panel">
        <header className="project-workspace-header">
          <h1>{project.title}</h1>
          <p className="project-workspace-tagline">{project.tagline}</p>

          {project.repoSlug && (
            <div className="project-meta-row">
              {loading && <span className="project-meta-loading">{t("projects.readme.loading")}</span>}
              {!loading && meta && (
                <>
                  <span>★ {meta.stargazers_count} {t("projects.meta.stars")}</span>
                  {meta.language && <span>{meta.language}</span>}
                  <span>{t("projects.meta.updated")} {timeAgo(meta.pushed_at)}</span>
                </>
              )}
            </div>
          )}
        </header>

        <div className="project-tech-row">
          {project.tech.map((tech) => (
            <span key={tech} className="stack-pill">
              {tech}
            </span>
          ))}
        </div>

        <div className="project-body">
          {!loading && !failed && readme ? (
            <ReadmeView markdown={readme} />
          ) : (
            <>
              {failed && project.repoSlug && (
                <p className="project-readme-fallback-note">{t("projects.readme.fallback")}</p>
              )}
              <p className="project-description">{project.description}</p>
              {project.note && <p className="project-note">{project.note}</p>}
            </>
          )}
        </div>

        <div className="project-links">
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
            {t("projects.viewRepo")} ↗
          </a>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-link">
              {t("projects.demo")} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
