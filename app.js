/* ============ Town Bus Hits — art-anchored player ============ */

const $ = (id) => document.getElementById(id);

/* ---------- where the paintings live ----------
   The day/night frames share one composition, so ONE set of boxes
   ([x1, y1, x2, y2] as % of image) pins the boards and hotspots in both
   modes. If the art is ever replaced, only these numbers change. */
const SCENES = {
  day:   { el: "art-day",   w: 1672, h: 941 },
  night: { el: "art-night", w: 1672, h: 941 },
};
const BOX = {
  whistle: [43.5, 61.0, 49.0, 71.0],
  horn:    [52.0, 52.5, 57.5, 59.5],
  engine:  [49.0, 57.0, 58.0, 74.0],
};
let mode = "day";

/* ---------- layout engine: pin overlays to the painting ---------- */
function layout() {
  const vw = window.innerWidth, vh = window.innerHeight;
  // position both images with cover-fit
  for (const m of ["day", "night"]) {
    const s = SCENES[m];
    const scale = Math.max(vw / s.w, vh / s.h);
    s.scale = scale;
    s.dx = (vw - s.w * scale) / 2;
    s.dy = (vh - s.h * scale) / 2;
    const img = $(s.el);
    img.style.left = s.dx + "px";
    img.style.top = s.dy + "px";
    img.style.width = s.w * scale + "px";
    img.style.height = s.h * scale + "px";
  }
  // overlays follow the ACTIVE painting
  const s = SCENES[mode];
  const put = (id, box) => {
    const el = $(id);
    const x = (box[0] / 100) * s.w * s.scale + s.dx;
    const y = (box[1] / 100) * s.h * s.scale + s.dy;
    const w = ((box[2] - box[0]) / 100) * s.w * s.scale;
    const h = ((box[3] - box[1]) / 100) * s.h * s.scale;
    el.style.left = x + "px"; el.style.top = y + "px";
    el.style.width = w + "px"; el.style.height = h + "px";
    return { x, y, w, h };
  };
  put("hot-whistle", BOX.whistle);
  put("hot-horn", BOX.horn);
  put("hot-engine", BOX.engine);

  if (location.hash.includes("debug")) {
    $("stage").classList.add("debug");
    const r = (id) => { const b = $(id).getBoundingClientRect(); return `${id}:${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}`; };
    document.title = `vw${vw}x${vh} s${s.scale.toFixed(3)} | ` + ["hot-whistle", "hot-horn", "hot-engine", "pill"].map(r).join(" | ");
  }
}
window.addEventListener("resize", layout);

/* ---------- day / night ---------- */
function setTheme(m) {
  mode = m;
  document.body.classList.toggle("night", m === "night");
  document.body.classList.toggle("day", m === "day");
  const dn = $("daynight");
  dn.setAttribute("aria-pressed", m === "night" ? "true" : "false");
  dn.setAttribute("aria-label", m === "night" ? "switch to day" : "switch to night");
  layout();
}
$("daynight").addEventListener("click", () => setTheme(mode === "day" ? "night" : "day"));
(function autoTheme() {
  const forced = location.hash.replace("#", "").split(",")[0];
  const h = new Date().getHours();
  const m = forced === "night" || forced === "day" ? forced : h >= 6 && h < 18 ? "day" : "night";
  mode = m;
  document.body.classList.toggle("night", m === "night");
  document.body.classList.toggle("day", m === "day");
  const dn = $("daynight");
  dn.setAttribute("aria-pressed", m === "night" ? "true" : "false");
  dn.setAttribute("aria-label", m === "night" ? "switch to day" : "switch to night");
})();

/* ---------- playlist mode ---------- */
const PLAYLIST_ID = (() => {
  if (typeof YT_PLAYLIST === "undefined" || !YT_PLAYLIST) return "";
  const m = YT_PLAYLIST.match(/[?&]list=([^&]+)/);
  return m ? m[1] : YT_PLAYLIST.trim();
})();
const usePlaylist = !!PLAYLIST_ID;

if (PLAYLIST_LINKS.spotify) { $("link-spotify").href = PLAYLIST_LINKS.spotify; $("link-spotify").hidden = false; }
const ytmLink = PLAYLIST_LINKS.ytmusic || (usePlaylist ? `https://music.youtube.com/playlist?list=${PLAYLIST_ID}` : "");
if (ytmLink) { $("link-ytmusic").href = ytmLink; $("link-ytmusic").hidden = false; }

