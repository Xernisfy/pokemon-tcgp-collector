import { Handlers } from "denoland/fresh/server.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { contentTypeHeader } from "utils/contentTypeHeader.ts";
import { fetchCached } from "utils/fetchCached.ts";
import { sets } from "utils/sets.ts";
import { CardSet } from "utils/types.ts";

const parseDom = ((p) => p.parseFromString.bind(p))(new DOMParser());

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { set, index } = ctx.params;
    const currentSet = sets.find((s) => s.id === set);
    if (!currentSet) return new Response(null, { status: 400 });
    try {
      return await getGermanCard(currentSet, +index);
    } catch {
      try {
        return await getEnglishCard(currentSet, +index);
      } catch {
        return new Response(null, { status: 404 });
      }
    }
  },
};

async function getGermanCard(
  set: CardSet,
  index: number,
): Promise<Response | never> {
  const documentSet = parseDom(
    await (await fetchCached(
      `https://pokewiki.de/${set.name.replaceAll(" ", "_")}_(TCG_Pocket)`,
    )).text(),
    "text/html",
  );
  const title = documentSet.querySelectorAll(
    `table.setliste:first-of-type > tbody > tr > td > a`,
  )[index].getAttribute("title");
  if (!title) throw "card name not found";
  const directImage = await fetchCached(
    `https://pokewiki.de/Spezial:Filepath/Datei:${title}.png`,
  );
  if (directImage.ok) return directImage;
  const search = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    titles: title,
    formatversion: "2",
    generator: "images",
    iiprop: "url",
  });
  const metadata = await (await fetchCached(
    "https://pokewiki.de/api.php?" + search.toString(),
  )).json() as {
    query: { pages: { title: string; imageinfo: { url: string }[] }[] };
  };
  const matchingPagesA = metadata.query.pages.filter((page) =>
    page.title.startsWith("Datei:" + title?.substring(0, 5))
  );
  if (matchingPagesA.length === 1) {
    const response = await fetchCached(matchingPagesA[0].imageinfo[0].url);
    if (response.ok) return response;
  }
  const matchingPagesB = matchingPagesA.filter((page) =>
    page.title.includes((index + 1).toString())
  );
  if (matchingPagesB.length === 1) {
    const response = await fetchCached(matchingPagesB[0].imageinfo[0].url);
    if (response.ok) return response;
  }
  throw "card not found on Pokéwiki";
}

async function getEnglishCard(
  set: CardSet,
  index: number,
): Promise<Response | never> {
  const response = await fetchCached(
    `https://serebii.net/tcgpocket/${set.link}/${index + 1}.jpg`,
  );
  if (response.ok) return new Response(response.body, contentTypeHeader("jpg"));
  throw "card not found on Serebii";
}
