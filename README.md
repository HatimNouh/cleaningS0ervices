# Al-IktisahIntegrated

Bilingual React + Vite website for `Al-Iktisah Integrated Home Services Company` in Tripoli.

## Stack

- React 19
- TypeScript
- Vite
- GitHub Pages via GitHub Actions

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

## Deployment

The site is built with Vite and deployed through `.github/workflows/deploy.yml`.

`vite.config.ts` sets the GitHub Pages base path automatically from the repository name during GitHub Actions builds, so the public path follows the active repo name once GitHub finishes the rename.
