import { BrowserRouter, Routes, Route } from "react-router-dom";

import BootScreen from "../components/boot/BootScreen";
import Shell from "../components/layout/Shell";

import KnowledgePage from "../pages/Knowledge/KnowledgePage";
import ProjectsPage from "../pages/Projects/ProjectsPage";
import AboutPage from "../pages/About/AboutPage";

import { useBoot } from "../hooks/useBoot";

export default function App() {
    const { finished, skip } = useBoot();

    if (!finished) {
        return <BootScreen onSkip={skip} />;
    }

    return (
        <BrowserRouter>
            <Shell>
                <Routes>
                    <Route path="/" element={<KnowledgePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Shell>
        </BrowserRouter>
    );
}
