import { projectsData } from "../../data/projects";
import { useLang } from "../../lib/i18n";

interface Props {
  activeIndex: number;
  onSelect: (i: number) => void;
}

export default function WorkspaceTabs({ activeIndex, onSelect }: Props) {
  const { t } = useLang();

  return (
    <nav className="workspace-strip" aria-label={t("projects.workspace")}>
      {projectsData.map((p, i) => (
        <button
          key={p.id}
          className={`workspace-strip-tab ${i === activeIndex ? "active" : ""}`}
          onClick={() => onSelect(i)}
          aria-current={i === activeIndex}
        >
          <span className="workspace-n">{i + 1}</span>
        </button>
      ))}
    </nav>
  );
}
