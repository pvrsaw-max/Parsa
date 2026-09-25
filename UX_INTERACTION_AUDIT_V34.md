# Parsayan V34 — Interaction & Gameplay Simulation Audit

## Scope
A second pass over the full V33 source with emphasis on button behavior, state transitions, responsive layout, text hierarchy, modal placement, timers, side-game rules, and GitHub Pages constraints.

## Gameplay simulations
- Main game: setup → secret powers → board → category → value → question → auction → reveal → owner miss → timed steal → result → next turn. PASS.
- Main game swap: board restriction → question-only activation → replacement question → consumed power. PASS.
- Rapid Fire: 45-second host-judged loop, correct/pass, timeout lock, restart. Existing V27 regression PASS.
- Chain: 5-second rotating turns, valid-link reset, invalid/timeout break, next topic. Existing V28 regression PASS.
- One Word: 45-second loop, correct/pass/foul, forbidden-word rendering, timeout. Existing V29 regression PASS.
- Director: found a rules/runtime mismatch: copy promised 5 seconds to read the card but runtime immediately started the 60-second performance timer. Fixed with a real 5-second prep phase before each scene. Also replaced random sort shuffle with Fisher–Yates.
- Three Second: question-read phase remains untimed; explicit tap starts a real 3000ms timer; timeout routes to judging. Existing V31 regression PASS.
- Who Said It?: found that a player name could be selected before the 15-second guessing timer started. Fixed: choices remain locked until the timer starts. Timeout/reveal/scoring paths remain intact.

## Responsive/UI hardening
- Added 430px and 340px narrow-device hardening.
- Added landscape <=500px height handling.
- Enforced 44px touch targets on quote-game choices and auction controls.
- Added overflow wrapping for long Persian question/card text.
- Hardened flexible navigation, leader strip, power cards, form controls, and multi-column game controls.
- Added explicit visual copy for Director prep and Quote ready states.

## Regression
`npm run test:audit`: PASS including all prior suites plus `interactionSimulationV34.test.mjs`.
The new simulation checks all major screens exist and executes a deterministic main-game interaction path through engine APIs, including auction/steal and swap.

## Build status
`npm install` was attempted but timed out in the execution environment. `npm run build` therefore still reports `vite: not found`. Build is not claimed as verified. GitHub Pages configuration remains covered by the existing 8/8 regression suite.

## Device-runtime limitation
Responsive contracts are code-tested, but this environment does not provide a physical iPhone/Safari session. No physical-device claim is made.