/* ---------- shuffle order for fallback list ---------- */
const order = SONGS.map((_, i) => i);
for (let i = order.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [order[i], order[j]] = [order[j], order[i]];
}
let pos = 0;
let errorStreak = 0;

/* ---------- YouTube engine ---------- */
let player = null;
let playerReady = false;
let playing = false;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("yt", {
    width: "2",
    height: "2",
    playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
    events: {
      onReady: () => {
        playerReady = true;
        if (usePlaylist) player.cuePlaylist({ list: PLAYLIST_ID, listType: "playlist" });
        else cueCurrent();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.CUED) { attemptAutoplay(); }
        if (e.data === YT.PlayerState.CUED && usePlaylist) { player.setLoop(true); syncFromPlayer(); }
        if (e.data === YT.PlayerState.ENDED && !usePlaylist) next(+1);
        if (e.data === YT.PlayerState.PLAYING) { errorStreak = 0; setRolling(true); if (usePlaylist) syncFromPlayer(); }
        if (e.data === YT.PlayerState.PAUSED) setRolling(false);
      },
      onError: () => {
        errorStreak++;
        if (usePlaylist) { if (errorStreak < 40) setTimeout(() => player.nextVideo(), 400); }
        else if (errorStreak < SONGS.length) next(+1);
        else showSong({ title: "no playable songs — check songs.js", movie: "", year: "" });
      },
    },
  });
};

function currentSong() { return SONGS[order[pos]]; }

function cueCurrent() {
  const s = currentSong();
  player.cueVideoById(s.id);
  showSong(s);
  onSongChange();
}

let lastVideoId = null;
function cleanTitle(t) {
  if (!t) return "";
  t = t.split("|")[0];
  t = t.replace(/[\[\(][^\]\)]*[\]\)]/g, "");
  t = t.replace(/\b(video song|lyric video|lyrical video|lyrics?|official|full song|audio song|audio|hd|4k|hq|remastered|with subtitles?)\b/gi, "");
  return t.replace(/\s{2,}/g, " ").replace(/[\s\-–·_]+$/g, "").trim();
}
function syncFromPlayer() {
  const d = player.getVideoData && player.getVideoData();
  if (!d || !d.video_id || d.video_id === lastVideoId) return;
  lastVideoId = d.video_id;
  // YouTube leaves author empty on some uploads: fall back to the part of the
  // title after the dash ("Song — Movie"), so the second line is never blank
  const author = (d.author || "").replace(/\s*-\s*Topic$/i, "").trim();
  const full = d.title || "";
  const tail = full.split("|")[1] || full.split(/\s[-–]\s/)[1] || "";
  $("song-title").textContent = cleanTitle(full) || "…";
  $("song-sub").textContent = author || cleanTitle(tail) || "Town Bus Hits";
  $("thumb").src = `https://i.ytimg.com/vi/${d.video_id}/mqdefault.jpg`;
  document.title = `▶ ${cleanTitle(d.title)} · Town Bus Hits`;
  onSongChange();
}

function showSong(s) {
  $("song-title").textContent = s.title;
  $("song-sub").textContent = s.movie ? `${s.movie} · ${s.year}` : "";
  if (s.id) $("thumb").src = `https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`;
  document.title = s.movie ? `▶ ${s.title} · Town Bus Hits` : "Town Bus Hits";
}

function next(step) {
  if (usePlaylist) { step > 0 ? player.nextVideo() : player.previousVideo(); return; }
  pos = (pos + step + order.length) % order.length;
  const s = currentSong();
  player.loadVideoById(s.id);
  showSong(s);
  onSongChange();
}

function setRolling(on) {
  playing = on;
  if (on) musicStarted = true;
  document.body.classList.toggle("rolling", on);
}

let musicStarted = false;
let startPicked = false; // the ride's opening song is chosen exactly once

/* Which song the bus opens with is decided once, the moment the playlist is
   ready. Browsers usually block sound until the visitor interacts, so the
   chosen song sits cued and the first tap simply presses play on it —
   whatever is showing in the pill is what plays. */
