import BootScreen from "../components/boot/BootScreen";
import Shell from "../components/layout/Shell";
import { useBoot } from "../hooks/useBoot";

export default function App() {
  const {
    finished,
    fading,
    desktopReady,
    skip,
  } = useBoot();

  return (
    <>
      <Shell startup={desktopReady} />

      {!finished && (
        <BootScreen
          fading={fading}
          onSkip={skip}
        />
      )}
    </>
  );
}
