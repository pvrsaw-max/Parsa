# Parsayan V41 — Browser E2E QA

V41 adds Playwright browser-level tests for all six side games. The tests enter players through the same UI a user sees, select one round, verify the start CTA becomes enabled, click it, exercise each game's primary action buttons, advance timers where needed, and verify the game can reach its final champion/result state.

## CI gate
GitHub Pages workflow now runs: install dependencies → source/regression audit → Vite build → install Chromium → Playwright E2E → Pages upload/deploy. A failed browser flow blocks deployment.

## Mobile target
The E2E project uses Playwright's iPhone 13 device profile in Chromium for mobile viewport/touch-oriented coverage. This is browser automation, not a claim of physical iPhone/Safari verification.

## Failure artifacts
Trace, screenshot, video and an HTML report are retained on E2E failure by Playwright configuration (local report generation; GitHub artifact upload is not configured in this revision).
