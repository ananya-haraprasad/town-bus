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

## Edit routes, links, boards

All in `content.js`:
- `PLAYLIST_LINKS`: your Spotify / YT Music playlist URLs (the top-right icons).
- `ROUTES`: the painted route boards (one picked per visit).

The blue board shows a random Thirukkural per visit from `kural.js` (all 1330,
public domain). About one visit in twelve it shows "யாதும் ஊரே யாவரும் கேளிர்"
instead — that one is Purananuru, not a kural, and is credited as such.

## Swap in generated art

The paintings live in `assets/day.jpg` and `assets/night.jpg` — two frames with
the same composition, crossfaded by the `body.night` class. Board and hotspot
positions are one shared set of percentage boxes (`BOX` at the top of `app.js`);
if the art is ever replaced, only those numbers change. Prompts are in `prompts.md`.

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