function attemptAutoplay() {
  if (musicStarted || playing || !playerReady) return;
  try {
    if (!startPicked) {
      startPicked = true;
      if (usePlaylist) {
        player.setShuffle(true);
        const n = (player.getPlaylist() || []).length;
        if (n > 1) { player.playVideoAt(Math.floor(Math.random() * n)); return; }
      }
    }
    player.playVideo();
  } catch (_) {}
}
function firstTap() {
  audio();
  attemptAutoplay();
}
document.addEventListener("pointerdown", firstTap);
document.addEventListener("keydown", firstTap);

$("btn-play").addEventListener("click", () => {
  if (!playerReady) return;
  playing ? player.pauseVideo() : player.playVideo();
});
$("btn-next").addEventListener("click", () => { clickSfx(); next(+1); });
$("btn-prev").addEventListener("click", () => { clickSfx(); next(-1); });

/* seek */
let seeking = false;
$("seek").addEventListener("input", () => { seeking = true; });
$("seek").addEventListener("change", () => {
  if (playerReady && player.getDuration) player.seekTo((player.getDuration() * $("seek").value) / 100, true);
  seeking = false;
});
function fmt(t) {
  t = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
setInterval(() => {
  if (!playerReady || !player.getCurrentTime) return;
  const now = player.getCurrentTime() || 0;
  const total = player.getDuration() || 0;
  $("t-now").textContent = fmt(now);
  $("t-total").textContent = fmt(total);
  if (!seeking && total > 0) $("seek").value = (now / total) * 100;
}, 500);

/* keyboard */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); $("btn-play").click(); }
  if (e.code === "ArrowRight") $("btn-next").click();
  if (e.code === "ArrowLeft") $("btn-prev").click();
  if (e.key === "h") hornBlast();
  if (e.key === "w") blowWhistle();
});

/* ---------- per-song ---------- */
function onSongChange() {
  layout();
}

/* ---------- fellow passengers (fake presence for now) ----------
   Real version: Firebase Realtime DB presence (free) — each visitor writes a
   key with onDisconnect().remove(); the count is the number of keys. */
let riders = 9 + Math.floor(Math.random() * 8) + (new Date().getHours() >= 18 ? 4 : 0);
function updateRiders() {
  $("riders-n").textContent = riders;
  $("riders-count").innerHTML =
    `<b id="riders-n">${riders}</b> co-traveller${riders === 1 ? "" : "s"}`;
  $("riders").setAttribute("aria-label", `${riders} co-travellers right now`);
}
updateRiders();

/* the count drifts like a real bus filling and emptying: someone gets on or
   off every few minutes, never the same gap twice */
(function driftRiders() {
  const wait = 90000 + Math.random() * 150000; // 1.5 to 4 minutes
  setTimeout(() => {
    const el = $("riders");
    el.classList.add("shifting");
    setTimeout(() => {
      const step = Math.random() < 0.5 ? -1 : 1;
      riders = Math.min(26, Math.max(4, riders + step));
      updateRiders();
      el.classList.remove("shifting");
    }, 350);
    driftRiders();
  }, wait);
})();

/* ============ WHIMSY SOUNDS (synthesized, spatial) ============ */

