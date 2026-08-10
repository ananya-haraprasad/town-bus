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
        if (e.data === YT.PlayerState.CUED) {
          if (usePlaylist) player.setLoop(true);
          beginProbe();
        }
        if (e.data === YT.PlayerState.ENDED && !usePlaylist) next(+1);
        if (e.data === YT.PlayerState.PLAYING) {
          errorStreak = 0;
          if (probing) { probeSucceeded(); return; }
          setRolling(true);
          if (usePlaylist) syncFromPlayer();
        }
        if (e.data === YT.PlayerState.PAUSED && !probing) setRolling(false);
      },
      /* A song whose label blocks embedding errors the instant it plays. The
         probe below finds those while muted, so the visitor never sees one. */
      onError: () => {
        errorStreak++;
        if (usePlaylist) {
          if (errorStreak < 40) setTimeout(() => player.nextVideo(), 300);
          else { probing = false; document.body.classList.remove("boarding"); }
        } else if (errorStreak < SONGS.length) next(+1);
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
let probing = false;    // silently auditioning songs, muted, before anyone looks
let probeDone = false;
let userWants = false;  // the visitor has asked for sound, so stop tiptoeing

/* Pick the ride's opening song, then audition it MUTED. Browsers allow muted
   playback without a gesture, so this is how we learn whether a song is
   actually playable: anything its label blocks from embedding errors here and
   gets skipped while nobody is watching. Whatever survives is what the pill
   shows, so pressing play always plays the song on screen. */
function beginProbe() {
  if (probeDone || probing || musicStarted || !playerReady) return;
  probing = true;
  document.body.classList.add("boarding");
  try {
    player.mute();
    if (usePlaylist) {
      player.setShuffle(true);
      const n = (player.getPlaylist() || []).length;
      if (n > 1) { player.playVideoAt(Math.floor(Math.random() * n)); return; }
    }
    player.playVideo();
  } catch (_) { probing = false; }
}

function probeSucceeded() {
  probing = false;
  probeDone = true;
  document.body.classList.remove("boarding");
  try {
    if (userWants) {
      // they already pressed play while we were auditioning: just turn it up
      player.unMute();
      player.setVolume(100);
      setRolling(true);
    } else {
      player.pauseVideo();
      player.seekTo(0, true);
    }
  } catch (_) {}
  syncFromPlayer();
}

/* The first real tap anywhere turns the sound on and plays what is already
   showing. Taps on the player's own buttons are left alone — they have their
   own handlers, and doing both would start and instantly stop the song. */
const OWN_HANDLER_KEYS = ["Space", "ArrowLeft", "ArrowRight"];
function firstTap(e) {
  audio();
  userWants = true;
  if (e && e.type === "keydown" && OWN_HANDLER_KEYS.includes(e.code)) return;
  if (e && e.target && e.target.closest && e.target.closest("#controls, #seekbox, .hotspot")) return;
  if (musicStarted || playing || !playerReady) return;
  try {
    player.unMute();
    player.setVolume(100);
    player.playVideo();
  } catch (_) {}
}
document.addEventListener("pointerdown", firstTap);
document.addEventListener("keydown", firstTap);

$("btn-play").addEventListener("click", () => {
  if (!playerReady) return;
  if (playing) { userWants = false; player.pauseVideo(); return; }
  userWants = true;
  try { player.unMute(); player.setVolume(100); } catch (_) {}
  player.playVideo();
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
  $("riders").setAttribute("aria-label", `உடன் பயணிகள் ${riders}`);
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
/* The conductor's whistle.
   A pea whistle is mostly AIR: a hard band of noise around 3 kHz shaped by the
   chamber, with the pea rattling inside so the whole thing warbles about 28
   times a second. Tones alone sound like a synth beep, so noise carries it and
   two thin partials only ride on top. */
let noiseBuf = null;
function noiseSource(ctx) {
  if (!noiseBuf) {
    const len = Math.floor(ctx.sampleRate * 1.2);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  return src;
}

function blowWhistle() {
  const ctx = audio();
  const pan = makePanner(-1.2, 0.2, -1);
  const out = ctx.createGain();
  out.gain.value = 0.9;
  out.connect(pan); pan.connect(ctx.destination);

  // prreep — preep: second burst a touch higher and shorter
  [{ at: 0, dur: 0.30, f: 2850 }, { at: 0.36, dur: 0.23, f: 3020 }].forEach((b) => {
    const t = ctx.currentTime + b.at;
    const end = t + b.dur;

    // the pea: one warble every layer of this burst shares
    const pea = ctx.createOscillator();
    pea.type = "triangle";
    pea.frequency.setValueAtTime(25, t);
    pea.frequency.linearRampToValueAtTime(31, end);
    pea.start(t); pea.stop(end + 0.03);

    // air through the chamber, the body of the sound
    const air = noiseSource(ctx);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.setValueAtTime(b.f, t);
    band.Q.value = 8.5;
    const wobble = ctx.createGain();
    wobble.gain.value = 300;            // pea shoves the resonance around
    pea.connect(wobble).connect(band.frequency);
    const airGain = ctx.createGain();
    airGain.gain.setValueAtTime(0.0001, t);
    airGain.gain.exponentialRampToValueAtTime(0.5, t + 0.014);
    airGain.gain.setValueAtTime(0.44, end - 0.06);
    airGain.gain.exponentialRampToValueAtTime(0.0001, end);
    air.connect(band).connect(airGain).connect(out);
    air.start(t); air.stop(end + 0.03);

    // pitched core, tremolo'd by the same pea
    [{ m: 1, lvl: 0.17 }, { m: 1.33, lvl: 0.055 }].forEach((p) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(b.f * p.m * 0.985, t);
      o.frequency.exponentialRampToValueAtTime(b.f * p.m, t + 0.04);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(p.lvl, t + 0.016);
      g.gain.setValueAtTime(p.lvl * 0.85, end - 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      const trem = ctx.createGain();
      trem.gain.value = p.lvl * 0.5;
      pea.connect(trem).connect(g.gain);
      o.connect(g).connect(out);
      o.start(t); o.stop(end + 0.03);
    });

    // the chiff of breath at the very start
    const chiff = noiseSource(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 2000;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.2, t);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    chiff.connect(hp).connect(cg).connect(out);
    chiff.start(t); chiff.stop(t + 0.07);
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
