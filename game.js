const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let current='start';function show(id){current=id;$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));scrollTo(0,0)}$$('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));$('#logo').onclick=()=>show('start');$('#rulesBtn').onclick=()=>$('#modal').classList.add('show');$('#closeModal').onclick=()=>$('#modal').classList.remove('show');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('show')};let lang='ru';let sound=true;$('#soundBtn').onclick=()=>{$('#soundBtn').textContent=(sound=!sound)?'🔊':'🔇'};function toast(t){let x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
const STORE='asyqArenaStrongV1';let profile=JSON.parse(localStorage.getItem(STORE)||'null')||{name:'Гость',xp:0,bestKnocked:0,bestAccuracy:0,completed:[],history:[]};function saveProfile(){localStorage.setItem(STORE,JSON.stringify(profile));renderProfile()}function renderProfile(){let lvl=1+Math.floor(profile.xp/300),inLevel=profile.xp%300;$('#profileName').textContent=profile.name;$('#profileLevel').textContent=`Уровень ${lvl} • ${lvl<2?'Бастаушы':lvl<4?'Мерген':'Шебер'}`;$('.avatar').textContent=(profile.name[0]||'A').toUpperCase();$('#xpFill').style.width=(inLevel/3)+'%';$('#xpText').textContent=`${inLevel} / 300 XP`;$('#bestKnocked').textContent=profile.bestKnocked;$('#bestAccuracy').textContent=profile.bestAccuracy+'%';$('#challengeProgress').textContent=`${profile.completed.length}/5`;let h=$('#historyList');h.innerHTML=profile.history.length?profile.history.slice(0,8).map(x=>`<div class="historyrow"><span>${x.date} • ${x.type}</span><b>${x.knocked} выбито</b><b>${x.throws} брос.</b><b>${x.accuracy}%</b></div>`).join(''):'<p class="empty">Пока матчей нет.</p>'}function recordResult(type,k,t,acc,win=false){profile.bestKnocked=Math.max(profile.bestKnocked,k);profile.bestAccuracy=Math.max(profile.bestAccuracy,acc);profile.xp+=Math.max(10,k*15)+(win?80:0);profile.history.unshift({date:new Date().toLocaleDateString('ru-RU'),type,knocked:k,throws:t,accuracy:acc});profile.history=profile.history.slice(0,20);let tip=acc<25?'Попробуй уменьшить силу и сначала выровнять направление по ближайшему асыку.':t>6?'Точность уже хорошая. Теперь цель — выбивать больше асыков одним ударом, выбирая край группы.':'Хороший контроль. Попробуй бить не в центр, а чуть сбоку — цепная реакция может выбить несколько асыков.';$('#coachText').textContent=tip;saveProfile()}renderProfile();$('#authBtn').onclick=()=>$('#authModal').classList.add('show');$('#closeAuth').onclick=()=>$('#authModal').classList.remove('show');$('#localLogin').onclick=()=>{let n=$('#authName').value.trim()||$('#nick').value.trim()||'Мерген';profile.name=n;$('#nick').value=n;$('#playerName').textContent=n;saveProfile();$('#authModal').classList.remove('show');$('#authBtn').textContent=n;toast('Профиль сохранён на устройстве')};let tutorialStep=0,trainingMode=false,trainingStep=0;
const tutorials=[
 ['1. ЦЕЛЬ ИГРЫ','◎','Выбивай обычные асыки полностью за белую границу круга. Для победы нужно выбить 8 асыков максимум за 7 бросков.'],
 ['2. КРАСНЫЙ АСЫҚ','!','Красный асық — запретная цель. Если он полностью покинет круг от прямого удара или рикошета — ты проиграешь.'],
 ['3. НАПРАВЛЕНИЕ И СИЛА','↗','Сначала мышью или пальцем выбери угол броска. Затем подтверди направление и поймай нужную силу на движущейся шкале.'],
 ['4. ГОТОВ!','◎','Теперь попробуй сам: наведи стрелку, подтверди угол, выбери силу и нажми УДАР. Подсказки будут двигаться вместе с твоими действиями.']
];
function showTut(){let t=tutorials[tutorialStep];$('#tutorialTitle').textContent=t[0];$('#tutorialVisual').textContent=t[1];$('#tutorialText').textContent=t[2];$$('.tutorialSteps i').forEach((x,i)=>x.classList.toggle('on',i===tutorialStep));$('#tutorialNext').textContent=tutorialStep===3?'ПОПРОБОВАТЬ →':'ДАЛЬШЕ →';$('#tutorialPrevArrow').disabled=tutorialStep===0;$('#tutorialNextArrow').disabled=tutorialStep===3}
function openOldTutorial(){tutorialStep=0;showTut();$('#tutorial').classList.add('show')}
function moveTut(d){tutorialStep=Math.max(0,Math.min(3,tutorialStep+d));showTut()}
$('#learnBtn').onclick=openOldTutorial;
$('#closeTutorial').onclick=()=>$('#tutorial').classList.remove('show');
$('#tutorialPrevArrow').onclick=()=>moveTut(-1);
$('#tutorialNextArrow').onclick=()=>moveTut(1);
function startTraining(){trainingMode=true;trainingStep=0;$('#tutorial').classList.remove('show');let n=$('#nick').value.trim()||profile.name||'Игрок';$('#playerName').textContent=n;newMatch('training');updateTrainingCoach(0)}
$('#tutorialNext').onclick=()=>{if(tutorialStep<3)moveTut(1);else startTraining()};
let skin='classic';$$('.skin').forEach(card=>card.querySelector('button').onclick=()=>{$$('.skin').forEach(x=>x.classList.remove('selected'));card.classList.add('selected');skin=card.dataset.skin;$$('.skin button').forEach(x=>x.textContent='ПРИМЕРИТЬ');card.querySelector('button').textContent='ВЫБРАНО';toast('Скин применён • характеристики не изменились')});$('#premiumDemo').onclick=()=>toast('Premium demo: 12 дополнительных испытаний + оформление. Без бонусов к силе.');
const c=$('#canvas'),ctx=c.getContext('2d');const circle={x:550,y:390,rx:178,ry:98,r:178};const ground={left:55,right:1045,top:205,bottom:650};let asyqs=[],saqa,drag=false,dragPos=null,running=false,raf,knocked=0,throws=0,shortDistance=false,particles=[],exitFx=[],challenge=null,challengeStart=0,combo=0,bestCombo=0,successfulThrows=0;const MAX_THROWS=7;
let forbiddenAsyq=null,forbiddenFailed=false,randomMission=null,missionDone=false,ricochetThisMatch=false,maxKnockedOneThrow=0;
const TURN={AIMING:'AIMING',POWER_SELECT:'POWER_SELECT',SHOT_ACTIVE:'SHOT_ACTIVE',RESOLVING:'RESOLVING',TURN_END:'TURN_END',GAME_OVER:'GAME_OVER'};
let turnState=TURN.AIMING,aimAngle=-Math.PI/2,powerPos=0,powerDir=1,powerRaf=0,powerLast=0,currentPower=75,perfectShot=false,settleFrames=0,resolveQueued=false,shotRicochet=false,shotStartKnocked=0;
const POWER_ZONES=[
 {a:0,b:.147,v:25},{a:.147,b:.283,v:50},{a:.283,b:.392,v:75},{a:.392,b:.489,v:100},{a:.489,b:.511,v:150,perfectA:.4975,perfectB:.5025},
 {a:.511,b:.608,v:100},{a:.608,b:.717,v:75},{a:.717,b:.853,v:50},{a:.853,b:1,v:25}
];
function zoneAt(p){return POWER_ZONES.find(z=>p>=z.a&&p<=z.b)||POWER_ZONES[0]}
function stopPowerMeter(){cancelAnimationFrame(powerRaf);powerRaf=0}
function powerSpeed(){let s=.00086; if(randomMission&&randomMission.id==='fastScale')s*=1.28;s*=1+Math.min(.12,combo*.025);return s}
function meterTick(t){if(turnState!==TURN.POWER_SELECT)return;let dt=Math.min(34,t-(powerLast||t));powerLast=t;powerPos+=powerDir*dt*powerSpeed();if(powerPos>=1){powerPos=1;powerDir=-1}else if(powerPos<=0){powerPos=0;powerDir=1}let m=$('#powerMarker');if(m)m.style.left=(powerPos*100)+'%';powerRaf=requestAnimationFrame(meterTick)}
function beginPower(){if(!running||turnState!==TURN.AIMING)return;if(trainingMode)updateTrainingCoach(2);turnState=TURN.POWER_SELECT;drag=false;$('#confirmAim').disabled=true;$('#hitBtn').disabled=false;$('#hint').textContent='Поймай нужную силу и нажми УДАР';powerPos=.05;powerDir=1;powerLast=0;stopPowerMeter();powerRaf=requestAnimationFrame(meterTick)}
function fireTimedShot(){if(!running||turnState!==TURN.POWER_SELECT)return;if(trainingMode)updateTrainingCoach(3);turnState=TURN.SHOT_ACTIVE;stopPowerMeter();$('#hitBtn').disabled=true;let z=zoneAt(powerPos);currentPower=z.v;perfectShot=!!(z.perfectA&&powerPos>=z.perfectA&&powerPos<=z.perfectB);let coeff={25:.055,50:.073,75:.089,100:.105,150:.118}[currentPower];if(perfectShot)coeff*=1.05;let variance=.98+Math.random()*.04;
let spreadDeg={25:.25,50:.45,75:.8,100:1.35,150:2.4}[currentPower]||.8;
if(perfectShot)spreadDeg=.18;
let jitter=(Math.random()*2-1)*spreadDeg*Math.PI/180;
let ang=aimAngle+jitter;saqa.vx=Math.cos(ang)*190*coeff*variance;saqa.vy=Math.sin(ang)*190*coeff*variance;
let jumpByPower={25:1.35,50:1.65,75:2.0,100:2.55,150:3.45};
saqa.z=0;saqa.vz=(jumpByPower[currentPower]||2.2)*(perfectShot?1.06:1);saqa.airborne=true;saqa.moving=true;saqa.hitDone=false;throws++;challengeStart=knocked;shotStartKnocked=knocked;shotRicochet=false;settleFrames=0;resolveQueued=false;if($('#throwsHud'))$('#throwsHud').textContent=throws;$('#powerReadout').textContent=perfectShot?'PERFECT! 150':`СИЛА: ${currentPower}`;toast(perfectShot?'✨ PERFECT! • 150':`СИЛА: ${currentPower}`);if(perfectShot){document.body.classList.add('powerPerfect');setTimeout(()=>document.body.classList.remove('powerPerfect'),180)}}
function prepareAim(){stopPowerMeter();turnState=TURN.AIMING;settleFrames=0;resolveQueued=false;$('#confirmAim').disabled=false;$('#hitBtn').disabled=true;$('#powerReadout').textContent='Выбери направление';$('#powerMarker').style.left='0%'}
function allObjectsStopped(){if(saqa&&(saqa.airborne||saqa.z>0.05))return false;if(saqa&&Math.hypot(saqa.vx||0,saqa.vy||0)>.16)return false;return !asyqs.some(a=>a.alive&&Math.hypot(a.vx||0,a.vy||0)>.16)}
function forbiddenLoss(){if(turnState===TURN.GAME_OVER)return;turnState=TURN.GAME_OVER;running=false;stopPowerMeter();cancelAnimationFrame(raf);forbiddenFailed=true;setTimeout(()=>{show('result');$('#resultTitle').textContent='🚫 ЗАПРЕТНАЯ ЦЕЛЬ!';$('#resultText').textContent='ПОРАЖЕНИЕ • запретный асық полностью покинул круг. Неважно, был это прямой удар, рикошет или цепная реакция.';$('#finalKnocked').textContent=knocked;$('#finalThrows').textContent=throws;$('#finalAccuracy').textContent=Math.min(100,Math.round(successfulThrows/Math.max(1,throws)*100))+'%';if($('#finalCombo'))$('#finalCombo').textContent=bestCombo;if($('#stars'))$('#stars').textContent='☆☆☆'},420)}

const RANDOM_MISSIONS=[
 {id:'safe',title:'НЕ ТРОНЬ ЗАПРЕТНЫЙ',text:'Победи, не выбив красный асық за границу круга.',xp:70},
 {id:'ricochet',title:'ЦЕПНАЯ РЕАКЦИЯ',text:'Сделай хотя бы один настоящий рикошет асық → асық.',xp:70},
 {id:'double',title:'ДВОЙНОЙ УДАР',text:'Выбей минимум 2 обычных асыка одним броском.',xp:80},
 {id:'fast3',title:'БЫСТРЫЙ СТАРТ',text:'Выбей 3 обычных асыка за первые 2 броска.',xp:80},
 {id:'combo3',title:'ХЛАДНОКРОВИЕ',text:'Собери серию успешных бросков ×3.',xp:90},
 {id:'fastScale',title:'БЫСТРАЯ ШКАЛА',text:'Маркер силы движется быстрее. Сохрани точность.',xp:90},
 {id:'power150',title:'МОЩНЫЙ УДАР',text:'Выбей обычный асық ударом силой 150.',xp:90}
];
function pickRandomMission(){randomMission=RANDOM_MISSIONS[Math.floor(Math.random()*RANDOM_MISSIONS.length)];missionDone=false;ricochetThisMatch=false;maxKnockedOneThrow=0;forbiddenFailed=false}
function showMissionCard(){if(!randomMission)return;$('#missionTitle').textContent=randomMission.title;$('#missionText').textContent=randomMission.text;$('#missionReward').textContent=`+${randomMission.xp} XP за выполнение`;$('#missionModal').classList.add('show')}
function missionCheck(){if(!randomMission||missionDone)return;let ok=randomMission.id==='safe'?!forbiddenFailed&&knocked>=8:randomMission.id==='ricochet'?ricochetThisMatch:randomMission.id==='double'?maxKnockedOneThrow>=2:randomMission.id==='fast3'?throws<=2&&knocked>=3:randomMission.id==='combo3'?combo>=3:randomMission.id==='power150'?currentPower===150&&knocked>shotStartKnocked:false;if(ok){missionDone=true;profile.xp+=randomMission.xp;saveProfile();toast(`✓ ${randomMission.title} • +${randomMission.xp} XP`)}}
function setupAsyqs(){asyqs=[];const spacing=19,start=550-7*spacing;for(let i=0;i<15;i++)asyqs.push({x:start+i*spacing,y:350,vx:0,vy:0,r:11,alive:true,homeX:start+i*spacing,homeY:350,rot:i*.43,spin:0,boosted:false,knockout:false,scored:false})}
function resetSaqa(){saqa={x:shortDistance?550:250,y:shortDistance?520:592,vx:0,vy:0,r:12.5,moving:false,rot:-.25,hitDone:false,z:0,vz:0,airborne:false};drag=false;dragPos=null;aimAngle=Math.atan2(circle.y-saqa.y,circle.x-saqa.x);$('#distanceLabel').textContent=shortDistance?'КРАЙ КРУГА':'6 М';prepareAim()}
function updateTrainingCoach(step){
 if(!trainingMode)return;trainingStep=step;let data=[
  ['НАВЕДИ СТРЕЛКУ','Мышью или пальцем направь стрелку на обычный асық. Стрелка на поле двигается за твоим прицелом.'],
  ['ПОДТВЕРДИ УГОЛ','Отлично. Теперь нажми «ПОДТВЕРДИТЬ», чтобы зафиксировать выбранное направление.'],
  ['ПОЙМАЙ СИЛУ','Смотри на движущийся маркер внизу. Выбери силу и нажми «УДАР» в нужный момент.'],
  ['СМОТРИ НА БРОСОК','Готово! Сақа летит. Посмотри, как сила и угол влияют на результат.']
 ][step];$('#trainingCoach').classList.add('show');$('#trainingCount').textContent=(step+1)+'/4';$('#trainingTitle').textContent=data[0];$('#trainingText').textContent=data[1];$$('.trainingProgress i').forEach((x,i)=>x.classList.toggle('on',i===step))}
function finishTraining(){
 trainingMode=false;$('#trainingCoach').classList.remove('show');try{localStorage.setItem('asyqTutorialComplete','1')}catch(e){}
 turnState=TURN.GAME_OVER;running=false;stopPowerMeter();cancelAnimationFrame(raf);
 setTimeout(()=>{show('result');$('#resultTitle').textContent='ОБУЧЕНИЕ ПРОЙДЕНО!';$('#resultText').textContent='Ты сам выбрал направление, подтвердил угол, поймал силу и сделал бросок. Теперь можно играть настоящий матч.';$('#finalKnocked').textContent=knocked;$('#finalThrows').textContent=1;$('#finalAccuracy').textContent=knocked>0?'100%':'—';if($('#finalCombo'))$('#finalCombo').textContent='—';if($('#stars'))$('#stars').textContent='★☆☆'},250)
}
function newMatch(ch=null){challenge=ch;knocked=0;throws=0;combo=0;bestCombo=0;successfulThrows=0;shortDistance=false;particles=[];exitFx=[];setupAsyqs();forbiddenAsyq=null;forbiddenFailed=false;randomMission=null;missionDone=false;ricochetThisMatch=false;maxKnockedOneThrow=0;if(!ch){pickRandomMission();forbiddenAsyq=asyqs[Math.floor(Math.random()*asyqs.length)];forbiddenAsyq.forbidden=true;}if(ch==='angle')asyqs.forEach((a,i)=>{a.x+=75;a.homeX=a.x;a.y+=((i%3)-1)*7;a.homeY=a.y});if(ch==='sniper')asyqs.forEach((a,i)=>{a.x=470+i*12;a.homeX=a.x;a.y=340+(i%2)*20;a.homeY=a.y});if(ch==='master')asyqs.forEach((a,i)=>{let row=Math.floor(i/5),col=i%5;a.x=500+col*25+row*12;a.y=325+row*24;a.homeX=a.x;a.homeY=a.y});resetSaqa();$('#knockedHud').textContent=0;if($('#throwsHud'))$('#throwsHud').textContent=0;$('#turnLabel').textContent=challenge==='training'?'ОБУЧЕНИЕ':challenge?'ИСПЫТАНИЕ':'ТВОЙ БРОСОК';$('#hint').textContent=challenge==='one'?'Один бросок: выбей хотя бы 1 асык':challenge==='double'?'Один бросок: выбей минимум 2 асыка':challenge==='angle'?'Смещённая линия: выбей 2':challenge==='sniper'?'Узкая цель: выбей 3':challenge==='master'?'Финал: выбей 4':challenge==='training'?'Наведи стрелку на асық':'Наведи стрелку на цель и подтверди направление';show('game');running=true;turnState=TURN.AIMING;cancelAnimationFrame(raf);loop();if(!ch)setTimeout(showMissionCard,120)}
$('#playBtn').onclick=()=>{try{if(!localStorage.getItem('asyqTutorialComplete')){openOldTutorial();return}}catch(e){}let n=$('#nick').value.trim()||profile.name||'Игрок';profile.name=n;saveProfile();$('#playerName').textContent=n;newMatch()};$$('.challengeBtn').forEach(b=>b.onclick=()=>{challengeStart=0;$('#playerName').textContent='Мерген';newMatch(b.dataset.ch)});$('#restart').onclick=()=>newMatch(challenge);$('#again').onclick=()=>newMatch();
function coords(e){const r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height}}
function setAimFromPointer(e){if(!running||turnState!==TURN.AIMING)return;let p=coords(e);aimAngle=Math.atan2(p.y-saqa.y,p.x-saqa.x);dragPos=p;if(trainingMode&&trainingStep===0)updateTrainingCoach(1)}
c.onpointerdown=e=>{if(turnState!==TURN.AIMING)return;drag=true;setAimFromPointer(e);try{c.setPointerCapture(e.pointerId)}catch(_){}};
c.onpointermove=e=>{if(drag)setAimFromPointer(e)};
c.onpointerup=e=>{if(!drag)return;setAimFromPointer(e);drag=false};
$('#confirmAim').onclick=beginPower;
$('#hitBtn').onclick=fireTimedShot;
function burst(x,y,count=12){for(let i=0;i<count;i++){let a=Math.random()*6.28,s=1+Math.random()*4;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:32})}}
function upperRingY(x){let q=(x-circle.x)/circle.rx;if(Math.abs(q)>1)return null;return circle.y-circle.ry*Math.sqrt(Math.max(0,1-q*q))}
function upperExit(a){return false}
function vanishUpper(a){}
function keepOnGround(o,bounce=.28){if(o.y<ground.top){o.y=ground.top;o.vy=Math.abs(o.vy)*bounce;o.vx*=.72}if(o.y>ground.bottom){o.y=ground.bottom;o.vy=-Math.abs(o.vy)*bounce;o.vx*=.72}if(o.x<ground.left){o.x=ground.left;o.vx=Math.abs(o.vx)*bounce;o.vy*=.78}if(o.x>ground.right){o.x=ground.right;o.vx=-Math.abs(o.vx)*bounce;o.vy*=.78}}function outsideRing(a){let dx=(a.x-circle.x)/(circle.rx+a.r),dy=(a.y-circle.y)/(circle.ry+a.r*.65);return dx*dx+dy*dy>1}function physics(){
 if(saqa&&saqa.airborne){
   saqa.z+=saqa.vz;
   saqa.vz-=0.22;
   if(saqa.z<=0&&saqa.vz<0){saqa.z=0;saqa.vz=0;saqa.airborne=false}
 }

 if(saqa.moving){
  saqa.x+=saqa.vx;saqa.y+=saqa.vy;keepOnGround(saqa,.16);saqa.rot+=Math.hypot(saqa.vx,saqa.vy)*.018;saqa.vx*=.982;saqa.vy*=.982;

  // Detect all asyqs touched by saqa in THIS physics frame before resolving the hit.
  // This makes a true seam-hit capable of knocking out 2 (rarely 3) asyqs at once.
  const contacts=[];
  for(const a of asyqs){
   if(!a.alive||a.scored)continue;
   let dx=a.x-saqa.x,dy=a.y-saqa.y,d=Math.hypot(dx,dy),m=a.r+saqa.r;
   if(d<m&&d&&(saqa.z||0)<11.5){contacts.push({a,dx,dy,d,m,nx:dx/d,ny:dy/d,overlap:m-d})}
  }

  const freshImpact=!saqa.hitDone&&contacts.length>0;
  const incomingSaqaVx=saqa.vx,incomingSaqaVy=saqa.vy;
  let powerfulContacts=0;

  for(const ct of contacts){
   const {a,nx,ny,overlap}=ct;
   // Saqa always stays solid: resolve overlap for every contacted bone.
   saqa.x-=nx*overlap*.38;saqa.y-=ny*overlap*.38;a.x+=nx*overlap*.62;a.y+=ny*overlap*.62;
   let rel=(incomingSaqaVx-a.vx)*nx+(incomingSaqaVy-a.vy)*ny;

   if(freshImpact&&rel>0){
    // Real impact energy: direct contacts receive more than glancing contacts.
    const transferSpeed=Math.max(0,(rel-2.25)*0.84);
    if(transferSpeed>1.05){
     a.boosted=true;a.knockout=true;powerfulContacts++;
     let rdx=a.x-circle.x,rdy=a.y-circle.y,rd=Math.hypot(rdx,rdy)||1;rdx/=rd;rdy/=rd;
     let odx=nx*.95+rdx*.05,ody=ny*.95+rdy*.05,od=Math.hypot(odx,ody)||1;odx/=od;ody/=od;
     a.vx+=odx*transferSpeed;a.vy+=ody*transferSpeed;
     a.spin+=(nx*rel-ny*rel)*.012;burst(a.x,a.y,14);
    }
   }else if(!freshImpact&&rel>0&&saqa.hitDone){
    // Later contacts remain solid, but are only small nudges: no bowling-chain effect.
    const normalS=saqa.vx*nx+saqa.vy*ny;
    if(normalS>0){
     saqa.vx-=normalS*nx*1.08;saqa.vy-=normalS*ny*1.08;
     const nudge=Math.min(1.2,normalS*.15);
     if(!a.knockout){a.vx+=nx*nudge;a.vy+=ny*nudge}
     saqa.vx*=.58;saqa.vy*=.58;
    }
   }
  }

  if(freshImpact&&powerfulContacts>0){
   saqa.hitDone=true;
   // One simultaneous impact event: the more bones hit at once, the more energy saqa loses.
   const retain=powerfulContacts>=3?.16:powerfulContacts===2?.21:.28;
   saqa.vx=incomingSaqaVx*retain;saqa.vy=incomingSaqaVy*retain;saqa.moving=true;

  }
  if(Math.hypot(saqa.vx,saqa.vy)<.14){saqa.vx=saqa.vy=0;if(!saqa.airborne)saqa.moving=false}
 }
 for(let i=0;i<asyqs.length;i++){let a=asyqs[i];if(!a.alive)continue;a.x+=a.vx;a.y+=a.vy;if(upperExit(a)){vanishUpper(a);continue}keepOnGround(a,.14);a.rot+=a.spin;
  let dragFactor=a.knockout&&!a.scored?.972:(a.scored?.92:.955);a.vx*=dragFactor;a.vy*=dragFactor;a.spin*=a.knockout?.992:.965;
  // Asyq-to-asyq ricochet: a bone launched by saqa can physically strike a nearby bone.
  // Energy is transferred only on real contact and fades on every link, so chain reactions stay rare/natural.
  if(!a.scored){for(let j=i+1;j<asyqs.length;j++){let b=asyqs[j];if(!b.alive||b.scored)continue;let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;if(d<m&&d){let nx=dx/d,ny=dy/d,o=m-d;a.x-=nx*o/2;a.y-=ny*o/2;b.x+=nx*o/2;b.y+=ny*o/2;let rel=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
   if(rel>.38){ricochetThisMatch=true;shotRicochet=true;let impulse=rel*.62;a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny;b.spin+=rel*.018;if(Math.hypot(b.vx,b.vy)>1.05){b.knockout=true;b.boosted=true;burst(b.x,b.y,8)}}
   else if(rel<-.38){ricochetThisMatch=true;let impulse=(-rel)*.62;b.vx+=impulse*nx;b.vy+=impulse*ny;a.vx-=impulse*nx;a.vy-=impulse*ny;a.spin-=rel*.018;if(Math.hypot(a.vx,a.vy)>1.05){a.knockout=true;a.boosted=true;burst(a.x,a.y,8)}}
  }}}
  if(!a.scored&&outsideRing(a)){a.boosted=false;a.knockout=false;a.scored=true;a.exitDelay=14;if(a.forbidden){forbiddenFailed=true;toast('🚫 ЗАПРЕТНАЯ ЦЕЛЬ! • ПОРАЖЕНИЕ');setTimeout(forbiddenLoss,40)}else{knocked++;$('#knockedHud').textContent=knocked}}
  if(a.scored){
   let dx=a.x-circle.x,dy=a.y-circle.y,d=Math.hypot(dx,dy)||1,nx=dx/d,ny=dy/d,rad=a.vx*nx+a.vy*ny;
   if(rad<0){a.vx-=rad*nx;a.vy-=rad*ny}
   if(!outsideRing(a)){let q=Math.sqrt((dx/(circle.rx+a.r))**2+(dy/(circle.ry+a.r*.65))**2)||1;a.x=circle.x+dx/q*1.015;a.y=circle.y+dy/q*1.015}
   if(a.exitDelay!==undefined){a.exitDelay--;if(a.exitDelay<=0){burst(a.x,a.y,22);a.alive=false;a.vx=a.vy=0;continue}}
  }
 }
 if(turnState===TURN.SHOT_ACTIVE){
   if(allObjectsStopped())settleFrames++;else settleFrames=0;
   if(settleFrames>=10&&!resolveQueued){resolveQueued=true;turnState=TURN.TURN_END;setTimeout(()=>{if(running&&turnState!==TURN.GAME_OVER)resolveThrow()},520)}
 }
 particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.94;p.vy*=.94;p.l--});particles=particles.filter(p=>p.l>0);exitFx.forEach(f=>{f.y-=.75;f.life--});exitFx=exitFx.filter(f=>f.life>0)
}
function resolveThrow(){if(!running||turnState===TURN.GAME_OVER)return;turnState=TURN.RESOLVING;let gained=knocked-challengeStart;
 if(gained>=4)toast(shotRicochet?'🔥 MEGA HIT • РИКОШЕТ!':'🔥 MEGA HIT!');
 else if(gained===3)toast(shotRicochet?'TRIPLE RICOCHET!':'TRIPLE!');
 else if(gained===2)toast(shotRicochet?'DOUBLE RICOCHET!':'DOUBLE!');
 else if(shotRicochet&&gained>0)toast('РИКОШЕТ!');
maxKnockedOneThrow=Math.max(maxKnockedOneThrow,gained);if(challenge==='training'){finishTraining();return}if(challenge){let need=challenge==='master'?4:challenge==='sniper'?3:(challenge==='double'||challenge==='angle')?2:1;finishChallenge(gained>=need,gained,need);return}
 if(gained>0){combo++;successfulThrows++;bestCombo=Math.max(bestCombo,combo);if(combo>=2)toast(`🔥 СЕРИЯ ×${combo}`)}else combo=0;missionCheck();
 if(knocked>=8){finishMatch(true);return}if(throws>=MAX_THROWS){finishMatch(false);return}
 let left=MAX_THROWS-throws,need=8-knocked;if(left<=2&&need>0){$('#turnLabel').textContent='⚡ РЕШАЮЩИЙ БРОСОК';$('#turnLabel').classList.add('danger');$('#hint').textContent=`Осталось ${left} брос. • нужно выбить ${need}`;}else{$('#turnLabel').classList.remove('danger');}
 if(gained>0){shortDistance=true;if(left>2)$('#turnLabel').textContent=combo>=2?`🔥 СЕРИЯ ×${combo}`:'УДАЧНЫЙ УДАР';if(left>2)$('#hint').textContent='Следующий бросок — с края круга';resetSaqa()}else{shortDistance=false;if(left>2)$('#turnLabel').textContent='НОВАЯ ПОПЫТКА';if(left>2)$('#hint').textContent='Промах: серия сброшена';asyqs.filter(a=>a.alive&&!a.scored).forEach(a=>{a.x=a.homeX;a.y=a.homeY;a.vx=a.vy=0;a.knockout=false;a.boosted=false});resetSaqa()}}
