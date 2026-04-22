# damon-blog

Personal site and blog of Weiting Liu — Staff SRE at Indeed, based in Tokyo.

## Live site

**https://liuweiting94-svg.github.io/damon-blog/**

| Page | URL |
|------|-----|
| Home | `/damon-blog/` |
| Blog post | `/damon-blog/blog/<slug>` |

### Published posts

| Slug | Title |
|------|-------|
| `kafka-consumer-lag` | Your Kafka Lag Monitor Is Lying to You |
| `interference-relation-smt` | Teaching an SMT Solver to Think About Threads |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/damon-blog](http://localhost:3000/damon-blog).

## Build & deploy

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`), which runs `npm run build` and deploys the `out/` directory to GitHub Pages automatically.

To build locally:

```bash
npm run build   # outputs to out/
```

## Stack

- [Next.js 16](https://nextjs.org) — App Router, static export
- [Tailwind CSS 4](https://tailwindcss.com)
- Fonts: Playfair Display (headings) + DM Serif Text (body) via `next/font/google`
