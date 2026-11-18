'use strict';

const KEY = 'ggj-lota29-timi01-aefing-v1';
const $ = id => document.getElementById(id);
const blank = () => ({value:'',checked:false,hints:0,folded:false});
function start(round=0) {
  return {version:1,round,group:0,step:0,summary:false,
    records:buildLesson(round).map(group=>group.questions.map(blank))};
}
function parseNumber(value) {
  let clean=value.trim().replace(',', '.');
  if (/^\d{1,3}(?:[   ]\d{3})+(?:\.\d+)?$/.test(clean)) clean=clean.replace(/[   ]/g,'');
  return /^\+?(?:\d+(?:\.\d+)?|\.\d+)$/.test(clean) ? Number(clean) : NaN;
}
function isCorrect(task,value) {
  return task.options ? value===String(task.answer) : Math.abs(parseNumber(value)-task.answer)<1e-8;
}
function valid(data) {
  const ix=(n,arr)=>Number.isInteger(n)&&n>=0&&n<arr.length;
  if (!data || data.version!==1 || !ix(data.round,rounds) || typeof data.summary!=='boolean') return false;
  const groups=buildLesson(data.round);
  if (!ix(data.group,groups)||!ix(data.step,groups[data.group].questions)||!Array.isArray(data.records)||data.records.length!==groups.length) return false;
  return groups.every((g,i)=>Array.isArray(data.records[i]) && g.questions.length===data.records[i].length &&
    g.questions.every((t,j)=>{
      const r=data.records[i][j];
      return r && typeof r.value==='string' && r.value.length<=80 && typeof r.checked==='boolean' &&
        (!r.checked||isCorrect(t,r.value)) && Number.isInteger(r.hints) && r.hints>=0 && r.hints<=t.hints.length && typeof r.folded==='boolean';
    }));
}
let state=start(), canSave=true;
try { const old=JSON.parse(localStorage.getItem(KEY)); if(valid(old)) state=old; } catch { /* Start with an empty round. */ }
let lesson=buildLesson(state.round);
const extra=lesson.length-1;
const current=()=>lesson[state.group].questions[state.step];
const record=()=>state.records[state.group][state.step];
const done=i=>state.records[i].every(r=>r.checked);
const coreDone=()=>state.records.slice(0,extra).filter((_,i)=>done(i)).length;
const storageNote=()=>canSave?'Framvindan vistast í þessum vafra.':'Framvindan helst á meðan æfingin er opin.';
function save(){ try{localStorage.setItem(KEY,JSON.stringify(state));}catch{canSave=false;} }
function visit(group,step=0,summary=false){
  Object.assign(state,{group,step,summary});
  render(true);
  window.scrollTo({top:0,behavior:'instant'});
}
function nextUnsolved(i){
  const next=state.records[i].findIndex(r=>!r.checked);
  return next<0?0:next;
}
function moveNext(){
  if(state.step+1<lesson[state.group].questions.length) visit(state.group,state.step+1);
  else if(state.group===extra-1 || state.group===extra) visit(state.group,state.step,true);
  else visit(state.group+1);
}
function renderProgress(){
  const groups=state.group===extra&&!state.summary?[lesson[extra]]:lesson.slice(0,extra);
  const marks=groups.length===1?groups[0].questions:groups;
  $('progress').innerHTML=marks.map((_,i)=>{
    const complete=groups.length===1?state.records[extra][i].checked:done(i);
    const active=!state.summary&&i===(groups.length===1?state.step:state.group);
    return '<i class="'+(complete?'done ':'')+(active?'current':'')+'"></i>';
  }).join('');
  $('progress').setAttribute('aria-label',coreDone()+' af '+extra+' kjarnadæmum lokið');
}
function boardHTML(task,r){
  const toggle=typeof task.board==='object';
  return '<div class="board">'+(toggle?'<div class="figure-switch" role="group" aria-label="Birting myndar"><button data-view="net" aria-pressed="'+(!r.folded)+'">Snið</button><button data-view="folded" aria-pressed="'+r.folded+'">Teningur</button></div>':'')+
    (toggle?(r.folded?task.board.folded:task.board.net):task.board)+'</div>';
}
function render(focus=false){
  save();
  renderProgress();
  if(state.summary){renderSummary();if(focus)$('heading').focus({preventScroll:true});return;}
  const group=lesson[state.group], task=current(), r=record(), option=Boolean(task.options);
  $('stepcount').textContent=state.group===extra?'Piprað dæmi':'Kjarni · '+(state.group+1)+' af '+extra;
  $('subcount').textContent='Skref '+(state.step+1)+' af '+group.questions.length;
  const inputs=option?'<div class="choices" role="group" aria-label="Svarmöguleikar">'+task.options.map((s,i)=>
    '<button type="button" data-choice="'+i+'" class="choice'+(r.value===String(i)?(r.checked?' correct':' selected'):'')+'" aria-pressed="'+(r.value===String(i))+'" '+(r.checked?'disabled':'')+'><span class="letter">'+String.fromCharCode(65+i)+'</span><span class="math">'+s+'</span></button>').join('')+'</div>':
    '<div class="input-row"><label for="answer">'+task.label+' =</label><input id="answer" type="text" maxlength="80" inputmode="decimal" autocomplete="off" '+(r.checked?'disabled':'')+' aria-describedby="unit"><span id="unit" class="unit">'+task.unit+'</span></div>';
  $('exercise').innerHTML='<div class="eyebrow">'+group.ref+' · '+group.name+'</div><h1 id="heading" tabindex="-1">'+task.title+'</h1><p class="intro">'+task.question+'</p>'+boardHTML(task,r)+inputs+
    '<div id="tips" role="status"></div><div id="feedback" aria-live="polite" aria-atomic="true"></div>';
  if(!option){
    $('answer').value=r.value;
    $('answer').oninput=e=>{r.value=e.target.value;clearFeedback();save();};
    $('answer').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check();}};
  }
  document.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{
    r.value=button.dataset.choice;clearFeedback();
    document.querySelectorAll('[data-choice]').forEach(el=>{const selected=el===button;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));});
    save();
  });
  document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
    r.folded=button.dataset.view==='folded';
    const svg=button.closest('.board').querySelector('svg');
    svg.outerHTML=r.folded?task.board.folded:task.board.net;
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    save();
  });
  $('back').disabled=state.group===0&&state.step===0;
  $('hint').hidden=false;
  $('check').hidden=false;
  $('check').textContent=r.checked?(state.step===group.questions.length-1&&[extra-1,extra].includes(state.group)?'Sjá niðurstöðu →':'Áfram →'):'Athuga svar →';
  showHints();
  if(r.checked) feedback('Rétt hjá þér',task.explain,true);
  if(focus) $('heading').focus({preventScroll:true});
}
function showHints(){
  const r=record(), task=current();
  $('hint').disabled=r.checked || r.hints>=task.hints.length;
  $('tips').innerHTML=r.hints?'<div class="hint-box"><strong>Vísbending'+(r.hints>1?'ar':'')+'</strong>'+task.hints.slice(0,r.hints).join('<br>')+'</div>':'';
}
function clearFeedback(){ $('feedback').replaceChildren(); }
function feedback(heading,message,ok){
  const box=document.createElement('div'), label=document.createElement('strong');
  box.className='feedback'+(ok?' success':'');label.textContent=heading;
  box.append(label,document.createTextNode(message));$('feedback').replaceChildren(box);
}
function check(){
  const r=record(), t=current();
  if(r.checked){moveNext();return;}
  if(isCorrect(t,r.value)){
    r.checked=true;render();$('check').focus({preventScroll:true});return;
  }
  let msg;
  if(!r.value.trim()) msg=t.options?'Veldu einn reikning.':'Skráðu tölu í svarreitinn. Einingin stendur við hliðina.';
  else if(t.options) msg=t.wrong[Number(r.value)];
  else if(!Number.isFinite(parseNumber(r.value))) msg='Skráðu töluna með kommu eða punkti ef þarf. Einingin stendur við reitinn.';
  else msg=t.errors?.find(([v])=>Math.abs(parseNumber(r.value)-v)<1e-8)?.[1] || t.hints[Math.min(r.hints,t.hints.length-1)];
  feedback('Reyndu aftur',msg,false);
  if($('answer')){$('answer').focus({preventScroll:true});$('answer').select();}
}
function renderSummary(){
  const count=coreDone(), all=count===extra;
  $('stepcount').textContent='Niðurstaða';$('subcount').textContent=count+' af '+extra+' kjarnadæmum lokið';
  $('hint').hidden=true;$('check').hidden=true;$('back').disabled=false;
  const heading=!all?'Haltu áfram með kjarnann':done(extra)?'Þú hefur lokið öllum dæmunum':'Þú hefur lokið kjarnanum';
  const blurb=all?'Þú hefur reiknað rúmmál, massa og yfirborðsflatarmál og tengt svörin við réttar einingar.':'Veldu næsta ólokna dæmi til að halda áfram.';
  $('exercise').innerHTML='<div class="summary"><div class="seal" aria-hidden="true">'+(all?'✓':'→')+'</div><div class="eyebrow">Lota 29 · 1. tími</div><h1 id="heading" tabindex="-1">'+heading+'</h1><p class="intro">'+blurb+'</p><div class="summary-actions">'+
    (!all?'<button id="resume" class="primary">Halda áfram með kjarnann →</button>':'')+
    (all&&!done(extra)?'<button id="bonus" class="primary">Prófa piprað dæmi · 29.8 →</button>':'')+
    (all?'<button id="again" class="'+(done(extra)?'primary':'quiet')+'">Æfa aftur með nýjum tölum ↻</button>':'')+'</div><p class="storage-note">'+storageNote()+'</p></div>';
  if($('resume')) $('resume').onclick=()=>{const i=lesson.findIndex((_,i)=>!done(i));visit(i,nextUnsolved(i));};
  if($('bonus')) $('bonus').onclick=()=>visit(extra,nextUnsolved(extra));
  if($('again')) $('again').onclick=()=>{state=start((state.round+1)%rounds.length);lesson=buildLesson(state.round);visit(0);};
}
$('check').onclick=check;
$('back').onclick=()=>{
  if(state.summary) visit(state.group,state.step);
  else if(state.step>0) visit(state.group,state.step-1);
  else if(state.group===extra) visit(extra-1,lesson[extra-1].questions.length-1,true);
  else if(state.group>0) visit(state.group-1,lesson[state.group-1].questions.length-1);
};
$('hint').onclick=()=>{record().hints++;save();showHints();};
$('outline').onclick=()=>{
  $('outlineItems').innerHTML=lesson.map((g,i)=>'<button class="outline-item" data-goto="'+i+'"><span>'+g.ref+'</span>'+g.name+(i===extra?' (piprað)':'')+'<small>'+(done(i)?'✓ Lokið':!state.summary&&i===state.group?'Hér ert þú':'')+'</small></button>').join('');
  $('outlineDialog').querySelector('.storage-note').textContent=storageNote();
  $('outlineDialog').showModal();
};
$('outlineItems').onclick=e=>{
  const b=e.target.closest('[data-goto]');if(!b)return;
  const i=Number(b.dataset.goto);$('outlineDialog').close();visit(i,nextUnsolved(i));
};
$('closeDialog').onclick=()=>$('outlineDialog').close();
render();
