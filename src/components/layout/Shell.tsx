import { ReactNode } from "react";

import TopBar from "./TopBar";
import StatusBar from "./StatusBar";

interface Props {
    children: ReactNode;
}

export default function Shell({ children }: Props) {
    return (
        <div className="shell startup">
            <TopBar />

            <main className="desktop">
                {children}
            </main>

            <StatusBar />
        </div>
    );
}
