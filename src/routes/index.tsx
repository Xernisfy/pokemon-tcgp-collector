import { Handlers } from "denoland/fresh/server.ts";
import { db, Prefix } from "utils/kv.ts";
import { CardCount } from "../islands/cardCount.tsx";
import { Collection } from "../islands/collection.tsx";
import { HeaderToggle } from "../islands/headerToggle.tsx";
import { PackProgress } from "../islands/packProgress.tsx";
import { SelectObtained } from "../islands/selectObtained.tsx";
import { SelectPack } from "../islands/selectPack.tsx";
import { SelectRarity } from "../islands/selectRarity.tsx";
import { SelectSet } from "../islands/selectSet.tsx";
import { SelectUser } from "../islands/selectUser.tsx";

export const handler: Handlers<PreloadData> = {
  async GET(_req, ctx) {
    const users: PreloadData["users"] = [];
    for await (const entry of db.list<string>({ prefix: [Prefix.users] })) {
      users.push(entry.value);
    }
    const cards: PreloadData["cards"] = {};
    for await (const entry of db.list<number>({ prefix: [Prefix.count] })) {
      cards[entry.key.slice(1).join("/")] = entry.value;
    }
    const packs: PreloadData["packs"] = {};
    for await (const entry of db.list<string>({ prefix: [Prefix.packs] })) {
      packs[entry.key.slice(1).join("/")] = entry.value;
    }
    return ctx.render({ users, cards, packs });
  },
};

interface PreloadData {
  users: string[];
  cards: Record<string, number>;
  packs: Record<string, string>;
}

export default function ({ data }: { data: PreloadData }) {
  return (
    <>
      <div id="header">
        <div id="header-items">
          <SelectUser users={data.users} />
          <SelectSet />
          <SelectPack />
          <SelectRarity />
          <SelectObtained />
          <CardCount />
          <PackProgress />
        </div>
        <HeaderToggle />
      </div>
      <Collection cards={data.cards} packs={data.packs} />
    </>
  );
}
