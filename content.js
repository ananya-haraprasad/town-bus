// All editable content lives here: routes, signage quotes, UI text, playlist links.

// THE PLAYLIST THAT ACTUALLY PLAYS.
// Paste your YouTube playlist link (or just its id, the part after "list=").
// The site plays this playlist through YouTube, so any song you add to it
// shows up here automatically. The playlist must be public or unlisted.
// While this is empty, the site falls back to the fixed list in songs.js.
const YT_PLAYLIST = "PLWHnzK65Bknc";

// Link buttons top-right. Buttons stay hidden while empty.
// ytmusic fills itself from YT_PLAYLIST if you leave it empty.
const PLAYLIST_LINKS = {
  spotify: "https://open.spotify.com/playlist/7CSKvOXEfN5HmPWsagiosh",
  ytmusic: "https://music.youtube.com/playlist?list=PLWHnzK65Bknc",
};

// Route names. Not shown right now — the painting's own board already carries
// a painted Tamil line — kept here in case a route label comes back later.
const ROUTES = [
  { no: "29C", ta: "பெரம்பூர் - பெசன்ட் நகர்", en: "Perambur - Besant Nagar" },
  { no: "47A", ta: "மயிலாப்பூர் - திருவான்மியூர்", en: "Mylapore - Thiruvanmiyur" },
  { no: "1A", ta: "மதுரை - திருப்பரங்குன்றம்", en: "Madurai - Thiruparankundram" },
  { no: "48", ta: "மதுரை - மேலூர்", en: "Madurai - Melur" },
  { no: "22", ta: "தஞ்சாவூர் - கும்பகோணம்", en: "Thanjavur - Kumbakonam" },
  { no: "5", ta: "சேலம் - ஆத்தூர்", en: "Salem - Attur" },
  { no: "24B", ta: "கோயம்புத்தூர் - பொள்ளாச்சி", en: "Coimbatore - Pollachi" },
  { no: "12", ta: "திருச்சி - லால்குடி", en: "Trichy - Lalgudi" },
  { no: "77", ta: "திருநெல்வேலி - நாகர்கோவில்", en: "Tirunelveli - Nagercoil" },
  { no: "88", ta: "விழுப்புரம் - புதுச்சேரி", en: "Villupuram - Puducherry" },
  { no: "16", ta: "ஈரோடு - கோபி", en: "Erode - Gobi" },
  { no: "3C", ta: "வேலூர் - ஆற்காடு", en: "Vellore - Arcot" },
];
