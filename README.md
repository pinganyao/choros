# Choros

An interactive map of Greek traditional music and dances. Explore cultural regions across Greece — from the Epirote mountains to the Cycladic islands — and discover the songs and dances that shape each corner of the country.

**Χορός** — dance, chorus, the circle of tradition.

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + TypeScript
- [React Router](https://reactrouter.com/) for client-side routing
- [D3.js](https://d3js.org/) for the interactive SVG map
- Plain CSS (no UI framework)

## Local development

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

The build runs `build:map` first, which generates `public/data/greece-map.json` from the source GeoJSON in `scripts/`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Vite. Confirm these settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. Deploy.

`vercel.json` is included for SPA routing (so `/about`, `/region/ikaria`, etc. work on refresh) and basic security/cache headers.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SITE_URL` | Recommended | Production URL (e.g. `https://choros.example.com`) for canonical tags, Open Graph URLs, and sitemap generation. On Vercel, `VERCEL_URL` is used automatically if this is unset. |

Copy `.env.example` to `.env.local` for local testing.

## SEO

- Per-page `<title>`, meta description, canonical URL, and Open Graph tags (via `PageMeta`)
- `public/og-logo.png` used as the social preview image
- `sitemap.xml` and `robots.txt` generated at build time when a site URL is available
- Visually hidden `h1` on the homepage for heading structure

## Project structure

```
choros/
├── public/              # Static assets (favicon, map data, social icons)
├── scripts/             # Map data build script + source GeoJSON
├── src/
│   ├── components/      # Layout, map, header, footer
│   ├── data/            # Region definitions and traditions
│   ├── pages/           # Home, region, about, 404
│   └── styles/          # Global CSS
├── index.html
├── vercel.json
└── vite.config.ts
```

## Map data

Region boundaries are built from Greek prefecture-unit GeoJSON. To regenerate after editing region assignments:

```bash
npm run build:map
```

## License

Private project. All rights reserved.
