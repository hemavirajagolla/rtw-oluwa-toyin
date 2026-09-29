import manifest from './image-manifest.json';

type ImageEntry = { width: number; height: number; original?: string; variants: { width: number; src: string }[]; portraitVariants?: { width: number; src: string }[] };

export function fullResolutionImage(src: string) {
  return (manifest as Record<string, ImageEntry>)[src]?.original ?? src;
}

export function responsiveImage(src: string, sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw', portrait = false) {
  const entry = (manifest as Record<string, ImageEntry>)[src];
  if (!entry) return { src, sizes };
  // Cover-cropped landscape photos need more source pixels than their box width.
  // Reserve enough pixels for the site's portrait cards, including retina displays.
  const cropped = portrait && entry.portraitVariants?.length ? entry.portraitVariants : undefined;
  const coverScale = cropped ? 1 : Math.max(1, entry.width / entry.height / 0.75);
  const coverSizes = sizes.replace(/(^|,\s*|\)\s*)([\d.]+)(vw|px)/g,
    (_, prefix, value, unit) => `${prefix}${Math.ceil(Number(value) * coverScale)}${unit}`);
  return {
    src,
    width: cropped ? Math.round(entry.height * 0.8) : entry.width,
    height: entry.height,
    srcSet: (cropped ?? entry.variants).map(image => `${image.src} ${image.width}w`).join(', '),
    sizes: coverSizes,
  };
}
