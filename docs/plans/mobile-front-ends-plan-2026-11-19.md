# Mobile front ends: God's Eye View, Greenlight, Finance dashboard

Written by Claude (Fable 5.2) for Markus, Thu 19 Nov 2026. He asked how the three platforms can work fully on a phone.

**How this was made.** I looked at the God's Eye View app's file list and notes in Replit and at screenshots of all three. I did **not** read the code of Greenlight (it is not in the Replit list I can see) or of the Finance app (access to `quant-terminal` was refused). So the God's Eye View part is firm; the other two are a design to check against the code first.

**Nothing here is built.** This is a plan only.

---

## 1. Rules for all three

1. **One screen, one job.** A phone shows one thing at a time. Panels that sit side by side on a computer become layers on a phone.
2. **The bottom sheet is the main tool.** A panel that slides up from the bottom with three heights: peek (a title bar), half, full. Drag or tap to change. This is what map apps use and what people already know.
3. **Thumb zone.** Main actions sit in the bottom third. The top is for status only.
4. **Touch sizes.** Every button at least 44 px. Body text at least 16 px.
5. **Same data, same back end.** Only the front end changes. No new servers.
6. **Switch by screen width** (under about 760 px), not by a separate site. One address for both.
7. **Night Glass look** stays: same colours, glass panels, thin lines.
8. **Done means tested on your real phone**, not only in my headless browser.

---

## 2. God's Eye View

**Today (computer):** top bar (logo, Live, search, Layers, Triage, Next, Stop), a focus title, a left panel (Operator / Orbit), a right panel (Mission / Coverage), a row of action chips, and a caption line. The code already has four layouts (`tactical, operator, minimal, cyber`) in `src/hudLayoutPolicy.js`.

**Plan: add a fifth layout, `mobile`.** This fits how the app is already built, so nothing existing is redesigned.

| Part | On a phone |
|---|---|
| Globe | Full screen, always. It is the product |
| Top bar | One slim row: logo, Live dot, search icon, menu icon. Search opens full screen |
| Layers, Triage, Next, Stop | Move into the menu icon and a small round button bottom right for "Next" |
| Left and right panels | Become **one bottom sheet** with tabs: Operator, Orbit, Mission, Coverage. Peek shows the object's name and one key number |
| Action chips | One row that scrolls sideways, just above the sheet |
| Caption | One line above the chips, tap to expand |
| Focus title | Small, top centre, under the bar |

**Touch:** one finger turns the globe, two fingers zoom, tap an object to open the sheet at half height.

**Speed:** a phone profile in `renderGovernor.js`: fewer objects drawn, lower detail, lower pixel ratio, 30 frames a second at rest. This needs real numbers from a real phone.

**Size of work:** medium. About 3 to 4 work sessions. **Risk:** how smooth the globe is on a mid-range phone.

---

## 3. DDG Greenlight

**Today (computer):** a 7-step wizard, six standards chips, a 3D map of the code, a three-column fix view (Plan / Console / detail), a bottom progress bar with speed buttons, and the Freya guide.

**Plan: a full rework for phones, as you said.** On a phone, Greenlight becomes a "review and approve" tool, because that is what a person does on a phone: check progress and say yes or no.

| Part | On a phone |
|---|---|
| 7 steps | One step per screen, with a progress bar on top and Back / Next at the bottom |
| Standards chips | A scrolling row; tap one for a full-screen detail |
| 3D code map | **Off by default.** Replaced by a list: folders, files, a coloured dot for state. A "View map" button opens the 3D map full screen for those who want it |
| Three columns | Three tabs: **Plan**, **Live**, **Why** |
| Fix items | Cards, one per fix: what, why, Approve / Skip. Swipe is optional, buttons always there |
| Progress bar and speed | A sticky bar at the bottom: progress, pause, speed |
| Freya | A small round button; opens as a bottom sheet chat |

**Size of work:** large. About 6 to 8 sessions. **First step:** I need to read the code, so I need to know where it lives.

---

## 4. Finance trading dashboard

**Plan: view-only on a phone, at first.** A dashboard on a phone is for checking, not for changing. Controls that can move money or stop bots stay on the computer until you say otherwise.

| Tab (bottom bar) | Shows |
|---|---|
| Today | Total value, today's change, a small line chart, any alarm |
| Bots | One card per bot: state, today's result, last trade. Tap for detail |
| Trades | A list, newest first, with filters |
| Health | Heartbeat, last data time, errors |

Tables become cards. Charts take the full width and can be tapped for full screen. Rules that stay true: no crypto, publish only when the US market is closed.

**Size of work:** small to medium. About 2 to 3 sessions, after I can read the code.

---

## 5. Order of work

1. **God's Eye View first.** Best known code, clearest plan, and the strongest thing to show a client on a phone.
2. **Finance dashboard second.** Smallest job.
3. **Greenlight last.** Biggest job, and I have not seen its code.

When a platform works on phones, remove its "Best viewed on a computer screen" note from ddg.limited.

---

## 6. What I need from you

1. **Yes or no:** may I work in the God's Eye View and Greenlight repos? The build guide says four repos only, and these are not on that list.
2. **Where is Greenlight's code?** (repo name or Replit app)
3. **Access to `quant-terminal`** for the Finance dashboard. It was refused in the last session.
4. **Finance on a phone: view-only first?** I suggest yes.
5. **When?** The audit says this comes after the enquiry email check and the client engine (B0). Your call.
