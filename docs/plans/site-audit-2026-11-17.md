# ddg.limited home page: visual and performance audit

Written by Claude (Opus 5.5) for Markus, Tue 17 Nov 2026, on the preview branch `claude/pipes-around-panels` (the tuner build), before it goes live.

**How it was checked.** Screenshots at 1440, 1100 and 390 pixels wide; a script that tests every water pipe against every piece of text, button and image; Chrome's own performance counters over 4 seconds at four places on the page; file sizes from the network log.

**Limits.** The test machine draws 3D graphics in software, with no graphics card. Its frame rates for the 3D first screen (about 1 frame a second) say nothing about a real phone or laptop. They only show that the first screen is the heaviest part by far. Real-device numbers are UNKNOWN until checked on Markus's phone and laptop.

Marks: **VERIFIED** = measured here. **INFERRED** = expert judgement from the code. **UNKNOWN** = needs a real device.

---

## 1. Performance engineer (the priority)

### Fixed in this pass
| What | Before | After |
|---|---|---|
| Clouds behind the page were redrawn every frame through a full-screen blur filter, and the glass panels re-blurred them again every frame | about 25 frames a second while scrolling the business section (software rendering) | **about 58** (VERIFIED, same machine) |
| How the fix works | — | Clouds are softened once and cached. The layer redraws at about 30 frames a second, or straight away on scroll. It stops completely while the first screen still covers it. |
| Clouds over the land popping in and out | They teleported across the river and snapped at the edges | Real motion with fade-in and fade-out; nothing appears or disappears suddenly |

### Do next, in order of value
1. **Automatic quality for the 3D first screen (INFERRED: biggest win).** Measure frame time for the first two seconds. If frames take longer than about 20 ms, step down:
   - drawing resolution, from 1.75× to 1.25× then 1×;
   - then cloud count halved;
   - then river spray off.

   A good laptop keeps everything; an older phone stays smooth. This is roughly 40 lines in `Stage.tsx`.
2. **Cap the 3D drawing resolution at 1.5× (INFERRED).** 1.75× on a 3× phone screen is about 36% more pixels than 1.5× for almost no visible difference.
3. **Clouds over the land cost fill-rate (INFERRED).** Large, overlapping, see-through sprites drawn without depth tests is the classic cost on phones.
   - On screens under 700 px it already uses half the clouds.
   - Keep "How many" at or below about 0.4 on the live settings.
4. **Only one logo picture should download (VERIFIED).** The glitch logo (239 KB) downloads even when the white logo (24 KB) is chosen, because hidden images still load.
   - When the settings are baked in, drop the unused one from the page.
   - This saves about 0.24 MB on every first visit.
5. **Load the chosen web font in the page head (INFERRED).** The name and quote font is fetched from Google by script after the page starts. Text can flash in the fallback font first.
   - A `<link rel="preload">` for the one chosen font fixes that.
   - Drop the font picker code from the live build.
6. **Set widths and heights on the screenshots (INFERRED).** This stops the business cards jumping as images load. It's a small layout-shift fix.
7. **Sizes (VERIFIED, unminified local build).**
   - The main script is 614 KB and the 3D scene 970 KB before minifying.
   - Replit's build minifies and compresses, so the live sizes are smaller (UNKNOWN until measured on the live site).
   - The 3D scene already loads separately after the words, which is right.
8. **The tuner code ships inside the 3D bundle (INFERRED, small).** It only runs with `#tune`. Splitting it out is tidy but saves little.

---

## 2. Art director (visual)

1. **One alignment rule.** The page mixes centred blocks (the "AI-powered development company" panel, the split heading) with left-aligned panels (How we run it, Build, Start).
   - Either is fine, but the switch reads as unplanned.
   - Suggestion: centre only the two "chapter" headings and left-align every panel.
2. **One accent colour.** Ice blue appears on eyebrows, numbers, tab underline and pipes; white ink pipes would add a second accent.
   - When the fluid colour is chosen, use the same colour for the tab underline and step numbers.
3. **Panel weight.** Glass panels now look correct on the clouds. The "How we run it" panel is text only and is the plainest block on the page.
   - A small, blurred DDG Control screenshot (no numbers readable) would balance it.
