import { useLang } from "../../lib/i18n";
import AboutParallaxBackground from "../../components/about/AboutParallaxBackground";
import RMPCBackground from "../../components/about/RMPCBackground";
import LiveLogFeed from "../../components/about/LiveLogFeed";
import AboutEN from "./AboutEN";
import AboutJA from "./AboutJA";

import "../../styles/about.css";

export default function AboutPage() {
  const { lang } = useLang();

  return (
    <section className="about-page">
      <AboutParallaxBackground />
      <RMPCBackground />
      <LiveLogFeed />

      {lang === "ja" ? <AboutJA /> : <AboutEN />}
    </section>
  );
}
