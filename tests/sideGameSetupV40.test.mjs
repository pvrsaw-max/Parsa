import fs from 'node:fs';
const p=fs.readFileSync(new URL('../src/components/PartySessionSetup.jsx',import.meta.url),'utf8');
const screens=['RapidFire','ChainGame','OneWordGame','DirectorGame','ThreeSecondGame','QuoteGame'].map(n=>fs.readFileSync(new URL(`../src/screens/${n}.jsx`,import.meta.url),'utf8'));
const checks=[
 ['one-by-one player input',p.includes('addPlayer')&&p.includes('مثلاً علی')],
 ['enter adds player',p.includes("e.key==='Enter'")],
 ['plus button adds player',p.includes('aria-label="افزودن بازیکن"')],
 ['player chips rendered',p.includes('playerChip')],
 ['player removal supported',p.includes('removePlayer')],
 ['minimum players enforced',p.includes('players.length>=minPlayers')],
 ['start uses main CTA language',p.includes('بزن بریم')],
 ['round presets preserved',p.includes('[1,3,5,7]')],
 ['custom rounds bounded',p.includes('Math.min(12')&&p.includes('Math.max(1')],
 ['all six modes use unified setup',screens.every(s=>s.includes('PartySessionSetup'))],
 ['quote requires three players',screens[5].includes('minPlayers={3}')],
 ['other modes default to two players',screens.slice(0,5).every(s=>!s.includes('minPlayers={3}'))],
];
let fail=0; for(const [n,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${n}`);if(!ok)fail++} if(fail)process.exit(1);console.log(`Side Game Setup V40: ${checks.length}/${checks.length} PASS`);
