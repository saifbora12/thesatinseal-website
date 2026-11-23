import React, { useEffect, useMemo, useState } from 'react';
import InviteScene from './InviteScene.jsx';
import { derive, PALETTES } from './colours.js';
import { useTween } from './hooks.js';

const EMAIL = 'thesatinseal@gmail.com';
const PLAN_LINKS = [['Essential', 35, 'https://payhip.com/b/23orf'], ['Signature', 69, 'https://payhip.com/b/VJmTW'], ['Bespoke', 149, 'https://payhip.com/b/nK0XB']];

const FONTS = [
  ['Pinyon Script', "'Pinyon Script', cursive", 1],
  ['Great Vibes', "'Great Vibes', cursive", 1],
  ['Parisienne', "'Parisienne', cursive", .85],
  ['Cormorant', "'Cormorant Garamond', serif", .8],
  ['Playfair', "'Playfair Display', serif", .7],
];
const MOTIFS = [['leaves', 'Ginkgo & roses'], ['islamic', 'Geometric stars'], ['stars', 'Starlight'], ['snow', 'Snowflakes'], ['balloons', 'Balloons'], ['clouds', 'Clouds'], ['diya', 'Diyas'], ['none', 'Plain']];
const FX = [['petals', 'Petals'], ['confetti', 'Confetti'], ['stars', 'Gold stars'], ['fireworks', 'Fireworks'], ['none', 'None']];

const OCCASIONS = {
  Wedding: { kicker: 'Together with their families', n1: 'Emily', amp: '&', n2: 'James', line: 'request the pleasure of your company at their wedding', motif: 'leaves', fx: 'petals', mono: 'E&J', pal: 0 },
  Engagement: { kicker: 'She said yes!', n1: 'Sophie', amp: '&', n2: 'Daniel', line: 'invite you to celebrate their engagement', motif: 'leaves', fx: 'confetti', mono: 'S&D', pal: 11 },
  Birthday: { kicker: 'You’re invited to', n1: 'Maya’s', amp: '', n2: '30th', line: 'Cake, music & dancing — come celebrate with me!', motif: 'balloons', fx: 'confetti', mono: '30', pal: 3 },
  Christmas: { kicker: 'Merry Christmas', n1: 'Christmas', amp: '', n2: 'at the Taylors’', line: 'Turkey, crackers & carols, come and join us', motif: 'snow', fx: 'stars', mono: '✶', pal: 6 },
  'New Year': { kicker: 'Ring in the new year', n1: 'Hello', amp: '', n2: '2027', line: 'Food, friends & fireworks', motif: 'stars', fx: 'fireworks', mono: '27', pal: 4 },
  'Baby shower': { kicker: 'Oh baby!', n1: 'A shower', amp: '', n2: 'for Sara', line: 'Tea, cake & tiny clothes', motif: 'clouds', fx: 'confetti', mono: 'B', pal: 2 },
  Christening: { kicker: 'Please join us for the christening of', n1: 'Olivia', amp: '', n2: 'Rose', line: 'followed by lunch with family & friends', motif: 'clouds', fx: 'petals', mono: 'O', pal: 8 },
  Anniversary: { kicker: 'Celebrating 25 years', n1: 'Linda', amp: '&', n2: 'Mark', line: 'join us for an evening of love & laughter', motif: 'leaves', fx: 'stars', mono: '25', pal: 1 },
  Eid: { kicker: 'Eid Mubarak from', n1: 'The Rahman', amp: '', n2: 'Family', line: 'Join us for Eid dinner', motif: 'islamic', fx: 'stars', mono: '☾', pal: 5 },
  Diwali: { kicker: 'Shubh Deepavali', n1: 'Festival', amp: '', n2: 'of Lights', line: 'Join us for sweets & sparklers', motif: 'diya', fx: 'stars', mono: '✺', pal: 7 },
};

