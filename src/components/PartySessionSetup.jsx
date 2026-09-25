import React,{useMemo,useState} from 'react';

export const parsePartyNames=(text='')=>[...new Set(text.split(/[،,\n]/).map(x=>x.trim()).filter(Boolean))].slice(0,12);

export function PartySessionSetup({title='تنظیم بازی',playersText,setPlayersText,rounds,setRounds,onStart,minPlayers=2}){
 const [name,setName]=useState('');
 const players=useMemo(()=>parsePartyNames(playersText),[playersText]);
 const valid=players.length>=minPlayers;
 const addPlayer=()=>{
   const clean=name.trim();
   if(!clean||players.includes(clean)||players.length>=12)return;
   setPlayersText([...players,clean].join('\n')); setName('');
 };
 const removePlayer=(player)=>setPlayersText(players.filter(p=>p!==player).join('\n'));
 return <section className="partySessionSetup">
  <div className="sessionSetupHead"><span className="eyebrow">میز بازی را بچین</span><h2>{title}</h2><p>اسم‌ها را یکی‌یکی اضافه کن؛ امتیازها تا پایان همین مسابقه جمع می‌شوند.</p></div>
  <div className="sessionPlayers">
   <div className="sectionHead"><div><span className="eyebrow">بازیکن‌ها · چند نفریم؟</span><h3>تیم امشب</h3></div><span className="count">{players.length} نفر</span></div>
   <div className="inputRow"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addPlayer()}}} placeholder="مثلاً علی" autoComplete="off"/><button type="button" className="iconBtn" aria-label="افزودن بازیکن" onClick={addPlayer}>＋</button></div>
   <div className="playerList">{players.map((p,i)=><div className="playerChip" key={p}><span>{String(i+1).padStart(2,'0')}</span><b>{p}</b><i>{i===0?'شروع‌کننده':''}</i><button type="button" className="removePlayer" aria-label={`حذف ${p}`} onClick={()=>removePlayer(p)}>×</button></div>)}</div>
   <small className={valid?'sessionOk':'sessionHint'}>{valid?`${players.length} بازیکن آماده‌اند`:`حداقل ${minPlayers} بازیکن اضافه کن`}</small>
  </div>
  <div className="sessionRounds"><div className="sectionHead"><div><span className="eyebrow">طول بازی</span><h3>چند راند بازی می‌کنیم؟</h3></div><span className="count">{rounds} راند</span></div><p className="roundHelp">هر راند یعنی همه یک نوبت کامل.</p><div className="roundPresets">{[1,3,5,7].map(n=><button type="button" key={n} className={rounds===n?'active':''} onClick={()=>setRounds(n)}><b>{n}</b><small>{n===1?'سریع':n===3?'کوتاه':n===5?'متعادل':'حماسی'}</small></button>)}</div><label className="roundCustom"><span>تعداد دلخواه</span><input aria-label="تعداد راند دلخواه" type="number" inputMode="numeric" min="1" max="12" value={rounds} onChange={e=>{const v=Math.max(1,Math.min(12,Number(e.target.value)||1));if(Number.isInteger(v))setRounds(v)}}/><small>۱ تا ۱۲</small></label></div>
  <button type="button" className="cta gameStart sessionStart" disabled={!valid} onClick={()=>valid&&onStart(players)}><span><b>بزن بریم</b><small>{valid?`${players.length} بازیکن · ${rounds} راند`:`حداقل ${minPlayers} بازیکن لازم داریم`}</small></span><span>←</span></button>
 </section>
}

export function MiniScoreboard({players=[],scores={},current,round,rounds}){const ranked=[...players].sort((a,b)=>(scores[b]||0)-(scores[a]||0));return <section className="miniScoreboard"><header><span>{rounds?`راند ${Math.min(round||1,rounds)} از ${rounds}`:'رتبه‌بندی زنده'}</span><b>{current?`نوبت ${current}`:'جدول امتیاز'}</b></header><div>{ranked.map((p,i)=><span key={p} className={p===current?'current':''}><i>{i+1}</i><small>{p}</small><strong>{scores[p]||0}</strong></span>)}</div></section>}

export const emptyScores=players=>Object.fromEntries(players.map(p=>[p,0]));