let actx = null;
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function makePanner(x, y, z) {
  const p = audio().createPanner();
  p.panningModel = "HRTF";
  p.distanceModel = "inverse";
  p.refDistance = 1;
  try { p.setPosition(x, y, z); } catch (_) {}
  return p;
}
function sweepPanner(p, fromX, toX, dur) {
  const t0 = performance.now();
  (function step(t) {
    const k = Math.min(1, (t - t0) / (dur * 1000));
    try { p.setPosition(fromX + (toX - fromX) * k, 0.4, -1.5); } catch (_) {}
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* conductor's whistle: two sharp pea-whistle bursts ("weet—weet").
   triangle carrier for bite, FM trill + AM rattle for the pea, breath
   noise underneath, and a tanh stage for a slightly blown edge. */
function blowWhistle() {
  const ctx = audio();
  const pan = makePanner(-1.2, 0.2, -1);
  pan.connect(ctx.destination);

  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(2.1 * x); }
  shaper.curve = curve;
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(shaper).connect(pan);

  // shared breath-noise buffer
  const nlen = ctx.sampleRate * 0.5;
  const nbuf = ctx.createBuffer(1, nlen, ctx.sampleRate);
  const ndata = nbuf.getChannelData(0);
  for (let i = 0; i < nlen; i++) ndata[i] = Math.random() * 2 - 1;

  [[0, 0.3, 2450], [0.38, 0.24, 2700]].forEach(([offset, dur, f0]) => {
    const t = ctx.currentTime + offset;

    // envelope
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.42, t + 0.012);
    env.gain.setValueAtTime(0.42, t + dur - 0.07);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    // pea rattle: AM around 0.7
    const amNode = ctx.createGain();
    amNode.gain.value = 0.72;
    const am = ctx.createOscillator();
    am.frequency.value = 29;
    const amG = ctx.createGain();
    amG.gain.value = 0.28;
    am.connect(amG).connect(amNode.gain);

    // carrier with FM trill and a little pitch scoop at the attack
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f0 * 0.92, t);
    osc.frequency.exponentialRampToValueAtTime(f0, t + 0.035);
    const trill = ctx.createOscillator();
    trill.frequency.value = 29;
    const trillG = ctx.createGain();
    trillG.gain.value = 240;
    trill.connect(trillG).connect(osc.frequency);

    osc.connect(env).connect(amNode).connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
    trill.start(t); trill.stop(t + dur + 0.02);
    am.start(t); am.stop(t + dur + 0.02);

    // breath
    const breath = ctx.createBufferSource();
    breath.buffer = nbuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 3000; bp.Q.value = 1.2;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.05, t + 0.015);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    breath.connect(bp).connect(bg).connect(master);
    breath.start(t); breath.stop(t + dur + 0.02);
  });
}

/* musical air horn: passes left → right with a pitch drop */
function hornBlast() {
  const ctx = audio();
  const pan = makePanner(-7, 0.4, -1.5);
  const master = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 2400; lp.Q.value = 2;
  master.connect(lp).connect(pan); pan.connect(ctx.destination);
  const t = ctx.currentTime;
  const dur = 1.7;
  [392, 494, 587].forEach((f) => {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(f, t);
    o.frequency.setValueAtTime(f, t + dur * 0.55);
    o.frequency.linearRampToValueAtTime(f * 0.94, t + dur);
    const vib = ctx.createOscillator();
    vib.frequency.value = 6.2;
    const vibG = ctx.createGain(); vibG.gain.value = 5;
    vib.connect(vibG).connect(o.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.05);
    g.gain.setValueAtTime(0.12, t + dur - 0.35);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.05);
    vib.start(t); vib.stop(t + dur + 0.05);
  });
  sweepPanner(pan, -7, 7, dur);
}

/* engine idle: brown noise + low thump under the floor */
let engineNodes = null;
function engineToggle() {
  const ctx = audio();
  if (engineNodes) {
    engineNodes.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    const n = engineNodes; engineNodes = null;
    setTimeout(() => { n.src.stop(); n.osc.stop(); }, 500);
    $("hot-engine").classList.remove("on");
    $("hot-engine").setAttribute("aria-pressed", "false");
    document.body.classList.remove("engine");
    return;
  }
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 110;
  const osc = ctx.createOscillator();
  osc.type = "sine"; osc.frequency.value = 46;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 8.6;
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.35;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.8);
  lfo.connect(lfoG).connect(gain.gain);
  const pan = makePanner(0, -1.2, -2.2);
  src.connect(lp).connect(gain);
  osc.connect(gain);
  gain.connect(pan).connect(ctx.destination);
  src.start(); osc.start(); lfo.start();
  engineNodes = { src, osc, lfo, gain };
  $("hot-engine").classList.add("on");
  $("hot-engine").setAttribute("aria-pressed", "true");
  document.body.classList.add("engine");
}

/* small conductor-punch click */
function clickSfx() {
  const ctx = audio();
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = "square"; o.frequency.value = 620;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  o.connect(g).connect(ctx.destination);
  o.start(t); o.stop(t + 0.07);
}

$("hot-whistle").addEventListener("click", blowWhistle);
$("hot-horn").addEventListener("click", hornBlast);
$("hot-engine").addEventListener("click", engineToggle);

/* ---------- boot ---------- */
onSongChange();
layout();
$("art-day").addEventListener("load", layout);
$("art-night").addEventListener("load", layout);
