import { DbExport } from "utils/types.ts";

export const db = await Deno.openKv(
  import.meta.dirname + "/../../db/db.sqlite",
);
addEventListener("unload", () => db.close());
Deno.addSignalListener("SIGINT", () => {
  db.close();
  Deno.exit(0);
});

export enum Prefix {
  users = "users",
  count = "count",
  packs = "packs",
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
