import React from "react";
import GameShell from "../components/GameShell";
import Icon from "../components/Icon";

export default function Landing({canContinue,onContinue,onNew,onHall,onModes}){
 return <GameShell compact>
  <section className="landing v23Landing" dir="rtl">
   <div className="v23Brand">
    <div className="v23Logo"><span>پ</span><i><Icon name="spark" size={13}/></i></div>
    <div><span className="eyebrow">PARSAYAN</span><h1>پارسایان</h1></div>
   </div>
   <div className="v23HeroCopy">
    <span className="eyebrow">بازی دورهمی دانشی و استراتژیک</span>
    <h2>بازی کن، ریسک کن،<br/><em>برنده شو.</em></h2>
    <p>یک گوشی دست مجری؛ بقیه بازی بین آدم‌ها اتفاق می‌افتد.</p>
   </div>
   <div className="v23Actions">
    <button className="v23Primary" onClick={onNew}><span><Icon name="play" size={20}/></span><b>بازی جدید</b><small>یک مسابقه تازه شروع کن</small><i>←</i></button>
    {canContinue&&<button className="v23Secondary" onClick={onContinue}><span><Icon name="undo" size={19}/></span><b>ادامه بازی</b><small>بازی ذخیره‌شده</small><i>←</i></button>}
    <button className="v23Secondary" onClick={onModes}><span>🎲</span><b>بازی‌های جانبی</b><small>۶ بازی کوتاه دورهمی</small><i>←</i></button>
    <button className="v23Secondary" onClick={onHall}><span><Icon name="trophy" size={19}/></span><b>تالار قهرمانان</b><small>رکوردها و نتایج</small><i>←</i></button>
   </div>
   <div className="v23MiniStats"><span><b>تا ۱۲</b> راند</span><span><b>۱۸</b> زمینه</span><span><b>۵</b> قدرت</span></div>
  </section>
 </GameShell>
}
