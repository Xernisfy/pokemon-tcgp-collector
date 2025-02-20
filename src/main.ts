import { start } from "denoland/fresh/server.ts";
import { walkSync } from "jsr:@std/fs";

async function importDir<T>(dir: string): Promise<Record<string, T>> {
  const imports: Record<string, T> = {};
  for (
    const { path } of walkSync(import.meta.dirname + "/" + dir, {
      includeDirs: false,
      includeSymlinks: false,
    })
  ) {
    imports[path] = await import(path);
  }
  return imports;
}

await start({
  baseUrl: import.meta.url,
  islands: await importDir("islands"),
  routes: await importDir("routes"),
}, { server: { port: Deno.args[0] } });
