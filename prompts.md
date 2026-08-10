# Town Bus Hits · art direction + prompts

One master illustration carries the whole site. Passenger POV inside a Tamil Nadu town bus, looking toward the front. Two versions of the same frame: day and night.

**Locked style: hand-painted 1990s South Indian movie poster.** Gouache/oil cinema-banner brushwork, warm amber light against deep emerald shadows, colors faded like an old offset print.

## The one rule that matters

**Every board and sign in the image must be BLANK.** The site writes live text on top of the image: song route on the yellow board, rotating Thirukkural on the blue board, passenger count on the cream board, ticket serial on the ticket. AI tools also mangle Tamil script, so blank plates protect the design AND make it dynamic. Blank dial face on the speedometer too (the site draws the needle).

## What to bring back

| File | What |
|---|---|
| scene-day.png | master frame, day, 16:9, at least 2560px wide |
| scene-night.png | identical frame, night (edit of the day image, never a fresh generation) |

Same composition between day and night or the click zones won't line up.

## Where to generate (free first)

| Tool | Cost | Role |
|---|---|---|
| Recraft.ai | free daily credits | strong illustration presets |
| Ideogram.ai | free daily credits | good graphic taste |
| LMArena image arena | free | side door to top paid models, keep the outputs |
| Gemini | free | best free EDITOR: use it for the night pass and fixes, not from-scratch style |
| Midjourney | $10/mo | only if the free stack disappoints |

