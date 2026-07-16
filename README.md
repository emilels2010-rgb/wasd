# McEvents website + PvP Tierlist

A build-free replacement for the current `mcevents.uk` GitHub Pages site. It includes a redesigned home page, a dedicated Tierlist tab, automatic Minecraft skin avatars, NameMC profile links, and a private ranking manager.

## What is included

- `index.html` — redesigned home page
- `tierlist.html` — public points tierlist with search, automatic tier bands, live skin avatars, and NameMC links
- `admin/index.html` — private points-editing workspace at `/admin/`
- `data/tierlist.json` — the public player scores and calculated rankings
- `site.config.js` — server, Discord, skin, NameMC, and GitHub settings
- `assets/` — shared CSS and JavaScript; no build tools or package install required

## Deploy

1. Back up the current website repository.
2. Copy everything in this folder into the repository root, replacing the old `index.html`, `style.css`, and `script.js` setup.
3. Keep the repository's existing `CNAME` file if it has one. This bundle intentionally does not replace it.
4. Open `site.config.js` and set `github.owner`, `github.repo`, and (if needed) `github.branch`.
5. Update the player scores in `data/tierlist.json`, or deploy first and use `/admin/`.
6. Commit and push. GitHub Pages will publish the site as usual.

You can preview locally with any static web server. Do not open the HTML with a `file://` URL because browsers block the JSON request in that mode.

## Update the tierlist

Open `https://mcevents.uk/admin/` after deployment.

### Direct publish through GitHub

1. Create a **fine-grained personal access token** in GitHub.
2. Restrict its repository access to the website repository only.
3. Give it **Contents: read and write** permission. No administration, workflow, or account permissions are needed for the included data-file workflow.
4. In the manager, enter the repository owner, repository name, branch, JSON path, and token.
5. Select **Load from GitHub**, edit player points, review the automatically calculated tiers, and select **Publish to GitHub**.

The repository settings are kept in local browser storage. The token is kept in `sessionStorage`, meaning it is scoped to that browser tab session; it is never written into the site, the JSON, an export, or local storage. Use **Forget token** before leaving a shared computer.

GitHub documentation: [managing fine-grained tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and [repository contents API](https://docs.github.com/en/rest/repos/contents).

### Manual publish

The manager also works without a GitHub connection. Edit the rankings, select **Export JSON**, then replace `data/tierlist.json` in the repository with the downloaded file. You can also import a prior export.

## Player data

Each player supports:

```json
{
  "username": "MinecraftName",
  "points": 750,
  "tier": "a",
  "rank": 4,
  "tierRank": 1,
  "specialty": "Sword PvP",
  "note": "Optional test result or staff note"
}
```

- `points` must be a whole number from 0 to 1,000.
- `tier`, `rank`, and `tierRank` are calculated automatically whenever the manager, public site, or Discord bot processes the file. Do not use them to place a player manually.
- The three highest positive scores are always S Tier.
- After the top three, A Tier is 601–1,000, B Tier is 401–600, C Tier is 201–400, and D Tier is 1–200.
- A player with 0 points remains in the manager and JSON but is unranked and hidden from the public board.
- The username supplies the current avatar through the configured skin-image service.
- The entire public card links to `https://namemc.com/profile/{username}`.
- If you later add a stable Minecraft UUID as `"uuid": "..."`, the public scripts automatically use it for the NameMC link.
- Keep Java usernames to 3–16 letters, numbers, and underscores.

The public tierlist and home-page podium check for new JSON data every 60 seconds and whenever the tab becomes active, so a deployed Discord-bot or GitHub update appears without a manual refresh.

## Quick configuration

Edit `site.config.js`:

```js
window.MCEVENTS_CONFIG = {
  site: {
    name: "McEvents",
    serverAddress: "play.mcevents.uk",
    discordUrl: "https://discord.gg/fdSwxhUf5p"
  },
  tierlist: {
    dataUrl: "data/tierlist.json",
    skinUrl: "https://mc-heads.net/avatar/{username}/160",
    nameMcUrl: "https://namemc.com/profile/{username}"
  },
  github: {
    owner: "YOUR_GITHUB_USERNAME",
    repo: "YOUR_REPOSITORY",
    branch: "main",
    dataPath: "data/tierlist.json"
  }
};
```

## Security note

The `/admin/` page is not linked publicly and is marked `noindex`, but its address is not a password. Publishing still requires a GitHub token with permission to the configured repository. For a larger staff team, the recommended next step is a same-domain API protected by Cloudflare Access, so staff can sign in by email instead of handling GitHub tokens.
