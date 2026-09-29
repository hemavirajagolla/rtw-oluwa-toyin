import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Keep originals untouched. Generate high-quality, device-sized derivatives.
const root = path.resolve('public');
const output = path.join(root, 'responsive');
await mkdir(output, { recursive: true });
const manifest = {};
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (file === output) continue;
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
    if (/\.jpg$/i.test(file)) {
      try { await access(file.replace(/\.jpg$/i, '.webp')); continue; } catch { /* Standalone upload. */ }
    }
    let original = file;
    if (/\.webp$/i.test(file)) {
      const master = file.replace(/\.webp$/i, '.jpg');
      try { await access(master); original = master; } catch { /* No master: use the supplied image. */ }
    }
    const input = await readFile(original);
    const meta = await sharp(input).metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    const id = createHash('sha256').update(input).update('responsive-v1-q92').digest('hex').slice(0, 16);
    const widths = [...new Set([96, 160, 240, 360, 480, 640, 800, 1080, 1440, 1920, 2160, width].filter(w => w <= width))].sort((a, b) => a - b);
    const variants = [];
    for (const w of widths) {
      const name = `${id}-${w}.webp`;
      try { await access(path.join(output, name)); }
      catch { await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 92, effort: 6 }).toFile(path.join(output, name)); }
      variants.push({ width: w, src: `/responsive/${name}` });
    }
    const portraitVariants = [];
    // These reproduce the existing 4:5 card's horizontal cover crop, so pixels
    // outside that visible area do not have to be downloaded. No upscaling.
    if (width / height > 0.8) {
      for (const w of widths.filter(w => w <= Math.floor(height * 0.8))) {
        const name = `${id}-portrait-${w}.webp`;
        try { await access(path.join(output, name)); }
        catch { await sharp(input).rotate().resize({ width: w, height: Math.round(w / 0.8), fit: 'cover', position: 'centre' }).webp({ quality: 92, effort: 6 }).toFile(path.join(output, name)); }
        portraitVariants.push({ width: w, src: `/responsive/${name}` });
      }
    }
    manifest['/' + path.relative(root, file).split(path.sep).join('/')] = {
      width, height, original: '/' + path.relative(root, original).split(path.sep).join('/'), variants, portraitVariants,
    };
  }
}
await walk(root);
await writeFile('lib/image-manifest.json', JSON.stringify(manifest));
console.log(`Prepared responsive images for ${Object.keys(manifest).length} originals.`);
