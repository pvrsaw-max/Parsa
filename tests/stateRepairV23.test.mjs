import {fresh,addPlayer,hydrate,assertInvariants} from '../src/engine/gameEngine.js';
let pass=0;const T=(n,c)=>{if(!c)throw new Error('FAIL '+n);pass++;console.log('PASS',n)};
let s=fresh();addPlayer(s,'A');addPlayer(s,'B');s.phase='board';s.scores.A=NaN;s.scores.B=Infinity;
let h=hydrate(s);T('repairs non-finite scores',h.scores.A===0&&h.scores.B===0);T('repaired scores satisfy invariants',!assertInvariants(h).some(x=>x.startsWith('score:')));
h=hydrate({...s,scores:{A:10,B:20},stats:{A:{correct:-2,wrong:'x',duels:Infinity},B:null}});T('repairs malformed stats',JSON.stringify(h.stats.A)==='{"correct":0,"wrong":0,"duels":0}'&&JSON.stringify(h.stats.B)==='{"correct":0,"wrong":0,"duels":0}');
h=hydrate({...s,scores:{A:0,B:0},usedPowers:{A:['بیمه','بیمه','BAD'],B:'oops'}});T('repairs powers',JSON.stringify(h.usedPowers.A)==='["بیمه"]'&&Array.isArray(h.usedPowers.B)&&h.usedPowers.B.length===0);
console.log(`STATE REPAIR V23 ${pass}/4`);
