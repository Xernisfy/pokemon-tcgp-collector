export const db = await Deno.openKv(import.meta.dirname + "/db.sqlite");
globalThis.addEventListener("unload", () => db.close());

export enum Prefix {
  users = "users",
  count = "count",
  packs = "packs",
}
