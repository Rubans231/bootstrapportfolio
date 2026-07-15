import TopBar from "./TopBar";
import Desktop from "./Desktop";
import StatusBar from "./StatusBar";

interface ShellProps {
  startup: boolean;
}

export default function Shell({ startup }: ShellProps) {
  return (
    <div className={`shell ${startup ? "startup" : ""}`}>
      <TopBar />
      <Desktop />
      <StatusBar />
    </div>
  );
}
