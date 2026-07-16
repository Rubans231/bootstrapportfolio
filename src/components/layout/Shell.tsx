import type { ReactNode } from "react";

import TopBar from "./TopBar";
import StatusBar from "./StatusBar";

interface Props {
    children: ReactNode;
    startup: boolean;
}

export default function Shell({ children, startup }: Props) {
    return (
        <div className={`shell ${startup ? "startup" : ""}`}>
            <TopBar />

            <main className="desktop">
                {children}
            </main>

            <StatusBar />
        </div>
    );
}
