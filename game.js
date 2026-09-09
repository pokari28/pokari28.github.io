const URLS={
beginnerIdle:'https://i.imgur.com/rVHmSnO.jpeg',
beginnerGood:'https://i.imgur.com/gYnugnU.jpeg',
beginnerBad:'https://i.imgur.com/kxvXRoW.jpeg',
proIdle:'https://i.imgur.com/V14GfXC.jpeg',
proIdlePlus:'https://i.imgur.com/Sr2n9CA.jpeg',
proGood:'https://i.imgur.com/BMiIM4X.jpeg',
proBad:'https://i.imgur.com/LXnRlAz.jpeg',
milestone10:'https://i.imgur.com/t2mmvGS.jpeg',
milestone20:'https://i.imgur.com/Y6o8sir.jpeg',
milestone30:'https://i.imgur.com/LFQgv4s.jpeg',
endingPerfect:'https://i.imgur.com/nPzY1Hm.jpeg',
title:'https://i.imgur.com/0vgA5sK.jpeg'
};
function pick(k){
  const d=window.IMAGE_DATA||{};
  return d[k]||URLS[k]||d.beginnerIdle||d.proIdle||d.title||URLS.beginnerIdle||'';
}
const IMG={
beginnerIdle:pick('beginnerIdle'),
beginnerGood:pick('beginnerGood'),
beginnerBad:pick('beginnerBad'),
proIdle:pick('proIdle'),
proIdlePlus:pick('proIdlePlus'),
proGood:pick('proGood'),
proBad:pick('proBad'),
m10:pick('milestone10'),
m20:pick('milestone20'),
m30:pick('milestone30'),
perfect:pick('endingPerfect'),
title:pick('title')
};
const baked=new Set([IMG.m10,IMG.m20,IMG.m30,IMG.perfect]);
if(IMG.title){
  document.getElementById('title').style.backgroundImage='linear-gradient(180deg,rgba(255,255,255,.15) 20%,rgba(255,255,255,.92) 62%,#fff 100%),url("'+IMG.title+'")';
}
if(IMG.beginnerIdle) document.getElementById('char').src=IMG.beginnerIdle;

let audioCtx,muted=false,bgmTimer,qIndex=0,score=0,quiz=[],failed=false,mode='beginner',qTimer,typeTimer;
const HSB='wanwanQuizHighScoreBeginner',HSP='wanwanQuizHighScorePro';
let hiB=+localStorage.getItem(HSB)||0,hiP=+localStorage.getItem(HSP)||0;
document.getElementById('hsB').innerText=hiB;
document.getElementById('hsP').innerText=hiP;
const title=document.getElementById('title'),char=document.getElementById('char'),opts=document.getElementById('options');
const fill=document.getElementById('fill'),pct=document.getElementById('pct'),prog=document.getElementById('progress'),bubble=document.getElementById('voice');

