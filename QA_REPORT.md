# QA Report — Houston Family HVAC (2026-10-19)

Tested in the Claude desktop app's built-in Chromium browser, served from `node serve.mjs` (localhost:5173).

## Verified
| Check | Result |
|---|---|
| Desktop (~1330px) full scroll: hero intro, emblem draw, marquee, 98°→72° pin, services, columns, ledger, FAQ, contact, footer | Pass |
| Mobile 375×812: layout, pinned heat sequence fits the viewport, sticky call bar | Pass (after fix) |
| Horizontal overflow at 375px (`scrollWidth === innerWidth`) | Pass |
| Mobile menu open → link → menu closes, Lenis scrolls to `#contact` with header offset | Pass |
| Quote form: empty submit → error message, `aria-invalid`, focus on first invalid field | Pass |
| Browser console errors | None |
| Single RAF loop (Lenis driven by `gsap.ticker`) | Pass (by code) |

## Fixed during QA
- Preview server crashed on 404s (headers written before file read).
- Degree sign rendered as a letter "o" in Cormorant → replaced with a drawn gold ring; lining numerals for the counter.
- Browser scroll restoration dropped visitors mid-pin on reload → manual restoration unless a hash is present.
- Mobile: the temperature counter sat below the fold during the pin → counter moved above the copy on <1024px; tighter padding.
- Meander divider read as square "glyphs" → redrawn as a continuous running Greek key; marquee separators changed to gold diamonds.
- Footer logo PNG showed a black box on the stone background → `mix-blend-mode: lighten`.
- Form error text contrast (ember on ink, about 3.5:1) → lighter ember (#e8845c, about 6:1).
- Sticky call bar overlapped the open mobile menu → hidden while the menu is open.

## Not verified / limitations
- `prefers-reduced-motion` was **not emulated** (the tool can't). By code path: no Lenis, no GSAP; all content is static and visible, and the counter shows 72°.
- No Lighthouse / Core Web Vitals run. Payload (minified, before gzip): CSS 36 KB; JS vendor 136 KB (Lenis 19 KB, GSAP 73 KB, ScrollTrigger 45 KB); plus Google Fonts (2 families).
- Safari / Firefox and real touch devices not tested.
- The quote form uses `mailto:`, so it depends on the visitor having a mail client. A real form backend (Formspree, Netlify Forms, etc.) is out of the current static scope.

## Content to confirm with the client
- Process copy ("you know what it costs and why before we start") and the Maintenance and Heating service lines are reasonable but not confirmed by the client.
- Add when available: TDLR license #, insurance, warranty, financing, service-area towns, real photos and Google reviews.
- Phone is a 908 (NJ) area code for a Houston business. Confirm it is the number they want public.

---

# Round 2: redesign with real photos (2026-10-19)

The client said round 1 read as generic, with no depth or personality. Changes:
- **Header:** a lintel bar with a hanging keystone medallion (column-H in a gold dashed ring) that shrinks on scroll. A Greek-key frieze appears once scrolled, and the phone block carries a handwritten "call the family" tag.
- **Hero:** layered depth. The real technician photo sits in a classical arch, with a Greek-key ring behind it, a taped wiring print in front, a handwritten "the pink tank? that's R-410A." note with a drawn arrow, and a rotating seal. Desktop has multi-speed parallax.
- **Type:** Bodoni Moda (carved, high contrast, echoing the marble H), Exo 2 for UI, and Reenie Beanie for field-note annotations.
- **Services:** an arch-shaped job photo follows the cursor on hover (fine pointers only). Touch screens show inline arch thumbnails instead.
- **The Family:** a temple builds itself on scroll (columns, then an architrave inscribed FAST · FAIR · FAMILY, then a pediment with the medallion).
- **Reviews:** 4 real Google reviews, quoted only up to where Google truncates them, with names as first name + last initial.
- **Field notes:** a pinned horizontal gallery of taped job prints with handwritten captions, plus 3 Instagram reel cards. Phones get native swipe with snap.
- **Footer:** "Design & build by KUDUY" credit linking to kuduy.com.

## Verified (built-in Chromium, desktop ~1330px + 375×812)
- Hero intro, header medallion and scroll state, cursor-follow service photo, temple build, reviews, horizontal gallery: pass.
- Mobile: no horizontal overflow (375 = 375), hero composition stacks below the copy, heat pin fits, service thumbnails show.
- Console errors: none.

## Fixed in round 2 QA
- Header right block fell into the centre grid column under the medallion → pinned to column 3.
- Hero parallax pushed the print over the CTA on mobile → parallax limited to ≥1024px; the "we mean it." note is hidden on phones.
- Service hover photo could stay on screen after Lenis scrolled the list away → hides on scroll.
- Gallery captions wrapped onto the photo → shortened.

## Limitations
- **Every client photo is a 243px-wide thumbnail**, upscaled 2× with Lanczos and sharpening. They look soft at large sizes. Put the full-resolution originals into `assets/images/source/` with the same names and run `npm run images`.
- Two Google reviews from reviewers who share the owner's surname (Tejeda) were left out on purpose so the section doesn't read as family-written. Add them back if the client wants.
- Reduced motion, Safari/Firefox, real devices and Lighthouse are still not tested.
