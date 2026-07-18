import episodeX from "../../assets/music/Ado - Episode X.webp";
import value from "../../assets/music/Ado - Value.webp";
import shoka from "../../assets/music/Ado - Shoka.webp";
import zero from "../../assets/music/Ado - 0.webp";
import newGenesis from "../../assets/music/Ado - New Genesis.webp";

export interface Song {
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
}

export const playlist: Song[] = [
  {
    title: "Episode X",
    artist: "Ado",
    album: "Episode X",
    duration: 202,
    cover: episodeX,
  },
  {
    title: "Value",
    artist: "Ado",
    album: "Value",
    duration: 191,
    cover: value,
  },
  {
    title: "Shoka",
    artist: "Ado",
    album: "Shoka",
    duration: 228,
    cover: shoka,
  },
  {
    title: "0",
    artist: "Ado",
    album: "0",
    duration: 206,
    cover: zero,
  },
  {
    title: "New Genesis",
    artist: "Ado",
    album: "UTA",
    duration: 227,
    cover: newGenesis,
  },
];
