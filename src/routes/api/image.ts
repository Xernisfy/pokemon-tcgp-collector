import { Handlers } from "denoland/fresh/server.ts";
import { STATUS_CODE } from "jsr:@std/http";
import { fetchCached } from "utils/fetchCached.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const filename = ctx.url.searchParams.get("path");
    if (!filename) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }
    return await fetchCached("https://serebii.net/tcgpocket/" + filename);
  },
};
