export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  githubUrl: string;
  note?: string;
}

export const projectsData: Project[] = [
  {
    id: "auto-image-processing",
    title: "Auto-ImageProcessing-Dockerized",
    tagline: "Structured Remote-Camera Automation & Batch Processing Engine",
    description: "My most complex, well-architected engineering project. Designed to run headless image processing pipelines. It features robust exception handling, structural data isolation, and remote camera ingestion layers. Harder to build than to visualize, completely operational, and pending remote field tests.",
    tech: ["Python", "Docker", "OpenCV", "IPC Logging", "Linux Dev"],
    githubUrl: "https://github.com/Rubans231/Auto-ImageProcessing-Dockerized"
  },
  {
    id: "rofi-youtube",
    title: "rofi-youtube",
    tagline: "Terminal-Native Media Playback & Control Daemon",
    description: "A lightweight utility integrated into my everyday Hyprland setup. Resolves playlist parsing and streaming directly from a Rofi prompt into specialized local processes. Built purely through terminal validation, config inspections, and rapid log debugging—my favorite type of systems challenge.",
    tech: ["Bash", "Rofi", "MPV", "Linux IPC", "Zsh"],
    githubUrl: "https://github.com/Rubans231"
  },
  {
    id: "vton-fashion",
    title: "Generative AI & AR Fashion Platform (VTON)",
    tagline: "Distilled Flux 2 & AR Garment Transfer System",
    description: "A custom Virtual Try-On web platform utilizing a prompt-free, distilled 4b rectified flow transformer model. Focused entirely on visual conditioning for jacket-layer stacking overlays rather than simple element deletion. Note: Codebase mirrored manually due to local multi-collaborator PR permission workarounds.",
    tech: ["Flux 2", "LoRA Training", "ComfyUI", "React", "Snap Kit SDK"],
    githubUrl: "https://github.com/Rubans231"
  },
  {
    id: "ai-video-workflows",
    title: "Temporal Diffusion & Digital Human Pipelines",
    tagline: "AnimateDiff, LTX-2.3, Wan 2.2 & Stable Diffusion Legacy Workflows",
    description: "Developing workflows since the Stable Diffusion 1.5 launch in 2020. Built advanced multi-stage rendering setups optimized for temporal consistency, moving from old patch-transfer systems (EBSynth) to modern native spatial-temporal models. Operated visual identity pipelines under optimization project identifiers like 'EnviousJin' and 'Ella.wisteria'.",
    tech: ["ComfyUI", "Wan 2.2", "LTX-2.3", "AnimateDiff", "LoRA Calibration"],
    githubUrl: "https://github.com/Rubans231"
  }
];
