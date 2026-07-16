import { useEffect, useState } from "react";
import { projectsData } from "../../data/projects";
import WorkspaceTabs from "../../components/projects/WorkspaceTabs";
import ProjectWorkspace from "../../components/projects/ProjectWorkspace";

import "../../styles/projects.css";

export default function ProjectsPage() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setActive((i) => Math.min(i + 1, projectsData.length - 1));
      } else if (e.key === "ArrowLeft") {
        setActive((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="projects-page">
      <ProjectWorkspace project={projectsData[active]} />
      <WorkspaceTabs activeIndex={active} onSelect={setActive} />
    </section>
  );
}
