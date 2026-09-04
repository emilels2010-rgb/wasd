# Element SMP tier bot

This bot registers `/givetier player points`. It writes player totals to `data/players.json` in the website repository; the live site loads that file whenever a visitor opens or refreshes the page.

## Deploy

1. Your bot Application ID is already configured. Invite it to your server (if needed) with [this invite link](https://discord.com/oauth2/authorize?client_id=1477090615912300675&permissions=0&scope=bot%20applications.commands).
2. Create a fine-grained GitHub personal access token limited to `emilels2010-rgb/wasd`, with **Contents: Read and write**.
3. Create a new Node service on Railway, Render, or a VPS. Set its root directory to `bot`, then add every value in `.env.example` as a host environment variable. Never commit a real token.
4. Run `npm install`, then `npm start`. The bot registers its command in the configured server immediately.

`/givetier` is restricted to people with Discord’s **Manage Server** permission, or the optional `STAFF_ROLE_ID` role.
