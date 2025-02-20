import { db } from "utils/kv.ts";

const dbImport = JSON.parse(Deno.readTextFileSync(Deno.args[0])) as Record<
  string,
  { key: Deno.KvKey; value: unknown }[]
>;

for (const prefix in dbImport) {
  for (const { key, value } of dbImport[prefix]) {
    db.set(key, value);
  }
}
