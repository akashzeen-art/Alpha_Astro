# Astro Live TV — Frontend

**Brand:** Astro Live TV (`astrolivetv.com`)  
**Backend:** Shared Spring Boot API at `/api/v1`

## Design

| Aspect | Direction |
|--------|-----------|
| Theme | Observatory ink · frost · aurora mint · sky |
| Fonts | Fraunces (display) + Sora (body) |
| Hero | Full-bleed brand composition, no card clutter |
| Background | Canvas starfield + aurora haze |
| Contrast to siblings | Not violet (GrahVeda), not saffron (My Astro Sutra) |

## Local dev

```bash
cd "Alpha Astro"
npm install
npm run dev
```

## Deploy

```bash
bash deploy-alphaastro.sh
```

Or:

```bash
bash deploy-frontend.sh "Alpha Astro" /var/www/vaszeen/alphaastro-www
```

Primary domain: `astrolivetv.com` (+ www). Add CORS origins and nginx via `deploy-alphaastro.sh`.
