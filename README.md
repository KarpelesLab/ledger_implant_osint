# Ledger Implant OSINT

**Live site: https://karpeleslab.github.io/ledger_implant_osint/**

This project tracks publicly reported Ledger devices that were found with hardware implants. The reports come from posts and photos published by different people. Each entry records where the device was bought, the model, the implant version (if known), and links back to the original sources. Every picture is archived in this repo.

## Adding a report

Each report is a folder under `reports/`, named `YYYY-MM-DD-<retailer>-<location>`:

```
reports/2026-10-13-challenger-vivocity-sg/
  report.json      # report data (see src/reports.ts for the schema)
  *.jpg, *.mp4     # pictures and videos, stored with Git LFS
```

- Use the original-size pictures. For X/Twitter media, add `?name=orig` to the URL.
- In `report.json`, list each picture with its source post and original URL.
- List videos under `videos`, each with a `poster` still frame (for example `ffmpeg -ss 20 -i video.mp4 -frames:v 1 poster.jpg`).
- `implant.status` is one of `confirmed`, `suspected`, `unverified` or `clean`.

Pictures are stored with [Git LFS](https://git-lfs.com/), so run `git lfs install` once before cloning or committing.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
npm run lint
```

Every push to `master` is deployed to GitHub Pages by `.github/workflows/deploy.yml`.
