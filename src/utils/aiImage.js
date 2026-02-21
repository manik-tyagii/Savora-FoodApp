// Enhanced local "AI-like" SVG generator for restaurant images.
// Produces a stylized SVG data-URL using gradients, subtle patterns, emoji, and typography.

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const palettes = [
  ["#FFB86B", "#FF8A65"],
  ["#FFD36E", "#FFB84D"],
  ["#A0E7E5", "#70D6FF"],
  ["#C7CEEA", "#9FA8DA"],
  ["#A8E6CF", "#56C596"],
  ["#F8BBD0", "#F48FB1"],
  ["#FFE082", "#FFCA28"],
  ["#E6EE9C", "#C5E1A5"],
];

const patternSvgs = [
  (c1, c2) => `
    <defs>
      <pattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'>
        <rect width='40' height='40' fill='${c2}'/>
        <circle cx='20' cy='20' r='6' fill='${c1}' fill-opacity='0.06' />
      </pattern>
    </defs>
  `,
  (c1, c2) => `
    <defs>
      <pattern id='p' width='60' height='60' patternUnits='userSpaceOnUse'>
        <rect width='60' height='60' fill='${c2}'/>
        <rect x='0' y='0' width='30' height='30' fill='${c1}' fill-opacity='0.04'/>
      </pattern>
    </defs>
  `,
];

export default function generateAIDishImage({ name = "Food", cuisines = [], id = "0", width = 1200, height = 900 } = {}) {
  try {
    const base = `${name} ${(cuisines || []).join(' ')}`.trim();
    const h = hashString(base + id);
    const p = palettes[h % palettes.length];
    const pat = patternSvgs[h % patternSvgs.length];

    const emojiOptions = ['🍕','🍔','🍣','🥗','🍜','🍛','🍩','🍰','🥐','🥟','🍝','🥘'];
    const emoji = emojiOptions[h % emojiOptions.length];

    const title = (name || 'Food').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const subtitle = (cuisines && cuisines.length ? cuisines.slice(0,2).join(', ') : 'Delicious').replace(/&/g, '&amp;').replace(/</g, '&lt;');

    const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
  <defs>
    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0' stop-color='${p[0]}' />
      <stop offset='1' stop-color='${p[1]}' />
    </linearGradient>
    ${pat(p[0], p[1])}
    <filter id='soft' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='18' result='b' />
      <feBlend in='SourceGraphic' in2='b' mode='normal'/>
    </filter>
  </defs>
  <rect width='100%' height='100%' fill='url(#p)' />
  <rect x='40' y='40' width='${width-80}' height='${height-160}' rx='24' fill='url(#g)' filter='url(#soft)' />

  <g font-family='Segoe UI, Roboto, Arial, Helvetica, sans-serif'>
    <text x='80' y='220' font-size='160' fill='rgba(255,255,255,0.95)'>${emoji}</text>
    <text x='80' y='360' font-size='72' fill='rgba(255,255,255,0.98)' font-weight='700'>${title}</text>
    <text x='80' y='430' font-size='36' fill='rgba(255,255,255,0.9)'>${subtitle}</text>

    <g transform='translate(80,${height-120})'>
      <rect x='0' y='0' width='${width-320}' height='96' rx='12' fill='rgba(0,0,0,0.18)' />
      <text x='24' y='64' font-size='28' fill='rgba(255,255,255,0.95)'>AI-generated preview</text>
    </g>
  </g>
</svg>`;

    const encoded = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return encoded;
  } catch (err) {
    return null;
  }
}
