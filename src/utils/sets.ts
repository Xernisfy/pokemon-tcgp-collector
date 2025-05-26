import { CardSet } from "utils/types.ts";

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
    id: "A2a",
    cards: { normal: 75, secret: 21 },
    link: "triumphantlight",
    name: "Licht des Triumphs",
    packs: [],
  },
  {
    id: "A2b",
    cards: { normal: 72, secret: 39 },
    link: "shiningrevelry",
    name: "Glänzendes Festival",
    packs: [],
  },
  {
    id: "A3",
    cards: { normal: 155, secret: 84 },
    link: "celestialguardians",
    name: "Hüter des Firmaments",
    packs: ["solgaleo", "lunala"],
  },
  {
    id: "PROMO-A",
    cards: { normal: 59, secret: 0 },
    link: "promo-a",
    name: "PROMO-A",
    packs: [],
  },
] as const satisfies CardSet[];

const duplicateList = [
  ["A1/217", "A1a/62"],
];

export const duplicates: Record<
  string,
  { latest: boolean; others: { set: string; index: number }[] }
> = {};
duplicateList.forEach((d) =>
  d.forEach((id, i) =>
    duplicates[id] = {
      latest: i === d.length - 1,
      others: d.filter((j) => id !== j).map((j) => {
        const [set, index] = j.split("/");
        return { set, index: +index };
      }),
    }
  )
);

export function isDuplicate(id: string) {
  return duplicates[id] && duplicates[id].latest === false;
}
