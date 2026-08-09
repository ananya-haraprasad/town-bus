// Town Bus Hits playlist — mirrors the Spotify playlist "Town bus vibes ✨".
// Add a song: find it on YouTube, copy the 11-character id from the URL
// (youtube.com/watch?v=THIS_PART) and add a row below.
// If a video blocks embedding, the player skips it automatically.

const SONGS = [
  { id: "shdyWGb1Flc", title: "Naan Erikarai", movie: "Chinna Thayee", year: 1992 },
  { id: "N15ET23CpLQ", title: "Valaiyosai", movie: "Sathya", year: 1988 },
  { id: "uCBRZbBKHD8", title: "Indha Maan", movie: "Karakattakkaran", year: 1989 },
  { id: "fuEcN6iv4gs", title: "Shenbagame Shenbagame", movie: "Enga Ooru Pattukaran", year: 1987 },
  { id: "Knuz8yCN-2A", title: "Pesa Koodaathu", movie: "Adutha Varisu", year: 1983 },
  { id: "jUk_mqRVYRE", title: "Pennalla Pennalla Oothapoo", movie: "Uzhavan", year: 1993 },
  { id: "KiEt9WQdn7A", title: "Ennai Thottu", movie: "Unna Nenachen Pattu Padichen", year: 1992 },
];

// Bench: earlier kuthu starter list, uncomment any row to add it back.
// { id: "sDGIHBnTZnM", title: "Rakkamma Kaiya Thattu", movie: "Thalapathi", year: 1991 },
// { id: "l4P_-Vhlm3c", title: "Aattama Therottama", movie: "Captain Prabhakaran", year: 1991 },
// { id: "cDRfjIPZBsA", title: "Madura Marikozhundhu", movie: "Enga Ooru Pattukaran", year: 1987 },
// { id: "mmYoBNtWEqI", title: "Chikku Bukku Rayile", movie: "Gentleman", year: 1993 },
// { id: "tJuos-SP3Tw", title: "Mukkabla", movie: "Kadhalan", year: 1994 },
// { id: "qwnSAPl2wl0", title: "Pettai Rap", movie: "Kadhalan", year: 1994 },
// { id: "E66PRw_GLa8", title: "Otha Ruba Tharen", movie: "Naattupura Pattu", year: 1996 },
// { id: "i1BqRYMFS08", title: "Appadi Podu", movie: "Ghilli", year: 2004 },
// { id: "d8DKbrYUbFA", title: "Vaadi Vaadi", movie: "Sachein", year: 2005 },
// { id: "zMs-VMzDCtE", title: "Naaka Mukka", movie: "Kadhalil Vizhunthen", year: 2008 },
// { id: "2jxwh0hF0wc", title: "Kalasala Kalasala", movie: "Osthe", year: 2011 },
// { id: "68ixlbMQaY0", title: "Machi Open The Bottle", movie: "Mankatha", year: 2011 },
// { id: "1zRe8UPF1tM", title: "Dandanakka", movie: "Romeo Juliet", year: 2015 },
// { id: "2ogKpj5QuSY", title: "Aaluma Doluma", movie: "Vedalam", year: 2015 },
// { id: "DE7wF8KfWy8", title: "Onnavitta Yaarum Yenakilla", movie: "Seemaraja", year: 2018 },
// { id: "fRD_3vJagxk", title: "Vaathi Coming", movie: "Master", year: 2021 },
// { id: "KUN5Uf9mObQ", title: "Arabic Kuthu", movie: "Beast", year: 2022 },
// { id: "6KzeuDstzOY", title: "Jalabulajangu", movie: "Don", year: 2022 },
