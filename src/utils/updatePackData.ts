import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { db, Prefix } from "utils/kv.ts";
import { sets } from "utils/sets.ts";

// delete existing entries
for await (const entry of db.list({ prefix: [Prefix.packs] })) {
  db.delete(entry.key);
}

const parseDom = ((p) => p.parseFromString.bind(p))(new DOMParser());

for (const set of sets.filter((set) => set.packs.length > 1)) {
  const response = await fetch(`https://serebii.net/tcgpocket/${set.link}`);
  const document = parseDom(await response.text(), "text/html");
  [...document.querySelectorAll(
    "table.dextable > tbody > tr:not(:first-child) > td:nth-child(5)",
  )].forEach((packCol, i) => {
    if (packCol.childElementCount !== 1) return;
    const pack = packCol.querySelector("a > img")?.getAttribute("src")
      ?.replace(/\..*?$/, "");
    db.set([Prefix.packs, set.id, i], pack);
  });
}