const START = (() => { const o = OCCASIONS.Wedding, p = PALETTES[o.pal]; return { occasion: 'Wedding', ...p, palette: p.name, motif: o.motif, mono: o.mono, font: 'Pinyon Script', top: '', kicker: o.kicker, n1: o.n1, amp: o.amp, n2: o.n2, line: o.line, date: 'Saturday · 12 June 2027', venue: 'The Orangery · Cheshire', fx: o.fx, scratch: true, secret: '' }; })();

const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const dec = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));

function Field({ label, children, hint }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[.2em] text-plum/60">{label}</span>{children}{hint && <span className="mt-1 block text-xs text-plum/50">{hint}</span>}</label>;
}
const inputCls = 'w-full rounded-xl border border-plum/15 bg-white/80 px-3.5 py-2.5 text-[15px] text-plum outline-none transition focus:border-plum/50 focus:ring-2 focus:ring-gold/30';
const Chip = ({ on, children, ...p }) => <button type="button" {...p} className={`rounded-full border px-3.5 py-2 text-sm transition ${on ? 'border-plum bg-plum text-ivory shadow' : 'border-plum/15 bg-white/70 text-plum hover:border-plum/40'}`}>{children}</button>;
function Section({ n, title, children }) {
  return <section className="rounded-3xl border border-plum/10 bg-white/55 p-5 backdrop-blur md:p-6"><h3 className="mb-4 flex items-center gap-3 font-serif text-2xl text-plum"><span className="grid h-8 w-8 place-items-center rounded-full bg-plum font-sans text-xs font-bold text-ivory">{n}</span>{title}</h3><div className="space-y-4">{children}</div></section>;
}
function ColourPick({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-plum/10 bg-white/70 p-2 pr-3">
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10" style={{ background: value }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={label} />
      </span>
      <span className="text-sm leading-tight text-plum">{label}<span className="block font-mono text-[10px] uppercase text-plum/45">{value}</span></span>
    </label>
  );
}

