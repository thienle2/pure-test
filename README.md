# Deal In · Join → Table transition

An interactive prototype of the transition from tapping a game in **Join More Games** to landing at the poker table.

**The choreography (direction C, "Deal in")**
1. **Tap**: the game card presses in.
2. **Go**: the sheet drops away, and the card's two playing cards lift off the button and move to the center of the screen.
3. **Load**: the cards shuffle while the table rim draws itself around them as a progress bar.
4. **Land**: the table fades in, players pop in seat by seat, and your cards fly to your seat as hole cards. A toast confirms you're dealt in next hand.

The seat count carries over the whole way. It reads 4/6 on the card and 5/6 in the top tab after you join.

Controls under the phone: **Replay**, **Slow-mo 4×** (for reviewing timing), and **Game** (switches between NLH and MAHJ theming).

## Project structure

```
index.html         markup for the lobby sheet, game card and table
styles.css         layout + all motion (one class per phase on .stage)
app.js             phase timeline, game themes, screen fitting
assets/table.png   table art
assets/players/    player avatars + nameplates
```

It has no framework, no build step and no dependencies.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Tuning the motion

- **Phase timing:** `TIMELINE` in `app.js` (ms at normal speed).
- **Durations and easing per phase:** the bottom section of `styles.css` (`C · Deal in choreography`). Every duration is multiplied by `--t`, which is how slow-mo works.
- **Seat counts:** `SEATS_BEFORE` / `SEATS_AFTER` in `app.js`.
- **Reduced motion:** users with reduced motion enabled get the end states without animation.

## Deploy to Vercel

### Option A: Vercel CLI (no GitHub needed)

```bash
npm i -g vercel
cd deal-in
vercel          # first run: log in, accept defaults (Framework: Other, no build command)
vercel --prod   # publish to your production URL
```

### Option B: GitHub + Vercel (redeploys on every push)

```bash
cd deal-in
git remote add origin https://github.com/<you>/deal-in.git
git push -u origin main
```

Then in Vercel: **Add New → Project → Import** the repo. Leave Framework as **Other** and the build command empty.
