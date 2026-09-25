import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pkg=JSON.parse(read('package.json'));
const cfg=read('playwright.config.js');
const spec=read('e2e/side-games.spec.js');
const wf=read('.github/workflows/deploy.yml');
const checks=[
 ['playwright dependency',!!pkg.devDependencies['@playwright/test']],
 ['e2e npm script',pkg.scripts['test:e2e']==='playwright test'],
 ['mobile project',cfg.includes("devices['iPhone 13']")],
 ['real web server',cfg.includes('npm run dev')&&cfg.includes('4173')],
 ['all six modes', ['رگبار','زنجیره','یک کلمه، بیشتر نه','کارگردان','سه‌ثانیه','کی اینو گفت'].every(x=>spec.includes(x))],
 ['setup clicks plus',spec.includes("name: 'افزودن بازیکن'")],
 ['start enabled assertion',spec.includes('toBeEnabled()')],
 ['rapid actions',spec.includes("name: 'درست ✓'")],
 ['chain actions',spec.includes('وصل شد')&&spec.includes('نامعتبر')],
 ['director actions',spec.includes('کات زودتر')&&spec.includes('گرفتیم!')],
 ['three-second actions',spec.includes('حالا')&&spec.includes('سوخت')],
 ['quote private answers',spec.includes("['جواب اول', 'جواب دوم', 'جواب سوم']")],
 ['trace on failure',cfg.includes("trace: 'retain-on-failure'")],
 ['screenshot on failure',cfg.includes("screenshot: 'only-on-failure'")],
 ['workflow installs browser',wf.includes('playwright install --with-deps chromium')],
 ['workflow runs e2e',wf.includes('npm run test:e2e')],
];
let fail=0;for(const [n,ok] of checks){console.log(`${ok?'✓':'✗'} ${n}`);if(!ok)fail++}
console.log(`\nV41 E2E contract: ${checks.length-fail}/${checks.length}`);if(fail)process.exit(1);
