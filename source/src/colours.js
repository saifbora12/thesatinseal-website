// Turn 5 picked colours into the full palette an invitation needs.
// The same maths is copied into the invite template so a customer's design renders identically.
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
export const lum = h => { const [r, g, b] = hex(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };

export const GOLD_FOIL = 'linear-gradient(100deg,#9a7428,#e4c77a 40%,#a9832f 60%,#d9b862)';
export const SILVER_FOIL = 'linear-gradient(100deg,#8d9399,#eef1f4 40%,#9aa1a8 60%,#dfe3e7)';
export const ROSE_FOIL = 'linear-gradient(100deg,#a8665c,#f2c3b5 40%,#b97a6d 60%,#e8b0a3)';

/** d = { paper, card, ink, seal, ribbon, foil: 'none'|'gold'|'silver'|'rose' } */
export function derive(d) {
  const dark = lum(d.card) < .25;
  const c = {
    paper: d.paper,
    liner: mix(d.paper, '#000000', .38),
    card: d.card,
    ink: d.ink,
    press: dark ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.7)',
    r1: mix(d.ribbon, '#ffffff', .55), r2: d.ribbon, r3: mix(d.ribbon, '#000000', .35),
    s1: mix(d.seal, '#ffffff', .25), s2: mix(d.seal, '#000000', .3),
    bg: mix(d.paper, '#ffffff', .4),
  };
  const foil = d.foil === 'gold' ? GOLD_FOIL : d.foil === 'silver' ? SILVER_FOIL : d.foil === 'rose' ? ROSE_FOIL : null;
  return { c, foil };
}

export const PALETTES = [
  { name: 'Blush', paper: '#cfb3b6', card: '#e2cdcf', ink: '#6b4c52', seal: '#8e6c72', ribbon: '#d4b6b9', foil: 'none' },
  { name: 'Ivory & gold', paper: '#ece2cf', card: '#f6efe1', ink: '#6f5a2e', seal: '#b8923f', ribbon: '#d9bd7c', foil: 'gold' },
  { name: 'Sage', paper: '#b9c7b1', card: '#f1f2ea', ink: '#55664d', seal: '#7e9175', ribbon: '#e2d8bf', foil: 'none' },
  { name: 'Lilac', paper: '#dccbe6', card: '#f5ecf7', ink: '#5a3e6c', seal: '#b05f88', ribbon: '#e6aac3', foil: 'rose' },
  { name: 'Midnight', paper: '#1f2847', card: '#1c2443', ink: '#ecd9a7', seal: '#b8964f', ribbon: '#c9a24c', foil: 'gold' },
  { name: 'Emerald', paper: '#1d5646', card: '#f1e8d4', ink: '#1f4d40', seal: '#c09a4e', ribbon: '#d2ad5a', foil: 'gold' },
  { name: 'Forest & red', paper: '#2f4a3c', card: '#f3eee4', ink: '#2f4a3c', seal: '#a63434', ribbon: '#b33a3a', foil: 'none' },
  { name: 'Marigold', paper: '#e39a3b', card: '#fbf0dc', ink: '#8a3f10', seal: '#b23a24', ribbon: '#f0a93a', foil: 'none' },
  { name: 'Dusty blue', paper: '#a9bccf', card: '#eef2f6', ink: '#34495e', seal: '#5d7690', ribbon: '#cfdbe6', foil: 'silver' },
  { name: 'Terracotta', paper: '#c98a6b', card: '#f7ebe3', ink: '#6e3b26', seal: '#9c4f33', ribbon: '#e5b49a', foil: 'rose' },
  { name: 'Black tie', paper: '#2b2b2e', card: '#f4f1ea', ink: '#1d1d1f', seal: '#1d1d1f', ribbon: '#d8d2c4', foil: 'gold' },
  { name: 'Champagne', paper: '#e7d6bd', card: '#fbf6ee', ink: '#6a5236', seal: '#c2a171', ribbon: '#f1e2c9', foil: 'gold' },
];
