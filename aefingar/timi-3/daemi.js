'use strict';

// New situations and values practise the skills of worksheet 29.3.
const rounds=[
 {solid:[6,14],vessel:[18,24],tank:[1.2,2.5],mantle:[10,8],wrap:[800,2.5,12],posts:[10,.18,2.4,5,1900],layer:[4,1.2],sheet:[16,60]},
 {solid:[4,15],vessel:[22,30],tank:[1.4,3],mantle:[12,9],wrap:[600,3.5,10],posts:[12,.2,2.2,4,2100],layer:[3,2.4],sheet:[18,72]},
 {solid:[8,16],vessel:[16,32],tank:[1.6,2.8],mantle:[14,7.5],wrap:[1200,2,15],posts:[7,.24,2,3,2400],layer:[5,.8],sheet:[14,80]}
];
function formatNumber(value,places){
 const s=places===undefined?String(Number(value.toFixed(8))):value.toFixed(places);
 const [a,b]=s.split('.');return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b===undefined?'':','+b);
}
const n=formatNumber,pi=Math.PI;
const roundTo=(value,places=2)=>Math.round((value+Number.EPSILON)*10**places)/10**places;
const formula=s=>'<span class="formula">'+s+'</span>';
const frac=(a,b)=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true" scriptlevel="0"><mfrac><mtext>'+a+'</mtext><mtext>'+b+'</mtext></mfrac></mstyle></math>';
const lab=(x,y,text,anchor='middle')=>'<text class="measure" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
const line=(x1,y1,x2,y2,cls='dimension')=>'<path class="'+cls+'" d="M'+x1+','+y1+' L'+x2+','+y2+'"/>';
function dimension(x1,y1,x2,y2){
 const k=5/Math.hypot(x2-x1,y2-y1),tx=-(y2-y1)*k,ty=(x2-x1)*k;
 return line(x1,y1,x2,y2)+line(x1-tx,y1-ty,x1+tx,y1+ty)+line(x2-tx,y2-ty,x2+tx,y2+ty);
}
const drawing=(content,description)=>'<svg viewBox="0 0 520 280" role="img" aria-label="'+description+'">'+content+'</svg>';
function cylinderShape(cx,top,bottom,rx,ry,theme=''){
 return '<g class="solid '+theme+'"><path class="front" d="M'+(cx-rx)+','+top+' H'+(cx+rx)+' V'+bottom+' A'+rx+' '+ry+' 0 0 1 '+(cx-rx)+','+bottom+' Z"/>'+
 '<path class="hidden-edge" d="M'+(cx-rx)+','+bottom+' A'+rx+' '+ry+' 0 0 1 '+(cx+rx)+','+bottom+'"/>'+
 '<ellipse class="lid" cx="'+cx+'" cy="'+top+'" rx="'+rx+'" ry="'+ry+'"/></g>';
}
function cylinderDrawing(size,height,unit='cm',diameter=false,mantle=false){
 const mark=diameter?line(155,80,315,80):line(235,80,315,80)+'<circle cx="235" cy="80" r="3" fill="#875637"/>';
 return drawing(cylinderShape(235,80,210,80,25,mantle?'peach':'green')+mark+
 lab(235,39,(diameter?'þ':'r')+' = '+n(size)+' '+unit)+dimension(350,80,350,210)+lab(365,150,'h = '+n(height)+' '+unit,'start')+
 (mantle?lab(235,159,'M') : ''),
 'Sívalningur. '+(diameter?'Þvermál':'Radíus')+' grunnflatarins er '+n(size)+' '+unit+' og hæðin '+n(height)+' '+unit+'.'+(mantle?' Litaða hliðin er möttullinn; hringfletirnir teljast ekki með.':''));
}
function tankDrawing([diameter,length]){
 const body='<g class="solid gold"><path class="front" d="M125,75 H370 A28 65 0 0 1 370,205 H125 Z"/>'+ 
 '<path class="hidden-edge" d="M370,75 A28 65 0 0 0 370,205"/>'+
 '<ellipse class="lid" cx="125" cy="140" rx="28" ry="65"/></g>';
 return drawing(body+dimension(420,75,420,205)+lab(461,129,'þ =')+lab(461,157,n(diameter)+' m')+
 dimension(125,239,370,239)+lab(247.5,267,n(length)+' m'),
 'Sívalningslaga regnvatnstankur liggur á hlið. Innanþvermál er '+n(diameter)+' m og lengdin milli hringlaga endanna er '+n(length)+' m.');
}
function postsDrawing([count,diameter,height]){
 const rx=170*diameter/(2*height),ry=rx*.32;
 return drawing(cylinderShape(225,55,225,rx,ry,'peach')+line(225-rx,55,225+rx,55)+
 lab(225,34,'þ = '+n(diameter)+' m')+dimension(290,55,290,225)+lab(305,146,'h = '+n(height)+' m','start')+
 lab(225,264,n(count)+' eins staurar'),
 'Sívalningslaga staur, '+n(height)+' m hár og '+n(diameter)+' m í þvermál. Mála á möttul '+n(count)+' eins staura.');
}
function layerDrawing([radius,mm]){
 const shape=cylinderShape(240,135,153,145,42);
 return drawing(shape+line(240,135,385,135)+'<circle cx="240" cy="135" r="3" fill="#875637"/>'+lab(303,124,'r = '+n(radius)+' m')+
 dimension(420,135,420,153)+line(420,164,420,200)+lab(420,224,n(mm)+' mm')+lab(214,257,'Þykkt ýkt á mynd'),
 'Þunnt vatnslag með hringlaga grunnflöt. Radíus '+n(radius)+' m og þykkt '+n(mm)+' mm. Þykktin er ýkt á myndinni.');
}
function sheetDrawing([height,circumference]){
 return drawing('<g class="solid peach"><rect class="front" x="85" y="75" width="170" height="120"/></g>'+lab(170,59,n(circumference)+' cm')+lab(72,141,n(height)+' cm','end')+
 '<path class="dimension" d="M276,135 H304 M295,127 l9,8 -9,8"/>'+cylinderShape(391,85,205,49,16,'peach open')+
 line(391,85,440,85)+'<circle cx="391" cy="85" r="2.5" fill="#875637"/>'+lab(391,57,'r = ?')+lab(391,253,'h = '+n(height)+' cm'),
 'Rétthyrnd plastplata, '+n(height)+' sinnum '+n(circumference)+' cm, er rúlluð í opinn sívalning. Styttri hliðin verður hæð og lengri hliðin ummál grunnflatarins.');
}
function buildLesson(round){
 const d=rounds[round];
 const group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
 function numeric(title,question,label,unit,board,exactAnswer,hints,explain,places=null,errors=[]){
  const answer=places===null?Number(exactAnswer.toFixed(8)):roundTo(exactAnswer,places);
  const rounding=places===null?'':' <strong>Notaðu π-takkann og námundaðu lokasvarið að '+(places===1?'einum aukastaf':'tveimur aukastöfum')+'.</strong>';
  return {title,question:question+rounding,label,unit,board,answer,hints,explain,rounding:places,errors};
 }
 const [r,h]=d.solid,[diam,vh]=d.vessel,vr=diam/2,vR=pi*vr*vr*vh;
 const [td,th]=d.tank,tr=td/2,tR=pi*tr*tr*th;
 const [md,mh]=d.mantle,mM=pi*md*mh;
 const [number,wr,wh]=d.wrap,wrapEach=2*pi*wr*wh,wrapAll=number*wrapEach/10000;
 const [count,pd,ph,coverage,price]=d.posts,pM=count*pi*pd*ph,paint=pM/coverage,cans=Math.ceil(paint);
 const [lr,mm]=d.layer,layerH=mm/1000,layerR=pi*lr*lr*layerH;
 const [sh,U]=d.sheet,sr=U/(2*pi),sR=pi*sr*sr*sh;
 return [
  group('29.17','Radíus og rúmmál',[
   numeric('Rúmmál sívalnings','Radíus (geisli) grunnflatarins er '+n(r)+' cm og hæðin '+n(h)+' cm. Hvert er rúmmál sívalningsins?','R','cm³',cylinderDrawing(r,h),pi*r*r*h,
    ['Reiknaðu flatarmál hringlaga grunnflatarins og margfaldaðu það með hæðinni.',formula('G = πr² og R = G · h.')],
    formula('R = π · '+n(r)+'² · '+n(h)+' = '+n(r*r*h)+'π ≈ '+n(pi*r*r*h,2)+' cm³.'),2)
  ]),
  group('29.18–19','Ílát og lítrar',[
   numeric('Frá þvermáli að radíus','Sívalt vatnsílát hefur innanþvermálið '+n(diam)+' cm og innanhæðina '+n(vh)+' cm. Hver er radíus grunnflatarins?','r','cm',cylinderDrawing(diam,vh,'cm',true),vr,
    ['Þvermál nær þvert yfir hringinn í gegnum miðju hans. Radíus er helmingur þess.',formula('r = ')+frac('þ','2')],formula('r = ')+frac(n(diam),'2')+formula(' = '+n(vr)+' cm.')),
   numeric('Hvað rúmar ílátið?','Hve margir lítrar rúmast í vatnsílátinu? Myndin sýnir innanmálin.','R','ℓ',cylinderDrawing(diam,vh,'cm',true),vR/1000,
    ['Notaðu radíus, ekki þvermál, í formúlunni R = πr²h.','Einn lítri er 1 000 cm³. Deildu rúmmálinu í rúmsentimetrum með 1 000.'],
    formula('R = π · '+n(vr)+'² · '+n(vh)+' = '+n(vr*vr*vh)+'π cm³ = ')+frac(n(vr*vr*vh)+'π','1 000')+formula(' ℓ ≈ '+n(vR/1000,2)+' ℓ.'),2,
    [[roundTo(4*vR/1000),'Þú virðist hafa notað þvermálið sem radíus. Radíus er helmingur þvermálsins.']])
  ]),
  group('29.20','Tankur á hlið',[
   {title:'Hvað táknar h hér?',question:'Regnvatnstankurinn liggur á hlið. Hvaða lengd er h í formúlunni '+formula('R = πr²h')+'?',board:tankDrawing(d.tank),options:[n(td)+' m',n(tr)+' m',n(th)+' m'],answer:2,
    hints:['Hæð sívalnings er hornrétt fjarlægð milli hringlaga grunnflatanna.','Þegar sívalningur liggur á hlið er sú fjarlægð lárétt.'],
    explain:'Hér er h = '+n(th)+' m: fjarlægðin milli hringlaga endanna. Þvermálið er '+n(td)+' m.',
    wrong:['Þetta er þvermálið. Finndu fjarlægðina milli hringlaga endanna.','Þetta er radíus grunnflatarins. Finndu fjarlægðina milli endanna.','']},
   numeric('Regnvatnið í tankinum','Hve margir lítrar rúmast í tankinum? Gefin eru innanmál.','R','ℓ',tankDrawing(d.tank),tR*1000,
    ['Finndu radíus með því að helminga þvermálið. Margfaldaðu flatarmál grunnflatarins með lengd tanksins.','Einn rúmmetri er 1 000 lítrar.'],
    formula('r = '+n(tr)+' m. R = π · '+n(tr)+'² · '+n(th)+' = '+n(tr*tr*th)+'π m³ ≈ '+n(tR*1000,2)+' ℓ.'),2,
    [[roundTo(4*tR*1000),'Athugaðu muninn á radíus og þvermáli.']])
  ]),
  group('29.21','Möttull sívalnings',[
   numeric('Aðeins möttullinn','Reiknaðu flatarmál möttuls sívalningsins. Hringlaga grunnfletirnir teljast ekki með.','M','cm²',cylinderDrawing(md,mh,'cm',true,true),mM,
    ['Útbreiddur möttull er rétthyrningur. Hliðarlengdir hans eru ummál grunnflatarins og hæð sívalningsins.',formula('U = πþ og M = U · h.')],
    formula('M = π · '+n(md)+' · '+n(mh)+' = '+n(md*mh)+'π ≈ '+n(mM,2)+' cm².'),2,
    [[roundTo(mM+2*pi*(md/2)**2),'Hringlaga grunnfletirnir teljast ekki með möttlinum.']])
  ]),
  group('29.22','Pappír utan um kerti',[
   numeric('Pappír fyrir öll kertin','Setja á pappír utan um '+n(number)+' eins sívalningslaga kerti. Hvert kerti hefur radíusinn '+n(wr)+' cm og hæðina '+n(wh)+' cm. Pappírinn hylur aðeins möttulinn; brúnirnar mætast án skörunar. Hversu marga fermetra þarf samtals?','F','m²',cylinderDrawing(wr,wh,'cm',false,true),wrapAll,
    ['Finndu flatarmál möttuls eins kertis og margfaldaðu með fjölda kertanna.','Einn fermetri er 10 000 cm². Deildu samanlögðu flatarmáli í fersentimetrum með 10 000.'],
    'Möttull eins kertis er '+n(2*wr*wh)+'π cm². '+formula('F = ')+frac(n(number)+' · '+n(2*wr*wh)+'π','10 000')+formula(' ≈ '+n(wrapAll,2)+' m².'),2)
  ]),
  group('29.23','Málning á staura',[
   numeric('Flatarmálið sem er málað','Mála á möttul '+n(count)+' eins sívalningslaga staura. Hæð hvers staurs er '+n(ph)+' m og þvermálið '+n(pd)+' m. Endafletirnir eru ekki málaðir. Hvert er samanlagt flatarmál möttlanna?','M','m²',postsDrawing(d.posts),pM,
    ['Reiknaðu flatarmál möttuls eins staurs.','Margfaldaðu flatarmál eins möttuls með fjölda stauranna.'],
    formula('M = '+n(count)+' · π · '+n(pd)+' · '+n(ph)+' = '+n(count*pd*ph)+'π ≈ '+n(pM,2)+' m².'),2),
   numeric('Magn málningar','Einn lítri af málningu þekur '+n(coverage)+' m². Hve marga lítra þarf til að mála möttul allra '+n(count)+' stauranna einu sinni? Haltu nákvæmu flatarmáli í reikningnum.','Magn','ℓ',postsDrawing(d.posts),paint,
    ['Deildu samanlögðu flatarmálinu með því flatarmáli sem einn lítri þekur.','Notaðu ónámundað flatarmál þegar þú deilir með '+n(coverage)+'.'],
    formula('Magn = ')+frac(n(count*pd*ph)+'π',n(coverage))+formula(' ≈ '+n(paint,2)+' ℓ.'),2),
   numeric('Hvað þarf að greiða?','Málningin fæst aðeins í eins lítra dósum. Hver dós kostar '+n(price)+' kr. Hver er minnsti kostnaður við að kaupa næga málningu á möttul allra stauranna?','Kostnaður','kr.',postsDrawing(d.posts),cans*price,
    ['Þú getur aðeins keypt heilar dósir. Veldu næsta heila lítrafjölda fyrir ofan reiknaða þörf.','Margfaldaðu fjölda dósanna með verði hverrar dósar.'],
    'Þörfin er um '+n(paint,3)+' ℓ, svo kaupa þarf '+n(cans)+' dósir. Kostnaðurinn er '+n(cans)+' · '+n(price)+' = '+n(cans*price)+' kr.',null,
    [[(cans-1)*price,'Það magn dugir ekki. Kaupa þarf næstu heilu dós til viðbótar.']])
  ]),
  group('29.24','Þunnt vatnslag',[
   numeric('Sama lengdareining','Á flötum hringlaga dúk liggur jafnt vatnslag, '+n(mm)+' mm á þykkt. Radíus dúksins er '+n(lr)+' m. Hver er þykkt vatnslagsins í metrum?','h','m',layerDrawing(d.layer),layerH,
    ['Radíus og þykkt þurfa að vera í sömu lengdareiningu þegar þú reiknar rúmmál.','Einn metri er 1 000 mm.'],formula('h = ')+frac(n(mm),'1 000')+formula(' = '+n(layerH)+' m.')),
   numeric('Rúmmál vatnslagsins','Hve margir lítrar af vatni liggja á dúknum? Gerðu ráð fyrir jafnri þykkt yfir allan hringflötinn.','R','ℓ',layerDrawing(d.layer),layerR*1000,
    ['Vatnslagið má skoða sem mjög lágan sívalning. Notaðu R = πr²h og þykktina í metrum.','Reikningurinn gefur rúmmetra. Margfaldaðu með 1 000 til að fá lítra.'],
    formula('R = π · '+n(lr)+'² · '+n(layerH)+' = '+n(lr*lr*layerH)+'π m³ ≈ '+n(layerR*1000,2)+' ℓ.'),2)
  ],true),
  group('29.25','Plata verður sívalningur',[
   numeric('Finndu radíusinn','Þunn plastplata er '+n(sh)+' cm × '+n(U)+' cm. Henni er rúllað í opinn sívalning þannig að styttri hliðin verði hæðin. Brúnirnar mætast án skörunar. Hver verður radíusinn?','r','cm',sheetDrawing(d.sheet),sr,
    ['Lengri hlið plötunnar verður ummál grunnflatarins.','Notaðu '+formula('U = 2πr')+' og einangraðu r: '+formula('r = ')+frac('U','2π')+'.'],
    formula('U = '+n(U)+' cm. r = ')+frac(n(U),'2π')+formula(' ≈ '+n(sr,2)+' cm.'),2),
   numeric('Hvað rúmast innan í honum?','Hvert er rúmmál sívalningsins? Reiknaðu eins og þykkt plastplötunnar sé engin. Notaðu ónámundaðan radíus í reikningnum.','R','cm³',sheetDrawing(d.sheet),sR,
    ['Hæðin er styttri hlið plötunnar. Radíusinn fæst með því að deila ummálinu með 2π.','Settu ónámundaðan radíus inn í R = πr²h.'],
    formula('R = π · (')+frac(n(U),'2π')+formula(')² · '+n(sh)+' ≈ '+n(sR,2)+' cm³.'),2,
    [[roundTo(pi*roundTo(sr,2)**2*sh),'Haltu ónámunduðum radíus í reikningnum. Námundaðu aðeins lokasvarið.']])
  ],true)
 ];
}
