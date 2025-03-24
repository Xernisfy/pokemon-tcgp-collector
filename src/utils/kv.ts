import { DbExport } from "utils/types.ts";

export const db = await Deno.openKv(
  import.meta.dirname + "/../../db/db.sqlite",
);

let closed = false;
addEventListener("unload", () => {
  if (!closed) db.close();
});
(["SIGINT", "SIGTERM"] as Deno.Signal[]).forEach((signal) =>
  Deno.addSignalListener(signal, () => {
    db.close();
    closed = true;
    Deno.exit(0);
  })
);

export enum Prefix {
  users = "users",
  count = "count",
  sets = "sets",
  packs = "packs",
  rarity = "rarity",
}

export async function dbExport(): Promise<DbExport> {
  const records: DbExport = {};
  for (const prefix of Object.values(Prefix)) {
    records[prefix] = [];
    for await (const { key, value } of db.list({ prefix: [prefix] })) {
      records[prefix].push({ key, value });
    }
  }
  return records;
}

export function dbImport(records: DbExport): void {
  for (const prefix in records) {
    for (const { key, value } of records[prefix]) {
      db.set(key, value);
    }
  }
}
