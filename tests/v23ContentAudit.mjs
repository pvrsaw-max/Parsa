import {bank,categories} from '../src/data/questions.js';
const tiers=[200,300,400,500,600];
const errors=[];
for(const category of categories){
  if(category==='چالش') continue;
  const src=bank[category];
  if(!src) errors.push(`${category}: missing bank`);
  for(const tier of tiers){
    const qs=src?.[tier]||[];
    const expected = ["هنر و معماری","علم و طبیعت","ریاضی و منطق","ورزش","فیلم و سریال","موسیقی","اطلاعات عمومی"].includes(category) ? 10 : 4;
    if(qs.length!==expected) errors.push(`${category}/${tier}: expected ${expected}, got ${qs.length}`);
    const ids=new Set();
    for(const q of qs){
      if(ids.has(q.id)) errors.push(`${category}/${tier}: duplicate id ${q.id}`); ids.add(q.id);
      if(!Array.isArray(q.opts)||q.opts.length!==4) errors.push(`${category}/${tier}/${q.id}: options`);
      if(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=4) errors.push(`${category}/${tier}/${q.id}: correctIndex`);
      if(!q.text?.trim()||!q.explanation?.trim()) errors.push(`${category}/${tier}/${q.id}: missing text/explanation`);
      if(new Set(q.opts).size!==4) errors.push(`${category}/${tier}/${q.id}: duplicate options`);
    }
  }
}
if(errors.length){console.error(`V23 content audit FAILED: ${errors.length}`);console.error(errors.join('\n'));process.exit(1)}
console.log(`V23 content audit PASS: existing categories keep 10 per tier; V23 expansion categories each have 20 questions (4 per tier), with structural QA passing.`);
