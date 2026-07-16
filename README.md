# Personal portfolio

Not a traditional portfolio. Three workspaces: a Knowledge Base (a real graph of my
ZenNotes vault), Projects (each one its own tiled-terminal workspace, pulling live
from GitHub), and About (hobbies, not a résumé). A Waybar-style shell wraps all of it,
with an EN/日本語 toggle instead of a separate language page.

## Stack

- React 19 + TypeScript + Vite
- Plain CSS (custom properties for theming, no Tailwind/UI kit)
- `react-router-dom` for routing
- `force-graph` (vanilla, canvas-based) for the Knowledge Base graph
- `marked` + `dompurify` for rendering live-fetched GitHub READMEs safely
- `lucide-react` for icons

## Structure

```
src/
  app/App.tsx            – boot gate, routes, lazy-loaded Projects/About
  lib/
    i18n.tsx              – EN/日本語 context + dictionaries
    github.ts             – live repo metadata + README fetch, sessionStorage-cached
    asciiFont.ts           – tiny block font for project-name ASCII banners
  hooks/
    useBoot.ts, usePageTitle.ts, useRepoData.ts
  components/
    boot/                 – BootScreen (typing terminal log)
    layout/                – Shell, TopBar (Waybar modules), StatusBar (workspace nav)
    ui/WaybarModule.tsx     – the asymmetrical waybar module shape
    knowledge/              – GraphCanvas (real graph), VaultPanel (reader + toggle)
    projects/               – WorkspaceTabs, ProjectWorkspace, TiledTerminalBackground,
                              TerminalTile, ReadmeView
  pages/
    Knowledge/KnowledgePage.tsx
    Projects/ProjectsPage.tsx
    About/AboutPage.tsx
  data/
    projects.ts             – curated project list + repoSlug for live GitHub data
    vaultGraph.json          – generated from Personal-Notes: titles + tag-links +
                              cluster only, no note content/excerpts
  styles/                    – themes.css (tokens), one file per section
```

## On "pulled from GitHub, nothing hardcoded"

GitHub's REST API has no public "pinned repos" concept — that only exists via the
GraphQL API with an auth token, which isn't safe to embed in client-side code. So
`data/projects.ts` is a small hand-curated list standing in for pins (which repos
show up), while everything *about* each one — stars, language, last push, and the
full README — is fetched live from `api.github.com` / `raw.githubusercontent.com`
and cached in `sessionStorage` for an hour. If GitHub is unreachable or rate-limited,
each workspace falls back to the local description in `projects.ts` instead of
breaking.

## i18n scope

The EN/日本語 toggle translates UI chrome, the Knowledge Base reader panel, and About's
section headers. It does **not** translate live-fetched GitHub READMEs or project
descriptions — that content stays in whatever language it's written in on GitHub.

## Regenerating the notes graph

`vaultGraph.json` is a derived, sanitized export — titles, folder-derived group, a
hand-mapped topic cluster, and wikilink-based connections only. Regenerate it from
`Personal-Notes/.zennotes/note-meta-cache-v1.json` if the vault changes; don't
hand-edit the JSON.

## Running it

```
npm install
npm run dev       # local dev server
npm run build     # type-check + production build → dist/
npm run preview   # serve the production build locally
```

`public/_redirects` handles Netlify's SPA routing fallback; add an equivalent rewrite
if you deploy elsewhere.

## Known placeholders / open items

- About → Mechanical Keyboards and Photography sections are intentionally empty,
  flagged inline, waiting on real content.
- The IEM hero uses real `left/right-faceplate.png` + `-insides.png` photo cutouts;
  a full 3D model is a deferred stretch goal.
- `Auto-ImageProcessing-Dockerized` is referenced under a placeholder name
  ("MemPalace") pending a real rename.
- `mysoreplace.jpg` is in `assets/` but not wired into any page yet.
