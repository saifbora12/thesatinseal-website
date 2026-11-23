import React, { useId, useMemo } from 'react';
import { motifSVG, frameSVG, sealPoints } from './motifs.js';

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const seg = (p, a, b) => clamp((p - a) / (b - a));
export const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const paper = (color, light = .18) => ({ backgroundColor: color, backgroundImage: `${NOISE},linear-gradient(160deg,rgba(255,255,255,${light}),rgba(0,0,0,.08))`, backgroundBlendMode: 'overlay,normal' });

/** Global SVG filters used by every scene – render once near the root. */
export function EmbossDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="uv-emb" filterUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="900" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b" />
          <feDiffuseLighting in="b" surfaceScale="7" diffuseConstant="1" lightingColor="#fff"><feDistantLight azimuth="225" elevation="30" /></feDiffuseLighting>
        </filter>
        <filter id="uv-emb-soft" filterUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="900" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="b" />
          <feDiffuseLighting in="b" surfaceScale="4" diffuseConstant="1" lightingColor="#fff"><feDistantLight azimuth="225" elevation="30" /></feDiffuseLighting>
        </filter>
        <filter id="uv-blur"><feGaussianBlur stdDeviation="1.2" /></filter>
      </defs>
    </svg>
  );
}

function Seal({ t }) {
  const id = useId().replace(/:/g, '');
  const small = t.mono.length > 2;
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <defs>
        <radialGradient id={`sg${id}`} cx="38%" cy="32%" r="75%"><stop offset="0" stopColor={t.c.s1} /><stop offset=".7" stopColor={t.c.s2} /><stop offset="1" stopColor={t.c.s2} /></radialGradient>
        <radialGradient id={`sh${id}`} cx="35%" cy="28%" r="40%"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <polygon points={sealPoints()} fill={`url(#sg${id})`} />
      <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="3" />
      <circle cx="59.2" cy="59.2" r="40" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.2" />
      <text x="60" y={small ? 71 : 74} textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize={small ? 32 : 40} fill="rgba(0,0,0,.35)">{t.mono}</text>
      <text x="59.2" y={small ? 70.2 : 73.2} textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize={small ? 32 : 40} fill="rgba(255,255,255,.35)">{t.mono}</text>
      <circle cx="60" cy="60" r="54" fill={`url(#sh${id})`} />
    </svg>
  );
}

