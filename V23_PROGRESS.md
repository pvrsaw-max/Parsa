# Parsayan V23 progress checkpoint

## Completed in this checkpoint
- Clean RTL category labels; no emoji embedded in category text.
- Added six new categories: تاریخ، جغرافیا، غذا و خوراکی، حیوانات، فناوری و اینترنت، ایران و فرهنگ.
- Added 120 new player-facing questions (20 per new category, 4 per value tier).
- Rebalanced the seven legacy player categories so the player-facing 500/600 tiers no longer pull from the old specialist-heavy 600 pool; 600 now uses the old 500 pool.
- Added content audit for option count, answer index, explanations, duplicate options and category/tier counts.
- Kept legacy category names resolvable on load for saved games while removing their emoji forms from the public category list.
- Simplified the landing page RTL layout and removed decorative English labels from the main hierarchy.
- Reworked category cards to use a consistent SVG icon slot instead of emoji.
- Preserved the Duel timer fix already present in V23 work.

## Test results run directly with Node 22
- V23 content audit: PASS
- Deep audit: 36/36
- Audit regression: 10/10
- Full flow: 19/19
- Secret/resume/tie: 18/18
- Challenge tiers: 24/24
- Stress edge: 36/36
- Browser hardening: 8/8
- State machine: 1000 simulated games / 99,733 checks (run earlier in this worktree)

## Not claimed yet
The Vite production build was not completed in this environment because `npm install` timed out twice. Do not treat this checkpoint as a final GitHub-ready release until the dependency install/build succeeds.
