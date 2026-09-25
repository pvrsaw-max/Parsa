# Parsayan V40 — Side Game Setup Fix

- Replaced the bulk textarea entry in all six side games with the same one-by-one player entry pattern used by the main game.
- Players are added with the + button or Enter, shown as individual chips, and can be removed.
- Start remains disabled only until the actual minimum player count is met (2 for five modes, 3 for Quote Game).
- Round selection remains 1–12 with quick presets.
- No scoring, timer, question bank, turn-order, or game-rule logic was changed.
- Full source regression: PASS through V40.
- V40 dedicated checks: 12/12 PASS.
- Local Vite build could not run because dependencies are not installed in this environment (`vite: not found`).
