/* ============ Town Bus Hits — player + interior ============ */

const $ = (id) => document.getElementById(id);

/* ---------- language ---------- */
let lang = "en";
function applyLang() {
  $("title").textContent = I18N[lang].title;
}
$("lang-toggle").addEventListener("click", () => {
  lang = lang === "en" ? "ta" : "en";
  applyLang();
});

/* ---------- day / night ---------- */
function setTheme(mode) {
  document.body.classList.toggle("night", mode === "night");
  document.body.classList.toggle("day", mode === "day");
  $("theme-toggle").textContent = mode === "night" ? "☾" : "☀︎";
}
$("theme-toggle").addEventListener("click", () =>
  setTheme(document.body.classList.contains("night") ? "day" : "night")
);
(function autoTheme() {
  const h = new Date().getHours();
  setTheme(h >= 6 && h < 18 ? "day" : "night");
})();

/* ---------- portrait crop: zoom into the front of the bus ---------- */
function fitView() {
  $("scene-svg").setAttribute(
    "viewBox",
    window.innerHeight > window.innerWidth ? "440 60 580 840" : "0 0 1440 900"
  );
}
fitView();
window.addEventListener("resize", fitView);

/* ---------- playlist mode ---------- */
// If YT_PLAYLIST is set, the site plays that YouTube playlist live:
// songs added to the playlist appear automatically.
const PLAYLIST_ID = (() => {
  if (typeof YT_PLAYLIST === "undefined" || !YT_PLAYLIST) return "";
  const m = YT_PLAYLIST.match(/[?&]list=([^&]+)/);
  return m ? m[1] : YT_PLAYLIST.trim();
})();
const usePlaylist = !!PLAYLIST_ID;

/* ---------- playlist links ---------- */
if (PLAYLIST_LINKS.spotify) {
  $("link-spotify").href = PLAYLIST_LINKS.spotify;
  $("link-spotify").hidden = false;
}
const ytmLink = PLAYLIST_LINKS.ytmusic ||
  (usePlaylist ? `https://music.youtube.com/playlist?list=${PLAYLIST_ID}` : "");
if (ytmLink) {
  $("link-ytmusic").href = ytmLink;
  $("link-ytmusic").hidden = false;
}

/* ---------- shuffle order, random start ---------- */
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
        if (usePlaylist) {
          player.cuePlaylist({ list: PLAYLIST_ID, listType: "playlist" });
        } else {
          cueCurrent();
        }
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.CUED && usePlaylist) {
          player.setLoop(true);
          syncFromPlayer();
        }
        if (e.data === YT.PlayerState.ENDED && !usePlaylist) next(+1);
        if (e.data === YT.PlayerState.PLAYING) {
          errorStreak = 0;
          setRolling(true);
          if (usePlaylist) syncFromPlayer();
        }
        if (e.data === YT.PlayerState.PAUSED) setRolling(false);
      },
      onError: () => {
        errorStreak++;
        if (usePlaylist) {
          if (errorStreak < 40) setTimeout(() => player.nextVideo(), 400);
        } else if (errorStreak < SONGS.length) {
          next(+1);
        } else {
          showSong({ title: "no playable songs — check songs.js", movie: "", year: "" });
        }
      },
    },
  });
};

function currentSong() { return SONGS[order[pos]]; }

// first paint: song is cued and shown; browsers only allow sound after a
// real tap/click, so the first interaction anywhere starts playback
function cueCurrent() {
  const s = currentSong();
  player.cueVideoById(s.id);
  showSong(s);
  newRoute();
  punchTicket();
}

/* playlist mode: show whatever video the player is on, clean up the title */
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
  const author = (d.author || "").replace(/\s*-\s*Topic$/i, "");
  $("song-title").textContent = cleanTitle(d.title) || "…";
  $("song-sub").textContent = author;
  $("thumb").src = `https://i.ytimg.com/vi/${d.video_id}/mqdefault.jpg`;
  document.title = `▶ ${cleanTitle(d.title)} · Town Bus Hits`;
  newRoute();
  punchTicket();
}

let musicStarted = false; // stays false until playback truly begins
function firstTap() {
  audio();
  if (musicStarted || playing || !playerReady) return;
  if (usePlaylist) {
    player.setShuffle(true);
    const n = (player.getPlaylist() || []).length;
    if (n > 1) player.playVideoAt(Math.floor(Math.random() * n));
    else player.playVideo();
  } else {
    player.playVideo();
  }
}
document.addEventListener("pointerdown", firstTap);
document.addEventListener("keydown", firstTap);

function loadCurrent() {
  const s = currentSong();
  player.loadVideoById(s.id);
  showSong(s);
  newRoute();
  punchTicket();
}

function showSong(s) {
  $("song-title").textContent = s.title;
  $("song-sub").textContent = s.movie ? `${s.movie} · ${s.year}` : "";
  if (s.id) $("thumb").src = `https://i.ytimg.com/vi/${s.id}/mqdefault.jpg`;
  document.title = s.movie ? `▶ ${s.title} · Town Bus Hits` : "Town Bus Hits";
}

function next(step) {
  if (usePlaylist) {
    step > 0 ? player.nextVideo() : player.previousVideo();
    return;
  }
  pos = (pos + step + order.length) % order.length;
  loadCurrent();
}

function setRolling(on) {
  playing = on;
  if (on) musicStarted = true;
  document.body.classList.toggle("rolling", on);
  $("btn-play").textContent = on ? "❚❚" : "▶";
}

