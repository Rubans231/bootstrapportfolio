import BootScreen from "../components/boot/BootScreen";
import Shell from "../components/layout/Shell";
import { useBoot } from "../hooks/useBoot";

export default function App() {
  const { finished, desktopReady, skip } = useBoot();

  return (
    <>
      <Shell startup={desktopReady} />

      {!finished && (
        <BootScreen onSkip={skip} />
      )}
    </>
  );
}
