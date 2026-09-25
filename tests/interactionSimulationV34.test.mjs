import fs from 'node:fs';
import {fresh,addPlayer,setRoundLimit,startGame,selectCategory,selectQuestion,revealOptions,setAuction,ownerResult,stealResult,commitTurn,armPower,swapQuestion,duelResult,availablePowers} from '../src/engine/gameEngine.js';
import {bank,challenges,categories,values} from '../src/data/questions.js';
const ok=(c,m)=>{if(!c)throw new Error('FAIL '+m);console.log('PASS',m)};
const screens=['Landing','Setup','Board','Values','SecretPowers','TieBreak','Winner','HallOfFame','PartyModes','RapidFire','ChainGame','OneWordGame','DirectorGame','ThreeSecondGame','QuoteGame'];
for(const n of screens) ok(fs.existsSync(new URL(`../src/screens/${n}.jsx`,import.meta.url)),`screen ${n}`);
let s=fresh();['علی','سارا','رضا','مینا'].forEach(n=>ok(addPlayer(s,n),`add ${n}`));ok(setRoundLimit(s,3),'round setting');ok(startGame(s).ok,'start game');
// finish secret draft using public API through deterministic choices
const eng=await import('../src/engine/gameEngine.js');
for(const n of s.players){const hand=eng.dealPowerHand(s,n);ok(hand.length===3,'power hand');ok(eng.chooseSecretPowers(s,n,hand.slice(0,2)).ok,'choose powers');ok(eng.confirmHandoff(s).ok,'handoff')}
ok(s.phase==='board','board reached');
const cat=categories.find(c=>c!=='چالش');ok(selectCategory(s,cat,categories).ok,'category button path');ok(s.phase==='values','values reached');ok(values.includes(200)&&values.includes(600),'score values');ok(selectQuestion(s,200,bank,challenges).ok,'value button path');ok(s.phase==='question','question reached');
// Auction path before reveal
const bidder=s.players[(s.turn+1)%s.players.length];ok(setAuction(s,bidder,5).ok,'auction register');ok(revealOptions(s).ok,'reveal options');let r=ownerResult(s,false,1000);ok(r.ok&&r.next==='steal','wrong owner routes steal');r=stealResult(s,true,2000);ok(r.ok,'steal judge');ok(commitTurn(s),'next-turn CTA');ok(s.phase==='board','back to board');
// Swap path, only when available to player: inject selected power to isolate UI contract
const owner=s.players[s.turn];s.powerDraft.choices[owner]=['تعویض','بیمه'];ok(armPower(s,'تعویض')===false,'swap blocked on board');ok(selectCategory(s,cat,categories).ok,'category second');ok(selectQuestion(s,300,bank,challenges).ok,'question second');ok(armPower(s,'تعویض'),'arm swap');ok(swapQuestion(s,bank).ok,'swap button behavior');
// Static interaction contracts for side games
const quote=fs.readFileSync(new URL('../src/screens/QuoteGame.jsx',import.meta.url),'utf8');ok(quote.includes('disabled={phase!=="guessing"||left===0}'),'quote guess locked before timer');
const director=fs.readFileSync(new URL('../src/screens/DirectorGame.jsx',import.meta.url),'utf8');ok(director.includes("phase==='prep'")&&director.includes('setPrep(5)'),'director real 5s prep');ok(!director.includes('sort(()=>Math.random()-.5)'),'director unbiased shuffle');
const css=fs.readFileSync(new URL('../src/styles/app.css',import.meta.url),'utf8');ok(css.includes('@media(max-width:340px)'),'320px hardening');ok(css.includes('.quoteSpeaker button,.quoteChoices button{min-height:44px}'),'quote touch targets');ok(css.includes('orientation:landscape'),'landscape hardening');
console.log('INTERACTION SIMULATION V34 PASS');
