import { signal } from "@preact/signals";
import { PackName, Rarity, SetId } from "utils/types.ts";

// global
export const user = signal<string>();
export const userCards = signal<Record<string, number>>({});
export const packs = signal<Record<string, string>>({});

// filters
export const filterSet = signal<SetId | "all">("all");
export const filterPack = signal<PackName | "all">("all");
export const filterRarity = signal<Rarity | "all">("all");
export const filterObtained = signal<"obtained" | "unobtained" | "all">("all");