function Bow({ t }) {
  const id = useId().replace(/:/g, '');
  const { r1, r2, r3 } = t.c;
  return (
    <svg viewBox="0 0 190 170" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id={`a${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={r1} /><stop offset=".45" stopColor={r2} /><stop offset=".7" stopColor={r1} /><stop offset="1" stopColor={r3} /></linearGradient>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={r3} /><stop offset=".35" stopColor={r1} /><stop offset=".6" stopColor={r2} /><stop offset="1" stopColor={r3} /></linearGradient>
      </defs>
      <path d="M88 78 C70 120 58 140 44 166 L66 160 L72 170 C84 140 92 115 96 80Z" fill={`url(#b${id})`} />
      <path d="M102 78 C120 120 132 140 148 164 L126 159 L120 170 C108 140 98 115 94 80Z" fill={`url(#b${id})`} />
      <path d="M92 70 C60 20 8 22 10 62 C12 96 60 96 92 76Z" fill={`url(#a${id})`} />
      <path d="M98 70 C130 20 182 22 180 62 C178 96 130 96 98 76Z" fill={`url(#a${id})`} />
      <path d="M90 70 C66 42 34 40 30 60 C40 52 64 56 88 74Z" fill="rgba(0,0,0,.14)" />
      <path d="M100 70 C124 42 156 40 160 60 C150 52 126 56 102 74Z" fill="rgba(0,0,0,.14)" />
      <path d="M30 50 C50 36 72 44 86 62" stroke="rgba(255,255,255,.55)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M160 50 C140 36 118 44 104 62" stroke="rgba(255,255,255,.55)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="82" y="58" width="26" height="30" rx="9" fill={`url(#a${id})`} stroke="rgba(0,0,0,.15)" />
    </svg>
  );
}

const ribbonGrad = (dir, c) => `linear-gradient(${dir},${c.r3},${c.r1} 22%,${c.r2} 45%,${c.r1} 62%,${c.r2} 82%,${c.r3})`;

/**
 * The envelope → seal → ribbon → card sequence, driven entirely by `p` (0…1).
 * Scroll it, tween it or tie it to a slider – the scene just renders the frame.
 */
export default function InviteScene({ theme: t, p = 0, className = '' }) {
  const motif = useMemo(() => ({ __html: motifSVG(t.motif) }), [t.motif]);
  const frame = useMemo(() => ({ __html: frameSVG(t.motif) }), [t.motif]);
  const seal = seg(p, .05, .16), flap = ease(seg(p, .12, .32)), rise = ease(seg(p, .28, .44)), away = ease(seg(p, .42, .56));
  const untie = ease(seg(p, .58, .72)), reveal = seg(p, .66, .86);
  const cardY = away > 0 ? lerp(-15, 0, away) : lerp(16, -15, rise);
  const cardS = lerp(.9, 1, Math.max(rise * .4, away));
  const nameStyle = t.foil ? { background: t.foil, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,.25))' } : { color: t.c.ink, textShadow: `0 1px 0 ${t.c.press}` };
  const lp = { color: t.c.ink, textShadow: `0 1px 0 ${t.c.press}` };
  const line = i => ({ opacity: clamp(reveal * 5 - i * .6), transform: `translateY(${(1 - clamp(reveal * 5 - i * .6)) * 8}px)` });

  return (
    <div className={`overflow-hidden select-none ${className || "relative"}`} style={{ containerType: 'inline-size', perspective: '1600px', background: t.c.liner }}>
      {/* envelope inside */}
      <div className="absolute inset-0" style={{ ...paper(t.c.liner, .05), transform: `translateY(${away * 105}%)`, opacity: 1 - away }} />

      {/* the card */}
      <div className="absolute left-[7%] right-[7%] top-[8%] bottom-[8%] rounded-[1.5cqw] overflow-hidden"
        style={{ ...paper(t.c.card, .25), zIndex: away > 0 ? 6 : 2, transform: `translateY(${cardY}%) scale(${cardS})`, boxShadow: '0 4cqw 9cqw rgba(0,0,0,.28),0 .5cqw 1.5cqw rgba(0,0,0,.15)' }}>
        <svg className="absolute inset-0 w-full h-full mix-blend-overlay" viewBox="0 0 400 700" preserveAspectRatio="none" dangerouslySetInnerHTML={frame} />
        <div className="absolute inset-[13%_12%_9%] flex flex-col items-center justify-center text-center" style={{ gap: '2.6cqw', fontFamily: 'var(--font-serif)' }}>
          {t.arabic && <div style={{ ...lp, ...line(0), fontFamily: 'Amiri, serif', fontSize: '5.2cqw', direction: 'rtl' }}>{t.arabic}</div>}
          <div style={{ ...lp, ...line(1), fontSize: '3.1cqw', letterSpacing: '.28em', textTransform: 'uppercase', fontWeight: 600 }}>{t.kicker}</div>
          <div style={{ ...nameStyle, ...line(2), fontFamily: t.nameFont || 'var(--font-script)', fontSize: `${(t.nameScale || 1) * 14}cqw`, lineHeight: .95 }} className="flex flex-col items-center">
            <span>{t.names[0]}</span>{t.amp && <span style={{ fontSize: '.55em', opacity: .8 }}>{t.amp}</span>}<span>{t.names[1]}</span>
          </div>
          <div style={{ ...lp, ...line(3), fontStyle: 'italic', fontSize: '4.3cqw', lineHeight: 1.3 }}>{t.line}</div>
          <div style={{ ...lp, ...line(4), fontSize: '3.4cqw', letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 600 }}>{t.date}</div>
          <div style={{ ...lp, ...line(5), fontSize: '3.6cqw', letterSpacing: '.06em' }}>{t.venue}</div>
        </div>
        {/* satin ribbon */}
        {untie < 1 && <>
          {[['l', -1], ['r', 1]].map(([k, d]) => (
            <div key={k} className="absolute top-1/2 h-[12cqw] w-[51%] uv-sheen" style={{ [k === 'l' ? 'left' : 'right']: 0, background: ribbonGrad('180deg', t.c), boxShadow: '0 .8cqw 1.5cqw rgba(0,0,0,.22)', transform: `translate(${d * untie * 115}%,-50%)`, opacity: 1 - seg(untie, .6, 1) }} />
          ))}
          {[['t', -1], ['b', 1]].map(([k, d]) => (
            <div key={k} className="absolute left-1/2 w-[10cqw] h-[51%] uv-sheen" style={{ [k === 't' ? 'top' : 'bottom']: 0, background: ribbonGrad('90deg', t.c), boxShadow: '.8cqw 0 1.5cqw rgba(0,0,0,.18)', transform: `translate(-50%,${d * untie * 115}%)`, opacity: 1 - seg(untie, .6, 1) }} />
          ))}
          <div className="absolute left-1/2 top-1/2 w-[46cqw] h-[41cqw]" style={{ transform: `translate(-50%,-46%) scale(${1 - untie * .6}) rotate(${untie * 25}deg)`, opacity: 1 - untie * 1.4, filter: 'drop-shadow(0 1.5cqw 2cqw rgba(0,0,0,.28))' }}>
            <Bow t={t} />
          </div>
        </>}
      </div>

      {/* envelope front pocket */}
      <div className="absolute inset-0" style={{ ...paper(t.c.paper), zIndex: 3, clipPath: 'polygon(0 0,50% 47%,100% 0,100% 100%,0 100%)', transform: `translateY(${away * 105}%)`, opacity: 1 - away }}>
        <svg className="absolute inset-0 w-full h-full mix-blend-overlay" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={motif} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points="0,100 50,62 100,100" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" filter="url(#uv-blur)" />
          <polyline points="0,100.4 50,62.6 100,100.4" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3, opacity: 1 - flap * 2 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points="0,1 50,53.5 100,1" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="6" vectorEffect="non-scaling-stroke" filter="url(#uv-blur)" />
      </svg>

      {/* flap */}
      <div className="absolute inset-0" style={{ zIndex: 4, transformOrigin: '50% 0', transformStyle: 'preserve-3d', transform: `rotateX(${flap * 178}deg)`, opacity: 1 - seg(flap, .75, 1) }}>
        <div className="absolute inset-0" style={{ ...paper(t.c.paper, .26), clipPath: 'polygon(0 0,100% 0,50% 52%)', backfaceVisibility: 'hidden' }}>
          <svg className="absolute inset-0 w-full h-full mix-blend-overlay" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={motif} />
        </div>
        <div className="absolute inset-0" style={{ background: t.c.liner, clipPath: 'polygon(0 0,100% 0,50% 52%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} />
      </div>

      {/* wax seal */}
      <div className="absolute left-1/2 top-1/2 w-[30cqw] h-[30cqw]" style={{ zIndex: 7, transform: `translate(-50%,${-50 - seal * 40}%) scale(${1 + seal * .25}) rotate(${-seal * 14}deg)`, opacity: 1 - seal, filter: 'drop-shadow(0 1.5cqw 2.5cqw rgba(0,0,0,.35))' }}>
        <Seal t={t} />
      </div>
    </div>
  );
}
