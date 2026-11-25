import React, { useEffect, useState } from 'react';

// ★ Black Friday 2026. Everything promo-related switches itself off after END.
export const PROMO = {
  start: new Date('2026-11-25T00:00:00Z'),
  end: new Date('2026-11-30T23:59:59Z'), // UK time = GMT in November
  code: 'BLACKFRIDAY',
  freePlan: 'Essential',
  freeCount: 20,
  salePct: 30,
  salePlans: ['Signature', 'Bespoke'],
};
export const promoOn = (now = Date.now()) => now >= PROMO.start && now <= PROMO.end;
export const salePrice = (plan, price) => {
  if (!promoOn()) return null;
  if (plan === PROMO.freePlan) return 0;
  if (PROMO.salePlans.includes(plan)) return Math.round(price * (100 - PROMO.salePct)) / 100;
  return null;
};
export const fmt = n => (n % 1 ? n.toFixed(2) : String(n));

export function usePromoClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const ms = Math.max(0, PROMO.end - now), s = Math.floor(ms / 1000);
  return { on: promoOn(now), d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
}

export function CopyCode({ className = '', dark }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(PROMO.code); setOk(true); setTimeout(() => setOk(false), 1800); } catch (e) {} }}
      className={`inline-flex items-center gap-2 rounded-full border border-dashed px-3 py-1 font-mono text-[12px] font-bold tracking-widest transition ${dark ? 'border-gold/70 text-gold hover:bg-gold/10' : 'border-plum/40 text-plum hover:bg-plum/5'} ${className}`}
      aria-label={`Copy code ${PROMO.code}`}>
      {PROMO.code}<span className="font-sans text-[10px] font-semibold tracking-normal opacity-70">{ok ? 'Copied ✓' : 'Copy'}</span>
    </button>
  );
}

const two = n => String(n).padStart(2, '0');
export function PromoBar() {
  const t = usePromoClock();
  const [hide, setHide] = useState(() => { try { return sessionStorage.getItem('tss-bf') === '1'; } catch (e) { return false; } });
  if (!t.on || hide) return null;
  return (
    <div className="relative z-[60] bg-[#140c10] text-ivory">
      <div className="uv-bf-shine pointer-events-none absolute inset-0" />
      <a href="#black-friday" className="relative flex items-center justify-center gap-2 px-10 py-2 text-center text-[12px] sm:hidden">
        <span className="whitespace-nowrap"><b className="text-gold">BLACK FRIDAY</b> · {PROMO.freeCount} invites <b className="text-gold">FREE</b> · {t.d}d {two(t.h)}h left →</span>
      </a>
      <div className="relative mx-auto hidden max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-10 py-2.5 text-center text-[13px] sm:flex">
        <span className="font-semibold uppercase tracking-[.25em] text-gold">Black Friday</span>
        <span>First {PROMO.freeCount} {PROMO.freePlan} invites <b className="text-gold">FREE</b> · {PROMO.salePct}% off {PROMO.salePlans.join(' & ')}</span>
        <CopyCode dark />
        <span className="font-mono tabular-nums text-ivory/75" aria-label="Time left">{t.d}d {two(t.h)}:{two(t.m)}:{two(t.s)}</span>
        <a href="#pricing" className="font-semibold underline decoration-gold underline-offset-4">Claim yours →</a>
      </div>
      <button onClick={() => { setHide(true); try { sessionStorage.setItem('tss-bf', '1'); } catch (e) {} }} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ivory/60 hover:text-ivory" aria-label="Hide offer">✕</button>
    </div>
  );
}

export function PromoPanel() {
  const t = usePromoClock();
  if (!t.on) return null;
  const box = (v, l) => <div className="min-w-[64px] rounded-2xl bg-ivory/10 px-3 py-2 text-center ring-1 ring-gold/30"><div className="font-serif text-4xl tabular-nums text-gold">{two(v)}</div><div className="text-[10px] uppercase tracking-widest text-ivory/60">{l}</div></div>;
  return (
    <section id="black-friday" className="relative overflow-hidden bg-[#140c10] px-5 py-16 text-ivory md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[.08] [background-image:radial-gradient(#c39b55_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[.35em] text-gold">Black Friday · until Mon 30 Nov</div>
          <h2 className="mt-3 font-serif text-[clamp(2.6rem,7vw,4.6rem)] leading-[.95]">Your invitation,<br /><span className="italic text-gold">on us.</span></h2>
          <p className="mt-5 max-w-md text-ivory/75">The first {PROMO.freeCount} people get an {PROMO.freePlan} interactive invitation completely free, for any celebration. Want photos, RSVP or a fully bespoke design? {PROMO.salePlans.join(' and ')} are {PROMO.salePct}% off, no code needed.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="https://payhip.com/b/23orf" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-plum transition hover:scale-105">Claim a free invite →</a>
            <span className="text-sm text-ivory/60">use code</span><CopyCode dark />
          </div>
          <p className="mt-3 text-xs text-ivory/45">Enter the code at Payhip checkout. Free while the {PROMO.freeCount} codes last or until 11:59pm Mon 30 Nov 2026 (UK).</p>
        </div>
        <div className="justify-self-center text-center">
          <div className="mb-3 text-[11px] uppercase tracking-[.3em] text-ivory/55">Offer ends in</div>
          <div className="flex gap-2">{box(t.d, 'Days')}{box(t.h, 'Hrs')}{box(t.m, 'Min')}{box(t.s, 'Sec')}</div>
          <a href="#design" className="mt-5 inline-block text-sm font-semibold text-gold underline underline-offset-4">Design yours first →</a>
        </div>
      </div>
    </section>
  );
}
