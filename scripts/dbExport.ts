import { dbExport } from "utils/kv.ts";

function fmt(ext: string, text: Uint8Array) {
  const process = new Deno.Command("deno", {
    args: ["fmt", "--ext", ext, "-"],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  }).spawn();
  ReadableStream.from([text]).pipeTo(process.stdin);
  return process.stdout;
}

fmt("json", new TextEncoder().encode(JSON.stringify(await dbExport()))).pipeTo(
  Deno.openSync(import.meta.dirname + "/../db/" + Date.now() + ".json", {
    create: true,
    write: true,
  }).writable,
);
