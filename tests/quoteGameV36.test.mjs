import fs from"node:fs";
const src=fs.readFileSync("src/screens/QuoteGame.jsx","utf8");
const css=fs.readFileSync("src/styles/app.css","utf8");
const data=fs.readFileSync("src/data/quoteGame.js","utf8");
const checks=[
 ["dedicated quote screen",/function QuoteGame/.test(src)],
 ["minimum 3 players",/players\.length<3/.test(src)],
 ["every player must answer",/allPlayersAnswered/.test(src)&&/players\.every/.test(src)],
 ["start guarded",/quotes\.length<3\|\|!allPlayersAnswered/.test(src)],
 ["safe current card",/const q=playDeck\[index\]\|\|null/.test(src)],
 ["missing-card recovery",/کارت بازی آماده نشد/.test(src)],
 ["timer is explicit 15s",/QUOTE_GUESS_MS = 15000/.test(data)],
 ["choices locked before timer",/disabled=\{phase!=="guessing"\|\|left===0\}/.test(src)],
 ["guess required to reveal",/phase!=="guessing"\|\|!guess/.test(src)],
 ["timeout counted once",/timeoutCounted\.current/.test(src)],
 ["timeout reveals",/setRevealed\(true\);setPhase\("play"\)/.test(src)],
 ["next round resets",/setGuess\(""\);setRevealed\(false\);setLeft\(QUOTE_GUESS_MS\)/.test(src)],
 ["collection progress UI",/quoteProgress/.test(src)&&/quoteProgress/.test(css)],
 ["decorative collision guard",/decorative collision guard/i.test(css)],
 ["mobile quote layout",/@media\(max-width:390px\)[\s\S]*quoteProgress/.test(css)]
];
let pass=0;for(const[c,ok]of checks){if(ok){pass++;console.log("PASS",c)}else{console.error("FAIL",c)}}console.log(`QUOTE V36 ${pass}/${checks.length}`);if(pass!==checks.length)process.exit(1);
