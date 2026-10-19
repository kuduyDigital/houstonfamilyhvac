// Copies pinned runtime libraries from node_modules into js/vendor (no bundler needed).
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('js/vendor', { recursive: true });
for (const [from, to] of [
  ['node_modules/lenis/dist/lenis.min.js', 'js/vendor/lenis.min.js'],
  ['node_modules/gsap/dist/gsap.min.js', 'js/vendor/gsap.min.js'],
  ['node_modules/gsap/dist/ScrollTrigger.min.js', 'js/vendor/ScrollTrigger.min.js'],
]) { copyFileSync(from, to); console.log('copied', to); }
