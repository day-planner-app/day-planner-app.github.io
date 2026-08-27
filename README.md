# Day Planner

A daily planner built around the shape of a day, not a grid of empty hours.

Every day here opens with **Wake up** and closes with **Go to bed**. Everything you plan lives on the timeline between those two bookends, so a day reads as a rhythm — when it starts, what it holds, when it ends — rather than as twenty-four identical slots waiting to be filled.

## The idea

Calendars are built for meetings: a fixed grid, every entry an appointment, empty space treated as availability. A day isn't really like that. It has a beginning and an end you actually control, a few things that matter, and a lot of room in between.

Day Planner encodes that difference in the data model. A time block is one of three kinds — `wake`, `sleep`, or `task` — and the two rituals are typed apart from the work. They render as the day's anchors: a light morning node at the top of the rail, a dark night node at the bottom, tasks strung between them. Morning is light-on-dark and night is dark-on-light, so the two ends of the day stay distinguishable in grayscale and without color vision.

The empty space between blocks is part of the plan, not a gap in it. A day with one task shows one task and a long quiet stretch, which is usually the honest picture.

## Views

Day, 3-Day, Week, and Month all render from the same timeline component, so a block looks and reads the same however far out you zoom.

- **Day** — one column, the full rail, every title and time.
- **3-Day** — the near horizon: today and what's immediately behind it.
- **Week** — Sunday through Saturday side by side, for seeing rhythm and imbalance across days.
- **Month** — compact cells showing each day's rituals and its first couple of tasks; clicking a date opens it in Day view.

Columns adapt to the width they're actually given rather than to the viewport, using CSS container queries. As a column narrows — a phone, or seven of them side by side — records drop their titles and collapse to icon plus time, keeping a scannable rail instead of overflowing text. Hidden titles stay in the accessibility tree, so screen readers and find-in-page still reach them.

## Status

This is an early prototype: the interface is real, the data is not. Days are generated from a fixed sample plan in [`src/data/samplePlan.ts`](src/data/samplePlan.ts) — wake at 8:00, bed at 22:00, and a handful of tasks that vary by weekday. Nothing persists across a reload yet.

Built but currently disabled: an inbox panel for capturing unstructured thoughts before they get a time. The `InboxTask` type and `InboxPanel` component are intact in the source; the drawer and its toggle are switched off in [`src/App.tsx`](src/App.tsx).

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Built with

React 19, TypeScript, Vite, Tailwind CSS 4, and daisyUI 5. The palette and radii live in a single daisyUI theme (`structured`) in [`src/index.css`](src/index.css); type is Manrope with Newsreader for display. Deployed as a static site on GitHub Pages.
