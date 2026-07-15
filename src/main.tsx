import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";

import App from "./App";

document.documentElement.setAttribute(
    "data-theme",
    "home"
);

ReactDOM.createRoot(
    document.getElementById("root")!
).render(

    <React.StrictMode>

        <App />

    </React.StrictMode>

);
