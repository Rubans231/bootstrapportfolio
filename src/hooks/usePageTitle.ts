import { useLocation } from "react-router-dom";

export default function usePageTitle() {
  const { pathname } = useLocation();

  switch (pathname) {
    case "/":
      return "Knowledge Base";

    case "/projects":
      return "Projects";

    case "/about":
      return "About";

    default:
      return "Portfolio";
  }
}
