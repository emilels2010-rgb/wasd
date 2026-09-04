# Inferno Rankings

A fire-themed Minecraft points tier list. The top three scores are always S tier; everyone else is placed from A through F by their points.

## Customize it

Open `app/page.tsx`, replace entries in `players`, and change each tier's `min` score to use your own point cutoffs. Player names automatically link to NameMC.

## Local setup

Install Node.js 22+ and pnpm, then run `pnpm install` and `pnpm dev`.

## Publish free with GitHub Pages

1. Create a GitHub repository and upload this `fire-tierlist` folder. If replacing an existing Pages site, retain the included `CNAME` file.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The included workflow deploys the site after every push to `main`.
4. The Pages URL appears in the Actions run and under **Settings → Pages**.
