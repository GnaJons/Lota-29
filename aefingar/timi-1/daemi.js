'use strict';

const rounds = [
  { cooler:[34,22,33], freezer:[750,440,910], gold:[25,8,5], faces:[[3.6,2.8,3.2],[4.8,4,3.5]], chest:[790,340,370], speaker:[55,35,25], edge:24.5, pool:[25,12,1.8], pack:[24,10,33.6], price:490 },
  { cooler:[40,25,28], freezer:[800,450,900], gold:[20,6,4], faces:[[4.2,3,2.5],[5.2,3.5,4]], chest:[720,360,400], speaker:[50,32,25], edge:12.5, pool:[20,12,1.5], pack:[20,12,32], price:560 },
  { cooler:[36,24,30], freezer:[700,500,850], gold:[22,5,4], faces:[[3.5,2.4,4],[4.5,3.2,3]], chest:[800,320,450], speaker:[60,30,24], edge:10.5, pool:[25,10,1.8], pack:[28,12,30], price:640 }
];

function formatNumber(n) {
  const [whole,decimal]=Number(n.toFixed(8)).toString().split('.');
  const grouped=whole.replace(/\B(?=(\d{3})+(?!\d))/g,' ');
  return decimal ? grouped+','+decimal : grouped;
}
const volume = ([l,b,h]) => l*b*h;
const surface = ([l,b,h]) => 2*(l*b + l*h + b*h);
const sizeText = dims => dims.map(formatNumber).join(' × ');
const product = dims => dims.map(formatNumber).join(' · ');
function label(x,y,text,anchor='middle') {
  return '<text class="measure" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
}
function drawing(content,description) {
  return '<svg viewBox="0 0 520 234" role="img" aria-label="'+description+'">'+content+'</svg>';
}
function boxDrawing(dims,unit,theme='blue'){
  const [l,b,h]=dims;
  const k=Math.min(280/(l+0.55*b),150/(h+0.40*b));
  const w=l*k, d=b*k*.55, rise=b*k*.40, tall=h*k;
  const x=(520-w-d)/2, y=(224+tall+rise)/2;
  const pts=[[x,y],[x+w,y],[x+w,y-tall],[x,y-tall],[x+d,y-rise],[x+w+d,y-rise],[x+w+d,y-rise-tall],[x+d,y-rise-tall]];
  const coords=i=>pts[i].map(v=>v.toFixed(2)).join(',');
  const path=(indices,cls)=>'<path class="'+cls+'" d="M'+indices.map(coords).join(' L')+' Z"/>';
  const hidden='<path class="hidden-edge" d="M'+coords(0)+' L'+coords(4)+' L'+coords(5)+' M'+coords(4)+' L'+coords(7)+'"/>';
  const colors='<g class="solid '+theme+'">'+path([0,1,2,3],'front')+path([1,5,6,2],'side')+path([3,2,6,7],'lid')+hidden+'</g>';
  return drawing(colors+label(x+w/2,y+22,formatNumber(l)+' '+unit)+label(x+w+d*.55+9,y-rise*.55+11,formatNumber(b)+' '+unit,'start')+label(x-10,y-tall/2+6,formatNumber(h)+' '+unit,'end'),
    'Skissa af ferstrendingi. Lengd '+formatNumber(l)+' '+unit+', breidd '+formatNumber(b)+' '+unit+' og hæð '+formatNumber(h)+' '+unit+'.');
}
function netDrawing(edge){
  const x=153, y=58, s=47;
  const outline='M0 1H1V0H2V1H4V2H2V3H1V2H0Z';
  return drawing('<g transform="translate('+x+' '+y+') scale('+s+')"><path class="net-outline" d="'+outline+'"/><path class="fold" d="M1 1V2 M2 1V2 M3 1V2 M1 1H2 M1 2H2"/></g><path class="dimension" d="M200 53V39 M247 53V39 M200 44H247"/>'+label(223.5,32,formatNumber(edge)+' cm'),
    'Snið úr sex jafnstórum ferningum. Fjórir eru í röð. Við annan ferninginn tengist einn ferningur að ofan og einn að neðan. Brún hvers fernings er '+formatNumber(edge)+' cm.');
}
function buildLesson(round){
  const d=rounds[round];
  function numeric(title,question,labelText,unit,board,answer,hints,explain,errors=[]){
    return {title,question,label:labelText,unit,board,answer,hints,explain,errors};
  }
  function item(ref,name,questions){ return {ref,name,questions}; }
  function litres(dims,unit,name){
    const divisor=unit==='cm'?1000:1000000;
    const raw=volume(dims), result=raw/divisor;
    return numeric(name,'Innanmálin eru '+sizeText(dims)+' '+unit+'. Hve margir lítrar rúmast í '+(unit==='cm'?'kælitöskunni':'frystiskápnum')+'?',
      'R','ℓ',boxDrawing(dims,unit),result,
      ['Finndu rúmmálið með því að margfalda lengd, breidd og hæð.',
       'Einn lítri er '+formatNumber(divisor)+' '+unit+'³. Deildu rúmmálinu með '+formatNumber(divisor)+'.'],
      'R = '+product(dims)+' = '+formatNumber(raw)+' '+unit+'³ = '+formatNumber(result)+' ℓ.',
      [[raw,'Þú hefur fundið rúmmálið í '+unit+'³. Breyttu því í lítra.']]);
  }
  function area(dims,unit,requestedUnit,title,question){
    const [l,b,h]=dims.map(formatNumber);
    const raw=surface(dims), divisor=requestedUnit==='cm²'?1:unit==='mm'?1e6:1e4;
    const result=raw/divisor;
    const formula='2 · ('+l+' · '+b+' + '+l+' · '+h+' + '+b+' · '+h+')';
    return numeric(title,question+' Málin eru '+sizeText(dims)+' '+unit+'.','YF',requestedUnit,boxDrawing(dims,unit,'green'),result,
      ['Hver flötur á sér jafnstóran mótflöt. Finndu flatarmál botns, framhliðar og hliðarflatar.',
       'YF = '+formula+'.'+(divisor>1?' Í einum fermetra eru '+formatNumber(divisor)+' '+unit+'².':'')],
      'YF = '+formula+' = '+formatNumber(raw)+' '+unit+'²'+(divisor>1?' = '+formatNumber(result)+' m².':'.'),
      [[result/2,'Þetta er flatarmál þriggja hliðarflata samanlagt. Bættu við mótflötunum þremur.'],
       ...(divisor>1?[[raw,'Flatarmálið er rétt í '+unit+'². Breyttu því í m².']]:[])]);
  }
  const goldVol=volume(d.gold), grams=goldVol*19.3, mass=grams/1000;
  const [a,b,c]=d.faces[0].map(formatNumber);
  const faceChoice={ title:'Hvernig telurðu alla fletina?',question:'Kassinn er lokaður. Hvaða reikningur gefur samanlagt flatarmál allra sex flatanna?',
    board:boxDrawing(d.faces[0],'cm','green'),
    options:[a+' · '+b+' · '+c, '2 · ('+a+' · '+b+' + '+a+' · '+c+' + '+b+' · '+c+')',a+' · '+b+' + '+a+' · '+c+' + '+b+' · '+c],
    answer:1, hints:['Finndu fletina sem eru jafnstórir og raðaðu þeim í pör.','Botn og lok mynda eitt par. Samtals eru pörin þrjú.'],
    explain:'Á móti hverjum fleti er jafnstór flötur. Því er YF = 2 · (l · b + l · h + b · h).',
    wrong:['Þessi margfeldisreikningur gefur rúmmál. Finndu flatarmál hvers flatar.','','Hér eru þrír fletir. Hvernig telurðu mótfletina líka?'] };
  const cubeV=d.edge**3, cubeY=6*d.edge**2;
  const poolVol=volume(d.pool), dose=poolVol/30;
  const packV=volume(d.pack), packA=surface(d.pack), small=d.pack.map(x=>x/2);
  const packBig=boxDrawing(d.pack,'cm','gold'), packSmall=boxDrawing(small,'cm','gold');
  const cube={ net:netDrawing(d.edge), folded:boxDrawing([d.edge,d.edge,d.edge],'cm','peach') };
  const tasks=[
    item('29.1','Kælitaska og frystiskápur',[litres(d.cooler,'cm','Hvað rúmar kælitaskan?'),litres(d.freezer,'mm','Hvað rúmar frystiskápurinn?')]),
    item('29.2','Gullklumpurinn',[numeric('Hver er massi gullklumpsins?','Gullklumpurinn er '+sizeText(d.gold)+' cm. Massi hvers rúmsentimetra af gulli er 19,3 g.',
      'Massi','kg',boxDrawing(d.gold,'cm','gold'),mass,['Byrjaðu á að finna rúmmál klumpsins í cm³.',
      'Margfaldaðu rúmmálið með 19,3 til að fá grömm. Í einu kílógrammi eru 1 000 g.'],
      'R = '+formatNumber(goldVol)+' cm³. Massinn er '+formatNumber(goldVol)+' · 19,3 g = '+formatNumber(grams)+' g = '+formatNumber(mass)+' kg.',
      [[grams,'Þú hefur fundið massann í grömmum. Breyttu honum í kílógrömm.']])]),
    item('29.3','Fletir ferstrendings',[faceChoice,
      ...d.faces.map((dims,i)=>area(dims,'cm','cm²',i?'Annar ferstrendingur':'Hvert er yfirborðsflatarmálið?',i?'Reiknaðu yfirborðsflatarmál seinni kassans.':'Reiknaðu samanlagt flatarmál allra sex flatanna.'))]),
    item('29.4','Krossviður í kistil',[area(d.chest,'mm','m²','Hve mikinn krossvið þarf?','Smíða á kistil með loki. Reiknaðu flatarmál krossviðarins í m². Hunsaðu þykkt, samskeyti og afskurð.')]),
    item('29.5','Pappi utan um hátalara',[area(d.speaker,'cm','m²','Hve mikinn pappa þarf í hvorn kassa?','Pétur kaupir tvo hátalara í jafnstórum, lokuðum kössum. Reiknaðu minnsta flatarmál pappa í einn kassa í m². Hunsaðu skörun, þykkt og afskurð.')]),
    item('29.6','Úr neti í tening',[
      numeric('Hvað rúmar teningurinn?','Sniðið er brotið saman í lokaðan kassa. Brún hvers fernings er '+formatNumber(d.edge)+' cm. Hvert er rúmmál kassans?',
        'R','cm³',cube,cubeV,['Lengd, breidd og hæð teningsins eru jafnar.','R = '+product([d.edge,d.edge,d.edge])+'.'],
        'R = '+formatNumber(d.edge)+'³ = '+formatNumber(cubeV)+' cm³.'),
      numeric('Hvert er flatarmál sniðsins?','Reiknaðu samanlagt flatarmál pappans í teningnum. Hver brún er '+formatNumber(d.edge)+' cm.','YF','cm²',cube,cubeY,
        ['Hve margir jafnstórir ferningar eru í sniðinu?','Hver ferningur er '+formatNumber(d.edge)+' cm á kant. Margfaldaðu flatarmál eins fernings með sex.'],
        'YF = 6 · '+formatNumber(d.edge)+'² = '+formatNumber(cubeY)+' cm².',[[d.edge**2,'Þú hefur fundið flatarmál eins fernings. Teldu alla fletina í sniðinu.']])]),
    item('29.7','Sundlaugin',[numeric('Hve marga lítra þarf á dag?','Sundlaugin er '+formatNumber(d.pool[0])+' m löng, '+formatNumber(d.pool[1])+' m breið og alls staðar '+formatNumber(d.pool[2])+' m djúp. Hún er full. Í dæminu þarf 1 ℓ af klórlausn á dag fyrir hverja 30 m³ af vatni.',
      'Klórlausn','ℓ',boxDrawing(d.pool,'m'),dose,['Finndu fyrst rúmmál vatnsins í m³.','Hve oft ganga 30 m³ upp í rúmmál vatnsins?'],
      'Laugin rúmar '+product(d.pool)+' = '+formatNumber(poolVol)+' m³. Það þarf '+formatNumber(poolVol)+' ÷ 30 = '+formatNumber(dose)+' ℓ á dag.',
      [[poolVol,'Þetta er rúmmál vatnsins í m³. Reiknaðu næst magn lausnarinnar.']])]),
    item('29.8','Þvottaefnispakkar',[
      numeric('Hve margir lítrar eru í stóra pakkanum?','Stóri þvottaefnispakkinn er fullur og málin eru '+sizeText(d.pack)+' cm. Hunsaðu þykkt umbúðanna.',
        'R','ℓ',packBig,packV/1000,['Margfaldaðu lengd, breidd og hæð.','Breyttu cm³ í lítra með því að deila með 1 000.'],
        'R = '+formatNumber(packV)+' cm³ = '+formatNumber(packV/1000)+' ℓ.'),
      numeric('Hve margir litlir pakkar rúma sama magn?','Hvert mál litla pakkans er helmingur af samsvarandi máli þess stóra. Myndin sýnir litla pakkann. Hve marga slíka þarf til að rúma jafn mikið þvottaefni og einn stór?',
        'Fjöldi','pakkar',packSmall,8,['Hve margir litlir pakkar komast eftir lengd stóra pakkans? En eftir breidd og hæð?','Í einu lagi komast 2 · 2 litlir pakkar. Hve mörg lög komast fyrir?'],
        'Rúmmál litla pakkans er '+formatNumber(volume(small))+' cm³. Það þarf 2 · 2 · 2 = 8 litla pakka.'),
      numeric('Í hve marga litla pakka dugar pappinn?','Hvert mál litla pakkans er helmingur af samsvarandi máli þess stóra. Hve marga litla, lokaða pakka má gera úr jafn miklum pappa og fer í einn stóran? Hunsaðu skörun og afskurð.',
        'Fjöldi','pakkar',packSmall,4,['Berðu saman botnflöt stóra pakkans og botnflöt þess litla.','Á hverjum fleti helmingast báðar hliðar. Sama hlutfall gildir um allt yfirborðið.'],
        'Yfirborðsflatarmálið fer úr '+formatNumber(packA)+' cm² í '+formatNumber(packA/4)+' cm². Pappinn dugar í 4 litla pakka.'),
      numeric('Hvað kostar pappinn í einn lítinn pakka?','Pappinn í stóra pakkann kostar '+d.price+' kr. Verð á fermetra er það sama og litli pakkinn þarf fjórðung af pappanum.',
        'Kostnaður','kr.',packSmall,d.price/4,['Kostnaðurinn er í beinu hlutfalli við flatarmál pappans.','Deildu '+d.price+' kr. með 4.'],
        'Pappinn í einn lítinn pakka kostar '+d.price+' ÷ 4 = '+formatNumber(d.price/4)+' kr.'),
      numeric('Hvað kosta umbúðirnar fyrir sama magn?','Átta litlir pakkar rúma jafn mikið og einn stór. Pappinn í einn lítinn pakka kostar '+formatNumber(d.price/4)+' kr. Hvað kostar pappinn í alla átta?',
        'Kostnaður','kr.',packSmall,2*d.price,['Þú veist verðið fyrir einn lítinn pakka.','Margfaldaðu verðið fyrir einn pakka með fjölda lítilla pakka.'],
        '8 · '+formatNumber(d.price/4)+' = '+formatNumber(2*d.price)+' kr. Umbúðirnar kosta tvöfalt meira þegar sama magni er skipt í átta litla pakka.')])
  ];
  return tasks;
}
