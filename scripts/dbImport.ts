import { dbImport } from "utils/kv.ts";

const input = Deno.args[0];
if (URL.canParse(input)) dbImport(await (await fetch(input)).json());
else dbImport(JSON.parse(Deno.readTextFileSync(input)));
