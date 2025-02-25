export const db = await Deno.openKv(import.meta.dirname + "/db.sqlite");
Deno.addSignalListener("SIGINT", () => {
  db.close();
  Deno.exit(0);
});

export enum Prefix {
  users = "users",
  count = "count",
  packs = "packs",
}
