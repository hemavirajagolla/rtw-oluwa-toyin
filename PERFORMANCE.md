# Performance and image delivery

Measure a production export, not the Next.js development server:

```sh
npm run build
npm run preview
```

Open `http://127.0.0.1:3001` and run Chrome Lighthouse with mobile and desktop settings. The preview uses gzip for HTML, CSS and JavaScript. Production hosting must provide gzip or Brotli too. Scores vary with device load, network, browser and hosting; a local score is not a guarantee for a deployed URL.

## Image clarity

- Original images remain untouched in `public`.
- The build generates responsive WebP derivatives at quality 92 from the original JPEG masters where available, without upscaling.
- Browsers select an appropriate resolution using the display size and device pixel ratio. Cover crops receive enough source pixels to avoid accidental enlargement.
- 4:5 product cards and mobile galleries use derivatives matching their existing visible crop, avoiding downloads of pixels outside the frame.
- Product hover zoom and lookbook lightboxes use full-resolution originals.
- Generated assets have content-hashed names. `_headers` enables long-lived caching on Netlify and Cloudflare Pages. Other hosts need equivalent cache configuration.
- Run the build after CMS image changes. The image manifest and responsive assets are generated automatically for both development and production.

## Rendering changes

- Product grids render in the static HTML. Only query-string synchronization needs a client-only boundary.
- Above-the-fold content is visible immediately, without waiting for entrance animations.
- Navigation and product links do not speculatively download unrelated page bundles. Route code loads when the visitor follows a link.
- Cart, search and filter drawers use CSS entrance transitions. Collection filtering no longer measures and animates the entire grid.
- Carousels retain buttons, tabs and swipe controls; slides change on user input rather than an automatic timer.
- Page-specific styles load with their routes. Next.js production CSS inlining removes initial stylesheet request waterfalls, at the cost of larger HTML and reduced independent stylesheet caching on full-page loads.
- Below-the-fold home sections use browser rendering containment.
- A postbuild step creates the filenames the Next.js client router expects from Windows static exports.

## Verification

```sh
npm run lint
node scripts/check-site.mjs
```

The browser check requires Google Chrome and the running production preview. It checks all 22 storefront routes at desktop and mobile widths, missing resources, horizontal overflow, filtering, search navigation and adding a product to the cart. Local screenshots and measurements are saved in `reports/` (excluded from Git).
