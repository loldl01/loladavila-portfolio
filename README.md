# Lola Davila Portfolio

Static fashion styling and creative production portfolio deployed from `main` through Cloudflare Pages.

## Site structure

- `index.html` — Hero, Selected Work, Archive, Experience / About and Contact.
- `projects/` — Stable individual URL for every production.
- `projects.js` — Generated project titles, descriptions, featured images and complete galleries.
- `script.js` — Main-page rendering and interactions.
- `project-page.js` — Shared rendering and navigation for individual projects.
- `styles.css` — Consolidated editorial design for desktop, tablet and mobile.
- `Assets/Images/` — Original production folders and image files.

## Updating the gallery

After adding, moving or deleting files inside `Assets/Images/`, run:

```bash
node scripts/build-projects.mjs
node scripts/check-portfolio.mjs
```

The build script keeps the existing folder names, excludes unsupported browser formats and regenerates the central project data plus the 20 individual pages. Project titles, order, descriptions and featured-image choices are configured in `scripts/build-projects.mjs`.

## Confirmed design decisions

- All visitor-facing content is in English.
- The current shaved-head portrait remains the cover.
- `LOLA` and `DAVILA` move in opposite directions.
- Only the hero intentionally uses `object-fit: cover`.
- All portfolio and About images preserve their complete frame with `object-fit: contain`.
- `BACKSTAGE` imagery appears as the rotating visual in About; `CONTACT SHEETS` remains the final project.
- Instagram: `https://instagram.com/loladl_st`
- Email: `loladavilast@gmail.com`