4. **The business reel.** Tabs, side cards and arrows now make the three choices clear.
   - The side cards are cut by the screen edge at widths around 1100 to 1280.
   - Fine, but check the arrows never sit on top of a side card's text at that width.
5. **The first screen** is strong and calm. Keep the quote and scroll hint as they are.

---

## 3. UX and journey

1. **The journey reads in the right order:** what we are, what we built, how we run it, what we build for you, start, charity.
2. **The services panel will show "Coming 8 November" if the server ever fails to answer.** That's the safe fallback (VERIFIED in code). On the live server it should show the price list (INFERRED).
3. **The form is on the home page and on `/start`.** Keep both. The hero button goes to `/start`, while the bottom of the page has the form itself. That's correct.
4. **The Finance card now describes the platform being built**, with "Paper trading. Not financial advice. We don't take outside money."
5. **Fitness stays secret:** blurred image, "Coming soon", no features named.

---

## 4. Accessibility

1. **Reduced motion is respected** for the carousel auto-turn, the 3D scene, the clouds and the scroll hint (VERIFIED in code).
2. **The carousel** has proper tabs, hidden side cards are not reachable by keyboard, and arrow keys work (VERIFIED in code).
3. **Contrast.** Small grey text on glass (12 to 13 px mono labels at 62% white) is near the lower limit.
   - Raise mono eyebrows to 70% white.
4. **Hidden logo images** have empty alt text, which is correct. The page title sits inside the `h1` for screen readers.

---

## 5. Pipes and lines

The automatic check found **no pipe crossing any text, button or image** at 1440, 1100 and 390 px (VERIFIED, after the fixes earlier today).

## Suggested order
Bake the settings in, then:
1. drop the unused logo (item 1.4);
2. preload the font (1.5);
3. cap the resolution at 1.5× (1.2);
4. add automatic quality (1.1).

Then go live and measure on Markus's phone and laptop.

---

# Final audit before go-live (17 Nov, 15:40)

Roles: web designer, UX and conversion, copywriter, SEO, accessibility, front-end performance, trust and compliance. **Fix before live** = small and visible to every visitor.

## Fix before live
1. **Phones: the "Scroll" hint sits on top of the menu** (VERIFIED, 390 px screenshot). On phones, move it below the menu or hide it.
2. **Search and share text is out of date** (VERIFIED, `index.html`). The description still says "four businesses … DDG Creative". New text: "AI-powered development company in Brisbane. We build websites, online stores, trading platforms, apps and AI."
3. **Share picture.** `og:image` is a relative `.webp` path. Many apps (Facebook, LinkedIn, iMessage) need a full `https://ddg.limited/...` address and prefer a 1200×630 JPG or PNG. Make one share image (orb + name).
4. **No privacy note on the enquiry form** (VERIFIED). The form collects name and email. Australian Privacy Principle 5 expects people to be told why and how their details are used. Add one line plus a short `/privacy` page. (Not legal advice; the lawyer can confirm.)
5. **Menu tap targets are 20 px tall on phones** (VERIFIED). Apple and Google ask for about 44 px. Add padding.

## Do soon
6. **No way to reach DDG except the form.** Add a contact email in the footer. It is written-only, which fits the plan.
7. **No proof from clients yet.** When Build client 1 is done, add one quote and one before/after. Until then, the "Projects we have built" reel is the proof, which is fine.
8. **Prices.** The founding price (about 13% off for the first five clients) is agreed but not shown. One line in the Build panel would help people decide.
9. **No sitemap and no canonical address** (VERIFIED, only `robots.txt`). Add `sitemap.xml` (/, /finance, /start) and a canonical link. Search engines find the pages faster.
10. **No page analytics.** You can't see how many people reach the form. A privacy-friendly, cookie-free counter would do (free tier only; ask before adding anything paid).
11. **Heavy first screen on old phones.** The automatic quality step-down helps. Test on your phone; if it still stutters, show a still image of the scene on small screens.
12. **"How we run it"** is text only. A blurred Control screenshot (nothing readable) would balance it.

## Fine as it is
- Clear journey; Finance disclaimer present; Fitness kept secret; no pipes through text; reduced motion respected; carousel works with keyboard; links all point to real pages.
