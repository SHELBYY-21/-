# EDGE ARENA

Responsive football intelligence MVP for match preparation, squad readiness and tactical scenarios.

The squad view requests Arsenal roster data and player headshots from ESPN's public client API at runtime. A curated local fallback keeps the app usable when that service is unavailable. Readiness scores and tactical recommendations are product-demo data and must not be treated as medical or sporting advice.

## Run locally

```bash
npm ci
npm run dev
```

## Production

```bash
npm run build
docker build -t edge-arena .
docker run --rm -p 8080:80 edge-arena
```
