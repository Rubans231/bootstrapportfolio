# Portfolio

Hosted on: https://naranderrubansportfolio.netlify.app/

Not a traditional portfolio. Three workspaces: a Knowledge Base (a real, live file
tree + reader + graph pulled straight from my ZenNotes vault on GitHub), Projects
(each one its own tiled-terminal workspace, pulling live from GitHub), and About
(hobbies, not a résumé). A Waybar-style shell wraps all of it, with an EN/日本語
toggle instead of a separate language page.

## Stack

- React 19 + TypeScript + Vite
- Plain CSS (custom properties for theming, no Tailwind/UI kit)
- `react-router-dom` for routing
- `force-graph` (vanilla, canvas-based) for the Knowledge Base graph, with a custom
  d3 force that repels nodes from the cursor for a reactive, particle-field feel
- `marked` + `dompurify` for rendering live-fetched markdown (READMEs and vault notes)
- `lucide-react` for icons

## Structure

```
src/
  app/App.tsx            – boot gate, routes, lazy-loaded Projects/About
  lib/
    i18n.tsx              – EN/日本語 context + dictionaries
    github.ts              – live repo metadata + README + optional per-project
                              .portfolio-log fetch (Projects page)
    vault.ts                – live vault tree + graph + note content (Knowledge page)
    cache.ts                 – shared sessionStorage cache w/ TTL
    asciiFont.ts              – tiny block font for project-name ASCII banners
  hooks/
    useBoot.ts, usePageTitle.ts, useRepoData.ts
    useMouseParallax.ts        – shared window mouse-offset + "recently active" state
  components/
    boot/                 – BootScreen (typing terminal log)
    layout/                – Shell, TopBar (Waybar modules), StatusBar (workspace nav)
    ui/WaybarModule.tsx     – the asymmetrical waybar module shape
    knowledge/               – GraphCanvas (live graph, reactive to mouse),
                              VaultTree (LazyVim-style tree, vim bindings),
                              NoteReader (renders selected note, resolves [[wikilinks]]),
                              WelcomeNote (hand-authored landing content),
                              VaultExplorer (glass panel combining tree + reader)
    about/                   – AboutParallaxBackground (fastfetch + IEM background),
                              RMPCBackground + Cava (rmpc/cava-style widget, bottom-left,
                              only "plays" while the mouse is active),
                              LiveLogFeed (top-right, continuously-flowing fake activity log)
    projects/               – WorkspaceTabs, ProjectWorkspace, TiledTerminalBackground,
                              TerminalTile, ReadmeView
  pages/
    Knowledge/KnowledgePage.tsx
    Projects/ProjectsPage.tsx
    About/AboutPage.tsx, AboutEN.tsx, AboutJA.tsx
  data/
    projects.ts             – curated project list + repoSlug for live GitHub data
  styles/                    – themes.css (tokens), one file per section
```

## Everything vault-related is live, not baked in

`lib/vault.ts` fetches `.zennotes/note-meta-cache-v1.json` directly from the
`Personal-Notes` repo on GitHub at runtime (cached in `sessionStorage` for an hour),
and derives the file tree, the graph (nodes/edges/clusters), and the title→path map
all from that single source. Individual note bodies are fetched on demand
(`raw.githubusercontent.com`) only when opened in the tree. Push a change to
`Personal-Notes` and it shows up here within the cache window — nothing to rebuild
or redeploy on this end.

## Graph physics

The Knowledge Base graph runs on `3d-force-graph` (WebGL/three.js), not the 2D
canvas version — nodes are pulled toward a fixed radius from center via a custom
`sphere` force (so the whole thing holds a sphere/constellation shape, connected
or not), the camera auto-rotates slowly like a planet, and a small periodic
reheat keeps it gently flowing instead of freezing solid. Mouse proximity adds a
further gentle push. This is a real dependency-weight tradeoff — see below.

**Weight:** the 3D engine (three.js + 3d-force-graph + three-spritetext) is
lazy-loaded into its own chunk, separate from the app shell, so nav/tree/reader
load fast regardless. That chunk itself is ~1.4MB (~370KB gzipped) — noticeably
heavier than the old 2D canvas graph. Mitigations already in place:
device-pixel-ratio is capped (more so on phones), node name labels only render
for tag/hub nodes on small screens or `prefers-reduced-motion`, and the
auto-rotate/reheat loop is skipped entirely for `prefers-reduced-motion` and
throttled on small screens. It'll run on a modern phone, but it's a heavier tab
than the rest of this site by a wide margin — worth knowing if that ever needs
to change.

## On "pulled from GitHub, nothing hardcoded" (Projects page)

GitHub's REST API has no public "pinned repos" concept — that only exists via the
GraphQL API with an auth token, which isn't safe to embed in client-side code. So
`data/projects.ts` is a small hand-curated list standing in for pins (which repos
show up), while everything *about* each one — stars, language, last push, and the
full README — is fetched live from `api.github.com` / `raw.githubusercontent.com`.

## Giving a project its own background log

Each project's tiled terminal background shows a fastfetch/ASCII tile, a build-log
tile, and a git-log-style tile. That last one can be replaced with your own real
content: drop a plain text file named **`.portfolio-log`** at the root of *that
project's own repo* (not this portfolio repo) — one log line per line, whatever you
want it to say. `lib/github.ts#fetchProjectLog` checks for it live on every visit
(main branch, then master), and falls back silently to the generated placeholder
lines if the file doesn't exist. No redeploy needed here — add the file to the
project repo and it shows up the next time the cache expires (an hour).

## i18n scope

The EN/日本語 toggle swaps in genuinely separate About page content (`AboutEN.tsx` /
`AboutJA.tsx`, not a translated copy of the same text) plus translates the rest of
the UI chrome and the Knowledge Base panel. It does **not** translate live-fetched
GitHub content (READMEs or vault notes) — that stays in whatever language it's
written in on GitHub.

## Vim bindings in the vault tree

`j`/`k` move, `l`/`Enter` opens a file or expands a folder, `h` collapses/steps to
parent, `gg`/`G` jump to top/bottom. Click works too.

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

- About → Mechanical Keyboards and Photography sections were cut rather than left as
  visible placeholders. Ask for them back once there's real content.
- The About background uses real `left/right-faceplate.png` photo cutouts; a full 3D
  IEM model is a deferred stretch goal.
- `Auto-ImageProcessing-Dockerized` is referenced under a placeholder name
  ("MemPalace") pending a real rename.
- `mysoreplace.jpg`, `iem-faceplates.png`, `iem-insides.png` are in `assets/` but not
  wired into any page yet.
