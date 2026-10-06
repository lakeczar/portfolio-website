import { mkdir, readFile, writeFile } from 'node:fs/promises';
// GitHub Pages has no SPA rewrite. Preserve existing direct route URLs.
const home = 'https://alekracz.dev/';
const index = await readFile(
  new URL('../dist/index.html', import.meta.url),
  'utf8'
);
for (const route of ['about', 'timeline']) {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), {
    recursive: true,
  });
  // Each route is its own page for search and sharing, not a copy of home.
  const html = index.replace(
    /(rel="canonical" href="|property="og:url" content=")https:\/\/alekracz\.dev\/"/g,
    `$1${home}${route}/"`
  );
  await writeFile(
    new URL(`../dist/${route}/index.html`, import.meta.url),
    html
  );
}
