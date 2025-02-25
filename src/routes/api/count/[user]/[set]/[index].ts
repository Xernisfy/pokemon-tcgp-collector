import { Handlers } from "denoland/fresh/server.ts";
import { db, Prefix } from "utils/kv.ts";
import { duplicates } from "utils/sets.ts";

export const handler: Handlers = {
  async PUT(req, ctx) {
    const user = decodeURIComponent(ctx.params.user);
    const set = ctx.params.set;
    const index = +ctx.params.index;
    const amount = +(await req.text());
    if (amount === 0) {
      db.delete([Prefix.count, user, set, index]);
    } else {
      db.set([Prefix.count, user, set, index], amount);
    }
    duplicates[`${set}/${index}`]?.others.forEach(({ index, set }) => {
      if (amount === 0) {
        db.delete([Prefix.count, user, set, index]);
      } else {
        db.set([Prefix.count, user, set, index], amount);
      }
    });
    return new Response();
  },
};
