# Oluwa Towin

Luxury African ready-to-wear storefront for European customers, built with Next.js static export, Tailwind CSS, GSAP motion and Decap CMS.

## Features

- Luxury editorial storefront design
- Static export for Cloudflare Pages or Netlify
- Decap CMS at /admin for non-technical product updates
- Browser cart using localStorage
- WhatsApp-based order flow with bank transfer only
- Product, collection, story, lookbook, FAQ and checkout pages
- No backend, database or payment gateway required

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Static export build

```bash
npm run build
```

The project is configured for static export using `output: 'export'`.

Use `npm run preview` after building to inspect the production export at
`http://127.0.0.1:3001`. See [performance and image delivery](PERFORMANCE.md)
for image-quality settings, hosting requirements and verification commands.

## Deploying to Cloudflare Pages

1. Push the repo to GitHub.
2. Open Cloudflare Pages.
3. Create a project from GitHub.
4. Choose this repository.
5. Build command: `npm run build`
6. Output directory: `out`
7. Deploy.

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify, click New site from Git.
3. Choose the repo.
4. Build command: `npm run build`
5. Publish directory: `out`
6. Deploy.

## Admin login setup for Decap CMS

The simplest free auth method is the Git-based Git Gateway flow provided by Netlify or GitHub-backed hosting.

### Netlify method

1. In Netlify, enable Identity.
2. Enable Git Gateway.
3. Invite the brand owner to log in.
4. The owner visits /admin and signs in.
5. Decap CMS will save content to the repo.

### Cloudflare Pages method

- Use GitHub repository integration and deploy from GitHub.
- For editing access, use the hosted Git-based CMS flow supported by the chosen repository service.
- Keep the CMS files under `public/admin` and content under `content/`.

## Brand owner guide

### Add a new product

1. Go to /admin.
2. Click Products.
3. Add a new product entry.
4. Fill in all product fields.
5. Save.
6. The site rebuilds automatically.

### Mark a product as sold out

1. Open the product in the CMS.
2. Toggle Sold out?.
3. Save.

### Update the homepage

1. Open the CMS.
2. Update the featured products or homepage content.
3. Save.

## WhatsApp order flow

The checkout form creates a WhatsApp message and opens a pre-filled WhatsApp order. The brand owner receives the order details and sends bank details by WhatsApp after the customer confirms.

The site does not show bank details publicly.

## Important notes

- No backend or database is used.
- No payment gateway is connected.
- Payment is via bank transfer only.
- Product data is stored in Markdown files in `content/products`.
- Product updates are handled through the admin panel without touching code.
