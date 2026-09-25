import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
let n=0;const ok=(x,m)=>{if(!x)throw new Error('FAIL '+m);n++;console.log('✓ '+m)};
const feel=read('src/components/PartyGameFeel.jsx'),setup=read('src/components/PartySessionSetup.jsx'),shell=read('src/components/GameShell.jsx'),css=read('src/styles/app.css');
ok(feel.includes('PartyChampion'),'shared champion screen');
ok(feel.includes('partyCue'),'shared sound/haptic cue');
ok(feel.includes('prefers')||css.includes('prefers-reduced-motion'),'reduced motion respected');
ok(feel.includes('localStorage'),'fx preference persists');
ok(setup.includes('sort((a,b)'),'live scoreboard ranking');
ok(shell.includes('FxToggle'),'main game exposes fx control');
ok(css.includes('championPop'),'champion motion exists');
ok(css.includes('finalRanking'),'final ranking styled');
for(const f of ['RapidFire','ChainGame','OneWordGame','DirectorGame','ThreeSecondGame','QuoteGame']){const s=read('src/screens/'+f+'.jsx');ok(s.includes('PartyChampion'),f+' uses shared final');ok(s.includes('partyCue'),f+' has feedback cue')}
const app=read('src/App.jsx'),winner=read('src/screens/Winner.jsx');ok(app.includes('partyCue(ok?'),'main question feedback cue');ok(winner.includes('partyCue("win")'),'main winner cue');
console.log(`V39 FINAL GAME FEEL ${n}/${n} PASS`);
