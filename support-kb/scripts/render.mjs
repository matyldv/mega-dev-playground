import { createServer } from 'vite';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
try {
  // Load the same Svelte server renderer as Vite's SSR module graph.
  const { render } = await server.ssrLoadModule('svelte/server');
  const assetDir = resolve('dist/assets');
  const css = readdirSync(assetDir).filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(resolve(assetDir, f), 'utf8')).join('\n');
  const paths = [];
  function walk(dir) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const path = resolve(dir, item.name);
      if (item.isDirectory()) walk(path);
      else if (item.name === '+page.svx') paths.push(path);
    }
  }
  walk(resolve('src/routes/kb'));
  for (const path of paths) {
    const mod = await server.ssrLoadModule(path);
    const rendered = render(mod.default);
    const route = dirname(path).slice(resolve('src/routes').length);
    const target = resolve(`rendered${route}/index.html`);
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${rendered.head}<style>${css}</style></head><body>${rendered.body}</body></html>\n`;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
    console.log(`Rendered ${route}`);
  }
} finally {
  await server.close();
}
