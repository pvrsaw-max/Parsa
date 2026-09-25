# Parsayan V35 — Content Polish / Card-by-card pass

This pass focuses on replay value and bank quality after V34 interaction simulation.

## Changes
- Director: all 120 cards were rewritten as curated scene-specific combinations. Every scene and every twist is unique; roles and constraints are highly varied instead of rotating 10 generic templates.
- One Word: difficulty is now mixed inside every one of the 12 categories instead of making entire categories easy/medium/hard. The redundant reveal/cover control was removed because the target was already visible to the clue-giver; a clear private-phone cue replaces it.
- Chain: the source bank is flattened to 120 explicit example sets. Legacy placeholder strings and runtime patching were removed.
- Rapid Fire: several awkward or imprecise wordings were tightened for fast host reading and clearer judging.
- Three Second and Who Said It: all prompts were rechecked for exact duplicates and category distribution; their strong banks were retained rather than changed for change's sake.

## Automated content gates
`tests/contentPolishV35.test.mjs` adds checks for exact prompt uniqueness, explicit Chain examples, per-category One Word difficulty spread, Director variety/uniqueness/balance, and removal of the redundant One Word reveal state.

## Verification
- `npm run test:audit`: PASS including all legacy suites plus V35 content polish.
- Physical iPhone/Safari playtest: not performed in this environment.
- Vite production build: only claim PASS if dependencies are available and build is actually run.

## Build environment note
`npm run build` was attempted after the audits. This container does not have local dependencies installed, so it stops at `vite: not found`. No production-build PASS is claimed. GitHub Pages configuration remains covered by the existing Pages regression suite.
