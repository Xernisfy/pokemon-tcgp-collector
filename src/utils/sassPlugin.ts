import { Plugin } from "denoland/fresh/server.ts";
import { compile } from "npm:sass";
import { contentTypeHeader } from "utils/contentTypeHeader.ts";

export const sassPlugin: Plugin = {
  name: "sass",
  middlewares: [{
    path: "/sass",
    middleware: {
      handler(_req, ctx) {
        if (ctx.destination !== "static") ctx.next();
        const path = ctx.config.staticDir + "/" + ctx.route;
        return new Response(
          compile(path, { style: "compressed" }).css,
          contentTypeHeader("css"),
        );
      },
    },
  }],
};
