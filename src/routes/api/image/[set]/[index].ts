import { Handlers } from "denoland/fresh/server.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { ensureDirSync, existsSync } from "jsr:@std/fs";
import { contentTypeHeader } from "utils/contentTypeHeader.ts";
import { sets } from "utils/sets.ts";

const cacheDir = import.meta.dirname + "/../../../../../.cache/";
const parseDom = ((p) => p.parseFromString.bind(p))(new DOMParser());

async function cacheAndDownload(response: Response, path: string) {
  const file = Deno.open(path, { create: true, write: true });
  const [a, b] = response.body!.tee();
  a.pipeTo((await file).writable);
  return new Response(b);
}

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { set, index } = ctx.params;
    const currentSet = sets.find((s) => s.id === set);
    if (!currentSet) return new Response(null, { status: 400 });
    const cacheSubDir = cacheDir + set + "/";
    const cacheFile = cacheSubDir + index.padStart(3, "0") + ".png";
    if (existsSync(cacheFile)) {
      return new Response(
        Deno.openSync(cacheFile).readable,
        contentTypeHeader("png"),
      );
    }
    ensureDirSync(cacheSubDir);
    const documentSet = parseDom(
      await (await fetch(
        `https://pokewiki.de/${
          currentSet.name.replaceAll(" ", "_")
        }_(TCG_Pocket)`,
      )).text(),
      "text/html",
    );
    const title = documentSet.querySelectorAll(
      `table.setliste:first-of-type > tbody > tr > td > a`,
    )[+index].getAttribute("title");
    if (!title) return new Response(null, { status: 404 });
    const directImage = await fetch(
      `https://pokewiki.de/Spezial:Filepath/Datei:${title}.png`,
    );
    if (directImage.ok && directImage.body) {
      return cacheAndDownload(directImage, cacheFile);
    }
    const metadata = await (await fetch("https://pokewiki.de/api.php", {
      method: "POST",
      body: new URLSearchParams({
        action: "query",
        format: "json",
        prop: "imageinfo",
        titles: title,
        formatversion: "2",
        generator: "images",
        iiprop: "url",
      }),
    })).json() as {
      query: {
        pages: {
          title: string;
          imageinfo: {
            url: string;
          }[];
        }[];
      };
    };
    const matchingPagesA = metadata.query.pages.filter((page) =>
      page.title.startsWith("Datei:" + title?.substring(0, 5))
    );
    if (matchingPagesA.length === 1) {
      const image = await fetch(matchingPagesA[0].imageinfo[0].url);
      if (image.ok && image.body) {
        return cacheAndDownload(image, cacheFile);
      }
    }
    const matchingPagesB = matchingPagesA.filter((page) =>
      page.title.includes((+index + 1).toString())
    );
    if (matchingPagesB.length === 1) {
      const image = await fetch(matchingPagesB[0].imageinfo[0].url);
      if (image.ok && image.body) {
        return cacheAndDownload(image, cacheFile);
      }
    }
    console.log(metadata);
    return new Response(null, { status: 404 });
  },
};