function finishChallenge(ok,gained,need){turnState=TURN.GAME_OVER;running=false;stopPowerMeter();cancelAnimationFrame(raf);let acc=ok?100:Math.min(99,Math.round(gained/need*100));if(ok&&!profile.completed.includes(challenge)){profile.completed.push(challenge);profile.xp+=50}recordResult('Испытание',gained,1,acc,ok);setTimeout(()=>{show('result');$('#resultTitle').textContent=ok?'ИСПЫТАНИЕ ПРОЙДЕНО!':'ЕЩЁ ОДНА ПОПЫТКА';$('#resultText').textContent=ok?`За один бросок выбито: ${gained}. +XP и прогресс сохранены.`:`Нужно выбить ${need}, получилось ${gained}. Попробуй изменить угол или силу.`;$('#finalKnocked').textContent=gained;$('#finalThrows').textContent=1;$('#finalAccuracy').textContent=acc+'%';if($('#finalCombo'))$('#finalCombo').textContent='—';if($('#stars'))$('#stars').textContent=ok?'★☆☆':'☆☆☆'},200)}function finishMatch(win){turnState=TURN.GAME_OVER;running=false;stopPowerMeter();cancelAnimationFrame(raf);let acc=Math.min(100,Math.round(successfulThrows/Math.max(1,throws)*100));let stars=win?(throws<=5?3:throws<=6?2:1):0;recordResult('Спортивный матч',knocked,throws,acc,win);show('result');$('#resultTitle').textContent=win?(stars===3?'ҮШ ЖҰЛДЫЗ • 3 ЗВЕЗДЫ!':'ЖЕҢІС • ПОБЕДА!'):'ПОПРОБУЙ ЕЩЁ';$('#resultText').textContent=(win?`8 асыков за ${throws} бросков. ${stars<3?'Следующая цель — победить за '+(throws-1)+'!':'Максимальный рейтинг раунда!'}`:`Выбито ${knocked}/8 за 7 бросков. Попробуй точнее выбрать угол и силу.`)+(randomMission?` • Испытание: ${missionDone?'ВЫПОЛНЕНО ✓':forbiddenFailed&&randomMission.id==='safe'?'ПРОВАЛЕНО':'не выполнено'}.`:'');$('#finalKnocked').textContent=knocked;$('#finalThrows').textContent=throws;$('#finalAccuracy').textContent=acc+'%';if($('#finalCombo'))$('#finalCombo').textContent=bestCombo;if($('#stars'))$('#stars').textContent='★'.repeat(stars)+'☆'.repeat(3-stars)}
function drawBone(a,saka=false){
 ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot||0);let r=a.r*(saka?1.05:1);
 ctx.shadowColor='#2b160b88';ctx.shadowBlur=saka?10:6;ctx.shadowOffsetY=saka?6:4;
 let palette=saka&&skin==='turquoise'?['#b9fff3','#4fbcae','#15564f']:saka&&skin==='gold'?['#fff0a9','#d7a83d','#775015']:saka?['#f2c982','#b67537','#5b321d']:['#f3dfb2','#c79658','#744628'];
 let g=ctx.createRadialGradient(-r*.35,-r*.55,r*.1,0,0,r*1.55);g.addColorStop(0,palette[0]);g.addColorStop(.52,palette[1]);g.addColorStop(1,palette[2]);ctx.fillStyle=g;
 // Recognisable sheep ankle-bone silhouette: two broad knuckles, narrow waist, deep side notches.
 ctx.beginPath();
 ctx.moveTo(-.18*r,-1.02*r);
 ctx.bezierCurveTo(-.62*r,-1.28*r,-1.08*r,-1.02*r,-1.13*r,-.60*r);
 ctx.bezierCurveTo(-1.18*r,-.27*r,-.78*r,-.17*r,-.69*r,.02*r);
 ctx.bezierCurveTo(-.61*r,.22*r,-1.08*r,.32*r,-1.02*r,.75*r);
 ctx.bezierCurveTo(-.95*r,1.16*r,-.45*r,1.28*r,-.08*r,1.00*r);
 ctx.bezierCurveTo(.10*r,.86*r,.19*r,.57*r,.38*r,.51*r);
 ctx.bezierCurveTo(.59*r,.45*r,.70*r,.90*r,1.08*r,.77*r);
 ctx.bezierCurveTo(1.48*r,.63*r,1.45*r,.13*r,1.13*r,-.06*r);
 ctx.bezierCurveTo(.94*r,-.18*r,.57*r,-.10*r,.49*r,-.31*r);
 ctx.bezierCurveTo(.40*r,-.53*r,.88*r,-.60*r,.82*r,-.92*r);
 ctx.bezierCurveTo(.74*r,-1.30*r,.22*r,-1.25*r,-.18*r,-1.02*r);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#5b3826bb';ctx.lineWidth=saka?2.8:1.7;ctx.stroke();
 // central saddle/groove
 ctx.shadowColor='transparent';ctx.strokeStyle='#70431f77';ctx.lineWidth=r*.17;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-.42*r,-.13*r);ctx.bezierCurveTo(-.08*r,.08*r,.18*r,.08*r,.54*r,-.12*r);ctx.stroke();
 // bone pores and highlight
 ctx.fillStyle='#fff7';ctx.beginPath();ctx.ellipse(-.48*r,-.72*r,.28*r,.11*r,-.35,0,6.28);ctx.fill();ctx.fillStyle='#5d351b33';for(let i=0;i<4;i++){ctx.beginPath();ctx.arc((i-1.5)*r*.26, r*(.52+(i%2)*.12),r*.055,0,6.28);ctx.fill()}
 ctx.restore();
}
function drawPerson(x,y,scale,shirt,pants,pose='watch',flip=1){ctx.save();ctx.translate(x,y);ctx.scale(scale*flip,scale);ctx.lineCap='round';
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,42,22,6,0,0,6.28);ctx.fill();
 ctx.strokeStyle='#3b271d';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-8,22);ctx.lineTo(-12,40);ctx.moveTo(8,22);ctx.lineTo(13,40);ctx.stroke();
 ctx.strokeStyle=pants;ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-5,5);ctx.lineTo(-8,24);ctx.moveTo(5,5);ctx.lineTo(9,24);ctx.stroke();
 ctx.fillStyle=shirt;ctx.beginPath();ctx.roundRect(-15,-27,30,36,9);ctx.fill();
 ctx.fillStyle='#b97952';ctx.beginPath();ctx.arc(0,-39,11,0,6.28);ctx.fill();ctx.fillStyle='#2b211d';ctx.beginPath();ctx.arc(0,-43,11,3.15,6.28);ctx.fill();
 ctx.strokeStyle='#b97952';ctx.lineWidth=8;if(pose==='throw'){ctx.beginPath();ctx.moveTo(-11,-18);ctx.lineTo(-28,-3);ctx.lineTo(-40,5);ctx.moveTo(11,-18);ctx.lineTo(28,-30);ctx.lineTo(42,-20);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(-11,-18);ctx.lineTo(-22,0);ctx.moveTo(11,-18);ctx.lineTo(21,1);ctx.stroke()}
 ctx.restore()}
