import React,{useMemo,useState} from 'react';

const PREF='parsayan_party_fx';
export function fxEnabled(){try{return localStorage.getItem(PREF)!=='off'}catch{return true}}
export function setFxEnabled(on){try{localStorage.setItem(PREF,on?'on':'off')}catch{}}
export function partyCue(kind='tap'){
 if(!fxEnabled())return;
 try{if(navigator.vibrate)navigator.vibrate(kind==='win'?[35,45,70]:kind==='good'?[28]:kind==='bad'?[18,35,18]:[12])}catch{}
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();
  const hz=kind==='win'?740:kind==='good'?610:kind==='bad'?190:420;o.frequency.value=hz;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.035,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.09);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.1);o.onended=()=>c.close();
 }catch{}
}
export function FxToggle(){const[on,setOn]=useState(fxEnabled());return <button type="button" className="fxToggle" aria-label={on?'خاموش کردن صدا و لرزش':'روشن کردن صدا و لرزش'} onClick={()=>{const n=!on;setOn(n);setFxEnabled(n);if(n)partyCue('tap')}}>{on?'♪ روشن':'♪ خاموش'}</button>}
export function PartyChampion({title='قهرمان مسابقه',players=[],scores={},onRestart,onBack}){
 const ranked=useMemo(()=>[...players].sort((a,b)=>(scores[b]||0)-(scores[a]||0)),[players,scores]);
 const top=ranked[0],max=top?(scores[top]||0):0,winners=ranked.filter(p=>(scores[p]||0)===max);
 return <section className="partyFinal" aria-live="polite"><div className="championHalo">♛</div><span className="eyebrow">FINAL SCORE</span><h1>{winners.length>1?'پایانِ مساوی!':title}</h1><p className="championName">{winners.join(' · ')}</p><strong className="championScore">{max} امتیاز</strong><div className="finalRanking">{ranked.map((p,i)=><div className={`finalRank ${i===0?'first':''}`} key={p}><span>{i+1}</span><b>{p}</b><strong>{scores[p]||0}</strong></div>)}</div><div className="finalActions"><button className="primary" onClick={()=>{partyCue('tap');onRestart?.()}}>مسابقه تازه</button>{onBack&&<button className="ghost" onClick={onBack}>بازی‌های دیگر</button>}</div></section>
}
