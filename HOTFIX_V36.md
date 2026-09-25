# Parsayan V36 — Quote Game Hotfix

- Reworked `کی اینو گفت؟` flow defensively.
- Start now requires at least 3 players AND at least one hidden answer from every player.
- Added visible collection progress per player.
- Added safe current-card guard and recovery screen instead of a possible blank/crash state.
- Guess buttons remain locked until the 15-second timer starts.
- Reveal requires an active timed round and a selected guess.
- Timeout is counted once and reveals the speaker safely.
- Round transitions reset guess/reveal/timer state.
- Added V36 dedicated regression suite: 15/15 PASS.
- Full `npm run test:audit` passes including all previous suites.
- Added CSS collision guards so decorative logo/sticker marks cannot cover primary readable text, plus narrow-mobile adjustments.
