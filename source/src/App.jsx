import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import InviteScene, { EmbossDefs, seg, clamp } from './InviteScene.jsx';
import { THEMES, OCCASIONS } from './themes.js';
import { useScrollProgress, usePageProgress, useInView, useTween, useCountUp, useNow, useTilt, useMagnet } from './hooks.js';

/* ------------------------------------------------------------------ */
/*  BUSINESS SETTINGS – edit these                                     */
/* ------------------------------------------------------------------ */
const BRAND = 'The Satin Seal';
const EMAIL = 'thesatinseal@gmail.com';
const SOCIALS = [['Instagram', 'https://www.instagram.com/thesatinseal/'], ['TikTok', 'https://www.tiktok.com/@thesatinseal'], ['Facebook', 'https://www.facebook.com/profile.php?id=61597002560660'], ['Pinterest', 'https://uk.pinterest.com/thesatinseal/']];
const ORDER_URL = '#pricing';            // ← swap for your Payhip / Etsy checkout link
const TURNAROUND = '3–5 working days';   // ← your real turnaround
const PLANS = [
  { name: 'Essential', price: 35, url: 'https://payhip.com/b/23orf', note: 'A collection design, made yours', features: ['Any design from the collection', 'Your names, wording & date', 'Live countdown, map & add-to-calendar', 'One private link to share anywhere', '2 rounds of changes'] },
  { name: 'Signature', price: 69, url: 'https://payhip.com/b/VJmTW', note: 'Our most loved', popular: true, features: ['Everything in Essential', 'RSVP with guest list', 'Your photos & a song as it opens', 'English + one more language', 'Matching Save the Date', '4 rounds of changes'] },
  { name: 'Bespoke', price: 149, url: 'https://payhip.com/b/nK0XB', note: 'Designed from scratch', features: ['Everything in Signature', 'Custom monogram wax seal', 'Colours matched to your outfits or décor', 'Every part of the day in one invite (ceremony, reception, after-party…)', 'Unlimited languages', 'Priority delivery'] },
];
const ADDONS = [['Express 48-hour delivery', '+£15'], ['Extra event or day', '+£20'], ['Custom monogram seal', '+£10'], ['Thank-you card after the event', '+£15']];
const FAQS = [
  ['What do my guests actually receive?', 'One private link. When they open it on their phone they break the wax seal, untie the ribbon and see your invitation, with the countdown, map, schedule and RSVP all inside.'],
  ['Do guests need to download anything?', 'No. It opens straight in their phone’s browser from WhatsApp, text, email or social media.'],
  ['Can one invite cover several events?', 'Yes. Ceremony and reception, a welcome dinner, a Christmas Eve party and Boxing Day, or a Mehndi, Nikah and Walima: each gets its own section with its own time and venue. Choose Bespoke and we’ll design the whole celebration as one invitation.'],
  ['Can it be in another language?', 'Yes. Signature includes a second language and Bespoke includes as many as you need, from Polish and Spanish to Urdu and Arabic, including right-to-left scripts.'],
  ['How do RSVPs work?', 'Guests reply inside the invitation, saying who’s coming and how many, and you receive every reply.'],
  ['How do I order?', `Choose your plan and check out securely. You'll instantly get a short guide telling you what to send us at ${EMAIL}: names, date, venue and wording. Questions first? Email us any time.`],
  ['How long does it take?', `You’ll get a private draft to approve within ${TURNAROUND}. Need it sooner? Add express delivery.`],
  ['Is it only for weddings?', 'Not at all: birthdays, Christmas, New Year, engagements, christenings, baby showers, anniversaries, Eid, Diwali and more. If you’re celebrating it, we can seal it.'],
];
const OCCASION_WORDS = ['Weddings', 'Christmas', 'Birthdays', 'Engagements', 'New Year', 'Christenings', 'Anniversaries', 'Baby showers', 'Eid', 'Diwali', 'Hen parties', 'Nikah', 'Graduations', 'Retirements'];
const PRICE_FROM = Math.min(...PLANS.map(p => p.price));

/* ------------------------------------------------------------------ */
const Logo = ({ light }) => (
  <a href="#top" className={`flex items-baseline gap-1.5 ${light ? 'text-ivory' : 'text-plum'}`} aria-label={BRAND}>
    <span className="text-[10px] font-semibold tracking-[.35em] uppercase">The</span>
    <span className="font-script text-3xl leading-none">Satin Seal</span>
  </a>
);

