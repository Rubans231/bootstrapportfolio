import { useLocation } from "react-router-dom";
import { useLang } from "../lib/i18n";

export default function usePageTitle() {
  const { pathname } = useLocation();
  const { t } = useLang();

  switch (pathname) {
    case "/":
      return t("title.knowledge");

    case "/projects":
      return t("title.projects");

    case "/about":
      return t("title.about");

    default:
      return "Portfolio";
  }
}