function drawThrower(){let power=0;if(drag&&dragPos)power=Math.min(1,Math.hypot(dragPos.x-saqa.x,dragPos.y-saqa.y)/190);ctx.save();ctx.translate(105,590);ctx.scale(.72,.72);ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(5,48,55,11,-.12,0,6.28);ctx.fill();ctx.strokeStyle='#24364a';ctx.lineWidth=18;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-10,2);ctx.lineTo(-18,48);ctx.moveTo(12,3);ctx.lineTo(26,46);ctx.stroke();ctx.fillStyle='#f2f0e7';ctx.beginPath();ctx.roundRect(-27,-68,54,74,14);ctx.fill();ctx.fillStyle='#d9a06e';ctx.beginPath();ctx.arc(0,-91,19,0,6.28);ctx.fill();ctx.fillStyle='#231c18';ctx.beginPath();ctx.arc(0,-98,20,3.1,6.28);ctx.fill();ctx.strokeStyle='#d9a06e';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-22,-50);ctx.lineTo(-40,-24);ctx.lineTo(-47,-4);ctx.moveTo(22,-50);ctx.lineTo(48-power*12,-62-power*20);ctx.lineTo(72+power*12,-48-power*24);ctx.stroke();ctx.restore()}
function drawYard(){
 let sky=ctx.createLinearGradient(0,0,0,230);sky.addColorStop(0,'#78c9ef');sky.addColorStop(1,'#d9f1df');ctx.fillStyle=sky;ctx.fillRect(0,0,1100,230);
 ctx.fillStyle='#ffd86c';ctx.beginPath();ctx.arc(930,70,34,0,6.28);ctx.fill();
 // distant apartment blocks / houses
 ctx.fillStyle='#ead7b4';ctx.fillRect(60,105,190,105);ctx.fillStyle='#b65f45';ctx.beginPath();ctx.moveTo(45,110);ctx.lineTo(155,48);ctx.lineTo(270,110);ctx.fill();ctx.fillStyle='#6aa2b8';for(let x=82;x<230;x+=48){ctx.fillRect(x,132,25,28)}
 ctx.fillStyle='#e5c8a0';ctx.fillRect(825,112,190,98);ctx.fillStyle='#87513d';ctx.beginPath();ctx.moveTo(805,116);ctx.lineTo(918,58);ctx.lineTo(1035,116);ctx.fill();
 // trees
 for(const [x,y,s] of [[20,145,1.1],[300,145,.85],[770,145,.95],[1060,150,1]]){ctx.fillStyle='#654427';ctx.fillRect(x-7,y,14,85*s);ctx.fillStyle='#3d7c43';for(let j=0;j<5;j++){ctx.beginPath();ctx.arc(x+(j-2)*16,y-j%2*18,38*s,0,6.28);ctx.fill()}}
 // fence
 ctx.fillStyle='#9a6a3d';ctx.fillRect(0,205,1100,16);for(let x=0;x<1100;x+=36){ctx.fillRect(x,174,7,68)}
 let ground=ctx.createLinearGradient(0,215,0,650);ground.addColorStop(0,'#caa26a');ground.addColorStop(.55,'#b68149');ground.addColorStop(1,'#8d5c34');ctx.fillStyle=ground;ctx.fillRect(0,215,1100,435);
 ctx.globalAlpha=.12;ctx.fillStyle='#4c321d';for(let i=0;i<180;i++){ctx.beginPath();ctx.arc((i*137)%1100,225+(i*83)%420,(i%3)+1,0,6.28);ctx.fill()}ctx.globalAlpha=1;
 drawPerson(250,235,1.05,'#ef6d45','#293c57','watch',1);drawPerson(850,242,1.08,'#4a9b7d','#323b4a','watch',-1);drawPerson(955,260,.9,'#e0b142','#394b62','watch',-1);
}
function draw(){ctx.clearRect(0,0,c.width,c.height);drawYard();
 ctx.fillStyle='#0002';ctx.beginPath();ctx.ellipse(circle.x,circle.y,circle.rx+20,circle.ry+16,0,0,6.28);ctx.fill();ctx.strokeStyle='#f6e5bf';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(circle.x,circle.y,circle.rx,circle.ry,0,0,6.28);ctx.stroke();ctx.strokeStyle='#fff9';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(circle.x-circle.rx+12,350);ctx.lineTo(circle.x+circle.rx-12,350);ctx.stroke();
 asyqs.forEach(a=>{if(!a.alive)return;drawBone(a);if(a.forbidden&&!a.scored){ctx.save();ctx.strokeStyle='#ff554d';ctx.lineWidth=3;ctx.shadowColor='#ff3b30';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(a.x,a.y,a.r+7,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#ff554d';ctx.font='800 12px Manrope';ctx.textAlign='center';ctx.fillText('!',a.x,a.y-a.r-11);ctx.restore()}});
 // Throwing boy stays behind the saqa; during flight he remains visible at the baseline.
 drawThrower();
 if((saqa.z||0)>0.2){
   ctx.save();ctx.globalAlpha=Math.max(.12,.34-saqa.z*.008);ctx.fillStyle='#000';
   ctx.beginPath();ctx.ellipse(saqa.x,saqa.y+8,Math.max(7,15-saqa.z*.06),Math.max(2.5,5-saqa.z*.02),0,0,Math.PI*2);ctx.fill();ctx.restore();
   let groundY=saqa.y;saqa.y=groundY-saqa.z;drawBone(saqa,true);saqa.y=groundY;
 }else drawBone(saqa,true);
 if(turnState===TURN.AIMING){let len=205,ang=aimAngle;ctx.save();ctx.translate(saqa.x,saqa.y);ctx.rotate(ang);ctx.setLineDash([12,10]);ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(28,0);ctx.lineTo(len,0);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.32;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(len,0);ctx.lineTo(len+150,0);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#f0b544';ctx.beginPath();ctx.moveTo(len+4,0);ctx.lineTo(len-14,-9);ctx.lineTo(len-14,9);ctx.fill();ctx.restore()}
 particles.forEach(p=>{ctx.globalAlpha=Math.max(0,p.l/32);ctx.fillStyle='#ffe09a';ctx.beginPath();ctx.arc(p.x,p.y,3.2,0,6.28);ctx.fill()});ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.font='800 12px Manrope';ctx.textAlign='center';ctx.shadowColor='#0008';ctx.shadowBlur=4;ctx.fillText(shortDistance?'СОКРАЩЁННАЯ ДИСТАНЦИЯ':'СТАРТОВАЯ ОТМЕТКА • 6 М',550,642);ctx.shadowColor='transparent'}
function loop(){if(!running)return;physics();draw();raf=requestAnimationFrame(loop)}



setTimeout(()=>{try{if(!localStorage.getItem('asyqTutorialComplete'))openOldTutorial()}catch(e){}},450);


// ===== Final multilingual UI + editor/shop/ranking =====
const I18N={
ru:{tabGame:'🎮 Игра',tabEditor:'🛠 Редактор',tabShop:'🛍 Магазин',tabRank:'🏆 Рейтинг',
editorTitle:'Редактор сақа',editorSub:'Выбери внешний вид главного сақа.',shopTitle:'Магазин',shopSub:'Открывай новые скины за игровые монеты.',rankTitle:'Рейтинг',rankSub:'Локальная таблица результатов этой версии.',
select:'Выбрать',selected:'Выбрано',buy:'Купить',natural:'Натуральный',lead:'Қорғасын (Свинец)',gold:'Золотой сақа',neon:'Неоновый асық',
classic:'Классический двор',night:'Ночной двор',goldTheme:'Золотая площадка',neonTheme:'Неоновая площадка',apply:'Применить',
play:'ИГРАТЬ',how:'? КАК ИГРАТЬ',confirm:'ПОДТВЕРДИТЬ',hit:'УДАР',aim:'НАВЕДИ СТРЕЛКУ',power:'ПОЙМАЙ СИЛУ'},
kz:{tabGame:'🎮 Ойын',tabEditor:'🛠 Редактор',tabShop:'🛍 Дүкен',tabRank:'🏆 Рейтинг',
editorTitle:'Сақа редакторы',editorSub:'Негізгі сақаның сыртқы түрін таңда.',shopTitle:'Дүкен',shopSub:'Ойын монеталарына жаңа скиндерді аш.',rankTitle:'Рейтинг',rankSub:'Осы нұсқадағы жергілікті нәтижелер кестесі.',
select:'Таңдау',selected:'Таңдалды',buy:'Сатып алу',natural:'Табиғи',lead:'Қорғасын сақа',gold:'Алтын сақа',neon:'Неон асық',
classic:'Классикалық аула',night:'Түнгі аула',goldTheme:'Алтын алаң',neonTheme:'Неон алаң',apply:'Қолдану',
play:'ОЙНАУ',how:'? ҚАЛАЙ ОЙНАУ КЕРЕК',confirm:'РАСТАУ',hit:'СОҚҚЫ',aim:'БАҒЫТТЫ ТАҢДА',power:'КҮШТІ ТАҢДА'},
en:{tabGame:'🎮 Game',tabEditor:'🛠 Editor',tabShop:'🛍 Shop',tabRank:'🏆 Ranking',
editorTitle:'Saqa Editor',editorSub:'Choose the appearance of your main saqa.',shopTitle:'Shop',shopSub:'Unlock new skins with game coins.',rankTitle:'Ranking',rankSub:'Local leaderboard for this version.',
select:'Select',selected:'Selected',buy:'Buy',natural:'Natural',lead:'Lead Saqa',gold:'Golden Saqa',neon:'Neon Asyk',
classic:'Classic Yard',night:'Night Yard',goldTheme:'Golden Arena',neonTheme:'Neon Arena',apply:'Apply',
play:'PLAY',how:'? HOW TO PLAY',confirm:'CONFIRM',hit:'HIT',aim:'AIM',power:'CHOOSE POWER'}
};
let uiLang=localStorage.getItem('asyqLang')||'ru';
let cosmetics=JSON.parse(localStorage.getItem('asyqCosmetics')||'{"coins":1200,"owned":["natural"],"skin":"natural","theme":"classic"}');
const skinData={natural:{icon:'🦴',price:0},lead:{icon:'🩶',price:350},gold:{icon:'🟡',price:700},neon:{icon:'🔵',price:900}};
function tr(k){return (I18N[uiLang]&&I18N[uiLang][k])||I18N.ru[k]||k}
function saveCos(){localStorage.setItem('asyqCosmetics',JSON.stringify(cosmetics));let c=document.querySelector('#coinBalance');if(c)c.textContent=cosmetics.coins}
const STATIC_TRANSLATIONS={
 ru:{
  'ОЙНАУ':'ИГРАТЬ','PLAY':'ИГРАТЬ','ҚАЛАЙ ОЙНАУ КЕРЕК':'КАК ИГРАТЬ','HOW TO PLAY':'КАК ИГРАТЬ',
  'РАСТАУ':'ПОДТВЕРДИТЬ','CONFIRM':'ПОДТВЕРДИТЬ','СОҚҚЫ':'УДАР','HIT':'УДАР',
  'Ойын':'Игра','Game':'Игра','Редактор':'Редактор','Editor':'Редактор','Дүкен':'Магазин','Shop':'Магазин','Ranking':'Рейтинг',
  'ТАҢДАУ':'ВЫБРАТЬ','SELECT':'ВЫБРАТЬ','САТЫП АЛУ':'КУПИТЬ','BUY':'КУПИТЬ',
  'КЕЛЕСІ':'ДАЛЬШЕ','NEXT':'ДАЛЬШЕ','АРТҚА':'НАЗАД','BACK':'НАЗАД','ӨТКІЗІП ЖІБЕРУ':'ПРОПУСТИТЬ','SKIP':'ПРОПУСТИТЬ',
  'БАЙҚАП КӨРУ':'ПОПРОБОВАТЬ','TRY':'ПОПРОБОВАТЬ','ЖАТТЫҒУ':'ТРЕНИРОВКА','TRAINING':'ТРЕНИРОВКА'
 },
 kz:{
  'ИГРАТЬ':'ОЙНАУ','PLAY':'ОЙНАУ','КАК ИГРАТЬ':'ҚАЛАЙ ОЙНАУ КЕРЕК','HOW TO PLAY':'ҚАЛАЙ ОЙНАУ КЕРЕК',
  'ПОДТВЕРДИТЬ':'РАСТАУ','CONFIRM':'РАСТАУ','УДАР':'СОҚҚЫ','HIT':'СОҚҚЫ',
  'Игра':'Ойын','Game':'Ойын','Редактор':'Редактор','Editor':'Редактор','Магазин':'Дүкен','Shop':'Дүкен','Ranking':'Рейтинг',
  'ВЫБРАТЬ':'ТАҢДАУ','SELECT':'ТАҢДАУ','КУПИТЬ':'САТЫП АЛУ','BUY':'САТЫП АЛУ',
  'ДАЛЬШЕ':'КЕЛЕСІ','NEXT':'КЕЛЕСІ','НАЗАД':'АРТҚА','BACK':'АРТҚА','ПРОПУСТИТЬ':'ӨТКІЗІП ЖІБЕРУ','SKIP':'ӨТКІЗІП ЖІБЕРУ',
  'ПОПРОБОВАТЬ':'БАЙҚАП КӨРУ','TRY':'БАЙҚАП КӨРУ','ТРЕНИРОВКА':'ЖАТТЫҒУ','TRAINING':'ЖАТТЫҒУ'
 },
 en:{
  'ИГРАТЬ':'PLAY','ОЙНАУ':'PLAY','КАК ИГРАТЬ':'HOW TO PLAY','ҚАЛАЙ ОЙНАУ КЕРЕК':'HOW TO PLAY',
  'ПОДТВЕРДИТЬ':'CONFIRM','РАСТАУ':'CONFIRM','УДАР':'HIT','СОҚҚЫ':'HIT',
  'Игра':'Game','Ойын':'Game','Редактор':'Editor','Магазин':'Shop','Дүкен':'Shop','Рейтинг':'Ranking',
  'ВЫБРАТЬ':'SELECT','ТАҢДАУ':'SELECT','КУПИТЬ':'BUY','САТЫП АЛУ':'BUY',
  'ДАЛЬШЕ':'NEXT','КЕЛЕСІ':'NEXT','НАЗАД':'BACK','АРТҚА':'BACK','ПРОПУСТИТЬ':'SKIP','ӨТКІЗІП ЖІБЕРУ':'SKIP',
  'ПОПРОБОВАТЬ':'TRY','БАЙҚАП КӨРУ':'TRY','ТРЕНИРОВКА':'TRAINING','ЖАТТЫҒУ':'TRAINING'
 }
};
function translateVisibleText(lang){
 const maps=STATIC_TRANSLATIONS[lang]||{};
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
   if(!n.parentElement||['SCRIPT','STYLE'].includes(n.parentElement.tagName))continue;
   let raw=n.nodeValue,trim=raw.trim();if(!trim)continue;
   let lead=raw.slice(0,raw.indexOf(trim)),trail=raw.slice(raw.indexOf(trim)+trim.length);
   if(maps[trim])n.nodeValue=lead+maps[trim]+trail;
 }
}

const CORE_UI={
ru:{
 nav:['Играть','Испытания','Коллекция','Профиль'],rules:'Правила',auth:'Войти',
 eyebrow:'ҚАЗАҚТЫҢ ҰЛТТЫҚ ОЙЫНЫ • DIGITAL EDITION',
 hero:'ТРАДИЦИЯ.|ТОЧНОСТЬ.| АЗАРТ.',desc:'Современная 2D-версия асық ату: почувствуй бросок сақа, выбивай асыки и стань мергеном.',
 nick:'Твой никнейм',play:'НАЧАТЬ МАТЧ',learn:'? КАК ИГРАТЬ',
 facts:['асыков на линии','до победы','стартовая дистанция'],tag:'НАВЕДИ • ПОТЯНИ • ОТПУСТИ',
 match:'СПОРТИВНЫЙ МАТЧ',goal:'ЦЕЛЬ',throws:'БРОСКИ',distance:'ДИСТАНЦИЯ',
 confirm:'ПОДТВЕРДИТЬ',hit:'УДАР'
},
kz:{
 nav:['Ойнау','Сынақтар','Жинақ','Профиль'],rules:'Ережелер',auth:'Кіру',
 eyebrow:'ҚАЗАҚТЫҢ ҰЛТТЫҚ ОЙЫНЫ • DIGITAL EDITION',
 hero:'ДӘСТҮР.|ДӘЛДІК.| ҚҰМАР.',desc:'Асық атудың заманауи 2D-нұсқасы: сақаны дәл лақтырып, асықтарды шеңберден шығарып, мерген бол.',
 nick:'Лақап атың',play:'МАТЧТЫ БАСТАУ',learn:'? ҚАЛАЙ ОЙНАУ КЕРЕК',
 facts:['сызықтағы асық','жеңіске дейін','бастапқы қашықтық'],tag:'БАҒЫТТА • КҮШТІ ТАҢДА • АТ',
 match:'СПОРТТЫҚ МАТЧ',goal:'МАҚСАТ',throws:'ЛАҚТЫРУ',distance:'ҚАШЫҚТЫҚ',
 confirm:'РАСТАУ',hit:'СОҚҚЫ'
},
en:{
 nav:['Play','Challenges','Collection','Profile'],rules:'Rules',auth:'Sign in',
 eyebrow:'KAZAKH NATIONAL GAME • DIGITAL EDITION',
 hero:'TRADITION.|PRECISION.| EXCITEMENT.',desc:'A modern 2D version of asyq atu: aim your saqa, knock asyks out and become a sharpshooter.',
 nick:'Your nickname',play:'START MATCH',learn:'? HOW TO PLAY',
 facts:['asyks on the line','to win','starting distance'],tag:'AIM • CHOOSE POWER • THROW',
 match:'SPORT MATCH',goal:'GOAL',throws:'THROWS',distance:'DISTANCE',
 confirm:'CONFIRM',hit:'HIT'
}};
function applyCoreLanguage(code){
 const d=CORE_UI[code]||CORE_UI.ru;
 const nav=[...document.querySelectorAll('header nav button[data-nav]')];nav.forEach((b,i)=>{if(d.nav[i])b.textContent=d.nav[i]});
 let rb=document.querySelector('#rulesBtn');if(rb)rb.textContent=d.rules;
 let ab=document.querySelector('#authBtn');if(ab)ab.textContent=d.auth;
 let hero=document.querySelector('#start .hero');if(hero){
   let e=hero.querySelector('.eyebrow');if(e)e.textContent=d.eyebrow;
   let h=hero.querySelector('h1');if(h){let p=d.hero.split('|');h.innerHTML=p[0]+'<br><span>'+p[1]+'</span>'+p[2]}
   let p=hero.querySelector(':scope > p');if(p)p.textContent=d.desc;
 }
 let nick=document.querySelector('#nick');if(nick)nick.placeholder=d.nick;
 let play=document.querySelector('#playBtn');if(play)play.innerHTML=d.play+' <b>→</b>';
 let learn=document.querySelector('#learnBtn');if(learn)learn.textContent=d.learn;
 document.querySelectorAll('#start .facts div span').forEach((e,i)=>{if(d.facts[i])e.textContent=d.facts[i]});
 let tag=document.querySelector('#start .tag');if(tag)tag.textContent=d.tag;
 let mb=document.querySelector('#game .matchbar');if(mb){
   let sm=mb.querySelector('small');if(sm)sm.textContent=d.match;
   let spans=mb.querySelectorAll('.target span');if(spans[0])spans[0].textContent=d.goal;if(spans[1])spans[1].textContent=d.throws;
   let smalls=mb.querySelectorAll('small');if(smalls[1])smalls[1].textContent=d.distance;
 }
 let ca=document.querySelector('#confirmAim');if(ca)ca.textContent=d.confirm;
 let hb=document.querySelector('#hitBtn');if(hb)hb.textContent=d.hit;
}

function applyLang(lang){
 if(!['kz','ru','en'].includes(lang))lang='ru';
 uiLang=lang;localStorage.setItem('asyqLang',lang);document.documentElement.lang=lang==='kz'?'kk':lang;applyCoreLanguage(lang);let lb=document.querySelector('#langBtn');if(lb)lb.textContent=lang.toUpperCase()+' ▾';
 document.querySelectorAll('[data-i18n]').forEach(e=>{let v=tr(e.dataset.i18n);if(v)e.textContent=v});
 translateVisibleText(lang);
 const direct={playBtn:'play',learnBtn:'how',confirmAim:'confirm',hitBtn:'hit'};
 Object.entries(direct).forEach(([id,key])=>{let e=document.getElementById(id);if(e)e.textContent=tr(key)});
 document.querySelectorAll('[data-lang],.lang button,.language button,.langs button').forEach(b=>{
   let code=(b.dataset.lang||b.textContent.trim()).toLowerCase();
   if(['kk','kz'].includes(code))code='kz';
   b.classList.toggle('active',code===lang);
 });
 if(document.querySelector('#hubPanel')?.classList.contains('show'))renderHub(document.querySelector('.hubTab.active')?.dataset.hub||'editor');
}
function skinCards(){
 return Object.entries(skinData).map(([id,s])=>{let own=cosmetics.owned.includes(id),sel=cosmetics.skin===id;return `<div class="skinCard"><div class="skinPreview">${s.icon}</div><h3>${tr(id)}</h3><p>${id==='natural'?'0':s.price+' 🪙'}</p><button class="hubAction ${sel?'owned':''}" onclick="chooseSkin('${id}')">${sel?tr('selected'):own?tr('select'):tr('buy')+' · '+s.price}</button></div>`}).join('')
}
function themeCards(){
 return [['classic','classic'],['night','night'],['gold','goldTheme'],['neon','neonTheme']].map(([id,key])=>`<div class="themeCard"><div class="themeSwatch ${id}"></div><h3>${tr(key)}</h3><button class="hubAction ${cosmetics.theme===id?'owned':''}" onclick="chooseTheme('${id}')">${cosmetics.theme===id?tr('selected'):tr('apply')}</button></div>`).join('')
}
window.chooseSkin=function(id){let s=skinData[id];if(!cosmetics.owned.includes(id)){if(cosmetics.coins<s.price)return;cosmetics.coins-=s.price;cosmetics.owned.push(id)}cosmetics.skin=id;saveCos();renderHub(document.querySelector('.hubTab.active').dataset.hub)}
window.chooseTheme=function(id){cosmetics.theme=id;document.body.className=document.body.className.replace(/\btheme-\S+/g,'').trim();if(id!=='classic')document.body.classList.add('theme-'+id);saveCos();renderHub('editor')}
function renderHub(type){
 let c=document.querySelector('#hubContent');if(type==='game'){document.querySelector('#hubPanel').classList.remove('show');return}
 if(type==='editor')c.innerHTML=`<h2 class="hubTitle">${tr('editorTitle')}</h2><p class="hubSub">${tr('editorSub')}</p><div class="skinGrid">${skinCards()}</div><h2 class="hubTitle" style="margin-top:28px">${tr('classic')}</h2><div class="themeGrid">${themeCards()}</div>`;
 if(type==='shop')c.innerHTML=`<h2 class="hubTitle">${tr('shopTitle')}</h2><p class="hubSub">${tr('shopSub')}</p><div class="skinGrid">${skinCards()}</div>`;
 if(type==='rank'){let name=(document.querySelector('#nick')?.value||'Игрок');c.innerHTML=`<h2 class="hubTitle">${tr('rankTitle')}</h2><p class="hubSub">${tr('rankSub')}</p>${[['🥇','Ayan',1240],['🥈','Dana',980],['🥉','Miras',860],['4',name,Number(localStorage.getItem('asyqBestScore')||0)]].map((r,i)=>`<div class="rankRow ${i===3?'me':''}"><span class="rankPos">${r[0]}</span><span class="rankName">${r[1]}</span><span class="rankScore">${r[2]}</span></div>`).join('')}`}
 document.querySelector('#hubPanel').classList.add('show')
}
document.querySelectorAll('.hubTab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.hubTab').forEach(x=>x.classList.toggle('active',x===b));renderHub(b.dataset.hub)});
document.querySelector('#hubClose').onclick=()=>document.querySelector('#hubPanel').classList.remove('show');
saveCos();chooseTheme(cosmetics.theme);

// Override every existing language button, regardless of old implementation.





const __drawBoneOriginal=drawBone;
drawBone=function(a,isSaqa=false){
 __drawBoneOriginal(a,isSaqa);
 if(!isSaqa)return;
 let s=(typeof cosmetics!=='undefined'?cosmetics.skin:'natural');
 if(s==='natural')return;
 ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot||0);ctx.globalAlpha=.72;
 if(s==='lead')ctx.fillStyle='#8f98a3';if(s==='gold')ctx.fillStyle='#f2bd3f';if(s==='neon'){ctx.fillStyle='#24d8ff';ctx.shadowColor='#24d8ff';ctx.shadowBlur=18}
 ctx.beginPath();ctx.ellipse(0,0,a.r*.72,a.r*.42,0,0,Math.PI*2);ctx.fill();ctx.restore()
};

const TUTORIAL_LANG={
kz:[
 ['1. ОЙЫН МАҚСАТЫ','◎','Қарапайым асықтарды ақ шеңберден толық шығарып жібер. Жеңу үшін 7 лақтыруда 8 асық шығару керек.'],
 ['2. ҚЫЗЫЛ АСЫҚ','!','Қызыл асық — тыйым салынған нысана. Ол тікелей соққыдан немесе рикошеттен шеңберден шықса, жеңілесің.'],
 ['3. БАҒЫТ ЖӘНЕ КҮШ','↗','Алдымен тышқанмен немесе саусақпен лақтыру бағытын таңда. Содан кейін бағытты раста да, қозғалып тұрған шкаладан күшті таңда.'],
 ['4. ДАЙЫН!','◎','Енді өзің байқап көр: бағытта, бұрышты раста, күшті таңда және СОҚҚЫ батырмасын бас.']
],
en:[
 ['1. GOAL','◎','Knock normal asyks completely outside the white ring. Win by knocking out 8 asyks in no more than 7 throws.'],
 ['2. RED ASYK','!','The red asyk is forbidden. If it leaves the ring from a direct hit or ricochet, you lose.'],
 ['3. AIM AND POWER','↗','First choose the throw direction with the mouse or your finger. Confirm the angle, then catch the desired power on the moving meter.'],
 ['4. READY!','◎','Now try it yourself: aim, confirm the angle, choose power and press HIT.']
]};
const __showTutLang=showTut;
showTut=function(){if(uiLang==='ru')return __showTutLang();let old=tutorials;tutorials=TUTORIAL_LANG[uiLang];__showTutLang();tutorials=old;let b=document.querySelector('#tutorialNext');if(b)b.textContent=tutorialStep===3?(uiLang==='kz'?'БАЙҚАП КӨРУ →':'TRY →'):(uiLang==='kz'?'КЕЛЕСІ →':'NEXT →')};

(function(){
 const btn=document.getElementById('langBtn'),menu=document.getElementById('langMenu');
 if(!btn||!menu)return;
 btn.onclick=function(e){e.preventDefault();e.stopPropagation();menu.classList.toggle('open')};
 menu.querySelectorAll('[data-language]').forEach(b=>{
   b.onclick=function(e){
     e.preventDefault();e.stopPropagation();
     const code=this.dataset.language;
     applyLang(code);
     menu.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.language===code));
     menu.classList.remove('open');
     if(typeof showTut==='function' && document.querySelector('#tutorial')?.classList.contains('show'))showTut();
   };
 });
 document.addEventListener('click',()=>menu.classList.remove('open'));
 applyLang(localStorage.getItem('asyqLang')||'ru');
 menu.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.language===uiLang));
})();
