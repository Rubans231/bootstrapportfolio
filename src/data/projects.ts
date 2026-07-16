export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  /** "owner/repo" — used to live-fetch metadata + README from GitHub. Omit if there's no public repo. */
  repoSlug?: string;
  githubUrl: string;
  demoUrl?: string;
  note?: string;
}

/**
 * GitHub's API has no public "pinned repos" concept without an auth token,
 * so this list is a hand-curated stand-in for pins — everything *about*
 * each project below (stars, language, README) is still fetched live from
 * GitHub, not hardcoded.
 */
export const projectsData: Project[] = [
  {
    id: "visual-context-agent",
    title: "MemPalace — Autonomous Visual Context Agent",
    tagline: "Local VLM + vector memory, watching a filesystem so I don't have to",
    description:
      "The project I've sunk the most hours into, and the most architecturally serious thing in my repos. A microservice pipeline pairing kernel-level filesystem events with a locally-run vision-language model for low-overhead drift monitoring and automatic contextual logging. A decoupled async IPC layer over a Unix domain socket keeps the filesystem watcher isolated from the VLM inference runtime, and a custom vector-memory layer — MemPalace — organizes everything into queryable categories exposed through a natural-language CLI.",
    tech: ["Python", "Docker", "Local VLM", "Vector Memory", "SSHFS", "Unix Domain Sockets"],
    repoSlug: "Rubans231/Auto-ImageProcessing-Dockerized",
    githubUrl: "https://github.com/Rubans231/Auto-ImageProcessing-Dockerized",
    note: "Fully functional. Remote-webcam-over-SSHFS ingestion is wired up but not stress-tested yet. \"MemPalace\" is a placeholder name pending a real rename.",
  },
  {
    id: "vton-fashion",
    title: "Generative AI & AR Fashion Platform (VTON)",
    tagline: "Distilled Flux 2 + LoRA garment transfer, under 8s on 6GB of VRAM",
    description:
      "A hybrid Virtual Try-On system combining a distilled, quantized 4B rectified-flow transformer with LoRA adapters for garment transfer, wired into a React frontend via Snap Camera Kit for the AR layer. I trained and validated the LoRA adapters and did the backend and documentation end to end; the frontend implementation was my teammate's work.",
    tech: ["Flux 2", "LoRA Training", "ComfyUI", "React", "Snap Camera Kit SDK"],
    repoSlug: "Rubans231/Virtual-Try-On",
    githubUrl: "https://github.com/Rubans231/Virtual-Try-On",
    note: "Repo permissions wouldn't let me raise a PR against my teammate's copy, so this repo exists because I copied the finished work over after he pushed it locally.",
  },
  {
    id: "audio-video-sync-daemon",
    title: "High-Res Audio/Video Sync Daemon",
    tagline: "The rig behind the mpv-in-the-corner setup",
    description:
      "The custom glue running my everyday terminal music player. A two-way IPC sync system over socat links MPD and MPV, so timestamps sync back to MPD the instant a video is toggled off — plus an auto high-res video conversion script, custom rmpc keybinds, and a Python fuzzy-matcher that ties local video files to high-fidelity FLAC audio with automated lyric sync.",
    tech: ["MPD", "MPV", "socat", "FFmpeg", "Python", "rmpc"],
    githubUrl: "https://github.com/Rubans231",
  },
  {
    id: "rofi-youtube",
    title: "rofi-youtube-client",
    tagline: "Terminal-native media client I actually use every day",
    description:
      "Rofi + mpv + yt-dlp glued together with a socat IPC layer for real-time playback-state tracking, plus cookie-based auth handling so I keep native account features while sidestepping anti-bot checks. Genuinely one of the more fun things I've built — I like systems debugging a lot more than LLM-project debugging.",
    tech: ["Shell", "Rofi", "mpv", "yt-dlp", "socat"],
    repoSlug: "Rubans231/rofi-youtube-client",
    githubUrl: "https://github.com/Rubans231/rofi-youtube-client",
  },
  {
    id: "genai-video-pipelines",
    title: "Temporally Consistent Video Generation Pipeline",
    tagline: "Doing this since the Stable Diffusion 1.5 era",
    description:
      "Making AI-generated dance/edit reels since 2020 — back when Stable Diffusion 1.5 first landed — under a couple of ongoing content identities (EnviousJin, and a photoreal one, Ella.wisteria). The technical backbone: migrating off AUTOMATIC1111-era localized style-transfer patching (Temporal Kit, EBSynth) onto native spatio-temporal diffusion in ComfyUI, building workflows around LTX-2.3 and Wan 2.2 to eliminate inter-frame flicker, and holding visual identity consistent across long, multi-stage renders.",
    tech: ["ComfyUI", "Wan 2.2", "LTX-2.3", "AnimateDiff", "Stable Diffusion"],
    githubUrl: "https://github.com/Rubans231",
  },
  {
    id: "ml-systems",
    title: "Recommender Systems & RAG",
    tagline: "Retrieval, ranking, and a lot of FAISS",
    description:
      "Two smaller, earlier ML projects that still get used as reference: a two-stage recommender (candidate generation → scoring → re-ranking) and a retrieval-augmented LLM product-recommendation engine built on FAISS and Sentence-Transformers.",
    tech: ["PyTorch", "FAISS", "Sentence-Transformers", "Pandas", "Scikit-learn"],
    repoSlug: "Rubans231/Recommender-systems",
    githubUrl: "https://github.com/Rubans231/Recommender-systems",
  },
  {
    id: "this-site",
    title: "NaranderOS (this site)",
    tagline: "A rice you can visit",
    description:
      "You're standing in it. A boot sequence, a Hyprland-style Waybar shell, a real force-directed graph pulled straight from my ZenNotes vault, and projects rendered live from GitHub instead of hardcoded copy.",
    tech: ["React", "TypeScript", "Vite", "force-graph", "GitHub API"],
    repoSlug: "Rubans231/bootstrapportfolio",
    githubUrl: "https://github.com/Rubans231/bootstrapportfolio",
  },
];
