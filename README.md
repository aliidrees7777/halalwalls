# HalalWalls

Free HD & 4K wallpaper platform — homepage demo built from design screenshot.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Lucide React

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── layout.tsx
│   └── globals.css       # Dark theme tokens
├── components/
│   ├── home/             # Header, search, filters, grid, sidebar
│   └── layout/           # Footer
├── data/                 # Mock wallpapers, filters, sidebar
└── types/
```

## Features

- Sticky header with dropdown nav, Premium link, Sign In, history icon
- Search bar + horizontal filter pills (Latest active = green)
- Left sidebar: resolutions, app/QR, trending, categories
- 3-column wallpaper grid with hover scale + favorite hearts
- Skeleton loading on filter/search/page change
- Pagination (1–9, …, 100, Next)
- Footer links + social buttons
- Responsive: sidebar stacks on mobile, 1→2→3 column grid

Mock data only — no backend or APIs.
