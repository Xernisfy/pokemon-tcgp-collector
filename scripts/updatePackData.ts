import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { fetchCached } from "utils/fetchCached.ts";
import { db, Prefix } from "utils/kv.ts";
import { sets } from "utils/sets.ts";

// delete existing entries
for await (const entry of db.list({ prefix: [Prefix.packs] })) {
  db.delete(entry.key);
}
for await (const entry of db.list({ prefix: [Prefix.rarity] })) {
  db.delete(entry.key);
}
for await (const entry of db.list({ prefix: [Prefix.sets] })) {
  db.delete(entry.key);
}

const parseDom =
  ((p) => ((source: string) => p.parseFromString(source, "text/html")).bind(p))(
    new DOMParser(),
  );

const rarityMap: Record<string, string> = {
  "diamond1": "🔷",
  "diamond2": "🔷🔷",
  "diamond3": "🔷🔷🔷",
  "diamond4": "🔷🔷🔷🔷",
  "star1": "⭐",
  "star2": "⭐⭐",
  "star3": "⭐⭐⭐",
  "shiny1": "🌟",
  "shiny2": "🌟🌟",
  "crown": "👑",
  "promo": "PROMO",
};

for (const set of sets) {
  const response = await fetchCached(
    `https://serebii.net/tcgpocket/${set.link}`,
  );
  const document = parseDom(await response.text());
  [...document.querySelectorAll(
    "table.dextable > tbody > tr:not(:first-child)",
  )].forEach((row, i) => {
    const cardCol = row.querySelector("td:nth-child(1)");
    if (cardCol) {
      const rarityImage = cardCol.querySelector("img")?.getAttribute("src")
        ?.match(/([^\/]*?)\./)?.[1];
      if (rarityImage && rarityImage in rarityMap) {
        db.set([Prefix.rarity, set.id, i], rarityMap[rarityImage]);
      } else throw new Error(`unknown rarity "${rarityImage}"`);
    }
    if (set.packs.length > 1) {
      const packCol = row.querySelector("td:nth-child(5)");
      if (packCol && packCol.childElementCount === 1) {
        const pack = packCol.querySelector("a > img")?.getAttribute("src")
          ?.replace(/\..*?$/, "");
        db.set([Prefix.packs, set.id, i], pack);
      }
    }
  });
}