function initAudio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}
function beep(f,d,t,v){if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.value=f;o.connect(g);g.connect(audioCtx.destination);const n=audioCtx.currentTime;o.start(n);o.stop(n+d);g.gain.setValueAtTime(v,n);g.gain.linearRampToValueAtTime(0,n+d)}
function toggleMute(){muted=!muted;document.getElementById('mute').innerText=muted?'\uD83D\uDD07':'\uD83D\uDD0A';if(muted)stopBGM();else if(title.style.display==='none')startBGM()}
function stopBGM(){if(bgmTimer){clearTimeout(bgmTimer);bgmTimer=null}}
function startBGM(){if(muted)return;stopBGM();initAudio();const notes=mode==='beginner'?[523,659,784,659]:[440,523,659,784];let i=0;function tick(){if(muted)return;beep(notes[i%notes.length],.12,'triangle',.03);i++;bgmTimer=setTimeout(tick,220)}tick()}
function goodS(){if(!muted){initAudio();beep(660,.1,'sine',.1);setTimeout(()=>beep(880,.3,'sine',.1),100)}}
function badS(){if(!muted){initAudio();beep(150,.2,'sawtooth',.1)}}
function fanfare(){if(muted)return;stopBGM();initAudio();[0,150,300,450].forEach((t,i)=>setTimeout(()=>beep([523,659,784,1047][i],i===3?.6:.15,'square',.1),t));setTimeout(()=>{if(!muted&&title.style.display==='none')startBGM()},1500)}
function startGame(m){title.style.display='none';prog.style.display='flex';mode=m;try{initAudio();beep(1047,.1,'square',.1);startBGM()}catch(e){}initGame()}
function backToTitle(){if(qTimer)clearTimeout(qTimer);stopBGM();title.style.display='flex';prog.style.display='none';opts.innerHTML='';bubble.textContent='';bubble.classList.remove('hide');char.src=IMG.beginnerIdle;score=0;updateGauge();document.getElementById('hsB').innerText=hiB;document.getElementById('hsP').innerText=hiP}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function idle(){return mode==='pro'?(score>=10?IMG.proIdlePlus:IMG.proIdle):IMG.beginnerIdle}
function setChar(src,hideB){char.src=src;char.classList.remove('jump','shake');bubble.classList.toggle('hide',!!hideB||baked.has(src))}
function updateGauge(){const max=quiz.length||1,p=Math.round(score/max*100);fill.style.height=p+'%';pct.innerText=p+'%';fill.style.background=p<30?'linear-gradient(0deg,#4facfe,#00f2fe)':p<70?'linear-gradient(0deg,#43e97b,#38f9d7)':'linear-gradient(0deg,#fa709a,#fee140)';prog.innerText=Math.min(qIndex+1,max)+' / '+max}
function say(t){bubble.classList.remove('hide');bubble.textContent='';if(typeTimer)clearTimeout(typeTimer);let i=0;function step(){if(i<t.length){bubble.textContent+=t.charAt(i++);if(!muted){initAudio();beep(900,.04,'square',.015)}typeTimer=setTimeout(step,32)}}step()}
function initGame(){if(typeof beginnerQuestions==='undefined'||typeof proQuestions==='undefined'){say('問題ファイルが読み込めません');return}quiz=shuffle([...(mode==='beginner'?beginnerQuestions:proQuestions)]).slice(0,mode==='beginner'?10:30);qIndex=0;score=0;failed=false;setChar(idle(),false);updateGauge();showQ()}
const pres=['行くよ！','次言うよ！','準備はいい？','さあ、次！','よく聞いて！','気合入れて！'];
const ok=['その調子！','正解！いいぞ！','やるね！','素晴らしい！'];
const ng=['ドンマイ！','次は当てよう！','惜しかったかも？'];
function showQ(){if(qIndex>=quiz.length){finish();return}failed=false;updateGauge();say(qIndex===0?'先生と一緒に頑張ろ！':pres[Math.floor(Math.random()*pres.length)]);opts.innerHTML='';setChar(idle(),false);qTimer=setTimeout(()=>{const q=quiz[qIndex];say('Q'+(qIndex+1)+'.\n'+q.q);opts.innerHTML='';const ans=q.options[q.ans];shuffle([...q.options]).forEach(opt=>{const b=document.createElement('button');b.className='choice';b.innerText=opt;b.onclick=e=>check(opt,ans,e.target);opts.appendChild(b)});setChar(idle(),false)},900)}
function check(sel,ans,btn){if(sel===ans){opts.querySelectorAll('button').forEach(b=>b.disabled=true);btn.style.background='#ff99cc';if(!failed)score++;updateGauge();let spec=null,img=null;if(!failed){if(score===30){spec='30問正解！先生も嬉しいよ！';img=IMG.m30}else if(score===20){spec='20問正解！エライエライ！';img=IMG.m20}else if(score===10){spec='10問正解！いいペースだよ！';img=IMG.m10}}if(img){fanfare();setChar(img,true);say(spec);qIndex++;qTimer=setTimeout(showQ,3800);return}goodS();say(ok[Math.floor(Math.random()*ok.length)]);setChar(mode==='pro'?IMG.proGood:IMG.beginnerGood,false);char.classList.add('jump');qIndex++;qTimer=setTimeout(showQ,1800)}else{failed=true;badS();say(ng[Math.floor(Math.random()*ng.length)]);setChar(mode==='pro'?IMG.proBad:IMG.beginnerBad,false);char.classList.add('shake');btn.style.background='#999';btn.disabled=true}}
function finish(){stopBGM();const max=quiz.length||1,p=Math.round(score/max*100);let msg='全問終了！最終ポイント: '+p+'%\n';const perfect=(mode==='beginner'&&score===10)||(mode==='pro'&&score===30);if(mode==='beginner'&&p>hiB){hiB=p;localStorage.setItem(HSB,hiB);msg+='\uD83C\uDF89基礎モード ハイスコア更新！\uD83C\uDF89\n'}if(mode==='pro'&&p>hiP){hiP=p;localStorage.setItem(HSP,hiP);msg+='\uD83C\uDF89プロモード ハイスコア更新！\uD83C\uDF89\n'}opts.innerHTML='<button onclick="backToTitle()">タイトルに戻る</button>';prog.innerText=max+' / '+max;if(perfect){msg+='とっても頑張ったね！\n今度もよろしくね！';setChar(IMG.perfect,true);fanfare();fill.style.height='100%'}else{msg+='お疲れ様！\nまた挑戦してね！';setChar(idle(),false)}say(msg)}
