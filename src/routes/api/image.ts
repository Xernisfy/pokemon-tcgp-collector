import { Handlers } from "denoland/fresh/server.ts";
import { ensureDir, existsSync } from "jsr:@std/fs";
import { STATUS_CODE } from "jsr:@std/http";

const cacheDir = import.meta.dirname + "/../../../.cache/packicons/";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const filename = ctx.url.searchParams.get("path");
    if (!filename) {
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }
    const cacheFile = cacheDir + filename;
    if (existsSync(cacheFile)) {
      return new Response(Deno.openSync(cacheFile).readable, {
        headers: { "Content-Type": "image/jpeg" },
      });
    }
    const response = await fetch("https://serebii.net/tcgpocket/" + filename);
    const image = await response.bytes();
    ensureDir(cacheFile.replace(/[^\/]+$/, "")).then(() =>
      Deno.writeFile(cacheFile, image)
    );
    return new Response(image, { headers: { "Content-Type": "image/jpeg" } });
  },
};
