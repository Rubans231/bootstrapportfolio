import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "ja";

type Dict = Record<string, string>;

const EN: Dict = {
  "nav.knowledge": "Knowledge",
  "nav.projects": "Projects",
  "nav.about": "About",

  "title.knowledge": "Knowledge Base",
  "title.projects": "Projects",
  "title.about": "About",

  "vault.heading": "Knowledge Base",
  "vault.intro1": "Welcome to my second brain.",
  "vault.intro2":
    "This graph is generated from my real ZenNotes vault — titles, tags, and the links between them. Nothing here is staged.",
  "vault.cta": "View Projects →",
  "vault.hide": "hide panel",
  "vault.show": "show panel",
  "vault.stats.notes": "notes",
  "vault.stats.tags": "tags",
  "vault.stats.links": "links",

  "projects.workspace": "workspace",
  "projects.viewRepo": "view repo",
  "projects.demo": "demo",
  "projects.readme.loading": "fetching README from GitHub…",
  "projects.readme.fallback":
    "Couldn't reach GitHub just now — showing the local summary instead.",
  "projects.meta.stars": "stars",
  "projects.meta.updated": "updated",

  "about.how": "How I actually work",
  "about.genai": "GenAI, since before it was cool",
  "about.japan": "Building toward Japan",
  "about.offclock": "Off the clock",
  "about.desk": "Desk Setup",
  "about.contact": "Get in touch",
};

const JA: Dict = {
  "nav.knowledge": "知識",
  "nav.projects": "プロジェクト",
  "nav.about": "自己紹介",

  "title.knowledge": "ナレッジベース",
  "title.projects": "プロジェクト",
  "title.about": "自己紹介",

  "vault.heading": "ナレッジベース",
  "vault.intro1": "第二の脳へようこそ。",
  "vault.intro2":
    "このグラフは実際のZenNotesボルトから生成されています — タイトル、タグ、そしてそれらのリンク。演出は一切ありません。",
  "vault.cta": "プロジェクトを見る →",
  "vault.hide": "パネルを隠す",
  "vault.show": "パネルを表示",
  "vault.stats.notes": "ノート",
  "vault.stats.tags": "タグ",
  "vault.stats.links": "リンク",

  "projects.workspace": "ワークスペース",
  "projects.viewRepo": "リポジトリを見る",
  "projects.demo": "デモ",
  "projects.readme.loading": "GitHubからREADMEを取得中…",
  "projects.readme.fallback":
    "GitHubに接続できませんでした — 代わりにローカルの概要を表示しています。",
  "projects.meta.stars": "スター",
  "projects.meta.updated": "更新日",

  "about.how": "働き方",
  "about.genai": "GenAI との付き合い方",
  "about.japan": "日本へ向けて",
  "about.offclock": "オフの時間",
  "about.desk": "デスク環境",
  "about.contact": "連絡先",
};

const DICTS: Record<Lang, Dict> = { en: EN, ja: JA };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "naranderos.lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "ja" ? "ja" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
  }

  function t(key: string): string {
    return DICTS[lang][key] ?? EN[key] ?? key;
  }

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
