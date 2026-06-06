# London Birthday Trip Site

Mobile-first web guide for Tiffany and Collin's London birthday trip, June 26-29, 2026.

## Live Site

The public GitHub Pages URL is:

https://mbediner.github.io/london-birthday-trip/

Every time the site is pushed to `main`, GitHub Actions deploys the latest version.

## What Is Included

- `index.html` - site structure and page sections.
- `styles.css` - mobile-first styling.
- `app.js` - itinerary data, map links, saved checklists, ticket wallet, and resource rendering.
- `assets/` - London photos used by the site.
- `.github/workflows/pages.yml` - GitHub Pages CI/CD workflow.
- `.nojekyll` - tells GitHub Pages to serve the static files exactly as-is.
- Legacy printable outputs remain in the folder: `.docx`, `.pdf`, and the original itinerary builder.

## Editing The Site

Most trip changes happen in `app.js`.

- Update the daily itinerary in the `days` array.
- Update Google Maps targets in `mapQueries`.
- Update pre-travel tasks in `todo`.
- Update packing items in `pack`.
- Update ticket reminders in `tickets`.
- Update app and safety links in `resources`.

Design changes happen in `styles.css`. The site intentionally has no build dependency, so small edits are easy and fast.

## Publishing Workflow

1. Edit the site files.
2. Commit the changes.
3. Push to the `main` branch.
4. GitHub Actions runs `Deploy GitHub Pages`.
5. The public site updates automatically.

The deployment workflow uses official GitHub Pages actions:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

## GitHub Pages Setup

For a new repository:

1. Create a public GitHub repo.
2. Push this folder to the repo's `main` branch.
3. In GitHub, open `Settings > Pages`.
4. Set the source to `GitHub Actions`.
5. Push again or run the `Deploy GitHub Pages` workflow manually.

## Local Preview

Open `index.html` in a browser. Because this is plain static HTML/CSS/JS, no local server is required.

## Update Rule

After every push, print the live site URL so the newest version can be checked immediately.

## Photo Sources

Photo credits are documented in the original itinerary README history and builder metadata. Current site images live in `assets/`.
