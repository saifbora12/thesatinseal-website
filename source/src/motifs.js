// Raised "embossed" motifs. Shapes are drawn in black; the alpha is used as a height map
// and lit by an SVG diffuse-light filter, then blended onto the paper.
const leaf = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
  <path d="M0 0 C-30 -25 -85 -60 -80 -120 Q0 -150 80 -120 C85 -60 30 -25 0 0Z" fill="#000" fill-opacity=".45"/>
  ${[-60, -35, -12, 12, 35, 60].map(a => `<path d="M0 -4 L${(Math.sin(a * Math.PI / 180) * 125).toFixed(1)} ${(-Math.cos(a * Math.PI / 180) * 125).toFixed(1)}" stroke="#000" stroke-width="2" fill="none"/>`).join('')}
  <path d="M-80 -120 Q0 -150 80 -120" stroke="#000" stroke-width="3" fill="none"/>
  <path d="M0 0 L0 40" stroke="#000" stroke-width="6" stroke-linecap="round"/></g>`;
const rose = (x, y, s) => {
  let p = '';
  for (let i = 0; i < 5; i++) p += `<ellipse cx="0" cy="-14" rx="11" ry="16" transform="rotate(${i * 72})" fill="none" stroke="#000" stroke-width="2.5"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${p}<circle r="7" fill="none" stroke="#000" stroke-width="2.5"/><circle r="2.5" fill="#000"/></g>`;
};
const star8 = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="2.2"><rect x="-20" y="-20" width="40" height="40"/><rect x="-20" y="-20" width="40" height="40" transform="rotate(45)"/><circle r="9"/></g>`;
const crescent = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -60 A60 60 0 1 0 40 45 A48 48 0 1 1 0 -60Z" fill="#000"/></g>`;
const lantern = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="#000" stroke-width="3"><path d="M0 -70 L0 -50"/><path d="M-14 -50 H14 L22 -36 H-22Z" fill="#000"/><path d="M-22 -36 Q-30 0 -18 34 H18 Q30 0 22 -36"/><path d="M0 -36 V34 M-11 -36 Q-16 0 -9 34 M11 -36 Q16 0 9 34"/><path d="M-18 34 H18 L10 46 H-10Z" fill="#000"/></g>`;
const balloon = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse rx="34" ry="42" fill="#000" fill-opacity=".55"/><path d="M-18 -22 Q-8 -34 6 -34" stroke="#000" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M-5 42 L5 42 L0 48Z" fill="#000"/><path d="M0 48 C10 70 -10 90 4 120" stroke="#000" stroke-width="2" fill="none"/></g>`;
const sparkle = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -30 Q4 -4 30 0 Q4 4 0 30 Q-4 4 -30 0 Q-4 -4 0 -30Z" fill="#000"/></g>`;
const flake = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="#000" stroke-width="3" stroke-linecap="round" fill="none">${[0, 60, 120].map(a => `<g transform="rotate(${a})"><path d="M0 -34 V34"/><path d="M-9 -24 L0 -15 L9 -24 M-9 24 L0 15 L9 24"/></g>`).join('')}</g>`;
const diya = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 Q0 34 40 0 Z" fill="#000" fill-opacity=".6"/><path d="M0 -6 C-10 -20 -4 -36 0 -46 C4 -36 10 -20 0 -6Z" fill="#000"/><path d="M-40 0 H40" stroke="#000" stroke-width="3"/></g>`;
const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 10 Q-52 -14 -28 -14 Q-22 -38 4 -34 Q26 -46 38 -20 Q60 -18 56 6 Q56 18 40 18 H-38 Q-52 18 -50 10Z" fill="#000" fill-opacity=".5"/></g>`;
const dots = (n, seed) => { let o = '', r = seed; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; for (let i = 0; i < n; i++) o += `<circle cx="${(rnd() * 400).toFixed(0)}" cy="${(rnd() * 800).toFixed(0)}" r="${(2 + rnd() * 3).toFixed(1)}" fill="#000"/>`; return o; };

