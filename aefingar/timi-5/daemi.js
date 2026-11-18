'use strict';
const rounds=[
 {volume:[4,'cm'],diameter:[14,'cm'],air:.6,half:160,area:18,areaD:[1.4,'m'],small:[6,5],mass:[3,4,4,2],cover:[2.4,12]},
 {volume:[6.5,'dm'],diameter:[3.6,'dm'],air:.7,half:180,area:14,areaD:[42,'km'],small:[9,6],mass:[4,5,5,2],cover:[3.2,15]},
 {volume:[1.5,'m'],diameter:[2.6,'m'],air:.5,half:240,area:20,areaD:[1.8,'m'],small:[7.2,4],mass:[2,8,4,1],cover:[3.6,8]}
];
function formatNumber(value,places){
 const s=places===undefined?String(Number(value.toFixed(8))):value.toFixed(places),[a,b]=s.split('.');
 return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b===undefined?'':','+b);
}
const n=formatNumber,pi=Math.PI,roundTo=(x,p=2)=>Math.round((x+Number.EPSILON)*10**p)/10**p;
const formula=s=>'<span class="formula">'+s+'</span>';
const frac=(a,b)=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true" scriptlevel="0"><mfrac><mtext>'+a+'</mtext><mtext>'+b+'</mtext></mfrac></mstyle></math>';
const lab=(x,y,text,anchor='middle')=>'<text class="measure" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
const line=(x1,y1,x2,y2,cls='dimension')=>'<path class="'+cls+'" d="M'+x1+','+y1+' L'+x2+','+y2+'"/>';
const drawing=(body,description)=>'<svg viewBox="0 0 520 280" role="img" aria-label="'+description+'">'+body+'</svg>';
function sphereShape(cx,cy,r,theme=''){
 const ry=r*.28;
 return '<g class="solid '+theme+'"><circle class="front" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>'+
 '<path class="hidden-edge" d="M'+(cx-r)+','+cy+' A'+r+' '+ry+' 0 0 1 '+(cx+r)+','+cy+'"/>'+
 '<path class="sphere-seam" d="M'+(cx-r)+','+cy+' A'+r+' '+ry+' 0 0 0 '+(cx+r)+','+cy+'"/></g>';
}
function sphereDrawing(size,unit,diameter=false,theme='green'){
 return drawing(sphereShape(250,140,90,theme)+line(diameter?160:250,140,340,140)+
 '<circle cx="250" cy="140" r="3" fill="#875637"/>'+
 (diameter?lab(250,32,'þ = '+n(size)+' '+unit):lab(299,126,'r = '+n(size)+' '+unit)),
 'Kúla. '+(diameter?'Þvermálið':'Radíusinn')+' er '+n(size)+' '+unit+'.'+(diameter?' Línan liggur í gegnum miðjuna milli tveggja punkta á yfirborðinu.':' Línan liggur frá miðju að yfirborði.'));
}
function hemisphereDrawing(diameter,unit='m',theme=''){
 return drawing('<g class="solid '+theme+'"><path class="front" d="M150,195 A110 110 0 0 1 370,195 A110 28 0 0 1 150,195 Z"/>'+
 '<path class="hidden-edge" d="M150,195 A110 28 0 0 1 370,195"/></g>'+line(150,195,370,195)+
 '<circle cx="260" cy="195" r="3" fill="#875637"/>'+lab(260,257,'þ = '+n(diameter)+' '+unit),
 'Hálfkúla með þvermálið '+n(diameter)+' '+unit+'. Hún er annar helmingur kúlu sem skorin er í gegnum miðju.');
}
function smallDrawing([bigCm,smallMm]){
 const r=80*smallMm/(bigCm*10);
 return drawing(sphereShape(140,140,80,'peach')+line(60,140,220,140)+lab(140,250,'þ = '+n(bigCm)+' cm')+
 '<path class="dimension" d="M256,140 H306 M297,132 l9,8 -9,8"/>'+sphereShape(385,140,r,'peach')+
 line(385-r,140,385+r,140)+lab(385,250,'þ = '+n(smallMm)+' mm'),
 'Stór leirkúla er '+n(bigCm)+' cm í þvermál. Litlu kúlurnar eiga að verða '+n(smallMm)+' mm í þvermál. Myndirnar sýna rétt hlutfall þvermálanna.');
}
function pairDrawing([da,wa,db,wb]){
 const scale=75/Math.max(da,db),ra=da*scale,rb=db*scale;
 return drawing(sphereShape(145,145,ra,'gold')+sphereShape(370,145,rb)+
 line(145-ra,145,145+ra,145)+line(370-rb,145,370+rb,145)+lab(145,43,'Kúla A')+lab(370,43,'Kúla B')+
 lab(145,257,'þ = '+n(da)+' cm')+lab(370,257,'þ = '+n(db)+' cm'),
 'Tvær gegnheilar kúlur úr ólíkum efnum. Þvermál A er '+n(da)+' cm og þvermál B '+n(db)+' cm. Stærðir myndanna fylgja hlutfalli þvermálanna.');
}
function buildLesson(round){
 const d=rounds[round];
 const group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
 function numeric(title,question,label,unit,board,value,hints,explain,places=null,errors=[]){
  return {title,question:question+(places===null?'':' <strong>Notaðu π-takkann og námundaðu lokasvarið að tveimur aukastöfum.</strong>'),label,unit,board,
   answer:places===null?Number(value.toFixed(8)):roundTo(value,places),hints,explain,rounding:places,errors};
 }
 const [r,unit]=d.volume,[diam,du]=d.diameter,dr=diam/2;
 const sphereV=x=>4*pi*x**3/3,sphereA=x=>4*pi*x*x;
 const airR=d.air/2,halfR=d.half/200;
 const ar=d.area,[ad,au]=d.areaD,adr=ad/2;
 const [big,small]=d.small,ratio=big*10/small,balls=ratio**3;
 const [da,wa,db,wb]=d.mass,ra=da/2,rb=db/2,ma=sphereV(ra)*wa,mb=sphereV(rb)*wb;
 const compare=wa*da**3===wb*db**3?2:wa*da**3>wb*db**3?0:1;
 const [coverD,percent]=d.cover,coverR=coverD/2,curved=2*pi*coverR**2,factor=1+percent/100;
 const areaChoices=[{text:frac('4 · π · '+n(ar)+'³','3'),wrong:'Þetta er rúmmálsformúlan. Yfirborðsflatarmál er mælt í ferningseiningum.'},
 {text:'2 · π · '+n(ar)+'²',wrong:'Þetta gefur bogið yfirborð hálfkúlu. Hér er spurt um heila kúlu.'}];
 areaChoices.splice(round,0,{text:'4 · π · '+n(ar)+'²',wrong:''});
 return [
  group('29.37','Rúmmál frá radíus',[
   numeric('Rúmmál kúlunnar','Radíus (geisli) kúlunnar er '+n(r)+' '+unit+'. Hvert er rúmmál hennar?','R',unit+'³',sphereDrawing(r,unit),sphereV(r),
    ['Rúmmálsformúlan notar radíus í þriðja veldi.',formula('R = ')+frac('4πr³','3')],
    formula('R = ')+frac('4 · π · '+n(r)+'³','3')+formula(' ≈ '+n(sphereV(r),2)+' '+unit+'³.'),2)
  ]),
  group('29.38','Þvermál og rúmmál',[
   numeric('Finndu radíusinn','Þvermál kúlunnar er '+n(diam)+' '+du+'. Hver er radíus hennar?','r',du,sphereDrawing(diam,du,true),dr,
    ['Radíus er helmingur þvermáls.',formula('r = ')+frac('þ','2')],formula('r = ')+frac(n(diam),'2')+formula(' = '+n(dr)+' '+du+'.')),
   numeric('Reiknaðu rúmmálið','Reiknaðu rúmmál kúlunnar. Á myndinni er þvermálið merkt.','R',du+'³',sphereDrawing(diam,du,true),sphereV(dr),
    ['Notaðu radíusinn úr fyrra skrefi í rúmmálsformúluna.',formula('R = ')+frac('4πr³','3')],
    formula('R = ')+frac('4 · π · '+n(dr)+'³','3')+formula(' ≈ '+n(sphereV(dr),2)+' '+du+'³.'),2,
    [[roundTo(sphereV(diam)),'Þú virðist hafa notað þvermálið sem radíus. Helmingaðu það fyrst.']])
  ]),
  group('29.39','Rúmmál í lítrum',[
   numeric('Loft í skrautkúlu','Hol skrautkúla hefur innanþvermálið '+n(d.air)+' m. Hve margir lítrar af lofti rúmast í henni?','R','ℓ',sphereDrawing(d.air,'m',true),sphereV(airR)*1000,
    ['Finndu radíus og reiknaðu rúmmálið í rúmmetrum.','Einn rúmmetri er 1 000 lítrar.'],
    formula('r = '+n(airR)+' m. R = ')+frac('4 · π · '+n(airR)+'³','3')+formula(' m³ ≈ '+n(sphereV(airR)*1000,2)+' ℓ.'),2)
  ]),
  group('29.40','Rúmmál hálfkúlu',[
   numeric('Hálfkúlulaga ílát','Ílát hefur lögun hálfkúlu. Innanþvermálið er '+n(d.half)+' cm. Hvert er rúmmálið að innan í rúmmetrum?','R','m³',hemisphereDrawing(d.half,'cm'),sphereV(halfR)/2,
    ['Breyttu lengdunum í metra og finndu radíusinn.','Hálfkúla hefur helming af rúmmáli heillar kúlu með sama radíus.'],
    formula('r = '+n(halfR)+' m. R = ')+frac('2 · π · '+n(halfR)+'³','3')+formula(' ≈ '+n(sphereV(halfR)/2,2)+' m³.'),2,
    [[roundTo(sphereV(halfR)),'Þetta er rúmmál heillar kúlu. Deildu því með 2.']])
  ]),
  group('29.41','Yfirborðsflatarmál',[
   {title:'Veldu reikning fyrir yfirborðið',question:'Kúlulaga lampi hefur radíusinn '+n(ar)+' cm. Hvaða reikningur gefur yfirborðsflatarmál kúlunnar?',board:sphereDrawing(ar,'cm',false,'peach'),
    options:areaChoices.map(c=>c.text),answer:round,wrong:areaChoices.map(c=>c.wrong),
    hints:['Yfirborðsflatarmál lýsir stærð yfirborðsins, ekki rýminu inni í kúlunni.',formula('YF = 4πr²')],
    explain:formula('YF = 4 · π · '+n(ar)+'²')+'. Radíus er í öðru veldi þegar flatarmál er reiknað.'},
   numeric('Flatarmál yfirborðsins','Reiknaðu yfirborðsflatarmál kúlulaga lampans.','YF','cm²',sphereDrawing(ar,'cm',false,'peach'),sphereA(ar),
    ['Notaðu radíusinn sem er gefinn á myndinni.',formula('YF = 4πr²')],
    formula('YF = 4 · π · '+n(ar)+'² = '+n(4*ar*ar)+'π ≈ '+n(sphereA(ar),2)+' cm².'),2)
  ]),
  group('29.42–43','Þvermál og yfirborð',[
   numeric('Yfirborð þegar þvermál er gefið','Kúla hefur þvermálið '+n(ad)+' '+au+'. Hvert er yfirborðsflatarmál hennar?','YF',au+'²',sphereDrawing(ad,au,true,'peach'),sphereA(adr),
    ['Helmingaðu þvermálið til að finna radíusinn.',formula('YF = 4πr²')],
    formula('r = '+n(adr)+' '+au+'. YF = 4 · π · '+n(adr)+'² ≈ '+n(sphereA(adr),2)+' '+au+'².'),2,
    [[roundTo(sphereA(ad)),'Notaðu radíus, ekki þvermál, í 4πr².']])
  ]),
  group('29.44','Smærri kúlur',[
   numeric('Hve margar litlar kúlur?','Úr leirkúlu með þvermálið '+n(big)+' cm á að móta litlar kúlur, '+n(small)+' mm í þvermál. Hve margar verða þær? Gerðu ráð fyrir óbreyttu rúmmáli og að ekkert fari til spillis.','Fjöldi','kúlur',smallDrawing(d.small),balls,
    ['Notaðu sömu lengdareiningu fyrir báðar stærðir. Deildu rúmmáli stóru kúlunnar með rúmmáli einnar lítillar.','Rúmmálshlutfallið fæst líka með því að taka hlutfall þvermálanna í þriðja veldi.'],
    'Stóra þvermálið er '+n(big*10)+' mm. Hlutfall þvermálanna er '+frac(n(big*10),n(small))+formula(' = '+n(ratio))+'. Fjöldinn er því '+formula(n(ratio)+'³ = '+n(balls))+'.',null,
    [[ratio,'Þetta er hlutfall þvermálanna. Fjöldinn ræðst af hlutfalli rúmmálanna.'],[ratio*ratio,'Rúmmál fylgir lengd í þriðja veldi, ekki öðru veldi.']])
  ],true),
  group('29.45','Massi tveggja kúlna',[
   numeric('Massi kúlu A','Kúlurnar eru gegnheilar og úr ólíkum efnum. Hver rúmsentimetri af efni A vegur '+n(wa)+' g. Hver er massi kúlu A?','Massi','g',pairDrawing(d.mass),ma,
    ['Finndu fyrst rúmmál kúlu A í cm³.','Margfaldaðu rúmmálið með '+n(wa)+' g fyrir hvern rúmsentimetra.'],
    formula('r = '+n(ra)+' cm. Massi = ')+frac('4 · π · '+n(ra)+'³','3')+formula(' · '+n(wa)+' ≈ '+n(ma,2)+' g.'),2),
   numeric('Massi kúlu B','Hver rúmsentimetri af efni B vegur '+n(wb)+' g. Hver er massi gegnheilu kúlu B?','Massi','g',pairDrawing(d.mass),mb,
    ['Finndu radíus og reiknaðu rúmmál kúlu B í cm³.','Margfaldaðu rúmmálið með '+n(wb)+' g fyrir hvern rúmsentimetra.'],
    formula('r = '+n(rb)+' cm. Massi = ')+frac('4 · π · '+n(rb)+'³','3')+formula(' · '+n(wb)+' ≈ '+n(mb,2)+' g.'),2),
   {title:'Hvor kúlan er þyngri?',question:'Berðu saman massana sem þú reiknaðir.',board:pairDrawing(d.mass),options:['Kúla A','Kúla B','Þær eru jafnþungar'],answer:compare,
    hints:['Stærri kúla þarf ekki að vera þyngri þegar efnin eru ólík.','Berðu saman massann í grömmum fyrir hvora kúlu.'],
    explain:compare===2?'Kúlurnar eru jafnþungar. Báðir massarnir eru nákvæmlega '+frac(n(wa*da**3)+'π','6')+' g, eða um '+n(ma,2)+' g.':
    'Massi A er um '+n(ma,2)+' g og massi B um '+n(mb,2)+' g. Kúla '+(compare===0?'A':'B')+' er því þyngri.',
    wrong:[0,1,2].map(i=>i===compare?'':'Skoðaðu massana úr báðum útreikningunum. Þvermálið eitt ræður ekki hvor er þyngri.')}
  ],true),
  group('29.46','Dúkur yfir hálfkúlu',[
   numeric('Aðeins bogna yfirborðið','Klæða á hálfkúlulaga gróðurhlíf með dúk. Þvermálið er '+n(coverD)+' m. Hvert er flatarmál bogna yfirborðsins? Botninn telst ekki með.','F','m²',hemisphereDrawing(coverD,'m','peach'),curved,
    ['Bogið yfirborð hálfkúlu er helmingur af yfirborði heillar kúlu.','Finndu radíus og notaðu '+formula('F = 2πr²')+'.'],
    formula('r = '+n(coverR)+' m. F = 2 · π · '+n(coverR)+'² ≈ '+n(curved,2)+' m².'),2,
    [[roundTo(3*pi*coverR*coverR),'Það telur hringlaga botnflötinn með. Hér á aðeins að þekja bogna yfirborðið.'],[roundTo(4*pi*coverR*coverR),'Þetta er yfirborð heillar kúlu. Hlífin er hálfkúla.']]),
   numeric('Dúkur með viðbót','Bæta þarf '+n(percent)+'% við vegna samskeyta og afskurðar. Hve marga fermetra af dúk þarf samtals? Notaðu ónámundað flatarmál úr fyrra skrefi.','F','m²',hemisphereDrawing(coverD,'m','peach'),curved*factor,
    ['Bættu við '+n(percent)+'% af flatarmálinu, ekki '+n(percent)+' fermetrum.','Þú þarft alls '+n(100+percent)+'% af flatarmálinu. Margfaldaðu það með '+n(factor)+'.'],
    formula('F = 2 · π · '+n(coverR)+'² · '+n(factor)+' ≈ '+n(curved*factor,2)+' m².'),2,
    [[roundTo(curved*percent/100),'Þetta er aðeins viðbótin. Leggðu hana við upphaflega flatarmálið.']])
  ],true)
 ];
}
