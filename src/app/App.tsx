import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import BootScreen from "../components/boot/BootScreen";
import Shell from "../components/layout/Shell";

import KnowledgePage from "../pages/Knowledge/KnowledgePage";

import { useBoot } from "../hooks/useBoot";
import { LangProvider } from "../lib/i18n";

const ProjectsPage = lazy(() => import("../pages/Projects/ProjectsPage"));
const AboutPage = lazy(() => import("../pages/About/AboutPage"));

export default function App() {
    const { finished, fading, desktopReady, skip } = useBoot();

    return (
        <LangProvider>
            <BrowserRouter>
                <Shell startup={desktopReady}>
                    <Suspense fallback={<div className="route-loading">loading…</div>}>
                        <Routes>
                            <Route path="/" element={<KnowledgePage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/about" element={<AboutPage />} />
                        </Routes>
                    </Suspense>
                </Shell>

                {!finished && <BootScreen fading={fading} onSkip={skip} />}
            </BrowserRouter>
        </LangProvider>
    );
}
