# Calculapedia

Free material & cost calculators for DIY and contractors — [calculapedia.com](https://calculapedia.com).

A dependency-free static site. Every calculator is defined as data in `build.js`, which
generates the deployable site into `dist/`.

## Build

```bash
npm run build      # or: node build.js
```

This writes all pages, `sitemap.xml`, `robots.txt`, and `style.css` into `dist/`.

## Deploy (Cloudflare Pages)

- **Build command:** `npm run build`
- **Build output directory:** `dist`

Pushing to `main` triggers an automatic deploy.

## Add a calculator

Add an entry to the `C[]` array in `build.js` (and a category in the `CAT` map),
then rebuild. No other files to touch.
