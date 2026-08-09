// All editable content lives here: routes, signage quotes, UI text, playlist links.

// THE PLAYLIST THAT ACTUALLY PLAYS.
// Paste your YouTube playlist link (or just its id, the part after "list=").
// The site plays this playlist through YouTube, so any song you add to it
// shows up here automatically. The playlist must be public or unlisted.
// While this is empty, the site falls back to the fixed list in songs.js.
const YT_PLAYLIST = "";

// Link buttons top-right. Buttons stay hidden while empty.
// ytmusic fills itself from YT_PLAYLIST if you leave it empty.
const PLAYLIST_LINKS = {
  spotify: "https://open.spotify.com/playlist/7CSKvOXEfN5HmPWsagiosh",
  ytmusic: "",
};

// Painted route boards. One is picked at random for every song.
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

// Signage: painted-board quotes. Rotates every 45 seconds.
const QUOTES = [
  { ta: "நிதானமே பிரதானம்", en: "patience is prime" },
  { ta: "அவசரம் ஆபத்து", en: "haste is danger" },
  { ta: "யாதும் ஊரே யாவரும் கேளிர்", en: "every town is home, everyone is kin" },
  { ta: "கற்க கசடறக் கற்பவை", en: "Thirukkural 391" },
  { ta: "கற்றது கைமண் அளவு, கல்லாதது உலகளவு", en: "what we know is a handful" },
  { ta: "தாய் ஆசீர்வாதம்", en: "mother's blessing" },
  { ta: "பொறுமை கடலினும் பெரிது", en: "patience is vaster than the sea" },
  { ta: "வருக வருக", en: "welcome welcome" },
  { ta: "நன்றி, மீண்டும் வருக", en: "thanks, come again" },
  { ta: "Speed thrills but kills", en: "classic bus-back wisdom" },
];

// UI text in both languages. The த/A button toggles this.
const I18N = {
  en: {
    title: "Town Bus Hits",
    tagline: "the songs your town bus raised you on",
    hopOn: "Hop on",
    gateNote: "songs stream from YouTube · headphones recommended",
    travellingWith: (n) => `travelling with ${n} other ${n === 1 ? "person" : "people"}`,
    whistle: "whistle",
    horn: "horn",
    engine: "engine",
    chatter: "chatter",
  },
  ta: {
    title: "டவுன் பஸ் ஹிட்ஸ்",
    tagline: "டவுன் பஸ் வளர்த்த பாட்டுகள்",
    hopOn: "ஏறுங்க",
    gateNote: "பாடல்கள் YouTube வழியாக · ஹெட்போன் போடுங்க",
    travellingWith: (n) => `உங்களுடன் பயணிப்பவர்கள்: ${n}`,
    whistle: "விசில்",
    horn: "ஹாரன்",
    engine: "இன்ஜின்",
    chatter: "கூட்டம்",
  },
};
