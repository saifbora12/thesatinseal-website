import { useEffect, useRef, useState, useCallback } from 'react';

export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** 0…1 progress of a tall section scrolling past a sticky viewport. */
export function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [ref]);
  return p;
}

/** Page-wide scroll progress (for the top progress bar). */
export function usePageProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement.scrollHeight - innerHeight; setP(h > 0 ? scrollY / h : 0); };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return p;
}

/** true once the element has entered the viewport. */
export function useInView(opts = { threshold: .2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/** Smoothly animates a number towards `target` (spring-ish exponential easing). */
export function useTween(target, speed = 0.12) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (prefersReduced()) { cur.current = target; setV(target); return; }
    let raf;
    const step = () => {
      const d = target - cur.current;
      if (Math.abs(d) < 0.001) { cur.current = target; setV(target); return; }
      cur.current += d * speed; setV(cur.current); raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, speed]);
  return v;
}

/** Counts up from 0 to `to` once `start` becomes true. */
export function useCountUp(to, start, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf; const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / ms); setN(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, to, ms]);
  return n;
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), interval); return () => clearInterval(i); }, [interval]);
  return now;
}

/** 3D tilt that follows the pointer. Returns props to spread on the element. */
export function useTilt(max = 8) {
  const [style, setStyle] = useState({});
  const onPointerMove = useCallback(e => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    setStyle({ transform: `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-4px)`, '--mx': `${(x + .5) * 100}%`, '--my': `${(y + .5) * 100}%` });
  }, [max]);
  const onPointerLeave = useCallback(() => setStyle({}), []);
  return { style, onPointerMove, onPointerLeave };
}

/** Magnetic pull towards the pointer for buttons. */
export function useMagnet(strength = .3) {
  const [t, setT] = useState('');
  return {
    style: { transform: t, transition: t ? 'transform .15s' : 'transform .5s cubic-bezier(.2,1.6,.4,1)' },
    onPointerMove: e => { if (e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); setT(`translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`); },
    onPointerLeave: () => setT(''),
  };
}
