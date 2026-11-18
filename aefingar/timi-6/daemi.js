'use strict';
const rounds=[
 {tri:true,prism:[7,10,18],review:[8,15],cube:3.2,mantle:[10,9],tunnel:[4,6],composite:[8,10],water:[1.6,2.4],cup:[8,40],unknown:[9,324],circum:[37.7,8],scale:[6,10]},
 {tri:false,prism:[16,9,7],review:[3.5,8],cube:4.5,mantle:[9,14],tunnel:[5,8],composite:[10,12],water:[1.8,4],cup:[10,75],unknown:[7,245],circum:[44,9],scale:[8,25]},
 {tri:true,prism:[9,12,14],review:[5.5],cube:6.5,mantle:[16,7],tunnel:[3,7],composite:[6,9],water:[1.4,1.5],cup:[7,30],unknown:[10,600],circum:[31.4,11],scale:[12,30]}
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
function dimension(x1,y1,x2,y2){
 const k=5/Math.hypot(x2-x1,y2-y1),tx=-(y2-y1)*k,ty=(x2-x1)*k;
 return line(x1,y1,x2,y2)+line(x1-tx,y1-ty,x1+tx,y1+ty)+line(x2-tx,y2-ty,x2+tx,y2+ty);
}
const rightMark=(x,y)=>'<path class="dimension" d="M'+x+','+(y-10)+' h10 v10"/>';
function pyramidDrawing([a,b,h]){
 return drawing('<g class="solid"><path class="front" d="M110,230 L265,40 330,230 Z"/><path class="side" d="M265,40 L420,165 330,230 Z"/>'+
 '<path class="hidden-edge" d="M110,230 L200,165 420,165 M200,165 L265,40"/></g>'+
 line(265,40,265,197,'altitude')+rightMark(265,197)+lab(252,130,'h = '+n(h)+' cm','end')+
 lab(220,261,n(a)+' cm')+lab(421,216,n(b)+' cm'),
 'Pýramídi með '+(a===b?'ferningslaga':'rétthyrndum')+' grunnflöt. Hliðar grunnflatarins eru '+n(a)+' cm og '+n(b)+' cm. Hornrétt hæð er '+n(h)+' cm.');
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
function boxDrawing([a,b,h],cube=false){
 const k=Math.min(170/a,140/h,110/b),x=150,y=225,w=a*k,v=h*k,dx=b*k*.7,dy=-b*k*.45;
 const top=y-v;
 const body='<g class="solid green"><path class="lid" d="M'+x+','+top+' l'+dx+','+dy+' h'+w+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="side" d="M'+(x+w)+','+top+' l'+dx+','+dy+' v'+v+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="front" d="M'+x+','+top+' h'+w+' v'+v+' h'+(-w)+' Z"/></g>';
 return drawing(body+lab(x+w/2,257,(cube?'h = ':'')+n(a)+' cm')+(cube?'':
 lab(x-12,top+v/2+8,n(h)+' cm','end')+lab(x+w+dx/2+18,y+dy/2+20,n(b)+' cm','start')),
 cube?'Teningur með hliðarlengd h = '+n(a)+' cm.':'Kassi með lengd '+n(a)+' cm, breidd '+n(b)+' cm og hæð '+n(h)+' cm.');
}
function triPrismDrawing([b,g,h]){
 const k=140/Math.max(b,g),x=130,y=220,w=b*k,v=g*k,dx=150,dy=-45;
 return drawing('<g class="solid gold"><path class="side" d="M'+x+','+(y-v)+' l'+dx+','+dy+' '+w+','+v+' '+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="front" d="M'+x+','+y+' h'+w+' L'+x+','+(y-v)+' Z"/></g>'+
 '<path class="dimension" d="M'+x+','+(y-12)+' h12 v12"/>'+lab(x+w/2,251,n(b)+' cm')+
 lab(x-12,y-v/2,n(g)+' cm','end')+dimension(x+w+12,y+12,x+w+dx+12,y+dy+12)+lab(x+w+dx/2+32,y+dy/2+44,n(h)+' cm'),
 'Þrístrendingur með rétthyrndum þríhyrningi sem grunnflöt. Skammhliðar þríhyrningsins eru '+n(b)+' cm og '+n(g)+' cm. Lengd strendingsins er '+n(h)+' cm.');
}
function cylinderDrawing(diameter,height,unit='cm',topLabel='',heightLabel=''){
 return drawing('<g class="solid"><path class="front" d="M170,70 H330 V220 A80 20 0 0 1 170,220 Z"/>'+
 '<ellipse class="lid" cx="250" cy="70" rx="80" ry="20"/><path class="hidden-edge" d="M170,220 A80 20 0 0 1 330,220"/></g>'+
 (diameter===null?'':line(170,70,330,70))+
 lab(250,30,topLabel||'þ = '+n(diameter)+' '+unit)+dimension(355,70,355,220)+
 lab(369,154,heightLabel||'h = '+(height===null?'?':n(height)+' '+unit),'start'),
 'Sívalningur. '+(topLabel||'Þvermál '+n(diameter)+' '+unit)+'. '+(heightLabel||'Hæð '+(height===null?'óþekkt':n(height)+' '+unit))+'.');
}
function tunnelDrawing([diameter,length]){
 // A semicircular front section is extruded horizontally. No floor is included in the cover.
 return drawing('<g class="solid peach"><path class="side" d="M110,205 A90 90 0 0 1 166.047,121.651 L301.047,66.651 A90 90 0 0 1 425,150 L290,205 Z"/>'+
 '<path class="front" d="M110,205 A90 90 0 0 1 290,205 Z"/>'+
 '<path class="hidden-edge" d="M245,150 H425"/></g>'+
 dimension(110,230,290,230)+lab(200,258,'þ = '+n(diameter)+' m')+
 dimension(305,224,440,169)+lab(399,232,n(length)+' m'),
 'Skýli í laginu eins og hálfur liggjandi sívalningur. Þvermál hálfhringslaga gafls er '+n(diameter)+' m og lengd skýlisins '+n(length)+' m.');
}
function compositeDrawing([diameter,height]){
 const k=165/(height+diameter/2),r=diameter*k/2,seam=55+r,bottom=seam+height*k,cx=250;
 return drawing('<g class="solid green"><path class="front" d="M'+(cx-r)+','+seam+' H'+(cx+r)+' V'+bottom+' A'+r+' 18 0 0 1 '+(cx-r)+','+bottom+' Z"/>'+
 '<path class="lid" d="M'+(cx-r)+','+seam+' A'+r+' '+r+' 0 0 1 '+(cx+r)+','+seam+' A'+r+' 18 0 0 1 '+(cx-r)+','+seam+' Z"/>'+
 '<path class="hidden-edge" d="M'+(cx-r)+','+seam+' A'+r+' 18 0 0 1 '+(cx+r)+','+seam+'"/></g>'+
 dimension(355,seam,355,bottom)+lab(369,(seam+bottom)/2+7,n(height)+' cm','start')+
 dimension(cx-r,247,cx+r,247)+lab(cx,270,'þ = '+n(diameter)+' cm'),
 'Gegnheill hlutur úr sívalningi með hálfkúlu ofan á. Báðir hlutarnir hafa þvermálið '+n(diameter)+' cm. Hæð sívalningsins eingöngu er '+n(height)+' cm.');
}
function waterDrawing(diameter){
 return drawing('<g class="solid"><path class="front" d="M165,65 H335 V225 A85 20 0 0 1 165,225 Z"/>'+
 '<path class="water" d="M165,150 H335 V225 A85 20 0 0 1 165,225 Z"/>'+
 '<ellipse class="lid" cx="250" cy="65" rx="85" ry="20"/><ellipse class="water" cx="250" cy="150" rx="85" ry="20"/>'+
 '<path class="hidden-edge" d="M165,200 A85 20 0 0 1 335,200 M165,200 A85 20 0 0 0 335,200"/></g>'+
 line(165,65,335,65)+lab(250,27,'þ = '+n(diameter)+' m')+
 dimension(360,150,360,200)+lab(374,183,'hækkun = ?','start'),
 'Tankur með lóðréttum hliðum og hringlaga botni. Innanþvermál '+n(diameter)+' m. Brotna línan sýnir fyrra vatnsborð, efra litaða yfirborðið vatnsborðið eftir áfyllingu. Hækkunin er óþekkt.');
}
function scaleDrawing([edge,percent]){
 const factor=1+percent/100;
 function cube(x,size){const y=210,dx=size*.35,dy=-size*.3;
 return '<g class="solid green"><path class="lid" d="M'+x+','+(y-size)+' l'+dx+','+dy+' h'+size+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="side" d="M'+(x+size)+','+(y-size)+' l'+dx+','+dy+' v'+size+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="front" d="M'+x+','+(y-size)+' h'+size+' v'+size+' h'+(-size)+' Z"/></g>';}
 return drawing(cube(95,75)+cube(310,75*factor)+lab(145,260,'h = '+n(edge)+' cm')+
 lab(370,260,'Nýr teningur')+lab(260,38,'Hver hlið lengist um '+n(percent)+'%')+
 '<path class="dimension" d="M225,165 H275 M265,155 l10,10 -10,10"/>',
 'Tveir teningar. Hliðarlengd þess fyrri er '+n(edge)+' cm. Hver hlið er lengd um '+n(percent)+'%. Myndirnar sýna rétt hlutfall hliðarlengdanna.');
}
function buildLesson(round){
 const d=rounds[round],group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
 function numeric(title,question,label,unit,board,value,hints,explain,places=null,errors=[],usesPi=true){
  return {title,question:question+(places===null?'':' <strong>'+(usesPi?'Notaðu π-takkann og námundaðu':'Námundaðu')+' lokasvarið að tveimur aukastöfum.</strong>'),label,unit,board,
   answer:places===null?Number(value.toFixed(8)):roundTo(value,places),hints,explain,rounding:places,errors};
 }
 const [a,b,h]=d.prism,tri=d.tri,prismR=a*b*h/(tri?2:1);
 const cubeArea=6*d.cube**2,[md,mh]=d.mantle,mantle=pi*md*mh;
 const [td,tl]=d.tunnel,tr=td/2,tunnelV=pi*tr*tr*tl/2,tunnelA=pi*tr*tl+pi*tr*tr;
 const [cd,ch]=d.composite,cr=cd/2,compositeV=pi*cr*cr*ch+2*pi*cr**3/3;
 const [wd,wv]=d.water,wr=wd/2,waterH=wv/(pi*wr*wr);
 const [dd,cl]=d.cup,dr=dd/2,cm3=cl*10,cupH=cm3/(pi*dr*dr);
 const [pb,pv]=d.unknown,pyrH=3*pv/(pb*pb);
 const [u,uh]=d.circum,ur=u/(2*pi),uV=pi*ur*ur*uh;
 const [old,p]=d.scale,k=1+p/100,areaIncrease=(k*k-1)*100,volumeIncrease=(k**3-1)*100;
 let review;
 if(round===0){const [s,ph]=d.review;
  review=numeric('Rúmmál pýramída','Grunnflötur pýramídans er ferningur. Hæðin á myndinni er hornrétt á grunnflötinn. Reiknaðu rúmmálið.','R','cm³',pyramidDrawing([s,s,ph]),s*s*ph/3,
   ['Finndu flatarmál grunnflatarins.','Berðu pýramídann saman við strending með sama grunnflatarmál og sömu hæð.'],
   formula('R = ')+frac(n(s)+'² · '+n(ph),'3')+formula(' = '+n(s*s*ph/3)+' cm³.'),null,[[s*s*ph,'Þetta er rúmmál strendings. Pýramídinn rúmar þriðjung af því.']]);
 }else if(round===1){const [r,hh]=d.review;
  review=numeric('Rúmmál keilu','Myndin sýnir radíus grunnflatarins og hornrétta hæð keilunnar. Reiknaðu rúmmálið.','R','cm³',coneDrawing({r,h:hh}),pi*r*r*hh/3,
   ['Finndu flatarmál hringlaga grunnflatarins.','Keila rúmar þriðjung af því sem sívalningur með sama grunnflatarmál og sömu hæð rúmar.'],
   formula('R = ')+frac('π · '+n(r)+'² · '+n(hh),'3')+formula(' ≈ '+n(pi*r*r*hh/3,2)+' cm³.'),2);
 }else{const [r]=d.review;
  review=numeric('Rúmmál kúlu','Myndin sýnir radíus kúlunnar. Reiknaðu rúmmálið.','R','cm³',sphereDrawing(r,'cm'),4*pi*r**3/3,
   ['Notaðu rúmmálsformúlu kúlu.',formula('R = ')+frac('4πr³','3')],formula('R = ')+frac('4 · π · '+n(r)+'³','3')+formula(' ≈ '+n(4*pi*r**3/3,2)+' cm³.'),2);
 }
 return [
  group('29.47','Rúmmál rúmhluta',[
   numeric(tri?'Rúmmál þrístrendings':'Rúmmál kassa',tri?'Grunnflöturinn er rétthyrndur þríhyrningur. Reiknaðu rúmmál strendingsins.':'Reiknaðu rúmmál kassans út frá málunum á myndinni.','R','cm³',tri?triPrismDrawing(d.prism):boxDrawing(d.prism),prismR,
    ['Finndu flatarmál grunnflatarins og margfaldaðu með hæð strendingsins.',tri?'Þríhyrningurinn hefur helming af flatarmáli rétthyrnings með sömu grunnlínu og hæð.':'Margfaldaðu lengd, breidd og hæð.'],
    formula('R = ')+(tri?frac(n(a)+' · '+n(b),'2'):formula(n(a)+' · '+n(b)))+formula(' · '+n(h)+' = '+n(prismR)+' cm³.'),null,
    tri?[[a*b*h,'Grunnflöturinn er þríhyrningur. Athugaðu flatarmál hans.']]:[]),review
  ]),
  group('29.48','Yfirborð og möttull',[
   numeric('Yfirborðsflatarmál tenings','Hliðarlengd teningsins er '+n(d.cube)+' cm. Hvert er yfirborðsflatarmál hans?','YF','cm²',boxDrawing([d.cube,d.cube,d.cube],true),cubeArea,
    ['Allir sex fletir teningsins eru jafnstórir.','Finndu flatarmál eins ferningsflatar og margfaldaðu með 6.'],
    formula('YF = 6 · '+n(d.cube)+'² = '+n(cubeArea)+' cm².'),null,[[d.cube*d.cube,'Þetta er flatarmál eins flatar. Teningurinn hefur sex slíka fleti.']]),
   numeric('Möttull sívalnings','Reiknaðu flatarmál möttuls sívalningsins. Grunnfletirnir teljast ekki með.','M','cm²',cylinderDrawing(md,mh),mantle,
    ['Útbreiddur möttull er rétthyrningur. Önnur hlið hans er hæð sívalningsins.','Hin hliðin er ummál grunnflatarins.'],
    formula('M = π · '+n(md)+' · '+n(mh)+' ≈ '+n(mantle,2)+' cm².'),2,
    [[roundTo(mantle+2*pi*(md/2)**2),'Þú hefur talið grunnfletina með. Hér er aðeins spurt um möttulinn.']])
  ]),
  group('29.49','Hálfur sívalningur',[
   numeric('Rúmmál geymsluskýlis','Geymsluskýli er í laginu eins og hálfur liggjandi sívalningur. Innanmálin eru merkt á myndinni. Hvert er rúmmálið að innan?','R','m³',tunnelDrawing(d.tunnel),tunnelV,
    ['Skoðaðu lögun gaflsins og lengd skýlisins.','Þú getur reiknað rúmmál heils sívalnings með sömu málum og tekið helminginn.'],
    formula('r = '+n(tr)+' m. R = ')+frac('π · '+n(tr)+'² · '+n(tl),'2')+formula(' ≈ '+n(tunnelV,2)+' m³.'),2,
    [[roundTo(2*tunnelV),'Skýlið er aðeins hálfur sívalningur.']]),
   numeric('Dúkur á skýlið','Hve marga fermetra af dúk þarf á bogna þakið og báða gaflana? Gólfið telst ekki með. Ekki draga op frá eða bæta við fyrir samskeyti. Hunsa má þykkt dúksins.','F','m²',tunnelDrawing(d.tunnel),tunnelA,
    ['Teldu þá fleti sem á að þekja. Gólfið undir skýlinu telst ekki með.','Þakið er hálfur möttull sívalnings. Tveir hálfhringir á göflunum mynda saman heilan hring.'],
    formula('F = π · '+n(tr)+' · '+n(tl)+' + π · '+n(tr)+'² ≈ '+n(tunnelA,2)+' m².'),2,
    [[roundTo(pi*tr*tl),'Þetta er aðeins þakið. Gaflarnir tveir eiga líka að vera með.'],[roundTo(tunnelA+td*tl),'Gólfið á ekki að telja með.']])
  ]),
  group('29.50','Samsettur hlutur',[
   numeric('Rúmmál tréhlutar','Gegnheill tréhlutur er gerður úr sívalningi og hálfkúlu ofan á honum. Þau hafa sama þvermál. Merkta hæðin tilheyrir aðeins sívalningnum. Hvert er rúmmál hlutarins?','R','cm³',compositeDrawing(d.composite),compositeV,
    ['Skiptu hlutnum í tvo rúmhluta sem þú þekkir.','Reiknaðu rúmmál hvors hluta fyrir sig og leggðu saman.'],
    formula('r = '+n(cr)+' cm. R = π · '+n(cr)+'² · '+n(ch)+' + ')+frac('2 · π · '+n(cr)+'³','3')+formula(' ≈ '+n(compositeV,2)+' cm³.'),2,
    [[roundTo(pi*cr*cr*ch+4*pi*cr**3/3),'Efri hlutinn er hálfkúla, ekki heil kúla.']])
  ]),
  group('29.51','Hækkun vatnsborðs',[
   numeric('Hvað hækkar vatnsborðið?','Í sívalningslaga tank með lóðréttum hliðum er bætt '+n(wv)+' m³ af vatni. Innanþvermálið er '+n(wd)+' m. Hvað hækkar vatnsborðið? Ekkert vatn fer til spillis eða flæðir yfir.','Hækkun','m',waterDrawing(wd),waterH,
    ['Vatnið sem bætist við myndar sívalningslaga lag.','Rúmmál lagsins er grunnflatarmál sinnum hækkun. Hvaða stærð vantar?'],
    formula('r = '+n(wr)+' m. Hækkun = ')+frac(n(wv),'π · '+n(wr)+'²')+formula(' ≈ '+n(waterH,2)+' m.'),2)
  ]),
  group('29.52','Rúmmál og hæð',[
   numeric('Hæð mæliíláts','Sívalningslaga mæliílát tekur '+n(cl)+' cℓ þegar það er fullt. Innanþvermálið er '+n(dd)+' cm. Hver er hæðin að innan?','h','cm',cylinderDrawing(dd,null),cupH,
    ['Samræmdu rúmmáls- og lengdareiningar áður en þú reiknar. Einn sentilítri er 10 cm³.','Settu gefið rúmmál og radíus í rúmmálsformúlu sívalnings og finndu hæðina.'],
    formula(n(cl)+' cℓ = '+n(cm3)+' cm³. h = ')+frac(n(cm3),'π · '+n(dr)+'²')+formula(' ≈ '+n(cupH,2)+' cm.'),2,
    [[roundTo(cl/(pi*dr*dr)),'Breyttu sentilítrum í rúmsentimetra fyrst.']])
  ]),
  group('29.53','Óþekkt hæð pýramída',[
   numeric('Finndu hæð pýramídans','Grunnflötur pýramída er ferningur með hliðarlengd '+n(pb)+' cm. Rúmmálið er '+n(pv)+' cm³. Hver er hornrétt hæð hans?','h','cm',pyramidDrawing([pb,pb,1]).replace(/h = 1 cm/g,'h = ?').replace(/Hornrétt hæð er 1 cm/g,'Hornrétt hæð er óþekkt'),pyrH,
    ['Finndu grunnflatarmálið og settu gefnu gildin í rúmmálsformúluna.','Þar sem deilt er með 3 í rúmmálsformúlunni þarftu að margfalda rúmmálið með 3 þegar þú einangrar hæðina.'],
    formula('h = ')+frac('3 · '+n(pv),n(pb)+'²')+formula(' = '+n(pyrH)+' cm.'),null,
    [[pv/(pb*pb),'Þetta væri hæð strendings með sama rúmmál og grunnflatarmál. Athugaðu stuðulinn í formúlu pýramídans.']])
  ],true),
  group('29.54','Ummál og rúmmál',[
   numeric('Rúmmál út frá ummáli','Ummál grunnflatar sívalningsins er '+n(u)+' cm og hæðin '+n(uh)+' cm. Reiknaðu rúmmálið. Ekki námunda milliniðurstöður.','R','cm³',cylinderDrawing(null,uh,'cm','U = '+n(u)+' cm'),uV,
    ['Ummálið gefur þér leið til að finna radíusinn.','Úr '+formula('U = 2πr')+' fæst '+formula('r = ')+frac('U','2π')+'.'],
    formula('r = ')+frac(n(u),'2π')+formula(' cm. R = ')+frac(n(u)+'² · '+n(uh),'4π')+formula(' ≈ '+n(uV,2)+' cm³.'),2)
  ],true),
  group('29.55','Stækkun tenings',[
   numeric('Aukning yfirborðsflatarmáls','Hver hlið tenings með hliðarlengd '+n(old)+' cm er lengd um '+n(p)+'%. Um hve mörg prósent eykst yfirborðsflatarmálið?','Aukning','%',scaleDrawing(d.scale),areaIncrease,
    ['Þú getur borið saman yfirborðsflatarmál gamla og nýja teningsins.','Lengdir margfaldast með '+n(k)+'. Flatarmál margfaldast með '+n(k)+'². Finndu aukninguna miðað við upphaflega flatarmálið.'],
    formula('('+n(k)+'² − 1) · 100 = '+n(areaIncrease,2)+'%.'),2,
    [[p,'Flatarmál breytist með lengd í öðru veldi.'],[roundTo(k*k*100),'Þetta segir hve mörg prósent nýja flatarmálið er af því gamla. Spurt er um aukninguna.']],false),
   numeric('Aukning rúmmáls','Hver hlið sama tenings er lengd um '+n(p)+'%. Um hve mörg prósent eykst rúmmálið?','Aukning','%',scaleDrawing(d.scale),volumeIncrease,
    ['Berðu saman rúmmál gamla og nýja teningsins.','Rúmmál margfaldast með '+n(k)+'³. Mundu að spurt er um aukninguna.'],
    formula('('+n(k)+'³ − 1) · 100 '+(Math.abs(volumeIncrease-roundTo(volumeIncrease))<1e-8?'= ':'≈ ')+n(volumeIncrease,2)+'%.'),2,
    [[roundTo(areaIncrease),'Þetta er aukning flatarmáls. Rúmmál breytist með lengd í þriðja veldi.'],[roundTo(k**3*100),'Dragðu upphaflegu 100% frá til að finna aukninguna.']],false)
  ],true)
 ];
}