**Biggest lever in any tool: attach 2-3 reference images with the prompt** (a real 90s Tamil movie poster you love, saloon.wtf's hero art, a real TNSTC interior photo).

## Composition requirements (the site is wired onto these)

- Wide 16:9. Phones crop to the center, so everything below sits in the middle 45% horizontally.
- Bottom center stays visually quiet (the player pill floats there).
- Three blank boards above the windshield: deep ultramarine w/ gold border (Thirukkural), marigold yellow w/ black border (route), plain cream (passenger count).
- Driver front right, back view, big thin steering wheel. Dash: one blank round cream dial + one round red horn button (clickable) + pink paper ticket.
- Sea-green engine hood with vents beside the driver (clickable).
- Brass whistle on a red cord hanging from the sky-blue front pole (clickable).
- Passengers from behind only: aunty with jasmine gajra, older man, a kid SITTING by the window (not kneeling). No visible faces.
- Authenticity notes from real TNSTC interiors: sky-blue painted steel seat frames and poles (not chrome), overhead parcel racks, caged roof fans, ribbed rubber floor, riveted cream ceiling panels, worn yellow grab rails.

## Master prompt: day

(Grounded in real TNSTC interiors: sky-blue painted steel frames, parcel racks, caged roof fans, ribbed rubber floor, riveted panels.)

> Hand-painted 1990s South Indian movie poster illustration. Interior of a 1990s Ashok Leyland Tamil Nadu government town bus, seen from a passenger seat in the middle of the aisle, one-point perspective aimed at the front windshield, eye level of a seated adult, horizon at 40% of frame height, wide 28mm feel, two dark out-of-focus seatback corners framing the bottom of the frame.
>
> CABIN: cream riveted metal ceiling panels with two small caged roof fans, a worn yellow grab rail on each side with hanging canvas loops swaying, overhead parcel racks above the windows holding a jute bag and a steel tiffin carrier. Pale green painted metal walls, sun-faded, with rivet lines. Full-drop sliding windows with aluminium frames half open, two thin horizontal safety bars. Ribbed grey rubber floor with sandy dust, a long bent gear lever rising from it near the front.
>
> SEATS AND PEOPLE: bench seats in burnt-orange rexine, cracked and patched, over sky-blue painted steel tube frames, receding in rows. Passengers painted from behind only: a woman with a jasmine gajra in her low bun wearing a cotton saree, an older man in a white shirt with a shoulder towel, a small boy sitting by a window looking out.
>
> DRIVER CABIN, front right: driver in an olive shirt sitting high over the wheel arch, arm resting on a huge thin-rimmed nearly-flat steering wheel, painted a worn black. Dark green metal dashboard with ONE blank round cream dial and ONE round red dome horn button, a small pink paper bus ticket lying on the dash shelf. Beside the driver a sea-green metal engine hood with louvred vents and a folded cotton cloth on top. Interior rear-view mirror with a small string of beads hanging. Above the windshield a narrow shelf with a marigold garland draped across and two burnt incense sticks.
>
> BOARDS, all blank: mounted above the windshield, one deep ultramarine enamel board with a thin gold border, one marigold yellow board with a black border, one plain cream board. No writing anywhere.
>
> WHISTLE: a small brass pea whistle on a red braided cord hanging from the sky-blue pole at the front entry, catching the sun.
>
> THROUGH THE GLASS: late afternoon, a single-lane grey tar road with red-earth shoulders, dry scrub, banana patch and coconut palms, telegraph poles with drooping wires, blue-green hills far away, a faint temple gopuram silhouette on the horizon, one distant bullock cart. Dust motes floating in the sunbeams.
>
> PAINT AND GRADE: gouache and oil on canvas like a hand-painted Kollywood cinema banner, confident visible brush strokes, soft airbrushed glow only on highlights, no outlines. Cinematic grading: warm amber sunlight raking through the left windows, long light patches on seatbacks and floor, deep emerald and indigo shadows, golden rim light on the rails, the whistle and the wheel, colors slightly faded like a 30-year-old offset print, subtle CMYK halftone in the shadows, weathered poster warmth, faded ektachrome cast.
>
> No text, no letters, no numbers, no logos, all boards and dials blank, no visible faces, bottom center of the frame quiet and empty. 16:9

## Edit passes on the chosen frame (run separately, keep the winner each time)

1. Fix oddities: "Keep this exact image. Remove the strange backwards seat directly in front of the boy on the right and replace it with a normal empty bench seat matching the others. Change nothing else."
2. Multi-faith shelf (her addition, classic TN bus detail): "Keep this exact image. On the front panel just below the rear-view mirror, add a small devotional shelf with three items side by side: a tiny brass Ganesha idol, a small Christian cross, and a small green plaque with a crescent and star, a thin marigold garland draped under all three. Small, humble, sun-faded, same painted style. Change nothing else."
3. Whistle (required, it is a clickable object): "Keep this exact image. Add a small brass pea whistle hanging on a red braided cord from the blue pole near the driver, at chest height, catching the sunlight. Change nothing else."
4. Naturalness: "Keep this exact image. Keep only one flower garland across the top, align the seat rows so they recede evenly, clean up any warped bars. Change nothing else."

After every edit, check the three boards are still blank.

## Night pass (edit the winning day image)

> same image, night: deep indigo sky, full moon and stars, dark hill silhouettes, warm tubelight glow inside the cabin, headlight beam on the road ahead, amber highlights against blue-black shadows, no text, no lettering

## FINAL MASTER PROMPT (11 Aug, evening): fresh ChatGPT chat, from scratch

She insisted on regenerating from scratch for the perfect frame. The definitive prompt lives in the chat (11 Aug, "FINAL, MOST DETAILED prompt"). Key facts: style = the patch-quilt painterly frame she liked (attach it as style ref + the Alamy conductor photo as grip ref); bright early-2000s print colours, explicitly "no golden-brown oil wash" (that repaint she hated); whistle = GREEN PLASTIC on red cord on the yellow mesh partition (clickable hotspot); conductor grip = notes folded lengthwise wedged between fingers; NO bucket; header band order = speaker, cream board, yellow board, deity trio (Ganesha/cross/crescent, one line, single garland below), blue board, speaker; 7-person locked cast; 10-point QA checklist in chat defines "done". Workflow rule given: max ONE fix per follow-up edit, stop after 2 consecutive failures of the same rule.

## OLDER DIRECTION (11 Aug): bus-ticket collage realism

Style locked with her: "constructed memory object", surfaces visibly collaged from blank ticket-sized paper patches (pink/mint/yellow/cream, perforated edges), painted-paper collage realism, battered not pristine. Palette default = sun-bleached Tamil Nadu; alternate = Kodak afternoon.

Iteration 4 FINAL GROUNDING (11 Aug): she supplied 8 real reference photos; canonical details extracted: seats = tubular steel frames + WHITE-MARBLED LAMINATE back panels + blue-green vinyl cushions (NOT orange rexine); forest of vertical poles seat-frame-to-ceiling + 2 long overhead rails; engine hump FRONT-CENTER with cloth/leather cover between driver and doorless front-left doorway; front bench FACES BACKWARD; yellow mesh grill partition behind driver; conductor = khaki, fanned rupee notes + ticket bundle, GREEN PLASTIC whistle on keyring; deity row lives on header band above windshield with tinsel; windows have yellow-tinted upper strip with black diamond decals; floor red-brown with aisle metal strips; interior is BRIGHT (white-mint/chrome/marble/blue-green/yellow), which also fixed her "colours feel dull" complaint. Her workflow note: attach reference photos 1/3/4 with the prompt. Center of frame sacred (player UI space). Full reference-grounded prompt in chat (iteration 4 final).

Iteration 3 corrections (11 Aug): schoolgirl plaits must be TWO symmetric (one per shoulder, ribbons); NO ONE stands at the front / blocks the windshield; conductor = only stander, mid-aisle, upright, hand on seatback grab-bar; railing system spelled out (2 full-length yellow rails + loops + vertical poles from alternate seat frames + chrome grab-bar on every seatback); devotional shelf sits FLAT on the metal band above the windshield under the center board, garland lying along the shelf edge, never over glass ("we won't block glass like that"); "every pole is structural" rule kills stray floating bars. Full prompt in chat (iteration 3).

Iteration 2 corrections (11 Aug, all hers): she now wants a BUSY bus, named cast of ~8 (jasmine-LOW-BUN woman with malli poo ONLY, older man with shoulder towel, boy at right window, schoolgirl with ribboned plaits, aunty with cloth bag, standing young man on a loop, CONDUCTOR standing with leather cash bag, driver), all faces hidden incl. mirror. Layout facts the model kept missing: front-LEFT open doorway with steps + pole (boarding side), metal pipe-and-mesh partition behind driver. Music = two weathered metal speaker boxes above the windshield corners with ceiling wires, NEVER a dashboard radio/cassette deck (she vetoed it, and garlanded electronics). Tri-faith shelf = ONLY devotional item and ONLY garland. Loves: umbrella, newspaper, koodai, road/paddy views. Thirukkural board (ultramarine+gold) above driver seat, 3 blank boards always fully visible. Full prompt in chat 11 Aug (iteration 2).

## OLDER DIRECTION (10 Aug): bold minimal editorial poster, max-detail spec

Locked decisions from her iterations: jasmine in a LOW BUN (never a braid), ONE garland only (under the tri-faith shelf), no cows/temples/carts outside (lush paddy bands only), sideways front bench facing the driver, sea-green driver partition with chrome rail, whistle hangs on the partition rail, no poles through seats, no partial seats, boards + dial always blank, bottom center quiet. Tri-faith shelf = brass Ganesha + cross + green crescent plaque below the mirror (her addition, keep always). The full mega-prompt lives in the chat from 10 Aug; style paragraph = "bold minimal flat editorial poster art, 8-color palette, flat shapes, no outlines/gradients/cartoon" with hex palette (#F2ECD7 cream, #C5D2BC sage, #33584A sea green, #C46A3A burnt orange, #7FA8C9 sky blue, #EEB62D marigold, #20376B ultramarine, #2C2318 sepia).

## Style exploration (swap only the style paragraph, keep the scene text identical)

- Cinema banner (baseline, proven): "A hand-painted scene in the style of a 1990s South Indian cinema banner: gouache and oil on canvas, confident visible brush strokes, matte finish, colors slightly faded like a 30-year-old poster. Not a cartoon, no outlines, no digital gloss."
- 90s film still: "A frame from a 1993 Tamil film shot on Kodak motion picture film, warm faded color grade, soft focus edges, slight film grain and halation."
- Anime background painting: "A painted anime background in the tradition of 90s Studio Ghibli films, soft gouache textures, warm detailed light, everything painted, no cel-style characters."
- 1960s Indian travel poster: "A 1960s Indian travel poster, flat litho printing, limited warm palette, bold simple shapes, aged paper."
- Watercolor reportage: "A loose watercolor and ink travel sketch painted on location, visible pencil underdrawing, paper texture, soft color bleeds."

Verdict to test first: cinema banner vs film still, side by side, same scene text.

ChatGPT notes: one combined prompt (it redraws everything per edit, unlike Gemini), say "landscape 16:9" every time, and check the boards stayed blank on every output.

## Negative prompt

> flat vector, cartoon, thick outlines, digital gradient, glossy 3D render, photorealism, text, lettering, numbers, watermark, visible faces, fisheye

## Working rules

1. Pick for composition, restyle after: generate 8+, keep the best-composed frame even if the style is off, then in Gemini: "keep this exact composition, restyle as a hand-painted 90s Tamil cinema banner, remove outlines" with a reference poster attached.
2. Don't ask the model for grain. Add 3-5% noise + slight desaturation in Figma or photopea.com at the end.
3. Night is always an edit of the day frame.
4. No kneeling kids, no faces, boards blank, bottom center quiet.

## What happens when you're back

scene-day.png + scene-night.png go full-bleed behind the UI, live Tamil text lands on the blank boards, invisible click zones on whistle / horn / engine hood, needle drawn on the blank dial. Title, pill, Spotify button and toggles stay clean HTML on top. About an hour of wiring.
