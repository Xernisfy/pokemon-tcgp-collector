import { rarityValues } from "utils/const.ts";
import { sets } from "utils/sets.ts";

export type CardSet = {
  id: string;
  name: string;
  link: string;
  cards: { normal: number; secret: number };
  packs: string[];
};

export type SetId = typeof sets[number]["id"];
export type PackName = typeof sets[number]["packs"][number];
export type Rarity = typeof rarityValues[number];

export type DbExport = Record<string, { key: Deno.KvKey; value: unknown }[]>;
