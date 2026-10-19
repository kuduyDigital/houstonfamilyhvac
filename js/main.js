/* Houston Family HVAC — interactions
   Lenis (smooth scroll) + GSAP/ScrollTrigger (Heavy reveal tier).
   All hidden start-states are set from JS, so content stays visible if scripts fail. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const HEADER_OFFSET = -80;

  /* ---------- Greek-key (meander) ring ---------- */
  function buildMeander() {
    const path = $('[data-meander]');
    if (!path) return;
    const N = 32, CX = 200, CY = 200, R0 = 150, DR = 9; // 4 radial units: 150 → 186
    const cell = [[0, 0], [0, 4], [3, 4], [3, 1], [1, 1], [1, 3], [2, 3], [2, 2]];
    const pt = (u, y) => {
      const a = (u / (N * 4)) * Math.PI * 2 - Math.PI / 2;
      const r = R0 + y * DR;
      return [CX + r * Math.cos(a), CY + r * Math.sin(a), r];
    };
    let d = '';
    for (let i = 0; i < N; i++) {
      cell.forEach(([x, y], k) => {
        const [px, py, r] = pt(i * 4 + x, y);
        if (k === 0) { d += `M${px.toFixed(2)} ${py.toFixed(2)}`; return; }
        const [prevX, prevY] = cell[k - 1];
        if (prevY === y) d += `A${r} ${r} 0 0 ${x > prevX ? 1 : 0} ${px.toFixed(2)} ${py.toFixed(2)}`; // arc at constant radius
        else d += `L${px.toFixed(2)} ${py.toFixed(2)}`;
      });
    }
    path.setAttribute('d', d);
  }
  buildMeander();

  /* ---------- Skyline for the temperature scene (deterministic) ---------- */
  function buildSkyline() {
    const g = $('[data-skyline]');
    if (!g) return;
    const NS = 'http://www.w3.org/2000/svg';
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const mk = (tag, attrs) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
    // far row (hazy), then near row; a few slim landmark towers with pyramid caps
    [[0.5, '#1a120d', 140, 80, 120, 26, 70], [1, '#0b0a08', 60, 60, 170, 40, 110]].forEach(([op, fill, lift, minH, varH, minW, maxW]) => {
      let x = -20;
      while (x < 1620) {
        const landmark = op === 1 && rnd() > 0.84;
        const w = landmark ? 42 + rnd() * 22 : minW + rnd() * (maxW - minW);
        const h = landmark ? 260 + rnd() * 110 : minH + rnd() * varH;
        const top = 900 - h - lift;
        g.appendChild(mk('rect', { x: x.toFixed(1), y: top.toFixed(1), width: w.toFixed(1), height: (900 - top).toFixed(1), fill, opacity: op }));
        if (landmark) g.appendChild(mk('polygon', { points: `${x},${top} ${x + w / 2},${top - 46} ${x + w},${top}`, fill }));
        else if (op === 1 && rnd() > 0.75) g.appendChild(mk('rect', { x: (x + w / 2 - 1).toFixed(1), y: (top - 34).toFixed(1), width: 2, height: 34, fill }));
        if (op === 1) {
          for (let wy = top + 14; wy < 860; wy += 22) for (let wx = x + 8; wx < x + w - 8; wx += 14) {
            if (rnd() > 0.8) g.appendChild(mk('rect', { x: wx.toFixed(1), y: wy.toFixed(1), width: 5, height: 8, fill: '#e6cb85', class: 'win', opacity: 0.75 }));
          }
        }
        x += w + 2 + rnd() * 14;
      }
    });
    g.appendChild(mk('rect', { x: 0, y: 860, width: 1600, height: 40, fill: '#0b0a08' }));
  }
  buildSkyline();

  /* ---------- Header state ---------- */
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Lenis ---------- */
  let lenis = null;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    if (hasGsap) {
      // single RAF loop: GSAP ticker drives Lenis
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $('[data-menu-toggle]');
  const menuLabel = $('[data-menu-label]');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'Close' : 'Menu';
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
  addEventListener('resize', () => { if (innerWidth >= 1024 && document.body.classList.contains('menu-open')) setMenu(false); });

  /* ---------- Anchor navigation ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) setMenu(false);
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { offset: HEADER_OFFSET, duration: 1.4 });
      else (id === '#top' ? window.scrollTo({ top: 0 }) : target.scrollIntoView());
      history.pushState(null, '', id);
      if (id !== '#top') { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    });
  });

  /* ---------- Quote form (frontend only → mailto) ---------- */
  const form = $('[data-quote-form]');
  if (form) {
    const err = $('[data-form-error]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const invalid = [];
      form.name.setAttribute('aria-invalid', String(!name));
      if (!name) invalid.push(form.name);
      const phoneOk = phone.replace(/\D/g, '').length >= 10;
      form.phone.setAttribute('aria-invalid', String(!phoneOk));
      if (!phoneOk) invalid.push(form.phone);
      if (invalid.length) {
        err.textContent = !name && !phoneOk ? 'Please add your name and a phone number.' : !name ? 'Please add your name.' : 'Please add a phone number we can call back (10 digits).';
        invalid[0].focus();
        return;
      }
      err.textContent = '';
      const body = [
        `Name: ${name}`, `Phone: ${phone}`,
        `ZIP: ${form.zip.value.trim() || '—'}`,
        `Service: ${form.service.value}`, '',
        form.message.value.trim(),
      ].join('\n');
      location.href = `mailto:info@houstonfamilyhvac.org?subject=${encodeURIComponent(`Quote request: ${form.service.value}`)}&body=${encodeURIComponent(body)}`;
    });
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Motion (Heavy tier) ---------- */
  if (!hasGsap || reduceMotion) return;
  gsap.registerPlugin(ScrollTrigger);
  // pinned scenes + restored mid-page positions don't mix; start from the top unless a hash is given
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);
  const ease = 'expo.out';
  const mm = gsap.matchMedia();

  // --- Hero intro ---
  const drawables = $$('[data-draw]');
  const swoosh = $('[data-swoosh]');
  [...drawables, swoosh].filter(Boolean).forEach((el) => {
    const len = el.getTotalLength();
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set('[data-hero] .line > span', { yPercent: 115 });
  gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 24 });
  gsap.set('[data-arch]', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('[data-arch] img', { scale: 1.4 });
  gsap.set('[data-hero-art] .print', { autoAlpha: 0, y: -80, rotation: -13 });
  gsap.set('[data-hero-art] .seal-spin', { scale: 0 });
  gsap.set(header, { autoAlpha: 0, y: -20 });

  gsap.timeline({ defaults: { ease } })
    .to(header, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.1)
    .to('[data-hero] .line > span', { yPercent: 0, duration: 1.5, stagger: 0.12 }, 0.15)
    .to('[data-arch]', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.2)
    .to('[data-arch] img', { scale: 1.04, duration: 2.4 }, 0.2)
    .to(drawables, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut', stagger: 0.1 }, 0.3)
    .to(swoosh, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' }, 1.1)
    .to('[data-hero-art] .print', { autoAlpha: 1, y: 0, rotation: 0, duration: 1.4, ease: 'back.out(1.4)' }, 1.0)
    .to('[data-hero-art] .seal-spin', { scale: 1, duration: 1.2, ease: 'back.out(1.6)' }, 1.3)
    .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.7);

  // Depth: layered parallax inside the hero
  mm.add('(min-width: 1024px)', () => {
    $$('[data-hero] [data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed);
      gsap.to(el, {
        y: () => (1 - speed) * innerHeight * 0.45, ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
    });
  });
  gsap.to('[data-parallax-img]', {
    yPercent: 8, ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('[data-emblem-ring]', {
    rotation: 140, ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  // Brushed-gold shimmer
  gsap.to('.gold-text', { backgroundPosition: '200% 0', duration: 7, ease: 'none', repeat: -1 });

  // --- Generic reveals ---
  $$('[data-lines]').forEach((h) => {
    gsap.from($$('.line > span', h), {
      yPercent: 115, duration: 1.4, ease, stagger: 0.1,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true },
    });
  });
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0, y: 40, duration: 1.3, ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  $$('[data-stagger]').forEach((list) => {
    gsap.from(list.children, {
      autoAlpha: 0, y: 34, duration: 1.1, ease, stagger: 0.08,
      scrollTrigger: { trigger: list, start: 'top 85%', once: true },
    });
  });
  $$('[data-quote]').forEach((q) => {
    gsap.from(q.children, {
      autoAlpha: 0, y: 50, duration: 1.3, ease, stagger: 0.1,
      scrollTrigger: { trigger: q, start: 'top 82%', once: true },
    });
  });

  // --- 98° → 72° pinned sequence ---
  const heat = $('[data-heat]');
  if (heat) {
    heat.classList.add('is-pinned');
    const steps = $$('.heat-step', heat);
    const tempEl = $('[data-temp]', heat);
    const t = { v: 98 };
    const render = () => { tempEl.textContent = Math.round(t.v); };
    gsap.set(steps, { autoAlpha: 0, y: 30 });
    gsap.set(steps[0], { autoAlpha: 1, y: 0 });
    render();

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: heat, start: 'top top', end: () => `+=${innerHeight * (innerWidth < 768 ? 2.2 : 3)}`,
        scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    const disp = $('[data-heat-disp]');
    const warp = { s: 12 };
    const wins = $$('[data-skyline] .win');
    const air = $$('[data-airflow] path');
    air.forEach((p) => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
    gsap.to('[data-heat-waves] path', { y: -60, duration: 3.2, ease: 'none', repeat: -1, stagger: { each: 0.5, repeat: -1 } });
    tl.fromTo('[data-sky-hot]', { opacity: 1 }, { opacity: 0, duration: 2.2 }, 0.2)
      .fromTo('[data-sky-dusk]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.6)
      .to('[data-sky-dusk]', { opacity: 0, duration: 1.4 }, 2.2)
      .fromTo('[data-sun]', { opacity: 1, y: 0 }, { opacity: 0, y: 520, duration: 3 }, 0)
      .fromTo(warp, { s: 12 }, { s: 0, duration: 2.6, onUpdate: () => disp.setAttribute('scale', warp.s.toFixed(1)) }, 0)
      .fromTo('[data-heat-waves]', { opacity: 0.55 }, { opacity: 0, duration: 2.2 }, 0)
      .fromTo('[data-night]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 2.8)
      .fromTo(wins, { opacity: 0 }, { opacity: 0.75, duration: 0.2, stagger: { amount: 1.2, from: 'random' } }, 2.5)
      .to(air, { strokeDashoffset: 0, duration: 1.5, stagger: 0.15 }, 2.5)
      .fromTo(t, { v: 98 }, { v: 72, duration: 4, onUpdate: render }, 0)
      .fromTo('[data-thermo]', { scaleY: 0.95 }, { scaleY: 0.3, duration: 4 }, 0);
    for (let i = 1; i < steps.length; i++) {
      tl.to(steps[i - 1], { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, i - 0.15)
        .fromTo(steps[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, i + 0.1);
    }
  }

  // --- Services: arch-shaped photo follows the cursor ---
  const float = $('[data-svc-float]');
  if (float && finePointer) {
    const floatImg = $('[data-svc-float-img]', float);
    gsap.set(float, { xPercent: -50, yPercent: -50, scale: 0.6 });
    const xTo = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(float, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    const list = $('[data-svc-list]');
    list.addEventListener('pointermove', (e) => {
      xTo(e.clientX + 120); yTo(e.clientY);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    });
    $$('.svc-row', list).forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        if (row.dataset.img && !floatImg.src.endsWith(row.dataset.img)) floatImg.src = row.dataset.img;
        if (!float.style.visibility || float.style.visibility === 'hidden') { gsap.set(float, { x: e.clientX + 120, y: e.clientY }); }
        shown = true;
        gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      });
    });
    // :hover / pointerleave go stale when Lenis scrolls content under a still mouse → test the real pointer position
    const ptr = { x: -1, y: -1 };
    let shown = false;
    const hideFloat = () => { if (!shown) return; shown = false; gsap.to(float, { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: 'power3.in', overwrite: 'auto' }); };
    const pointerInList = () => { const r = list.getBoundingClientRect(); return ptr.x >= r.left && ptr.x <= r.right && ptr.y >= r.top && ptr.y <= r.bottom; };
    const check = () => { if (shown && !pointerInList()) hideFloat(); };
    addEventListener('pointermove', (e) => { ptr.x = e.clientX; ptr.y = e.clientY; check(); }, { passive: true });
    addEventListener('scroll', check, { passive: true });
    if (lenis) lenis.on('scroll', check);
    document.documentElement.addEventListener('pointerleave', hideFloat);
    list.addEventListener('pointerleave', hideFloat);
  }

  // --- Temple builds itself: stylobate → columns → architrave → pediment ---
  const temple = $('[data-temple]');
  if (temple) {
    const tt = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: temple, start: 'top 85%', end: 'bottom 88%', scrub: 1 },
    });
    tt.from('[data-pillar]', { scaleY: 0, stagger: 0.12, duration: 1 })
      .from('[data-architrave]', { yPercent: -120, autoAlpha: 0, duration: 0.5 }, '>-0.1')
      .from('[data-pediment]', { yPercent: -60, autoAlpha: 0, duration: 0.5 }, '>-0.1');
  }

  // --- Field notes: horizontal travel (tablet/desktop) ---
  mm.add('(min-width: 768px)', () => {
    const track = $('[data-gallery-track]');
    const section = $('[data-gallery]');
    if (!track) return;
    const distance = () => Math.max(0, track.scrollWidth - innerWidth + 80);
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
    });
  });

  // --- Subtle 3D tilt on prints & reels ---
  if (finePointer) {
    $$('[data-tilt]').forEach((el) => {
      gsap.set(el, { transformPerspective: 800 });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 14);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  // Footer word rises
  gsap.from('[data-footer-word]', {
    yPercent: 45, ease: 'none',
    scrollTrigger: { trigger: '[data-footer-word]', start: 'top bottom', end: 'bottom 85%', scrub: true },
  });

  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
