import { Outlet, useLocation } from "react-router-dom";

function watermark(pathname: string): string {
  if (pathname.startsWith("/about")) return "WHOAMI";
  if (pathname.startsWith("/notes")) return "GRAPH";
  if (pathname.startsWith("/japan")) return "日本語";
  return "DESKTOP";
}

export default function Desktop() {
  const { pathname } = useLocation();

  return (
    <main className="desktop">
      <h2 className="desktop-watermark" aria-hidden="true">
        {watermark(pathname)}
      </h2>
      <div className="desktop-content">
        <Outlet />
      </div>
    </main>
  );
}
