export const parsePlayers=input=>[...new Set(String(input||"").split(/[،,\n]/).map(x=>x.trim()).filter(Boolean))].slice(0,12);
export const answeredSpeakers=quotes=>new Set((Array.isArray(quotes)?quotes:[]).map(x=>x?.speaker).filter(Boolean));
export const canStartQuoteRound=(players,quotes)=>Array.isArray(players)&&players.length>=3&&players.every(p=>answeredSpeakers(quotes).has(p));
export const nextUnanswered=(players,quotes,current="")=>{const done=answeredSpeakers(quotes);return players.find(p=>!done.has(p))||players[(Math.max(0,players.indexOf(current))+1)%Math.max(1,players.length)]||""};
export function makeQuote({speaker,text,prompt,id}){const clean=String(text||"").trim();if(!speaker)return{ok:false,error:"اول بازیکن را انتخاب کن."};if(clean.length<2)return{ok:false,error:"جواب خیلی کوتاه است؛ حداقل دو حرف بنویس."};if(!prompt?.prompt)return{ok:false,error:"سؤال آماده نیست؛ یک سؤال دیگر بگیر."};return{ok:true,quote:{id:id||`u-${Date.now()}`,speaker,quote:clean,prompt:prompt.prompt,category:prompt.category||"عمومی"}}}
export function scoreGuess(actual,guess,timedOut=false){if(timedOut)return{hit:0,miss:1};return guess&&guess===actual?{hit:1,miss:0}:{hit:0,miss:1}}
