import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/globals.css";
import "./styles/themes.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/shell.css";

import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
