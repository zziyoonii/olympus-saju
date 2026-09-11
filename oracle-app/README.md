# 신들의 신탁 — Oracle of the Gods

Production React implementation of the `Oracle Spec.dc.html` / `Oracle App.dc.html`
Claude Design handoff (see `../chats` and `../project` for the original design
bundle this was built from).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

No backend — the saju (사주팔자) and natal-chart (네이털 차트) calculations run
entirely in the browser, ported verbatim from the design bundle's
`oracle-engine.js` / `oracle-copy.js` / `oracle-compat.js` / `oracle-year.js` /
`oracle-persona.js`.

## Structure

- `src/engine/` — calculation + copy-generation engines, ported to ES modules
  (logic unchanged from the design bundle; only the module wrapper changed).
- `src/components/` — one component per screen (`Landing`, `InputScreen`,
  `LoadingScreen`, `ResultScreen` + `LifeTab`/`YearTab`, `CompareScreen`,
  `ShareOverlay`), plus `icons.jsx` (god symbols, temple/flame line art) and
  `Hoverable.jsx` (mirrors the prototype's hover-style attribute).
- `src/utils/sx.js` — parses the design spec's inline CSS declaration strings
  into React style objects, so screen components keep the exact declarations
  from the spec instead of hand-retyped camelCase.
- `src/App.jsx` — screen routing, form/share state, and the view-model object
  (mirrors the original `renderVals()`) passed down to screen components.

## Scope decisions made against the design bundle

Per the design chat's own open questions (`../chats/chat2.md`), and confirmed
with the user before implementation:

- **Archive ("지난 신탁") dropped.** The chat flagged this feature as weak by
  its own logic (one deterministic reading per birth chart, nothing to
  accumulate) and left three options open; the user chose to drop it rather
  than build the "people I've looked up" pivot or keep it as designed.
- **Tone fixed to 근엄 (grave).** The 근엄/세련 toggle in `Oracle Spec.dc.html`
  is a comparison tool for the design canvas, not a shipped end-user
  preference — the app ships with one voice.
- **Responsive instead of two fixed device frames.** The spec previews the
  app inside an iOS frame and a Chrome window side by side
  (`ios-frame.jsx` / `browser-window.jsx`) — those are Claude Design's own
  presentation chrome, not product UI. The real app is one responsive layout:
  full-bleed under 680px, centered 620px column above it, matching the
  spec's mobile/desktop column-width and padding rules.
- **Paywall stays removed**, evidence toggle stays on, five oracles /
  compatibility engine / year-end+new-year reading / share flow are all
  implemented per the chat's final state.
