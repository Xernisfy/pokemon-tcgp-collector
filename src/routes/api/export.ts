import { Handlers } from "denoland/fresh/server.ts";
import { contentTypeHeader } from "utils/contentTypeHeader.ts";
import { dbExport } from "utils/kv.ts";

export const handler: Handlers = {
  async GET() {
    return new Response(
      JSON.stringify(await dbExport()),
      contentTypeHeader("json"),
    );
  },
};
