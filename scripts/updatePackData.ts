import { DOMParser } from "jsr:@b-fuze/deno-dom";
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

for (const set of sets) {
  const response = await fetch(`https://serebii.net/tcgpocket/${set.link}`);
  const document = parseDom(await response.text());
  [...document.querySelectorAll(
    "table.dextable > tbody > tr:not(:first-child)",
  )].forEach((row, i) => {
    const cardCol = row.querySelector("td:nth-child(1)");
    if (cardCol) {
      const rarityImage = cardCol.querySelector("img")?.getAttribute("src")
        ?.match(/([^\/]*?)\./)?.[1];
      switch (rarityImage) {
        case "diamond1":
          db.set([Prefix.rarity, set.id, i], "🔹");
          break;
        case "diamond2":
          db.set([Prefix.rarity, set.id, i], "🔹🔹");
          break;
        case "diamond3":
          db.set([Prefix.rarity, set.id, i], "🔹🔹🔹");
          break;
        case "diamond4":
          db.set([Prefix.rarity, set.id, i], "🔹🔹🔹🔹");
          break;
        case "star1":
          db.set([Prefix.rarity, set.id, i], "⭐");
          break;
        case "star2":
          db.set([Prefix.rarity, set.id, i], "⭐⭐");
          break;
        case "star3":
          db.set([Prefix.rarity, set.id, i], "⭐⭐⭐");
          break;
        case "crown":
          db.set([Prefix.rarity, set.id, i], "👑");
          break;
        case "promo":
          db.set([Prefix.rarity, set.id, i], "PROMO");
          break;
        default:
          console.log(rarityImage);
      }
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
