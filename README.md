# Town Bus Hits · டவுன் பஸ் ஹிட்ஸ்

The songs your Tamil Nadu town bus raised you on.
Inspired by [Deluxe Saloon (saloon.wtf)](https://saloon.wtf) by [Yash Bhardwaj](https://x.com/ybhrdwj).

Music streams from YouTube through their official iframe player (hidden, audio only), so YouTube handles playback and licensing. Nothing is hosted or re-encoded here. The whistle, horn and engine sounds are synthesized in the browser with the Web Audio API, so they have no licensing at all.

## Run locally

```bash
cd town-bus
python3 -m http.server 4173
```

Open http://localhost:4173. Don't open index.html directly as a file, the YouTube API needs a proper http origin.

## Edit the playlist

Everything is in `songs.js`. One row per song: YouTube video id (the 11 characters after `watch?v=`), title, movie, year. Videos that block embedding get skipped automatically, so just add and see.

## Edit routes, quotes, links

All in `content.js`:
- `PLAYLIST_LINKS`: paste your Spotify / YT Music playlist URLs and the top-right buttons appear.
- `ROUTES`: the painted route boards (one picked per song).
- `QUOTES`: the signage (Thirukkural, bus-back wisdom).
- `I18N`: all UI text, English and Tamil.

## Add bus chatter (optional)

1. Go to freesound.org, search "india bus ambience" or "indian street crowd".
2. Filter licence = Creative Commons 0 (no attribution needed, safest).
3. Download, convert to mp3 if needed, save as `assets/chatter.mp3`.

The கூட்டம் (chatter) button appears automatically once the file exists. It plays with or without music and slowly orbits around your head on headphones.

## Swap in generated art

The whole background scene is the `<div id="scene">` block in `index.html`. To use Midjourney art instead, replace that block with:

```html
<div id="scene"><img src="assets/hero.jpg" alt="" style="width:100%;height:100%;object-fit:cover"></div>
```

Keep two versions (`hero-day.jpg`, `hero-night.jpg`) and swap by the `body.night` class if you want day/night to survive. Prompts are in `prompts.md`.

## Deploy free (GitHub Pages, personal account)

1. Create a new public repo on your personal GitHub, e.g. `town-bus`.
2. In this folder:

```bash
git init && git add -A && git commit -m "town bus hits" && git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/town-bus.git && git push -u origin main
```

3. Repo → Settings → Pages → Source: `main` branch, root. Done.
4. Site lives at `https://YOUR_USERNAME.github.io/town-bus/`. A custom domain like `.wtf` costs money (about $5-30/yr at Porkbun/Namecheap), totally optional.

Cloudflare Pages and Netlify also work (drag-and-drop the folder), also free.

## Live "travelling with N others" counter

Currently a believable fake (random walk, evening bump). To make it real for free: create a Firebase project on your personal Google account, enable Realtime Database (Spark plan, free, no card), and replace the presence block in `app.js` (it's marked). Each visitor writes a key with `onDisconnect().remove()`, the count is the number of keys.
