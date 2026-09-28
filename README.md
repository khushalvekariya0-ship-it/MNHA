# MNHA — Your Wealth

A professional investing-platform frontend (Groww-style) built with **Next.js 15**, **React 19**, **TypeScript** and **Tailwind CSS v4**.

## Pages

- `/` — Landing page (hero, stats, products, why MNHA, steps, CTA)
- `/info` — About the company
- `/contact` — Contact form + office details
- `/try` — SIP & lumpsum calculator (interactive, no account needed)
- `/signup` — Account creation form

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Production build

```bash
npm run build
npm start
```

## Notes

- Frontend only — forms show a success state locally and are not wired to any backend yet.
- Brand colors and tokens live in `app/globals.css` under `@theme`.