$("btn-play").addEventListener("click", () => {
  if (!playerReady) return;
  playing ? player.pauseVideo() : player.playVideo();
});
$("btn-next").addEventListener("click", () => { clickSfx(); next(+1); });
$("btn-prev").addEventListener("click", () => { clickSfx(); next(-1); });

/* seek bar */
let seeking = false;
$("seek").addEventListener("input", () => { seeking = true; });
$("seek").addEventListener("change", () => {
  if (playerReady && player.getDuration) {
    player.seekTo((player.getDuration() * $("seek").value) / 100, true);
  }
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

/* ---------- route plate ---------- */
function newRoute() {
  const r = ROUTES[Math.floor(Math.random() * ROUTES.length)];
  $("route-no").textContent = r.no;
  $("route-ta").textContent = r.ta;
  $("route-en").textContent = r.en.toUpperCase();
}

/* ---------- thirukkural board ---------- */
let quoteIdx = Math.floor(Math.random() * QUOTES.length);
function splitTwo(s) {
  if (s.length <= 15) return [s, ""];
  const mid = Math.floor(s.length / 2);
  let cut = s.lastIndexOf(" ", mid);
  if (cut < 4) cut = s.indexOf(" ", mid);
  if (cut < 0) return [s, ""];
  return [s.slice(0, cut), s.slice(cut + 1)];
}
function showQuote() {
  const q = QUOTES[quoteIdx % QUOTES.length];
  const [l1, l2] = splitTwo(q.ta);
  const size = q.ta.length > 26 ? 13 : 17;
  $("quote-l1").setAttribute("font-size", size);
  $("quote-l2").setAttribute("font-size", size);
  $("quote-l1").textContent = l1;
  $("quote-l2").textContent = l2;
  $("quote-src").textContent = q.en;
}
showQuote();
setInterval(() => { quoteIdx++; showQuote(); }, 45000);

/* ---------- ticket ---------- */
let ticketNo = 41000 + Math.floor(Math.random() * 9000);
function punchTicket() {
  ticketNo++;
  $("ticket-no").textContent = "№ " + String(ticketNo).padStart(6, "0");
  $("ticket").classList.remove("punched");
  setTimeout(() => $("ticket").classList.add("punched"), 400);
}

/* ---------- passengers board (fake presence for now) ----------
   To make it real for free: Firebase Realtime DB presence
   (Spark plan) — each visitor writes a key with onDisconnect().remove(),
   the count is the number of keys. Only this block changes. */
let riders = 6 + Math.floor(Math.random() * 9) + (new Date().getHours() >= 18 ? 5 : 0);
function updatePresenceText() {
  $("pres-num").textContent = riders;
}
updatePresenceText();
setInterval(() => {
  riders = Math.max(3, riders + (Math.random() < 0.5 ? -1 : 1));
  updatePresenceText();
}, 25000 + Math.random() * 20000);

/* ---------- speedometer (on the dashboard) ---------- */
const DIAL = { cx: 944, cy: 512, r: 30 };
(function buildTicks() {
  const g = $("speedo-ticks");
  for (let v = 0; v <= 100; v += 20) {
    const a = Math.PI + (v / 100) * Math.PI;
    const x1 = DIAL.cx + (DIAL.r - 9) * Math.cos(a), y1 = DIAL.cy + (DIAL.r - 9) * Math.sin(a);
    const x2 = DIAL.cx + (DIAL.r - 4) * Math.cos(a), y2 = DIAL.cy + (DIAL.r - 4) * Math.sin(a);
    const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    g.appendChild(l);
  }
})();
let speed = 0, speedTarget = 0;
setInterval(() => {
  speedTarget = playing ? 42 + Math.sin(Date.now() / 3000) * 9 + Math.random() * 6 : 0;
}, 900);
setInterval(() => {
  speed += (speedTarget - speed) * 0.15;
  const deg = -90 + (Math.min(speed, 100) / 100) * 180;
  $("needle").setAttribute("transform", `rotate(${deg} ${DIAL.cx} ${DIAL.cy})`);
  $("speedo-num").textContent = Math.round(speed);
}, 120);

/* ============ WHIMSY SOUNDS (all synthesized, all 3D) ============ */

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

/* conductor whistle: two sharp pea-whistle bursts, rear-right */
function blowWhistle() {
  const ctx = audio();
  $("hot-whistle").classList.remove("blown");
  requestAnimationFrame(() => $("hot-whistle").classList.add("blown"));
  const pan = makePanner(2.2, 0.3, -1.2);
  pan.connect(ctx.destination);
  [0, 0.36].forEach((offset, n) => {
    const t = ctx.currentTime + offset;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(n ? 2950 : 2750, t);
    const trill = ctx.createOscillator();
    trill.frequency.value = 34;
    const trillGain = ctx.createGain();
    trillGain.gain.value = 320;
    trill.connect(trillGain).connect(osc.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.24, t + 0.02);
    g.gain.setValueAtTime(0.24, t + 0.22);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(g).connect(pan);
    osc.start(t); osc.stop(t + 0.32);
    trill.start(t); trill.stop(t + 0.32);
  });
}

/* musical air horn: two-tone blast passing left → right with a pitch drop */
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

/* engine idle: looped brown noise + low thump, under the floor */
let engineNodes = null;
function engineToggle() {
  const ctx = audio();
  if (engineNodes) {
    engineNodes.gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    const n = engineNodes; engineNodes = null;
    setTimeout(() => { n.src.stop(); n.osc.stop(); }, 500);
    $("hot-engine").classList.remove("on");
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
  document.body.classList.add("engine");
}

/* small conductor-punch click for prev/next */
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

applyLang();
