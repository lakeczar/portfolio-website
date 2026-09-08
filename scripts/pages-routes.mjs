import { copyFile, mkdir } from 'node:fs/promises';
// GitHub Pages has no SPA rewrite. Preserve existing direct route URLs.
for (const route of ['about', 'timeline']) {
  await mkdir(new URL(`../dist/${route}/`, import.meta.url), {
    recursive: true,
  });
  await copyFile(
    new URL('../dist/index.html', import.meta.url),
    new URL(`../dist/${route}/index.html`, import.meta.url)
  );
}
