// Every design is just a theme object – add a new occasion by adding an entry here.
export const THEMES = [
  {
    id: 'blush-satin', name: 'Blush Satin', occasion: 'Wedding', tag: 'Bestseller',
    blurb: 'Ginkgo-embossed envelope, mauve wax seal and a satin bow',
    c: { paper: '#cfb3b6', liner: '#8e6f75', card: '#e2cdcf', ink: '#6b4c52', press: 'rgba(255,255,255,.55)', r1: '#f2e2e2', r2: '#d4b6b9', r3: '#a78489', s1: '#a68389', s2: '#6f5157', bg: '#efe3e2' },
    foil: null, motif: 'leaves', mono: 'E&J',
    arabic: '', kicker: 'Together with their families',
    names: ['Emily', 'James'], amp: '&', line: 'invite you to celebrate their wedding', date: 'Saturday · 12 June 2027', venue: 'Cheshire',
  },
  {
    id: 'winter-forest', name: 'Winter Forest', occasion: 'Christmas', tag: 'New',
    blurb: 'Forest green, embossed snowflakes and a red velvet bow',
    c: { paper: '#2f4a3c', liner: '#16261e', card: '#f3eee4', ink: '#2f4a3c', press: 'rgba(255,255,255,.8)', r1: '#e8a0a0', r2: '#b33a3a', r3: '#6e1c1c', s1: '#c24a4a', s2: '#741f1f', bg: '#1f3329' },
    foil: null, motif: 'snow', mono: '✶',
    arabic: '', kicker: 'Merry Christmas', names: ['Christmas', 'at the Taylors’'], amp: '', line: 'Turkey, crackers & carols, come and join us', date: 'Friday · 25 December 2026', venue: 'Our home',
  },
  {
    id: 'lilac-party', name: 'Lilac Party', occasion: 'Birthday', tag: '',
    blurb: 'Embossed balloons, a pink satin bow and a confetti burst',
    c: { paper: '#dccbe6', liner: '#9c7fb1', card: '#f5ecf7', ink: '#5a3e6c', press: 'rgba(255,255,255,.75)', r1: '#fbe5ee', r2: '#e6aac3', r3: '#b9758f', s1: '#d27ea3', s2: '#8c3f63', bg: '#efe3f3' },
    foil: 'linear-gradient(100deg,#b35d8a,#e9a3c2 45%,#9a4c78)', motif: 'balloons', mono: '30',
    arabic: '', kicker: 'You’re invited to', names: ['Maya’s', '30th'], amp: '', line: 'Cake, music & dancing', date: 'Saturday · 23 January 2027', venue: 'Rooftop',
  },
  {
    id: 'ivory-nikah', name: 'Ivory Nikah', occasion: 'Wedding', tag: 'New',
    blurb: 'Cream linen, gold-leaf arches and an Islamic star seal',
    c: { paper: '#ece2cf', liner: '#b49a6a', card: '#f6efe1', ink: '#6f5a2e', press: 'rgba(255,255,255,.8)', r1: '#fbf3dc', r2: '#d9bd7c', r3: '#9c7c3a', s1: '#d0ad62', s2: '#86662a', bg: '#f4ecdc' },
    foil: 'linear-gradient(100deg,#9a7428,#e4c77a 40%,#a9832f 60%,#d9b862)', motif: 'islamic', mono: 'H&I',
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', kicker: 'With the blessings of Allah',
    names: ['Hana', 'Imran'], amp: '&', line: 'request the honour of your presence at their Nikah', date: 'Sunday · 5 September 2027', venue: 'Bolton',
  },
  {
    id: 'midnight-gold', name: 'Midnight Gold', occasion: 'New Year', tag: '',
    blurb: 'Navy starfield, gold foil and midnight fireworks',
    c: { paper: '#1f2847', liner: '#0c1122', card: '#1c2443', ink: '#ecd9a7', press: 'rgba(0,0,0,.6)', r1: '#f6e6b4', r2: '#c9a24c', r3: '#7d6122', s1: '#d4b46a', s2: '#7d6122', bg: '#121935' },
    foil: 'linear-gradient(100deg,#b8913f,#f3dd9c 40%,#b48b38 60%,#e8cb7c)', motif: 'stars', mono: '27',
    arabic: '', kicker: 'Ring in the new year', names: ['Hello', '2027'], amp: '', line: 'Food, friends & fireworks', date: 'Thursday · 31 December 2026', venue: 'The Glass House',
  },
  {
    id: 'emerald-eid', name: 'Emerald Eid', occasion: 'Festivals', tag: '',
    blurb: 'Deep emerald paper, lanterns, a crescent and a gold bow',
    c: { paper: '#1d5646', liner: '#0d3127', card: '#f1e8d4', ink: '#1f4d40', press: 'rgba(255,255,255,.7)', r1: '#f6e7b8', r2: '#d2ad5a', r3: '#8f6d26', s1: '#d6b264', s2: '#8a6a24', bg: '#123f34' },
    foil: 'linear-gradient(100deg,#9a7428,#e4c77a 40%,#a9832f 60%,#d9b862)', motif: 'islamic', mono: '☾',
    arabic: 'عِيد مُبَارَك', kicker: 'Eid Mubarak from', names: ['The Rahman', 'Family'], amp: '', line: 'Join us for Eid dinner', date: 'Eid evening · 2027', venue: 'Our home',
  },
  {
    id: 'marigold-diwali', name: 'Marigold Diwali', occasion: 'Festivals', tag: '',
    blurb: 'Saffron paper, embossed diyas and a marigold seal',
    c: { paper: '#e39a3b', liner: '#9c4f12', card: '#fbf0dc', ink: '#8a3f10', press: 'rgba(255,255,255,.8)', r1: '#ffe3a8', r2: '#f0a93a', r3: '#a4581a', s1: '#d8462e', s2: '#7e1f12', bg: '#f3d3a1' },
    foil: null, motif: 'diya', mono: '✺',
    arabic: '', kicker: 'Shubh Deepavali', names: ['Festival', 'of Lights'], amp: '', line: 'Join us for sweets & sparklers', date: 'Monday · 1 November 2027', venue: 'Leicester',
  },
  {
    id: 'sage-baby', name: 'Sage Baby', occasion: 'Baby shower', tag: '',
    blurb: 'Soft sage, embossed clouds and a cream ribbon',
    c: { paper: '#b9c7b1', liner: '#7d8f74', card: '#f1f2ea', ink: '#55664d', press: 'rgba(255,255,255,.8)', r1: '#fbf7ec', r2: '#e2d8bf', r3: '#a99d7c', s1: '#9cae93', s2: '#5f7056', bg: '#e6ece0' },
    foil: null, motif: 'clouds', mono: 'B',
    arabic: '', kicker: 'Oh baby!', names: ['A shower', 'for Sara'], amp: '', line: 'Tea, cake & tiny clothes', date: 'Saturday · 6 March 2027', venue: 'Leeds',
  },
];

export const OCCASIONS = ['All', 'Wedding', 'Christmas', 'Birthday', 'New Year', 'Festivals', 'Baby shower'];
