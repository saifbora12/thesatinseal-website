// Bundles React app with esbuild, compiles Tailwind v4, inlines both into dist/index.html
import { build } from 'esbuild';
import { compile } from 'tailwindcss';
import fs from 'node:fs';
import path from 'node:path';
const NM = '/opt/npm-tools/node_modules';
const r = await build({ entryPoints: ['src/main.jsx'], bundle: true, minify: true, write: false, format: 'iife', jsx: 'automatic', nodePaths: [NM], define: { 'process.env.NODE_ENV': '"production"' }, loader: { '.js': 'jsx' } });
const js = r.outputFiles[0].text;
// tailwind candidates from source
const src = fs.readdirSync('src').filter(f => /\.(jsx?|js)$/.test(f)).map(f => fs.readFileSync('src/' + f, 'utf8')).join('\n');
const candidates = new Set(src.split(/[\s"'`{}<>]+/).filter(Boolean));
const css = fs.readFileSync('src/styles.css', 'utf8');
const compiler = await compile(css, { base: process.cwd(), loadStylesheet: async (id, base) => {
  const p = id === 'tailwindcss' ? path.join(NM, 'tailwindcss/index.css') : path.resolve(base, id);
  return { path: p, base: path.dirname(p), content: fs.readFileSync(p, 'utf8') };
}});
const out = compiler.build([...candidates]);
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Satin Seal – Interactive digital invitations</title>
<meta name="description" content="Interactive digital invitations for weddings, Nikah, Eid, birthdays, New Year and every celebration. Break the seal, untie the ribbon, reveal the moment.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=Pinyon+Script&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<style>${out}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html);
console.log('built', (html.length / 1024).toFixed(0) + 'KB', 'css', (out.length/1024).toFixed(0)+'KB');
