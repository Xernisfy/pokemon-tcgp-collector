import { sets } from "utils/sets.ts";
import { rarities } from "../islands/selectRarity.tsx";

export type Set = {
  id: string;
  name: string;
  link: string;
  cards: { normal: number; secret: number };
  packs: string[];
};

export type SetId = typeof sets[number]["id"];
export type PackName = typeof sets[number]["packs"][number];
export type Rarity = typeof rarities[number][0];
