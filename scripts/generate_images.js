#!/usr/bin/env node
// Node script to generate PNG images from AI SVGs for all restaurants in public/mock/restaurants.json
// Requires: npm i -D sharp

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const palettes = [
  ['#FFB86B', '#FF8A65'],
  ['#FFD36E', '#FFB84D'],
  ['#A0E7E5', '#70D6FF'],
  ['#C7CEEA', '#9FA8DA'],
  ['#A8E6CF', '#56C596'],
  ['#F8BBD0', '#F48FB1'],
  ['#FFE082', '#FFCA28'],
  ['#E6EE9C', '#C5E1A5'],
];

function pattern(p, c1, c2) {
  if (p % 2 === 0) return `\n<defs>\n  <pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'>\n    <rect width='40' height='40' fill='${c2}'/>\n    <circle cx='20' cy='20' r='6' fill='${c1}' fill-opacity='0.06' />\n  </pattern>\n</defs>\n`;
  return `\n<defs>\n  <pattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'>\n    <rect width='60' height='60' fill='${c2}'/>\n    <rect x='0' y='0' width='30' height='30' fill='${c1}' fill-opacity='0.04'/>\n  </pattern>\n</defs>\n`;
}

function generateSvg({ name = 'Food', cuisines = [], id = '0', width = 1200, height = 900 }) {
  const base = `${name} ${(cuisines || []).join(' ')}`.trim();
  const h = hashString(base + id);
  const p = palettes[h % palettes.length];
  const pat = pattern(h, p[0], p[1]);
  const emojiOptions = ['🍕','🍔','🍣','🥗','🍜','🍛','🍩','🍰','🥐','🥟','🍝','🥘'];
  const emoji = emojiOptions[h % emojiOptions.length];
  const title = (name || 'Food').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const subtitle = (cuisines && cuisines.length ? cuisines.slice(0,2).join(', ') : 'Delicious').replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>\n  ${pat}\n  <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\n    <stop offset='0' stop-color='${p[0]}' />\n    <stop offset='1' stop-color='${p[1]}' />\n  </linearGradient>\n  <rect width='100%' height='100%' fill='url(#p)' />\n  <rect x='40' y='40' width='${width-80}' height='${height-160}' rx='24' fill='url(#g)' />\n  <g font-family='Segoe UI, Roboto, Arial, Helvetica, sans-serif'>\n    <text x='80' y='220' font-size='160' fill='rgba(255,255,255,0.95)'>${emoji}</text>\n    <text x='80' y='360' font-size='72' fill='rgba(255,255,255,0.98)' font-weight='700'>${title}</text>\n    <text x='80' y='430' font-size='36' fill='rgba(255,255,255,0.9)'>${subtitle}</text>\n  </g>\n</svg>`;
  return svg;
}

async function main() {
  const mockPath = path.join(process.cwd(), 'public', 'mock', 'restaurants.json');
  if (!fs.existsSync(mockPath)) {
    console.error('Mock restaurants not found at', mockPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(mockPath, 'utf8');
  let data;
  try { data = JSON.parse(raw); } catch (e) { console.error('Invalid JSON'); process.exit(1); }

  const outDir = path.join(process.cwd(), 'public', 'assets', 'food');
  fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  for (const item of data) {
    const rid = item?.info?.id || item?.id || String(count);
    const name = item?.info?.name || 'Food';
    const cuisines = item?.info?.cuisines || [];
    const svg = generateSvg({ name, cuisines, id: rid });
    const pngPath = path.join(outDir, `${rid}.png`);
    try {
      await sharp(Buffer.from(svg)).resize(1200, 900).png({ quality: 90 }).toFile(pngPath);
      console.log('Wrote', pngPath);
      count++;
    } catch (err) {
      console.error('Failed to render', rid, err.message);
    }
  }

  console.log(`Generated ${count} AI images into ${outDir}`);
}

main();
