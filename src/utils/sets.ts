import { Set } from "utils/types.ts";

export const sets = [
  {
    id: "A1",
    cards: { normal: 226, secret: 60 },
    link: "geneticapex",
    name: "Unschlagbare Gene",
    packs: ["mewtwo", "pikachu", "charizard"],
  },
  {
    id: "A1a",
    cards: { normal: 68, secret: 18 },
    link: "mythicalisland",
    name: "Mysteriöse Insel",
    packs: [],
  },
  {
    id: "A2",
    cards: { normal: 155, secret: 52 },
    link: "space-timesmackdown",
    name: "Kollision von Raum und Zeit",
    packs: ["dialga", "palkia"],
  },
  {
    id: "PROMO-A",
    cards: { normal: 41, secret: 0 },
    link: "promo-a",
    name: "PROMO-A",
    packs: [],
  },
] as const satisfies Set[];
