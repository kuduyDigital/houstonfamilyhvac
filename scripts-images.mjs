// Prepares client photos: crops phone watermarks, upscales 2x (lanczos3) with light sharpening.
// Drop full-resolution originals into assets/images/source/ with the same names and re-run: npm run images
import sharp from 'sharp';
const jobs = [
  ['2.png', 'hero-tech-condenser'],
  ['3.png', 'wiring-panel'],
  ['4.png', 'reel-double-shaft-motor'],
  ['5.png', 'attic-air-handler'],
  ['6.png', 'twin-water-heaters'],
  ['7.png', 'reel-filter-maintenance'],
  ['8.png', 'reel-drain-clog'],
  ['9.png', 'water-heater-closet', { bottom: 0.11 }],
  ['11.png', 'condensate-drain', { bottom: 0.14 }],
];
for (const [src, out, crop] of jobs) {
  let img = sharp(`assets/images/source/${src}`);
  const { width, height } = await img.metadata();
  if (crop) img = img.extract({ left: 0, top: 0, width, height: Math.round(height * (1 - crop.bottom)) });
  const w = Math.min(width * 2, 1600);
  await img.resize({ width: w, kernel: 'lanczos3' }).sharpen({ sigma: 0.8 }).modulate({ saturation: 0.92 })
    .jpeg({ quality: 84, mozjpeg: true }).toFile(`assets/images/work/${out}.jpg`);
  console.log('→', out);
}