function Button({ href = ORDER_URL, children, variant = 'dark', className = '', ...rest }) {
  const m = useMagnet(.25);
  const base = 'group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors';
  const v = variant === 'dark' ? 'bg-plum text-ivory hover:bg-plum-2' : variant === 'gold' ? 'bg-gold text-plum hover:bg-gold-2' : 'border border-plum/25 text-plum hover:border-plum/60 bg-white/40 backdrop-blur';
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} {...m} {...rest} className={`${base} ${v} ${className}`}>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <span className="relative transition-transform group-hover:translate-x-1">→</span>
    </Tag>
  );
}

function Reveal({ children, delay = 0, className = '', as: Tag = 'div', y = 28 }) {
  const [ref, inView] = useInView({ threshold: .15 });
  return (
    <Tag ref={ref} className={`transition-all duration-[1000ms] ease-[cubic-bezier(.2,.7,.2,1)] ${className}`} style={{ transitionDelay: `${delay}ms`, opacity: inView ? 1 : 0, transform: inView ? 'none' : `translateY(${y}px)`, filter: inView ? 'none' : 'blur(6px)' }}>
      {children}
    </Tag>
  );
}

/** Splits a heading into words that rise into place one by one. */
function SplitText({ text, className = '', delay = 0, play = true }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[.12em] align-bottom" aria-hidden="true">
          <span className="inline-block transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: play ? 'none' : 'translateY(110%)', transitionDelay: `${delay + i * 70}ms` }}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}

const Phone = ({ children, className = '' }) => (
  <div className={`relative rounded-[2.6rem] bg-[#1c1418] p-[10px] shadow-[0_40px_80px_-20px_rgba(58,29,42,.55),inset_0_0_0_1.5px_rgba(255,255,255,.12)] ${className}`}>
    <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-black">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const on = () => setScrolled(scrollY > 30); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  const links = [['Collection', '#collection'], ['Features', '#features'], ['How it works', '#how'], ['Pricing', '#pricing'], ['FAQ', '#faq']];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-500 ${scrolled ? 'mx-3 bg-ivory/75 py-2 shadow-[0_8px_30px_-12px_rgba(58,29,42,.35)] backdrop-blur-xl md:mx-auto' : 'py-2'}`}>
        <Logo />
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="group relative text-sm font-medium text-plum/80 hover:text-plum">
              {l}<span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-plum transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
        <a href={ORDER_URL} className="hidden rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-ivory transition hover:scale-105 md:inline-block">Start your invite</a>
        <button className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>
          <span className={`h-px w-6 bg-plum transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-plum transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </nav>
      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ivory/95 backdrop-blur-xl transition-all duration-500 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        {links.map(([l, h], i) => (
          <a key={h} href={h} onClick={() => setOpen(false)} className="font-serif text-4xl text-plum transition-all duration-500" style={{ transitionDelay: `${open ? i * 60 : 0}ms`, transform: open ? 'none' : 'translateY(20px)', opacity: open ? 1 : 0 }}>{l}</a>
        ))}
        <Button className="mt-4" onClick={() => setOpen(false)}>Start your invite</Button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
const STEPS = [
  { n: '', kicker: 'Interactive digital invitations', title: 'Invitations worth opening.', body: 'Not a PDF. Not a flat e-card. A keepsake your guests open on their phone, with a wax seal, a satin bow and every detail they need.' },
  { n: '01', kicker: 'The first touch', title: 'Break the seal.', body: 'Guests tap the wax seal and the envelope opens, flap and all, just like the real thing.' },
  { n: '02', kicker: 'The anticipation', title: 'Untie the ribbon.', body: 'A satin bow slips loose and the card rises from the envelope.' },
  { n: '03', kicker: 'The reveal', title: 'Reveal the moment.', body: 'Your names, date and story, embossed, foiled and animated in your colours.' },
  { n: '04', kicker: 'For every celebration', title: 'One link. Every occasion.', body: 'Weddings, birthdays, Christmas, New Year and more, sent by WhatsApp in a single tap.' },
];
const CHIPS = [
  { t: 'Live countdown', i: '⏳', x: '-58%', y: '14%' }, { t: 'RSVP in one tap', i: '✓', x: '72%', y: '26%' },
  { t: 'Google Maps', i: '⌖', x: '-62%', y: '58%' }, { t: 'Your song plays', i: '♫', x: '70%', y: '66%' }, { t: 'Add to calendar', i: '◷', x: '-40%', y: '86%' },
];

function Hero() {
  const ref = useRef(null);
  const prog = useScrollProgress(ref);
  const p = useTween(prog, .18);
  const step = p < .14 ? 0 : p < .34 ? 1 : p < .56 ? 2 : p < .8 ? 3 : 4;
  const sceneP = seg(p, .1, .8);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (step !== 4) { setCycle(0); return; }
    const i = setInterval(() => setCycle(c => (c + 1) % THEMES.length), 1700);
    return () => clearInterval(i);
  }, [step]);
  const chipK = seg(p, .74, .92);
  const s = STEPS[step];

  return (
    <section id="top" ref={ref} className="relative h-[520vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <Petals />
        <div className="mx-auto grid w-full max-w-6xl grid-rows-[1fr_auto] items-center gap-4 px-5 pt-20 pb-6 md:grid-cols-[1.05fr_.95fr] md:grid-rows-1 md:gap-10 md:pb-0">
          {/* copy */}
          <div className="relative order-2 md:order-1">
            <div className="absolute -left-2 top-1 hidden flex-col gap-3 lg:-left-14 lg:flex">
              {STEPS.slice(1).map((x, i) => (
                <div key={x.n} className="flex items-center gap-2">
                  <span className={`h-px transition-all duration-500 ${step === i + 1 ? 'w-8 bg-plum' : 'w-3 bg-plum/30'}`} />
                  <span className={`text-[10px] font-semibold tracking-widest transition-colors ${step === i + 1 ? 'text-plum' : 'text-plum/30'}`}>{x.n}</span>
                </div>
              ))}
            </div>
            <div key={step} className="uv-step">
              <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.3em] text-mauve">
                {s.n && <span className="font-serif text-3xl font-normal tracking-normal text-gold">{s.n}.</span>}{s.kicker}
              </div>
              <h1 className="font-serif text-[clamp(2.4rem,7.5vw,5.4rem)] font-medium leading-[.95] tracking-tight text-plum">
                <SplitText text={s.title} />
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-plum/70 md:mt-6 md:text-lg">{s.body}</p>
            </div>
            <div className={`mt-6 flex flex-wrap items-center gap-3 transition-opacity duration-500 md:mt-8 ${step === 0 || step === 4 ? 'opacity-100' : 'pointer-events-none opacity-0 md:opacity-30'}`}>
              <Button href="#collection">Explore designs</Button>
              <span className="text-sm text-plum/60">From <b className="text-plum">£{PRICE_FROM}</b></span>
            </div>
            <div className={`mt-6 hidden items-center gap-2 text-xs uppercase tracking-[.3em] text-plum/50 transition-opacity md:flex ${step === 0 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="uv-scrollmouse" /> Scroll to open
            </div>
          </div>

          {/* phone */}
          <div className="relative order-1 flex h-[52svh] items-center justify-center md:order-2 md:h-[78svh]">
            <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(195,155,85,.35),transparent_65%)] blur-2xl" style={{ transform: `scale(${1 + sceneP * .3})` }} />
            <div className="relative aspect-[9/19.5] h-full">
              <Phone className="h-full w-full">
                {step === 4 ? (
                  <div key={cycle} className="uv-fade absolute inset-0"><InviteScene theme={THEMES[cycle]} p={1} className="absolute inset-0" /></div>
                ) : (
                  <InviteScene theme={THEMES[0]} p={sceneP} className="absolute inset-0" />
                )}
              </Phone>
              {CHIPS.map((c, i) => {
                const k = clamp(chipK * 2.2 - i * .3);
                return (
                  <div key={c.t} className="absolute left-0 z-10 hidden whitespace-nowrap rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-semibold text-plum shadow-[0_10px_30px_-10px_rgba(58,29,42,.4)] backdrop-blur-md sm:flex sm:items-center sm:gap-2"
                    style={{ top: c.y, transform: `translateX(${c.x}) translateY(${(1 - k) * 20}px) scale(${.8 + k * .2})`, opacity: k, animation: k >= 1 ? `uv-float 4s ${i * .4}s ease-in-out infinite` : 'none' }}>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-plum text-[10px] text-ivory">{c.i}</span>{c.t}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold to-mauve" style={{ width: `${p * 100}%` }} />
      </div>
    </section>
  );
}

function Petals() {
  const items = useRef(Array.from({ length: 14 }, (_, i) => ({ l: (i * 37) % 100, d: 9 + (i % 5) * 2.5, s: 6 + (i % 4) * 3, dl: -(i * 1.7), r: i % 2 ? 1 : -1 }))).current;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((x, i) => (
        <span key={i} className="absolute -top-8 rounded-[60%_0_60%_0] bg-gradient-to-br from-blush to-mauve/60 opacity-60"
          style={{ left: `${x.l}%`, width: x.s, height: x.s * 1.4, animation: `uv-fall ${x.d}s ${x.dl}s linear infinite`, '--r': x.r }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Marquee() {
  const row = (rev) => (
    <div className={`flex w-max ${rev ? 'animate-marquee-rev' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
      {[0, 1].map(k => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {OCCASION_WORDS.map(w => (
            <span key={w} className="flex items-center font-serif text-4xl italic text-plum/85 md:text-6xl">
              <span className="px-6 transition-colors hover:text-gold md:px-10">{w}</span><span className="text-xl not-italic text-gold">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <section className="relative overflow-hidden border-y border-plum/10 bg-blush/50 py-8 md:py-12" aria-label="Occasions we design for">
      {row(false)}
      <div className="mt-4 opacity-50">{row(true)}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function SectionHead({ kicker, title, sub, light }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <div className={`mb-4 text-[11px] font-semibold uppercase tracking-[.35em] ${light ? 'text-gold' : 'text-mauve'}`}>{kicker}</div>
      <h2 className={`font-serif text-[clamp(2.2rem,6vw,4rem)] font-medium leading-[1] ${light ? 'text-ivory' : 'text-plum'}`}><SplitText text={title} play={inView} /></h2>
      {sub && <p className={`mt-5 text-base leading-relaxed md:text-lg ${light ? 'text-ivory/70' : 'text-plum/65'}`} style={{ opacity: inView ? 1 : 0, transition: 'opacity 1s .4s' }}>{sub}</p>}
    </div>
  );
}

function DesignCard({ t, i, onOpen }) {
  const [hover, setHover] = useState(false);
  const p = useTween(hover ? .24 : 0, .1);
  const tilt = useTilt(6);
  return (
    <div className="uv-pop" style={{ animationDelay: `${i * 70}ms` }}>
      <button onClick={() => onOpen(t)} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); tilt.onPointerLeave(); }} onPointerMove={tilt.onPointerMove}
        className="group block w-full text-left transition-transform duration-300 will-change-transform" style={tilt.style} aria-label={`Open live demo of ${t.name}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_20px_50px_-25px_rgba(58,29,42,.6)]" style={{ background: t.c.bg }}>
          <InviteScene theme={t} p={p} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.35),transparent 50%)' }} />
          {t.tag && <span className="absolute left-3 top-3 z-10 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-plum backdrop-blur">{t.tag}</span>}
          <span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 translate-y-3 whitespace-nowrap rounded-full bg-plum/90 px-4 py-2 text-xs font-semibold text-ivory opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">Try the live demo ↗</span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3 px-1">
          <div>
            <div className="font-serif text-2xl text-plum">{t.name}</div>
            <div className="text-sm text-plum/60">{t.blurb}</div>
          </div>
          <span className="shrink-0 rounded-full border border-plum/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-mauve">{t.occasion}</span>
        </div>
      </button>
    </div>
  );
}

function Collection({ onOpen }) {
  const [f, setF] = useState('All');
  const tabs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => { const el = tabs.current[f]; if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth }); }, [f]);
  useEffect(() => { const on = () => { const el = tabs.current[f]; if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth }); }; addEventListener('resize', on); return () => removeEventListener('resize', on); }, [f]);
  const list = THEMES.filter(t => f === 'All' || t.occasion === f);
  return (
    <section id="collection" className="relative px-5 py-24 md:py-32">
      <SectionHead kicker="The collection" title="Designs worth opening" sub="Hover to peek inside, then tap any design to open the live demo, exactly as your guests will." />
      <div className="-mx-5 mb-12 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        <div className="relative mx-auto flex w-max gap-1 rounded-full bg-white/60 p-1.5 shadow-inner backdrop-blur">
          <span className="absolute top-1.5 bottom-1.5 rounded-full bg-plum shadow-lg transition-all duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]" style={pill} />
          {OCCASIONS.map(o => (
            <button key={o} ref={el => (tabs.current[o] = el)} onClick={() => setF(o)} className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${f === o ? 'text-ivory' : 'text-plum/70 hover:text-plum'}`}>{o}</button>
          ))}
        </div>
      </div>
      <div key={f} className="mx-auto grid max-w-6xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((t, i) => <DesignCard key={t.id} t={t} i={i} onOpen={onOpen} />)}
      </div>
      <Reveal className="mt-14 text-center text-plum/60">Don’t see your occasion? <a href="#pricing" className="font-semibold text-plum underline decoration-gold decoration-2 underline-offset-4">Go Bespoke</a> and we’ll design one from scratch.</Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function DemoModal({ theme, onClose }) {
  const [t, setT] = useState(theme);
  const [stage, setStage] = useState(0);
  const p = useTween([0, .57, 1][stage], .06);
  const idx = THEMES.findIndex(x => x.id === t.id);
  useEffect(() => {
    const on = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    addEventListener('keydown', on); document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', on); document.body.style.overflow = ''; };
  });
  const go = d => { setT(THEMES[(idx + d + THEMES.length) % THEMES.length]); setStage(0); };
  const hint = ['Tap the seal', 'Untie the ribbon', ''][stage];
  return (
    <div className="uv-modal fixed inset-0 z-[60] flex overflow-y-auto bg-plum/60 p-4 pt-16 backdrop-blur-md md:pt-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${t.name} live demo`}>
      <div className="relative m-auto flex w-full max-w-4xl flex-col items-center gap-5 md:flex-row md:justify-center md:gap-12" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[9/19.5] h-[min(50svh,520px)] md:h-[min(72svh,640px)]">
          <Phone className="h-full w-full">
            <button className="absolute inset-0 cursor-pointer" onClick={() => setStage(s => Math.min(2, s + 1))} aria-label={hint || 'Invitation'}>
              <InviteScene theme={t} p={p} className="absolute inset-0" />
              {hint && <span className="absolute inset-x-0 bottom-[12%] z-20 animate-pulse text-center font-script text-3xl" style={{ color: stage === 0 ? '#fff' : t.c.ink, textShadow: '0 1px 6px rgba(0,0,0,.35)' }}>{hint}</span>}
            </button>
          </Phone>
        </div>
        <div className="max-w-xs text-center text-ivory md:text-left">
          <div className="text-[11px] font-semibold uppercase tracking-[.3em] text-gold">{t.occasion} · Live demo</div>
          <div className="mt-1 font-serif text-4xl md:text-5xl">{t.name}</div>
          <p className="mt-3 hidden text-ivory/75 sm:block">{t.blurb}. Every detail can be changed to suit you.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 md:mt-6 md:justify-start">
            <Button variant="gold" onClick={onClose}>Choose this design</Button>
            <button onClick={() => setStage(0)} className="rounded-full border border-ivory/30 px-5 py-3 text-sm font-semibold hover:bg-ivory/10">↺ Replay</button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
            <button onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 transition hover:bg-ivory hover:text-plum" aria-label="Previous design">←</button>
            <span className="text-sm text-ivory/60">{idx + 1} / {THEMES.length}</span>
            <button onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 transition hover:bg-ivory hover:text-plum" aria-label="Next design">→</button>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ivory/15 text-xl text-ivory hover:bg-ivory/30" aria-label="Close">✕</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Tile({ children, className = '', delay = 0, dark }) {
  const tilt = useTilt(4);
  return (
    <Reveal delay={delay} className={className}>
      <div {...tilt} className={`group relative h-full overflow-hidden rounded-3xl p-7 transition-transform duration-300 ${dark ? 'bg-plum text-ivory' : 'border border-plum/10 bg-white/55 text-plum backdrop-blur'}`}>
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--mx,50%) var(--my,50%),rgba(195,155,85,.18),transparent 60%)' }} />
        <div className="relative h-full">{children}</div>
      </div>
    </Reveal>
  );
}
const TileHead = ({ t, s }) => (<><h3 className="font-serif text-3xl">{t}</h3><p className="mt-1 text-sm opacity-65">{s}</p></>);

function Countdown() {
  const now = useNow();
  const d = Math.max(0, new Date('2027-06-12T13:00:00') - now) / 1000;
  const parts = [['Days', Math.floor(d / 86400)], ['Hrs', Math.floor(d % 86400 / 3600)], ['Min', Math.floor(d % 3600 / 60)], ['Sec', Math.floor(d % 60)]];
  return (
    <div className="mt-6 grid grid-cols-4 gap-2">
      {parts.map(([l, v]) => (
        <div key={l} className="rounded-2xl bg-ivory/10 py-3 text-center ring-1 ring-ivory/15">
          <div key={v} className="uv-flip font-serif text-3xl tabular-nums md:text-4xl">{String(v).padStart(2, '0')}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-60">{l}</div>
        </div>
      ))}
    </div>
  );
}

function RSVPDemo() {
  const [ref, inView] = useInView({ threshold: .4 });
  const n = useCountUp(128, inView, 1800);
  const guests = [['Amira K.', 'Attending · 2'], ['Daniel & Sofia', 'Attending · 2'], ['Uncle Tariq', 'Attending · 5'], ['Priya S.', 'Can’t make it']];
  return (
    <div ref={ref} className="mt-5">
      <div className="mb-3 flex items-baseline gap-2"><span className="font-serif text-5xl tabular-nums">{n}</span><span className="text-sm opacity-60">guests attending</span></div>
      <ul className="space-y-2">
        {guests.map(([g, s], i) => (
          <li key={g} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm shadow-sm transition-all duration-700" style={{ transitionDelay: `${300 + i * 250}ms`, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-20px)' }}>
            <span className="font-medium">{g}</span><span className={`text-xs ${s.startsWith('Can') ? 'text-mauve' : 'text-emerald-700'}`}>{s.startsWith('Can') ? '✕' : '✓'} {s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MapDemo() {
  const [ref, inView] = useInView({ threshold: .4 });
  return (
    <div ref={ref} className="relative mt-5 h-40 overflow-hidden rounded-2xl bg-[#efe6dc]">
      <svg viewBox="0 0 300 160" className="absolute inset-0 h-full w-full">
        <g stroke="#fff" strokeWidth="9" fill="none"><path d="M-10 120 L120 90 L310 110" /><path d="M60 -10 L90 170" /><path d="M200 -10 L180 170" /></g>
        <g stroke="#e3d6c8" strokeWidth="3" fill="none"><path d="M-10 40 L310 55" /><path d="M140 -10 L130 170" /></g>
        <rect x="210" y="18" width="60" height="30" rx="6" fill="#cfe0c8" />
        <path d="M40 140 C80 120 100 70 150 75 S210 60 232 48" fill="none" stroke="#3a1d2a" strokeWidth="3" strokeDasharray="6 6" className={inView ? 'uv-dash' : ''} style={{ strokeDashoffset: inView ? undefined : 300 }} />
        <circle cx="40" cy="140" r="6" fill="#a67c86" />
      </svg>
      <div className={`absolute left-[75%] top-[12%] text-3xl ${inView ? 'uv-pin' : 'opacity-0'}`}>📍</div>
    </div>
  );
}

function Equaliser() {
  return (
    <div className="mt-6 flex h-16 items-end gap-1.5">
      {Array.from({ length: 18 }, (_, i) => <span key={i} className="w-full rounded-full bg-gradient-to-t from-gold to-blush" style={{ animation: `uv-eq ${.7 + (i % 5) * .17}s ${i * .07}s ease-in-out infinite alternate`, height: '30%' }} />)}
    </div>
  );
}

function Languages() {
  const words = [['You’re invited', 'ltr', 'font-serif'], ['Jesteś zaproszony', 'ltr', 'font-serif'], ['Estás invitado', 'ltr', 'font-serif'], ['آپ مدعو ہیں', 'rtl', 'font-arabic'], ['Vous êtes invité', 'ltr', 'font-serif']];
  const now = useNow(1800);
  const i = Math.floor(now / 1800) % words.length;
  const [w, dir, f] = words[i];
  return <div className="mt-6 flex h-16 items-center"><span key={i} dir={dir} className={`uv-swap ${f} text-4xl`}>{w}</span></div>;
}

function ShareDemo() {
  const [ref, inView] = useInView({ threshold: .5 });
  const slug = '/aisha-and-zayn';
  const [n, setN] = useState(0);
  useEffect(() => { if (!inView) return; let k = 0; const i = setInterval(() => { k++; setN(k); if (k >= slug.length) clearInterval(i); }, 70); return () => clearInterval(i); }, [inView]);
  return (
    <div ref={ref} className="mt-6">
      <div className="flex items-center gap-2 rounded-full bg-ivory/10 px-4 py-3 font-mono text-sm ring-1 ring-ivory/20">
        <span className="opacity-50">🔒 your-link</span><span>{slug.slice(0, n)}</span><span className="uv-caret h-4 w-px bg-ivory" />
      </div>
      <div className="mt-4 flex gap-2">
        {['WhatsApp', 'Text', 'Email', 'Instagram'].map((s, i) => (
          <span key={s} className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-plum transition-all duration-500" style={{ transitionDelay: `${1300 + i * 120}ms`, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(10px) scale(.8)' }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="relative px-5 py-24 md:py-32">
      <SectionHead kicker="Inside every invite" title="More than a pretty card" sub="Everything your guests need, beautifully packed into one link." />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3 md:grid-rows-2">
        <Tile dark className="md:col-span-2"><TileHead t="A live countdown" s="Ticking down to the big day, every time they open it." /><Countdown /></Tile>
        <Tile delay={100} className="md:row-span-2"><TileHead t="RSVPs, sorted" s="Guests reply inside the invite. You see who’s coming at a glance." /><RSVPDemo /></Tile>
        <Tile delay={150}><TileHead t="Map & calendar" s="Directions and add-to-calendar in one tap." /><MapDemo /></Tile>
        <Tile delay={200}><TileHead t="Your song" s="Music that starts as the envelope opens." /><Equaliser /></Tile>
      </div>
      <div className="mx-auto mt-5 grid max-w-6xl gap-5 md:grid-cols-2">
        <Tile delay={100}><TileHead t="In their language" s="English, Polish, Spanish, Urdu and more, including right-to-left scripts." /><Languages /></Tile>
        <Tile delay={200} dark><TileHead t="One private link" s="Send it anywhere. No app, no printing, no postage." /><ShareDemo /></Tile>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function How() {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const steps = [
    ['Pick your design', 'Browse the collection and open any live demo. Choose your favourite and your plan.'],
    ['Send your details', 'Names, date, venue, wording and photos. Add a song or extra events if you like.'],
    ['Approve your draft', `We send a private preview within ${TURNAROUND}. Ask for changes until it’s perfect.`],
    ['Share & celebrate', 'Send your link on WhatsApp, text or email, and watch the replies roll in.'],
  ];
  return (
    <section id="how" ref={ref} className="relative bg-plum px-5 py-24 text-ivory md:py-32">
      <div className="absolute inset-0 opacity-[.07] [background-image:radial-gradient(#c39b55_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative">
        <SectionHead light kicker="How it works" title="From idea to inbox" sub="Done for you, start to finish. No design skills needed." />
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-ivory/15" />
          <div className="absolute left-[27px] top-2 w-px bg-gradient-to-b from-gold to-blush" style={{ height: `${clamp(p * 1.6 - .2) * 100}%` }} />
          {steps.map(([t, s], i) => {
            const on = p * 1.6 - .2 > i / steps.length;
            return (
              <Reveal key={t} delay={i * 80} className="relative flex gap-6 pb-12 last:pb-0">
                <span className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full font-serif text-2xl transition-all duration-500 ${on ? 'scale-110 bg-gold text-plum shadow-[0_0_30px_rgba(195,155,85,.6)]' : 'bg-plum-2 text-ivory/60 ring-1 ring-ivory/20'}`}>{i + 1}</span>
                <div className="pt-2"><h3 className="font-serif text-3xl">{t}</h3><p className="mt-2 text-ivory/65">{s}</p></div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function PlanCard({ plan, i }) {
  const tilt = useTilt(5);
  return (
    <Reveal delay={i * 120} className={plan.popular ? 'md:-mt-6' : ''}>
      <div {...tilt} className={`group relative h-full rounded-[2rem] p-[1.5px] transition-transform duration-300 ${plan.popular ? 'uv-border' : 'bg-plum/10'}`}>
        <div className={`relative flex h-full flex-col rounded-[calc(2rem-1.5px)] p-8 ${plan.popular ? 'bg-plum text-ivory' : 'bg-ivory text-plum'}`}>
          {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-plum">Most popular</span>}
          <div className="font-serif text-3xl">{plan.name}</div>
          <div className="text-sm opacity-60">{plan.note}</div>
          <div className="my-6 flex items-baseline gap-1"><span className="font-serif text-6xl">£{plan.price}</span><span className="text-sm opacity-60">one-off</span></div>
          <ul className="mb-8 space-y-3 text-sm">
            {plan.features.map(f => <li key={f} className="flex gap-3"><span className={plan.popular ? 'text-gold' : 'text-mauve'}>✦</span>{f}</li>)}
          </ul>
          <Button href={plan.url} variant={plan.popular ? 'gold' : 'dark'} className="mt-auto justify-center">Choose {plan.name}</Button>
        </div>
      </div>
    </Reveal>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="relative px-5 py-24 md:py-32">
      <SectionHead kicker="Pricing" title="One price. No subscriptions." sub="Pay once per celebration. Your link stays live for all your guests." />
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 md:grid-cols-3">{PLANS.map((p, i) => <PlanCard key={p.name} plan={p} i={i} />)}</div>
      <Reveal className="mx-auto mt-14 max-w-3xl rounded-3xl border border-plum/10 bg-white/50 p-6 backdrop-blur md:p-8">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[.3em] text-mauve">Add-ons</div>
        <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {ADDONS.map(([a, p]) => <div key={a} className="flex justify-between border-b border-dashed border-plum/15 pb-2 text-plum"><span>{a}</span><span className="font-semibold">{p}</span></div>)}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="px-5 py-24 md:py-32">
      <SectionHead kicker="Questions" title="Good to know" />
      <div className="mx-auto max-w-3xl">
        {FAQS.map(([q, a], i) => (
          <Reveal key={q} delay={i * 50} className="border-b border-plum/15">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i}>
              <span className="font-serif text-2xl text-plum md:text-3xl">{q}</span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-plum/20 text-plum transition-transform duration-500 ${open === i ? 'rotate-45 bg-plum text-ivory' : ''}`}>+</span>
            </button>
            <div className={`grid transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden"><p className="pb-6 pr-12 leading-relaxed text-plum/70">{a}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-28 text-center md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,155,85,.25),transparent_60%)]" />
      <Petals />
      <div className="relative">
        <div className="mx-auto mb-6 h-24 w-24 animate-[uv-float_5s_ease-in-out_infinite]">
          <svg viewBox="0 0 120 120"><defs><radialGradient id="ctaS" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#a68389" /><stop offset=".7" stopColor="#6f5157" /></radialGradient></defs><circle cx="60" cy="60" r="54" fill="url(#ctaS)" /><circle cx="60" cy="60" r="40" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="3" /><text x="60" y="74" textAnchor="middle" fontFamily="Pinyon Script, cursive" fontSize="40" fill="rgba(255,255,255,.4)">TS</text></svg>
        </div>
        <h2 className="mx-auto max-w-3xl font-serif text-[clamp(2.6rem,8vw,6rem)] font-medium leading-[.95] text-plum"><SplitText text="Ready to break the seal?" play={inView} /></h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-plum/65">Choose a design today and we’ll have your private draft with you in {TURNAROUND}.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3"><Button>Start your invite</Button><Button href="#collection" variant="ghost">See the collection</Button></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-plum px-5 pb-10 pt-16 text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div><Logo light /><p className="mt-4 max-w-xs text-sm text-ivory/60">Interactive digital invitations for every celebration, designed by hand in the UK.</p></div>
        <div className="text-sm"><div className="mb-3 text-[11px] uppercase tracking-[.3em] text-gold">Explore</div>{[['Collection', '#collection'], ['Features', '#features'], ['Pricing', '#pricing'], ['FAQ', '#faq']].map(([l, h]) => <a key={h} href={h} className="block py-1 text-ivory/70 hover:text-ivory">{l}</a>)}</div>
        <div className="text-sm"><div className="mb-3 text-[11px] uppercase tracking-[.3em] text-gold">Follow</div>{SOCIALS.map(([s, h]) => <a key={s} href={h} target="_blank" rel="noopener" className="block py-1 text-ivory/70 hover:text-ivory">{s}</a>)}<a href={`mailto:${EMAIL}`} className="mt-2 block py-1 text-ivory/70 hover:text-ivory">{EMAIL}</a></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-wrap justify-between gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/45"><span>© 2026 {BRAND} · Bolton, UK</span><span>Invitations worth opening.</span></div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
function CursorGlow() {
  const [pos, setPos] = useState(null);
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const on = e => setPos([e.clientX, e.clientY]);
    addEventListener('pointermove', on); return () => removeEventListener('pointermove', on);
  }, []);
  if (!pos) return null;
  return <div className="pointer-events-none fixed inset-0 z-30 mix-blend-soft-light" style={{ background: `radial-gradient(500px circle at ${pos[0]}px ${pos[1]}px,rgba(195,155,85,.35),transparent 60%)` }} />;
}

export default function App() {
  const [demo, setDemo] = useState(null);
  const page = usePageProgress();
  return (
    <div className="relative min-h-screen bg-ivory font-sans text-plum antialiased selection:bg-gold/40">
      <EmbossDefs />
      <div className="fixed left-0 top-0 z-[70] h-[3px] bg-gradient-to-r from-mauve via-gold to-mauve" style={{ width: `${page * 100}%` }} />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Collection onOpen={setDemo} />
        <Features />
        <How />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      {demo && <DemoModal theme={demo} onClose={() => setDemo(null)} />}
    </div>
  );
}
