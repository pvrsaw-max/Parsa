import fs from 'node:fs';
const css=fs.readFileSync('src/styles/app.css','utf8');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('src/App.jsx','utf8');
const checks=[
 ['viewport-fit cover',/viewport-fit=cover/.test(html)],
 ['dynamic viewport fallback',/min-height:100vh;min-height:100dvh/.test(css)],
 ['safe area all screen edges',/safe-area-inset-right/.test(css)&&/safe-area-inset-left/.test(css)&&/safe-area-inset-bottom/.test(css)&&/safe-area-inset-top/.test(css)],
 ['modal constrained to viewport',/\.sheet\{max-height:calc\(100dvh/.test(css)&&/overflow-y:auto/.test(css)],
 ['iOS form zoom prevention',/input,select\{font-size:16px\}/.test(css)],
 ['44px touch targets',/button\{min-height:44px\}/.test(css)],
 ['narrow question options stack',/@media\(max-width:390px\)[\s\S]*?\.optionGrid\{grid-template-columns:1fr\}/.test(css)],
 ['horizontal overflow guarded',/overflow-x:hidden/.test(css)],
 ['overlay uses dvh',/\.overlay\{height:100vh;height:100dvh/.test(css)],
 ['auction numeric constraints remain',/min="2" max="15"/.test(app)],
];
let pass=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(ok)pass++}
console.log(`IPHONE SAFARI V23 ${pass}/${checks.length}`); if(pass!==checks.length)process.exit(1);
