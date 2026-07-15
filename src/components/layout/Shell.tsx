import TopBar from "./TopBar";
import Desktop from "./Desktop";
import StatusBar from "./StatusBar";

export default function Shell() {
  return (
    <div className="shell">
      <TopBar />
      <Desktop />
      <StatusBar />
    </div>
  );
}
