# MOODLE LMS (Next.js)

A Learning Management System prototype built with Next.js (App Router). Includes multi-page layout, dark/light themes, tabbed content editor with output generator, and accessibility improvements.

## Setup

```bash
npm install
npm run dev
```

- Dev server: http://localhost:3000
- Node 18+ recommended

## Features

- Header with student number (left), centered title, theme toggle + hamburger menu (right)
- Footer (fixed): © 2025, Arunjot Babra, 21406232, Date
- Pages: Home, About, Escape Room, Coding Races, Court Room
- Dark/Light mode with persistence
- Hamburger menu with CSS transform animation and a11y (button, aria-expanded, ESC/Click-outside)
- Tabs (Home):
  - Up to 15 tabs (+ / -)
  - Rename tab headings (double-click)
  - Per-tab content editing
  - Persisted to localStorage
  - Last active tab remembered via cookie
- Output generator:
  - Produces HTML with ONLY inline CSS (no classes, no <style>)
  - Copy to clipboard and paste as Hello.html to open in a browser

## Branching

- main: stable integration
- feature/theme-toggle: theme + header standardization + a11y fixes
- feature/tabs-and-output: tabs, localStorage, inline-only output
- feature/accessibility: accessibility enhancements

## Scripts

```bash
npm run dev     # start dev server
npm run build   # build
npm start       # run production build
```

## Repository Hygiene

- node_modules is excluded via root .gitignore
- .next and .DS_Store also ignored

## Notes

- Video demo to be added later (1, 3, 5 tabs outputs)