export default function Designer({ onClose }) {
  const [d, setD] = useState(() => {
    try { const h = location.hash; if (h.startsWith('#design=')) return { ...START, ...dec(h.slice(8)) }; } catch (e) {}
    try { const s = localStorage.getItem('tss-design'); if (s) return { ...START, ...JSON.parse(s) }; } catch (e) {}
    return START;
  });
  const set = patch => setD(o => ({ ...o, ...patch, ...(('paper' in patch || 'card' in patch || 'ink' in patch || 'seal' in patch || 'ribbon' in patch || 'foil' in patch) && !patch.palette ? { palette: 'Custom' } : {}) }));
  useEffect(() => { try { localStorage.setItem('tss-design', JSON.stringify(d)); } catch (e) {} }, [d]);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [target, setTarget] = useState(1);
  const p = useTween(target, .05);
  const play = () => { setTarget(0); setTimeout(() => setTarget(.57), 500); setTimeout(() => setTarget(1), 2300); };
  const [order, setOrder] = useState(false);
  const [copied, setCopied] = useState('');

  const theme = useMemo(() => {
    const { c, foil } = derive(d);
    const f = FONTS.find(x => x[0] === d.font) || FONTS[0];
    return { c, foil, motif: d.motif, mono: d.mono || ' ', arabic: d.top, kicker: d.kicker, names: [d.n1, d.n2], amp: d.amp, line: d.line, date: d.date, venue: d.venue, nameFont: f[1], nameScale: f[2] };
  }, [d]);

  const pickOccasion = k => { const o = OCCASIONS[k], pal = PALETTES[o.pal]; setD(x => ({ ...x, occasion: k, kicker: o.kicker, n1: o.n1, amp: o.amp, n2: o.n2, line: o.line, motif: o.motif, fx: o.fx, mono: o.mono, ...pal, palette: pal.name })); setTarget(1); };
  const link = `${location.origin}${location.pathname}#design=${enc(d)}`;
  const summary = `Occasion: ${d.occasion}\nNames: ${d.n1} ${d.amp} ${d.n2}\nDate: ${d.date}\nVenue: ${d.venue}\nColours: ${d.palette} (envelope ${d.paper}, card ${d.card}, text ${d.ink}, seal ${d.seal}, ribbon ${d.ribbon}, foil ${d.foil})\nPattern: ${d.motif} · Font: ${d.font} · Monogram: ${d.mono}\nEffect: ${d.fx} · Scratch to reveal: ${d.scratch ? 'yes' : 'no'}${d.secret ? `\nSecret message: ${d.secret}` : ''}`;
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`My design – ${d.n1} ${d.amp} ${d.n2}`.replace(/\s+/g, ' '))}&body=${encodeURIComponent(`Hi The Satin Seal,\n\nHere's my invitation design:\n${link}\n\n${summary}\n\nPlan: \nMy order email/receipt: \n`)}`;
  const copy = async (txt, what) => { try { await navigator.clipboard.writeText(txt); setCopied(what); setTimeout(() => setCopied(''), 2000); } catch (e) { setCopied('fail'); } };

  return (
    <div className="min-h-screen bg-ivory pb-24 text-plum">
      <header className="sticky top-0 z-40 border-b border-plum/10 bg-ivory/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <button onClick={onClose} className="flex items-baseline gap-1.5 text-plum" aria-label="Back to The Satin Seal home"><span className="text-[10px] font-semibold uppercase tracking-[.35em]">The</span><span className="font-script text-3xl leading-none">Satin Seal</span></button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hidden rounded-full px-4 py-2 text-sm font-medium text-plum/70 hover:text-plum sm:block">← Home</button>
            <button onClick={() => setOrder(true)} className="rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-ivory transition hover:scale-105">Order this design</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-8 lg:grid-cols-[1fr_440px]">
        {/* preview */}
        <div className="lg:order-2">
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 text-center lg:text-left"><div className="text-[11px] font-semibold uppercase tracking-[.3em] text-mauve">Design studio</div><h1 className="font-serif text-4xl leading-tight md:text-5xl">Design your own</h1></div>
            <div className="flex items-end justify-center gap-4">
              <div className="relative aspect-[9/19.5] h-[min(60svh,620px)] rounded-[2.4rem] bg-[#1c1418] p-[9px] shadow-[0_40px_80px_-25px_rgba(58,29,42,.6)]">
                <button className="relative block h-full w-full overflow-hidden rounded-[2rem]" onClick={play} aria-label="Play the opening">
                  <InviteScene theme={theme} p={p} className="absolute inset-0" />
                  <span className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
                </button>
              </div>
              <div className="hidden w-28 shrink-0 sm:block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg"><InviteScene theme={theme} p={0} className="absolute inset-0" /></div>
                <div className="mt-2 text-center text-xs text-plum/55">Envelope</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={play} className="rounded-full border border-plum/20 bg-white/70 px-4 py-2 text-sm font-semibold hover:border-plum/50">▶ Play opening</button>
              <button onClick={() => setOrder(true)} className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-plum hover:bg-gold-2">Order this design →</button>
            </div>
            <p className="mt-2 text-center text-xs text-plum/50">Tap the phone to watch your guests’ view. Your design saves automatically on this device.</p>
          </div>
        </div>

        {/* controls */}
        <div className="space-y-5 lg:order-1">
          <Section n="1" title="What are you celebrating?">
            <div className="flex flex-wrap gap-2">{Object.keys(OCCASIONS).map(k => <Chip key={k} on={d.occasion === k} onClick={() => pickOccasion(k)}>{k}</Chip>)}</div>
            <p className="text-xs text-plum/50">Picking an occasion fills in example wording and colours. Change anything below.</p>
          </Section>

          <Section n="2" title="Colours">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {PALETTES.map(pl => (
                <button key={pl.name} type="button" onClick={() => setD(o => ({ ...o, ...pl, palette: pl.name }))} className={`group rounded-2xl p-1.5 text-center transition ${d.palette === pl.name ? 'bg-plum/10 ring-2 ring-plum' : 'hover:bg-plum/5'}`} aria-label={`${pl.name} palette`}>
                  <span className="relative mx-auto block h-11 w-11 overflow-hidden rounded-full ring-1 ring-black/10" style={{ background: pl.paper }}>
                    <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: pl.card }} />
                    <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/70" style={{ background: pl.seal }} />
                  </span>
                  <span className="mt-1 block text-[10px] leading-tight text-plum/70">{pl.name}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <ColourPick label="Envelope" value={d.paper} onChange={v => set({ paper: v })} />
              <ColourPick label="Card" value={d.card} onChange={v => set({ card: v })} />
              <ColourPick label="Text" value={d.ink} onChange={v => set({ ink: v })} />
              <ColourPick label="Wax seal" value={d.seal} onChange={v => set({ seal: v })} />
              <ColourPick label="Ribbon" value={d.ribbon} onChange={v => set({ ribbon: v })} />
            </div>
            <Field label="Names in foil">
              <div className="flex flex-wrap gap-2">{[['none', 'No foil'], ['gold', 'Gold'], ['silver', 'Silver'], ['rose', 'Rose gold']].map(([k, l]) => <Chip key={k} on={d.foil === k} onClick={() => set({ foil: k })}>{l}</Chip>)}</div>
            </Field>
          </Section>

          <Section n="3" title="Pattern, seal & font">
            <Field label="Embossed pattern"><div className="flex flex-wrap gap-2">{MOTIFS.map(([k, l]) => <Chip key={k} on={d.motif === k} onClick={() => { set({ motif: k }); setTarget(0); }}>{l}</Chip>)}</div></Field>
            <Field label="Wax seal monogram" hint="1–3 characters, e.g. your initials or a number"><input className={inputCls} maxLength={3} value={d.mono} onChange={e => set({ mono: e.target.value })} onFocus={() => setTarget(0)} /></Field>
            <Field label="Font for names">
              <div className="flex flex-wrap gap-2">{FONTS.map(([k, css]) => <Chip key={k} on={d.font === k} onClick={() => { set({ font: k }); setTarget(1); }}><span style={{ fontFamily: css, fontSize: 18 }}>{d.n1 || 'Aa'}</span></Chip>)}</div>
            </Field>
          </Section>

          <Section n="4" title="Your wording">
            <Field label="Small line at the very top (optional)" hint="e.g. a blessing, verse or “Save the date”"><input className={inputCls} value={d.top} onChange={e => set({ top: e.target.value })} onFocus={() => setTarget(1)} /></Field>
            <Field label="Opening line"><input className={inputCls} value={d.kicker} onChange={e => set({ kicker: e.target.value })} onFocus={() => setTarget(1)} /></Field>
            <div className="grid grid-cols-[1fr_70px_1fr] gap-2">
              <Field label="Name / title"><input className={inputCls} value={d.n1} onChange={e => set({ n1: e.target.value })} onFocus={() => setTarget(1)} /></Field>
              <Field label="Join"><input className={inputCls} value={d.amp} maxLength={3} onChange={e => set({ amp: e.target.value })} onFocus={() => setTarget(1)} /></Field>
              <Field label="Second line"><input className={inputCls} value={d.n2} onChange={e => set({ n2: e.target.value })} onFocus={() => setTarget(1)} /></Field>
            </div>
            <Field label="Invitation message"><textarea className={`${inputCls} min-h-[70px]`} value={d.line} onChange={e => set({ line: e.target.value })} onFocus={() => setTarget(1)} /></Field>
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Date"><input className={inputCls} value={d.date} onChange={e => set({ date: e.target.value })} onFocus={() => setTarget(1)} /></Field>
              <Field label="Venue / place"><input className={inputCls} value={d.venue} onChange={e => set({ venue: e.target.value })} onFocus={() => setTarget(1)} /></Field>
            </div>
            <p className="text-xs text-plum/50">Times, maps, schedule, dress code and RSVP details come next. We’ll ask for those after you order.</p>
          </Section>

          <Section n="5" title="Finishing touches">
            <Field label="Celebration effect when it opens"><div className="flex flex-wrap gap-2">{FX.map(([k, l]) => <Chip key={k} on={d.fx === k} onClick={() => set({ fx: k })}>{l}</Chip>)}</div></Field>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-plum/10 bg-white/70 p-4">
              <span><span className="block font-medium">Scratch to reveal the date</span><span className="text-xs text-plum/55">Guests scratch gold foil off the date · Signature & Bespoke</span></span>
              <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${d.scratch ? 'bg-plum' : 'bg-plum/20'}`}><input type="checkbox" className="absolute inset-0 cursor-pointer opacity-0" checked={d.scratch} onChange={e => set({ scratch: e.target.checked })} /><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${d.scratch ? 'left-6' : 'left-1'}`} /></span>
            </label>
            <Field label="Secret scratch-off message (optional)" hint="Revealed under gold foil further down the invitation · Signature & Bespoke"><textarea className={`${inputCls} min-h-[60px]`} value={d.secret} onChange={e => set({ secret: e.target.value })} placeholder="e.g. Our first dance song is a surprise…" /></Field>
          </Section>

          <div className="rounded-3xl bg-plum p-6 text-center text-ivory">
            <div className="font-serif text-3xl">Love your design?</div>
            <p className="mt-1 text-sm text-ivory/70">Send it to us, choose your plan, and we’ll make it real, with your countdown, map and RSVP.</p>
            <button onClick={() => setOrder(true)} className="mt-4 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-plum transition hover:scale-105">Order this design →</button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-plum/10 bg-ivory/90 p-3 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <button onClick={() => { scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(play, 400); }} className="flex-1 rounded-full border border-plum/20 bg-white py-3 text-sm font-semibold">▶ Preview</button>
        <button onClick={() => setOrder(true)} className="flex-1 rounded-full bg-plum py-3 text-sm font-semibold text-ivory">Order this design</button>
      </div>

      {order && (
        <div className="uv-modal fixed inset-0 z-[60] flex overflow-y-auto bg-plum/60 p-4 backdrop-blur-md" onClick={() => setOrder(false)} role="dialog" aria-modal="true" aria-label="Order this design">
          <div className="relative m-auto w-full max-w-lg rounded-3xl bg-ivory p-6 text-plum shadow-2xl md:p-8" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOrder(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-plum/10" aria-label="Close">✕</button>
            <div className="text-[11px] font-semibold uppercase tracking-[.3em] text-mauve">Two quick steps</div>
            <h2 className="mt-1 font-serif text-4xl">Order this design</h2>
            <div className="mt-6 rounded-2xl border border-plum/10 bg-white/70 p-4">
              <div className="font-semibold">1. Send us your design</div>
              <p className="mt-1 text-sm text-plum/65">This opens an email to {EMAIL} with your design link and details filled in.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={mail} className="rounded-full bg-plum px-4 py-2.5 text-sm font-semibold text-ivory">✉ Email my design</a>
                <button onClick={() => copy(link, 'link')} className="rounded-full border border-plum/20 px-4 py-2.5 text-sm font-semibold">{copied === 'link' ? 'Copied ✓' : 'Copy design link'}</button>
              </div>
              {copied === 'fail' && <p className="mt-2 break-all text-xs text-plum/60">Copy this link: {link}</p>}
              <p className="mt-2 text-xs text-plum/50">No email app? Copy the link and send it to {EMAIL} or DM us @thesatinseal.</p>
            </div>
            <div className="mt-3 rounded-2xl border border-plum/10 bg-white/70 p-4">
              <div className="font-semibold">2. Choose your plan & pay securely</div>
              <div className="mt-3 grid gap-2">
                {PLAN_LINKS.map(([n, pr, u]) => <a key={n} href={u} className="flex items-center justify-between rounded-xl border border-plum/15 px-4 py-3 transition hover:border-plum/50 hover:bg-white"><span className="font-medium">{n}{n !== 'Essential' && d.scratch ? <span className="ml-2 text-xs text-mauve">includes scratch-to-reveal</span> : null}</span><span className="font-serif text-2xl">£{pr}</span></a>)}
              </div>
              {d.scratch && <p className="mt-2 text-xs text-plum/55">Scratch-to-reveal is included in Signature and Bespoke.</p>}
            </div>
            <p className="mt-4 text-center text-xs text-plum/50">We’ll send you a private preview to approve before anything goes to your guests.</p>
          </div>
        </div>
      )}
    </div>
  );
}
