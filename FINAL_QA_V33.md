# Parsayan V33 — Final Deep QA

## Scope
Full source review of game engine, all screens, six side-game flows, content banks, RTL/mobile CSS, iPhone safe-area rules, GitHub Pages/PWA configuration, state persistence and regression tests.

## Fixes in V33
- Removed obsolete demo-mode logic from PartyModes; all six entries now route only to their dedicated implementations.
- Fixed Quote Game timeout accounting: an unanswered 15-second round now counts exactly once as a miss.
- Replaced biased `sort(() => Math.random() - .5)` shuffles in One Word, Three Second and Quote Game with Fisher–Yates.
- Upgraded all 120 Chain cards with concrete host examples and difficulty metadata; removed generic host-placeholder examples from the exported bank.
- Fixed duplicate One Word targets (`زعفران`, `سلفی`) with new cards (`گلاب`, `قلقلک`) and corrected `کندو` typography.
- Corrected Persian spelling of `پالیندروم` in the main bank.
- Replaced the ambiguous “most land borders” geography item with an unambiguous area question.
- Added keyboard focus-visible treatment and retained iPhone safe-area/mobile hardening.
- Added `finalDeepQAV33.test.mjs` with 52 additional checks for bank size, unique IDs/prompts, required fields, difficulty metadata, timers, intro/rules presence, GitHub Pages config, PWA paths, iPhone viewport/safe areas, known content defects and shuffle quality contracts.

## Banks checked
- Rapid Fire: 120
- Chain: 120
- One Word: 120
- Director: 120
- Three Second: 180
- Quote Game: 144
- Main question/challenge bank: covered by existing V23 content + challenge tier + deep audit suites.

## Automated QA result
`npm run test:audit` PASS, including the new `FINAL DEEP QA V33 52/52 PASS` plus all previous state-machine, stress, full-flow, save/resume/tie, configurable-rounds, state-repair, content, GitHub Pages, iPhone/Safari contract and per-mode suites.

## Build status
`npm run build` was attempted. It cannot be verified in this execution environment because local dependencies are unavailable (`vite: not found`). The GitHub Pages workflow still installs dependencies, runs `npm run test:audit`, then builds `dist` before deployment.

## Device status
Static iPhone/Safari contracts are tested. A physical iPhone/Safari visual pass is not claimed by this report.
