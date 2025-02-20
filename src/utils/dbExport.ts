import { db, Prefix } from "utils/kv.ts";

const prefixes = Object.values(Prefix);

const dbExport: Record<string, unknown[]> = {};
for (const prefix of prefixes) {
  dbExport[prefix] = [];
  for await (const { key, value } of db.list({ prefix: [prefix] })) {
    dbExport[prefix].push({ key, value });
  }
}
Deno.writeTextFileSync(
  import.meta.dirname + "/dbExport-" + Date.now() + ".json",
  JSON.stringify(dbExport),
);
