'use strict';
const rounds=[
 {pyramid:[12,8,15],triangle:[7,4,9],cone:[5,12],pile:[300,120],mantle:[9,12,15],hats:[60,5,13],wax:[12,9,3,2],mould:[6,8],hopper:[1,1.2,.6],covers:[6,8,50,80]},
 {pyramid:[10,10,18],triangle:[8,6,10.5],cone:[4,9],pile:[360,180],mantle:[6,8,10],hats:[80,4,10],wax:[15,8,4,3],mould:[8,9],hopper:[1.2,1.4,.9],covers:[8,9,50,95]},
 {pyramid:[14,9,12],triangle:[9,4.8,12.5],cone:[6,10],pile:[240,160],mantle:[8,15,17],hats:[50,3,8],wax:[16,9,4,2],mould:[5,12],hopper:[.9,1.6,.8],covers:[10,11,70,85]}
];
function formatNumber(value,places){
 const s=places===undefined?String(Number(value.toFixed(8))):value.toFixed(places),[a,b]=s.split('.');
 return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b===undefined?'':','+b);
}
const n=formatNumber,pi=Math.PI,roundTo=(x,p=2)=>Math.round((x+Number.EPSILON)*10**p)/10**p;
const formula=s=>'<span class="formula">'+s+'</span>';
const frac=(a,b)=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true" scriptlevel="0"><mfrac><mtext>'+a+'</mtext><mtext>'+b+'</mtext></mfrac></mstyle></math>';
const root=(r,h)=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mrow><msup><mn>'+n(r)+'</mn><mn>2</mn></msup><mo>+</mo><msup><mn>'+n(h)+'</mn><mn>2</mn></msup></mrow></msqrt></math>';
const lab=(x,y,text,anchor='middle')=>'<text class="measure" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
const line=(x1,y1,x2,y2,cls='dimension')=>'<path class="'+cls+'" d="M'+x1+','+y1+' L'+x2+','+y2+'"/>';
function dimension(x1,y1,x2,y2){
 const k=5/Math.hypot(x2-x1,y2-y1),tx=-(y2-y1)*k,ty=(x2-x1)*k;
 return line(x1,y1,x2,y2)+line(x1-tx,y1-ty,x1+tx,y1+ty)+line(x2-tx,y2-ty,x2+tx,y2+ty);
}
const drawing=(body,description)=>'<svg viewBox="0 0 520 280" role="img" aria-label="'+description+'">'+body+'</svg>';
const rightMark=(x,y)=>'<path class="dimension" d="M'+x+','+(y-10)+' h10 v10"/>';
function pyramidDrawing([a,b,h]){
 return drawing('<g class="solid"><path class="front" d="M110,230 L265,40 330,230 Z"/><path class="side" d="M265,40 L420,165 330,230 Z"/>'+
 '<path class="hidden-edge" d="M110,230 L200,165 420,165 M200,165 L265,40"/></g>'+
 line(265,40,265,197,'altitude')+rightMark(265,197)+lab(252,130,'h = '+n(h)+' cm','end')+
 lab(220,261,n(a)+' cm')+lab(421,216,n(b)+' cm'),
 'Pýramídi með '+(a===b?'ferningslaga':'rétthyrndum')+' grunnflöt. Hliðar grunnflatarins eru '+n(a)+' cm og '+n(b)+' cm. Hornrétt hæð er '+n(h)+' cm.');
}
function triangleDrawing([b,g,h]){
 return drawing('<g class="solid green"><path class="front" d="M90,235 L220,40 390,235 Z"/><path class="side" d="M220,40 L340,145 390,235 Z"/>'+
 '<path class="hidden-edge" d="M90,235 L340,145"/></g>'+line(220,40,220,210,'altitude')+rightMark(220,210)+
 line(340,145,340,235,'altitude')+'<path class="dimension" d="M330,235 v-10 h10"/>'+
 lab(205,135,n(h)+' dm','end')+lab(351,201,n(g)+' dm','start')+lab(240,265,n(b)+' dm'),
 'Pýramídi með þríhyrndum grunnfleti. Grunnlína þríhyrningsins er '+n(b)+' dm og hornrétt hæð hans '+n(g)+' dm. Hæð pýramídans frá topppunkti að grunnfleti er '+n(h)+' dm.');
}
function coneDrawing({r,h,l,diameter=false,unit='cm',slant=false,inverted=false}){
 const cx=250,rx=100,ry=24,by=inverted?65:215,ty=inverted?225:45;
 let body='<g class="solid gold'+(inverted?' open':'')+'"><path class="front" d="M'+(cx-rx)+','+by+' L'+cx+','+ty+' '+(cx+rx)+','+by+' A'+rx+' '+ry+' 0 0 1 '+(cx-rx)+','+by+' Z"/>';
 body+=inverted?'<ellipse class="lid" cx="250" cy="65" rx="100" ry="24"/>':'<path class="hidden-edge" d="M150,215 A100 24 0 0 1 350,215"/>';
 body+='</g>';
 if(h!==undefined){
  body+=line(cx,ty,cx,by,'altitude');
  if(inverted)body+=dimension(390,by,390,ty)+lab(405,153,'h = '+n(h)+' '+unit,'start');
  else body+=rightMark(cx,by)+lab(232,128,'h = '+n(h)+' '+unit,'end');
 }
 body+=line(diameter?cx-rx:cx,by,cx+rx,by);
 body+=diameter?lab(cx,inverted?27:263,'þ = '+n(2*r)+' '+unit):lab(cx+55,inverted?55:204,'r = '+n(r)+' '+unit);
 if(slant)body+=lab(346,136,'l = '+(l===undefined?'?':n(l)+' '+unit),'start');
 return drawing(body,'Keila'+(inverted?' sem snýr toppnum niður':'')+'. '+(diameter?'Þvermál '+n(2*r):'Radíus '+n(r))+' '+unit+'.'+(h===undefined?'':' Hornrétt hæð '+n(h)+' '+unit+'.')+(slant?' Skáhlið '+(l===undefined?'óþekkt.':n(l)+' '+unit+'.'):''));
}
function hopperDrawing([diameter,ch,kh]){
 const seam=55+180*ch/(ch+kh);
 return drawing('<g class="solid"><path class="side" d="M190,'+seam+' L250,235 310,'+seam+' Z"/><path class="front" d="M190,55 H310 V'+seam+' A60 18 0 0 1 190,'+seam+' Z"/>'+
 '<ellipse class="lid" cx="250" cy="55" rx="60" ry="18"/><path class="hidden-edge" d="M190,'+seam+' A60 18 0 0 1 310,'+seam+'"/></g>'+
 lab(250,26,'þ = '+n(diameter)+' m')+dimension(345,55,345,seam)+lab(360,(55+seam)/2+7,n(ch)+' m','start')+
 dimension(345,seam,345,235)+lab(360,(seam+235)/2+7,n(kh)+' m','start'),
 'Ílát úr sívalningi og keilu undir honum. Sameiginlegt þvermál '+n(diameter)+' m, hæð sívalnings '+n(ch)+' m og hornrétt hæð keilu '+n(kh)+' m.');
}
function buildLesson(round){
 const d=rounds[round];
 const group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
 function numeric(title,question,label,unit,board,value,hints,explain,places=null,errors=[],usesPi=true){
  const answer=places===null?Number(value.toFixed(8)):roundTo(value,places);
  const note=places===null?'':' <strong>'+(usesPi?'Notaðu π-takkann og námundaðu':'Námundaðu')+' lokasvarið að tveimur aukastöfum.</strong>';
  return {title,question:question+note,label,unit,board,answer,hints,explain,rounding:places,errors};
 }
 const [a,b,ph]=d.pyramid,pg=a*b,pR=pg*ph/3;
 const [tb,tg,th]=d.triangle,tG=tb*tg/2,tR=tG*th/3;
 const [cr,ch]=d.cone,cR=pi*cr*cr*ch/3;
 const [pd,phcm]=d.pile,prm=pd/200,phm=phcm/100,pileR=pi*prm*prm*phm/3;
 const [mr,mh,ml]=d.mantle,mM=pi*mr*ml;
 const [num,hr,hl]=d.hats,hatM=num*pi*hr*hl;
 const [wb,wh,bw,bh]=d.wax,wR=wb*wb*wh/3,wL=wR/(bw*bh);
 const [md,mh2]=d.mould,mr2=md/2,mR=pi*mr2*mr2*mh2/3;
 const [hd,hch,hkh]=d.hopper,hgr=hd/2,hG=pi*hgr*hgr,hopperR=hG*(hch+hkh/3);
 const [cd,coverH,sw,sh]=d.covers,rr=cd/2,ll=Math.hypot(rr,coverH),coverM=pi*rr*ll,sheetA=sw*sh,coverCount=Math.floor(sheetA/coverM);
 const coverBoard=coneDrawing({r:rr,h:coverH,diameter:true,slant:true});
 return [
  group('29.26–27','Rúmmál pýramída',[
   numeric('Rúmmál pýramídans','Grunnflöturinn er '+(a===b?'ferningur':'rétthyrningur')+'. Myndin sýnir hliðar grunnflatarins og hornrétta hæð pýramídans. Hvert er rúmmálið?','R','cm³',pyramidDrawing(d.pyramid),pR,
    ['Finndu fyrst flatarmál grunnflatarins.','Pýramídinn rúmar þriðjung af því sem strendingur með sama grunnflatarmál og sömu hæð rúmar. '+formula('R = ')+frac('G · h','3')],
    formula('G = '+n(a)+' · '+n(b)+' = '+n(pg)+' cm². R = ')+frac(n(pg)+' · '+n(ph),'3')+formula(' = '+n(pR)+' cm³.'),null,
    [[pg*ph,'Þú hefur fundið rúmmál strendings. Deildu með 3 til að fá rúmmál pýramídans.']])
  ]),
  group('29.28','Þríhyrndur grunnflötur',[
   {title:'Hvaða hæð fer í rúmmálsformúluna?',question:'Pýramídinn hefur þríhyrndan grunnflöt. Hvaða lengd er h í formúlunni '+formula('R = ')+frac('G · h','3')+'?',board:triangleDrawing(d.triangle),options:[n(tb)+' dm',n(tg)+' dm',n(th)+' dm'],answer:2,
    hints:['Hæð pýramídans er hornrétt fjarlægð frá topppunkti að grunnfleti.','Hæð þríhyrningsins í grunnfletinum er notuð til að finna G. Hún er önnur stærð en hæð pýramídans.'],
    explain:'Í rúmmálsformúluna fer hæð pýramídans, '+n(th)+' dm. Hæð þríhyrningsins er '+n(tg)+' dm.',wrong:['Þetta er grunnlína þríhyrningsins.','Þetta er hæð þríhyrningsins í grunnfletinum. Leitaðu að hæðinni frá topppunktinum.','']},
   numeric('Rúmmál með þríhyrndum grunnfleti','Reiknaðu rúmmál pýramídans. Grunnflöturinn er þríhyrningur.','R','dm³',triangleDrawing(d.triangle),tR,
    ['Finndu flatarmál þríhyrningsins með grunnlínu hans og hornréttri hæð.','Margfaldaðu grunnflatarmálið með hæð pýramídans og deildu með 3.'],
    formula('G = ')+frac(n(tb)+' · '+n(tg),'2')+formula(' = '+n(tG)+' dm². R = ')+frac(n(tG)+' · '+n(th),'3')+formula(' = '+n(tR)+' dm³.'))
  ]),
  group('29.29','Rúmmál keilu',[
   numeric('Rúmmál keilunnar','Radíus grunnflatarins er '+n(cr)+' cm og hornrétt hæð keilunnar er '+n(ch)+' cm. Hvert er rúmmálið?','R','cm³',coneDrawing({r:cr,h:ch}),cR,
    ['Grunnflöturinn er hringur með flatarmálið πr².',formula('R = ')+frac('πr²h','3')],
    formula('R = ')+frac('π · '+n(cr)+'² · '+n(ch),'3')+formula(' = '+n(cr*cr*ch/3)+'π ≈ '+n(cR,2)+' cm³.'),2,
    [[roundTo(cR*3),'Þetta væri rúmmál sívalnings. Keilan rúmar þriðjung af því.']])
  ]),
  group('29.30','Mælieiningar',[
   numeric('Sandurinn í haugnum','Sandhaugur er keilulaga, '+n(phcm)+' cm hár og '+n(pd)+' cm í þvermál. Hvert er rúmmál sandsins í rúmmetrum?','R','m³',coneDrawing({r:pd/2,h:phcm,diameter:true}),pileR,
    ['Þú getur breytt lengdunum í metra áður en þú reiknar. Radíus er helmingur þvermálsins.','Notaðu radíusinn og hornréttu hæðina í R = '+frac('πr²h','3')+'.'],
    formula('r = '+n(prm)+' m og h = '+n(phm)+' m. R = ')+frac('π · '+n(prm)+'² · '+n(phm),'3')+formula(' ≈ '+n(pileR,2)+' m³.'),2)
  ]),
  group('29.31','Hæð eða skáhlið?',[
   {title:'Hvaða reikningur gefur möttulinn?',question:'Veldu reikninginn sem gefur flatarmál möttuls keilunnar. Hringlaga grunnflöturinn telst ekki með.',board:coneDrawing({r:mr,h:mh,l:ml,slant:true}),
    options:['π · '+n(mr)+' · '+n(mh),'π · '+n(mr)+'²','π · '+n(mr)+' · '+n(ml)],answer:2,
    hints:['Möttulsformúlan notar skáhlið keilunnar, ekki hornréttu hæðina.',formula('M = πrl')],
    explain:'Radíus er '+n(mr)+' cm og skáhliðin l er '+n(ml)+' cm. Því er reikningurinn '+formula('M = π · '+n(mr)+' · '+n(ml))+'.',
    wrong:['Þetta notar hornréttu hæðina. Í möttulsformúluna fer skáhliðin.','Þetta gefur flatarmál hringlaga grunnflatarins.','']},
   numeric('Flatarmál möttulsins','Reiknaðu flatarmál möttuls keilunnar.','M','cm²',coneDrawing({r:mr,h:mh,l:ml,slant:true}),mM,
    ['Notaðu radíus og skáhlið keilunnar.',formula('M = πrl')],
    formula('M = π · '+n(mr)+' · '+n(ml)+' = '+n(mr*ml)+'π ≈ '+n(mM,2)+' cm².'),2)
  ]),
  group('29.32','Pappírshattar',[
   numeric('Pappír í alla hattana','Búa á til '+n(num)+' keilulaga pappírshatta án brims. Hver hattur hefur radíusinn '+n(hr)+' cm og skáhliðina '+n(hl)+' cm. Hve marga fersentímetra af pappír þarf samtals? Gerðu ráð fyrir að enginn pappír fari í límkanta.','F','cm²',coneDrawing({r:hr,l:hl,slant:true}),hatM,
    ['Hver hattur er möttull keilu. Enginn hringflötur lokar hattinum neðan frá.','Finndu flatarmál eins möttuls og margfaldaðu með fjölda hattanna.'],
    formula('F = '+n(num)+' · π · '+n(hr)+' · '+n(hl)+' = '+n(num*hr*hl)+'π ≈ '+n(hatM,2)+' cm².'),2)
  ]),
  group('29.33','Sama rúmmál, ný lögun',[
   numeric('Lengd vaxstykkisins','Vaxpýramídi með ferningslaga grunnflöt er bræddur í ferstrending sem er '+n(bw)+' cm breiður og '+n(bh)+' cm hár. Hve langur verður hann? Gerðu ráð fyrir óbreyttu rúmmáli og að ekkert fari til spillis.','Lengd','cm',pyramidDrawing([wb,wb,wh]),wL,
    ['Reiknaðu fyrst rúmmál vaxpýramídans.','Deildu rúmmálinu með margfeldi breiddar og hæðar ferstrendingsins.'],
    formula('R = ')+frac(n(wb)+'² · '+n(wh),'3')+formula(' = '+n(wR)+' cm³. Lengd = ')+frac(n(wR),n(bw)+' · '+n(bh))+formula(' = '+n(wL)+' cm.'))
  ],true),
  group('29.34','Keila með toppinn niður',[
   numeric('Hvað rúmar mótið?','Keilulaga mót snýr toppnum niður. Myndin sýnir innanmálin. Hve marga sentilítra rúmar mótið?','R','cℓ',coneDrawing({r:mr2,h:mh2,diameter:true,inverted:true}),mR/10,
    ['Staða keilunnar breytir ekki rúmmálsformúlunni. Finndu radíus og rúmmál í cm³.','Einn sentilítri er 10 cm³.'],
    formula('r = '+n(mr2)+' cm. R = ')+frac('π · '+n(mr2)+'² · '+n(mh2),'3')+formula(' cm³ ≈ '+n(mR/10,2)+' cℓ.'),2)
  ],true),
  group('29.35','Samsettur rúmhlutur',[
   numeric('Ílát undir korn','Ílátið er úr sívalningi og keilu undir honum. Þau hafa sama grunnflatarmál. Myndin sýnir innanmálin og hæð hvors hluta. Hve marga lítra rúmar allt ílátið?','R','ℓ',hopperDrawing(d.hopper),hopperR*1000,
    ['Reiknaðu rúmmál sívalningsins og keilunnar hvort í sínu lagi.','Leggðu rúmmálin saman. Einn rúmmetri er 1 000 lítrar.'],
    formula('r = '+n(hgr)+' m. R = π · '+n(hgr)+'² · '+n(hch)+' + ')+frac('π · '+n(hgr)+'² · '+n(hkh),'3')+formula(' m³ ≈ '+n(hopperR*1000,2)+' ℓ.'),2)
  ],true),
  group('29.36','Keilulaga hlífar',[
   numeric('Finndu skáhliðina','Búa á til keilulaga hlífar úr þunnu plasti, opnar að neðan. Hver hlíf er '+n(cd)+' cm í þvermál og '+n(coverH)+' cm á hæð. Hver er lengd skáhliðarinnar?','l','cm',coverBoard,ll,
    ['Radíus og hornrétt hæð keilunnar eru skammhliðar rétthyrnds þríhyrnings. Skáhliðin er langhliðin.',formula('l² = r² + h². Taktu svo ferningsrót.')],
    formula('r = '+n(rr)+' cm. l = ')+root(rr,coverH)+formula(' ≈ '+n(ll,2)+' cm.'),2,[],false),
   numeric('Flatarmál einnar hlífar','Hvert er flatarmál plastsins í einni hlíf? Aðeins möttullinn telst með. Notaðu ónámundaða skáhlið í reikningnum.','M','cm²',coverBoard,coverM,
    ['Möttulsformúlan er M = πrl.','Notaðu ferningsrótina úr fyrra skrefi án þess að námunda hana áður en þú margfaldar.'],
    formula('M = π · '+n(rr)+' · ')+root(rr,coverH)+formula(' ≈ '+n(coverM,2)+' cm².'),2,
    [[roundTo(pi*rr*roundTo(ll)),'Notaðu ónámundaða skáhlið. Námundaðu aðeins lokasvarið.']]),
   numeric('Hve margar heilar hlífar?','Plastplatan er '+n(sw)+' cm × '+n(sh)+' cm. Hve margar heilar hlífar fæst efni í miðað við flatarmál plötunnar? Gerðu ráð fyrir engum afskurði eða skörun. Notaðu ónámundað flatarmál einnar hlífar.','Fjöldi','hlífar',coverBoard,coverCount,
    ['Deildu flatarmáli plötunnar með flatarmáli einnar hlífar.','Aðeins heilar hlífar teljast með. Veldu heilu töluna fyrir neðan deilingarsvarið.'],
    'Flatarmál plötunnar er '+n(sheetA)+' cm². Deilingin gefur um '+n(sheetA/coverM,3)+', svo efnið nægir í '+n(coverCount)+' heilar hlífar.',null,
    [[coverCount+1,'Efnið dugir ekki í svo margar heilar hlífar. Námundaðu fjöldann niður.']])
  ],true)
 ];
}