export function motifSVG(kind) {
  let g = '';
  if (kind === 'leaves') g = leaf(70, 250, 1.35, -35) + leaf(330, 240, 1.35, 35) + leaf(200, 470, 1.1, 0) + leaf(40, 640, 1.2, -150) + leaf(360, 660, 1.2, 150) + leaf(200, 120, .9, 180) + leaf(120, 420, .8, -80) + leaf(290, 420, .8, 80) + leaf(200, 800, 1.3, 180) + rose(200, 330, 1.1) + rose(60, 470, .8) + rose(340, 480, .8);
  else if (kind === 'islamic') { for (let y = 40; y < 820; y += 80) for (let x = (y / 80 % 2 ? 40 : 0); x < 440; x += 80) g += star8(x, y, .85); g += crescent(200, 400, 1.6) + lantern(80, 220, 1) + lantern(320, 220, 1); }
  else if (kind === 'balloons') g = balloon(80, 180, 1.3, -12) + balloon(310, 150, 1.5, 10) + balloon(200, 320, 1.1, 0) + balloon(60, 520, 1.2, -6) + balloon(340, 560, 1.3, 8) + balloon(190, 690, 1, 4) + dots(60, 7);
  else if (kind === 'snow') g = flake(80, 150, 1.4) + flake(320, 220, 1.1) + flake(200, 400, 2) + flake(60, 580, 1) + flake(330, 620, 1.5) + flake(160, 720, .9) + dots(70, 11);
  else if (kind === 'diya') { g = diya(200, 420, 2) + diya(80, 200, 1.1) + diya(320, 200, 1.1) + diya(80, 640, 1.1) + diya(320, 640, 1.1) + dots(80, 5); g += `<g fill="none" stroke="#000" stroke-width="2.4"><circle cx="200" cy="400" r="130"/><circle cx="200" cy="400" r="150" stroke-dasharray="3 9"/></g>`; }
  else if (kind === 'clouds') g = cloud(90, 160, 1.4) + cloud(310, 260, 1.2) + cloud(200, 430, 1.8) + cloud(80, 620, 1.1) + cloud(320, 680, 1.3) + dots(40, 2);
  else { g = sparkle(80, 140, 1.4) + sparkle(320, 200, 1) + sparkle(200, 380, 1.8) + sparkle(60, 560, 1) + sparkle(330, 610, 1.5) + sparkle(150, 700, .8) + sparkle(260, 90, .7) + dots(90, 3); g += `<g fill="none" stroke="#000" stroke-width="2.4"><circle cx="200" cy="380" r="120"/><circle cx="200" cy="380" r="140" stroke-dasharray="2 10"/></g>`; }
  return `<g filter="url(#uv-emb)">${g}</g>`;
}

export function frameSVG(kind) {
  const arch = i => `M${40 + i} 690 L${40 + i} ${170 + i} Q${40 + i} ${40 + i} 200 ${40 + i} Q${360 - i} ${40 + i} ${360 - i} ${170 + i} L${360 - i} 690`;
  const corner = { leaves: (x, y) => rose(x, y, .9), islamic: (x, y) => star8(x, y, .6), balloons: (x, y, r) => balloon(x, y, .45, r), stars: (x, y) => sparkle(x, y, .7), snow: (x, y) => flake(x, y, .6), diya: (x, y) => diya(x, y, .5), clouds: (x, y) => cloud(x, y, .45) }[kind] || ((x, y) => sparkle(x, y, .7));
  const c = corner(30, 30, -15) + corner(370, 30, 15) + corner(30, 670, -15) + corner(370, 670, 15);
  return `<g filter="url(#uv-emb-soft)" fill="none" stroke="#000"><path d="${arch(0)}" stroke-width="3"/><path d="${arch(10)}" stroke-width="1.4"/><rect x="14" y="14" width="372" height="672" rx="4" stroke-width="1.6"/>${c}</g>`;
}

export function sealPoints() {
  const pts = [];
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const r = 54 + Math.sin(i * 2.7) * 2.4 + Math.cos(i * 5.1) * 1.6; pts.push((60 + Math.cos(a) * r).toFixed(1) + ',' + (60 + Math.sin(a) * r).toFixed(1)); }
  return pts.join(' ');
}
