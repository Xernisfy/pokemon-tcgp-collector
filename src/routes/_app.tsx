import { type PageProps } from "denoland/fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pokémon TCG Pocket Card Collector</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
