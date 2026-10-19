# Design Proposal — Houston Family HVAC

## 1. Market snapshot (Oct 2026, light research — see sources)
Houston HVAC sites (Bellaire AC, Bodensteiner, VOS Air, Velocity Air, Ace Comfort) follow one template: blue/red palette, snowflake + flame icons, stock smiling-tech photo, coupon banners, "family owned" buried in a paragraph. Trust is built with years, reviews, BBB, financing.
**Gap:** nobody looks *established and premium*. Houston Family HVAC's logo already says "institution" (column, meander, gold). We lean into that and stand out from every blue-and-red competitor.

Sources: expertise.com/tx/houston/ac-repair, lantern.llc/tx/houston/home-services/hvac, communityimpact.com (Velocity Air), vosairservices.com.

## 2. Customer journey (hypothesis)
Discovery: AC dies in 98°F heat → searches on phone → **needs the phone number in under 2 seconds**.
Evaluation: Are they real? Local? Fair? → family, 60+ yrs combined, union-trained tech, real recent jobs.
Decision: call or request a quote. Every section ends within one thumb-reach of the call button (sticky on mobile).

## 3. Creative thesis
**"Comfort, built like a monument."** A neo-classical system built from the logo: the fluted column, the Greek-key meander and brushed gold on near-black. Everything holds up the house and keeps it cool. The motion story follows Houston heat breaking: an ember-warm 98° counts down to a calm 72° as you scroll.

- **Type:** Cormorant Garamond (display; inscription-like, italic for warmth) + Exo 2 (echoes the logo's squared wordmark; UI, labels and body).
- **Color:** Ink #0B0A08 · Stone #15130F · Gold #C9A24A / #E6CB85 · Marble #F1ECE2 · Ember #C2512A (heat only, used once).
- **Layout:** asymmetric editorial grid, big type and generous dark space, gold hairline rules, meander bands as section dividers. No cards-in-cards and no icon tiles.
- **Signature moments:**
  1. The hero emblem: the Greek-key ring draws itself in SVG, and the column-H rises.
  2. The pinned **98° → 72°** heat sequence, where the background cools from ember to ink and the steps run Call → Diagnose → Fix → Cool.
  3. **Three pillars:** fluted columns rise from the ground carrying *Fast Service / Fair Pricing / Family-Owned*.
  4. **Field ledger:** real jobs from Instagram as an editorial index with hover reveals.
- **Anti-references:** snowflake/flame icons, blue gradients, stock technicians, coupon starbursts, fake reviews.

## 4. Page structure
Header (logo, anchors, phone) → Hero → Service marquee → 98°→72° pinned story → Services index (7) → Three pillars + family story + UA Local 211 → Field ledger → What to expect / FAQ → Quote + call → Footer.

## 5. Motion (Heavy, client-selected)
- **Lenis** for smooth scrolling (lerp-tuned, anchor offsets for the sticky header). It is synced with GSAP's ticker so there is a single RAF loop.
- **GSAP + ScrollTrigger** for the pinned heat sequence, column rise, split-line headline masks, emblem draw and parallax. Combined payload is about 50 KB gzipped, which the cinematic pin justifies.
- **prefers-reduced-motion:** no Lenis smoothing, no pins and no scrubs; content renders static and fully readable.
- On mobile the pin is shortened and the parallax disabled.

## 6. Acceptance criteria
Phone tap-to-call reachable on every viewport (sticky on mobile) · no horizontal overflow from 360 px up · keyboard and focus visible · AA contrast on text · no console errors · no fabricated claims.

## Open assumptions
No photos yet (illustration/type-led). License #, warranty and financing to be added when supplied.
