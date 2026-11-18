'use strict';
const rounds=[
 {cubes:[9,3],cone:[20,29],cylinder:[24,26],pyramid:[14,25],algebra:[3,8,864],areas:[81,294],pair:[8,18,12,12],radius:[.8,10],box:[8,15,12],joined:[12,20]},
 {cubes:[10,2.5],cone:[24,26],cylinder:[20,29],pyramid:[18,21],algebra:[4,9,2916],areas:[144,384],pair:[10,27,15,8],radius:[.45,18],box:[6,8,24],joined:[15,17]},
 {cubes:[15,3],cone:[8,17],cylinder:[16,20],pyramid:[16,17],algebra:[5,7,2240],areas:[36,486],pair:[6,20,10,18],radius:[.9,14],box:[10,24,18],joined:[10,14]}
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
const math=s=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true" scriptlevel="0">'+s+'</mstyle></math>';
const mn=x=>'<mn>'+n(x)+'</mn>',sq=x=>'<msup>'+mn(x)+'<mn>2</mn></msup>';
const root=s=>math('<msqrt><mrow>'+s+'</mrow></msqrt>');
const rootDiff=(a,b)=>root(sq(a)+'<mo>−</mo>'+sq(b));
const rootSum=values=>root(values.map(sq).join('<mo>+</mo>'));
const rootFraction=(a,b)=>root('<mfrac>'+mn(a)+'<mtext>'+b+'</mtext></mfrac>');
const lines=(...ss)=>ss.map(s=>'<div class="calc-line">'+s+'</div>').join('');
function cubeShape(x,y,size){const dx=size*.4,dy=-size*.3;
 return '<g class="solid green"><path class="lid" d="M'+x+','+(y-size)+' l'+dx+','+dy+' h'+size+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="side" d="M'+(x+size)+','+(y-size)+' l'+dx+','+dy+' v'+size+' l'+(-dx)+','+(-dy)+' Z"/>'+
 '<path class="front" d="M'+x+','+(y-size)+' h'+size+' v'+size+' h'+(-size)+' Z"/></g>';
}
function cubePair([large,small]){
 const s=110*small/large;
 return drawing(cubeShape(95,220,110)+cubeShape(350,220,s)+lab(150,258,'h = '+n(large)+' cm')+lab(370,258,'h = '+n(small)+' cm'),
 'Tveir teningar með hliðarlengdir '+n(large)+' cm og '+n(small)+' cm. Myndirnar sýna rétt hlutfall lengdanna.');
}
function cubeUnknown(area,surface=false){
 return drawing(cubeShape(190,220,115)+lab(250,38,(surface?'YF = ':'G = ')+n(area)+' cm²')+lab(248,258,'h = ?'),
 'Teningur. '+(surface?'Yfirborðsflatarmálið':'Grunnflatarmálið')+' er '+n(area)+' cm². Hliðarlengdin h er óþekkt.');
}
function coneUnknown([height,slant],joined=false){
 const r=Math.sqrt(slant*slant-height*height),k=joined?Math.min(95/r,190/(height+r)):Math.min(100/r,170/height);
 const cx=250,rx=r*k,top=(280-height*k-(joined?rx:18))/2,base=top+height*k;
 let body=joined?'<g class="solid green"><path class="front" d="M'+(cx-rx)+','+base+' A'+rx+' '+rx+' 0 0 0 '+(cx+rx)+','+base+' Z"/></g>':'';
 body+='<g class="solid gold"><path class="front" d="M'+(cx-rx)+','+base+' L'+cx+','+top+' '+(cx+rx)+','+base+' A'+rx+' 18 0 0 1 '+(cx-rx)+','+base+' Z"/>'+
 '<path class="hidden-edge" d="M'+(cx-rx)+','+base+' A'+rx+' 18 0 0 1 '+(cx+rx)+','+base+'"/></g>'+
 line(cx,top,cx,base,'altitude')+line(cx,base,cx+rx,base)+
 '<path class="dimension" d="M250,'+(base-10)+' h10 v10"/>'+
 lab(235,(top+base)/2,'h = '+n(height)+' cm','end')+lab(cx+rx/2+27,(top+base)/2,'l = '+n(slant)+' cm','start')+
 lab(cx+rx/2,base-9,'r = ?');
 return drawing(body,(joined?'Keila ofan á hálfkúlu. Grunnfletirnir falla saman. ':'Keila. ')+'Hornrétt hæð keilunnar er '+n(height)+' cm og skáhlið hennar l er '+n(slant)+' cm. Radíus er óþekktur.');
}
function cylinderSection([height,diagonal]){
 const diameter=Math.sqrt(diagonal*diagonal-height*height),k=Math.min(160/diameter,165/height),w=diameter*k,hh=height*k,x=250-w/2,top=55,by=top+hh;
 return drawing('<g class="solid"><path class="front" d="M'+x+','+top+' h'+w+' v'+hh+' A'+w/2+' 18 0 0 1 '+x+','+by+' Z"/>'+
 '<ellipse class="lid" cx="250" cy="55" rx="'+w/2+'" ry="18"/>'+
 '<path class="hidden-edge" d="M'+x+','+by+' A'+w/2+' 18 0 0 1 '+(x+w)+','+by+'"/></g>'+
 line(x,top,x+w,by,'highlight')+line(x,by,x+w,by)+
 '<path class="dimension" d="M'+x+','+(by-10)+' h10 v10"/>'+
 dimension(x-20,top,x-20,by)+lab(x-32,top+hh/2,n(height)+' cm','end')+
 lab(269,top+hh/2,n(diagonal)+' cm','start')+lab(250,by+47,'þ = ?'),
 'Sívalningur. Í rétthyrndu sniði gegnum miðjur grunnflatanna er hæðin '+n(height)+' cm og hornalínan '+n(diagonal)+' cm. Breidd sniðsins er óþekkt þvermál sívalningsins.');
}
function pyramidSurface([side,edge]){
 return drawing('<g class="solid peach"><path class="front" d="M110,230 L230,40 350,230 Z"/><path class="side" d="M230,40 L430,165 350,230 Z"/>'+
 '<path class="hidden-edge" d="M110,230 L190,165 430,165 M190,165 L230,40"/></g>'+
 line(230,40,230,230,'altitude')+'<path class="dimension" d="M230,218 h12 v12"/>'+
 lab(218,161,'l = ?','end')+lab(331,117,n(edge)+' cm','start')+lab(230,262,n(side)+' cm'),
 'Pýramídi með ferningslaga grunnflöt og fjóra eins jafnarma hliðarþríhyrninga. Grunnbrún er '+n(side)+' cm og hver hliðarbrún frá toppi að hornpunkti er '+n(edge)+' cm. Óþekkt hæð hliðarþríhyrningsins l er merkt, ekki hornrétt hæð pýramídans.');
}
function algebraBox(multiplier,height){
 return drawing('<g class="solid"><path class="lid" d="M110,120 L200,65 400,65 310,120 Z"/><path class="side" d="M310,120 L400,65 400,165 310,220 Z"/>'+
 '<path class="front" d="M110,120 H310 V220 H110 Z"/></g>'+lab(210,258,n(multiplier)+'x cm')+lab(377,226,'x cm')+lab(98,173,n(height)+' cm','end'),
 'Ferstrendingur með grunnbrúnir x cm og '+n(multiplier)+'x cm. Hæð hans er '+n(height)+' cm.');
}
function cylinderPair([da,ha,db,hb]){
 const k=Math.min(165/Math.max(ha,hb),120/Math.max(da,db));
 function one(cx,d,h,name){const rx=d*k/2,by=220,top=by-h*k,ry=rx*.22;
 return '<g class="solid"><path class="front" d="M'+(cx-rx)+','+top+' H'+(cx+rx)+' V'+by+' A'+rx+' '+ry+' 0 0 1 '+(cx-rx)+','+by+' Z"/>'+
 '<ellipse class="lid" cx="'+cx+'" cy="'+top+'" rx="'+rx+'" ry="'+ry+'"/></g>'+lab(cx,28,name)+
 dimension(cx+rx+10,top,cx+rx+10,by)+lab(cx+rx+20,(top+by)/2+5,n(h)+' cm','start')+lab(cx,267,'þ = '+n(d)+' cm');}
 return drawing(one(140,da,ha,'A')+one(365,db,hb,'B'),
 'Sívalningur A hefur þvermál '+n(da)+' cm og hæð '+n(ha)+' cm. Sívalningur B hefur þvermál '+n(db)+' cm og hæð '+n(hb)+' cm. Sama lengdareining og kvarði á báðum myndum.');
}
function radiusCylinder(height){
 return drawing('<g class="solid"><path class="front" d="M170,65 H330 V220 A80 18 0 0 1 170,220 Z"/><ellipse class="lid" cx="250" cy="65" rx="80" ry="18"/></g>'+
 line(250,65,330,65)+'<circle cx="250" cy="65" r="3" fill="#875637"/>'+lab(290,46,'r = ?')+
 dimension(355,65,355,220)+lab(369,150,'h = '+n(height)+' cm','start'),
 'Sívalningslaga ílát. Innanhæðin er '+n(height)+' cm. Radíus grunnflatarins að innan er óþekktur.');
}
function diagonalBox([a,b,h],space=false){
 return drawing('<g class="solid transparent"><path class="lid" d="M110,120 L205,60 425,60 330,120 Z"/><path class="side" d="M330,120 L425,60 425,165 330,225 Z"/>'+
 '<path class="front" d="M110,120 H330 V225 H110 Z"/><path class="hidden-edge" d="M110,225 L205,165 425,165 M205,165 V60"/></g>'+
 '<path class="base-diagonal" d="M110,225 L425,165"/>'+(space?'<path class="space-diagonal" d="M110,225 L425,60"/>':'')+
 (space?'<path class="dimension" d="M413,167.3 v-12 L425,153"/>':'<path class="dimension" d="M318,225 l8,-5 12,0"/>')+
 lab(98,242,'A')+lab(337,243,'B')+lab(430,188,'C')+lab(428,48,'D')+
 lab(220,263,n(a)+' cm')+lab(393,218,n(b)+' cm')+
 dimension(437,60,437,165)+lab(449,118,n(h)+' cm','start'),
 'Kassi með innanmál '+n(a)+' cm, '+n(b)+' cm og '+n(h)+' cm. AB og BC eru grunnbrúnir. C er beint undir D. Bláa strikið AC er hornalína botnsins.'+(space?' Appelsínugula strikið AD er hornalína í kassanum.':''));
}
function buildLesson(round){
 const d=rounds[round],group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
 function numeric(title,question,label,unit,board,value,hints,explain,places=null,errors=[],usesPi=true){
  return {title,question:question+(places===null?'':' <strong>'+(usesPi?'Notaðu π-takkann og námundaðu':'Námundaðu')+' lokasvarið að tveimur aukastöfum.</strong>'),label,unit,board,
   answer:places===null?Number(value.toFixed(8)):roundTo(value,places),hints,explain,rounding:places,errors};
 }
 const [big,small]=d.cubes,cubeRatio=(big/small)**3;
 const [ch,cl]=d.cone,cr2=cl*cl-ch*ch,cr=Math.sqrt(cr2),coneV=pi*cr2*ch/3;
 const [yh,yc]=d.cylinder,yd2=yc*yc-yh*yh,yd=Math.sqrt(yd2),yr=yd/2,cylinderV=pi*yd2*yh/4;
 const [ps,pe]=d.pyramid,pl2=pe*pe-(ps/2)**2,pl=Math.sqrt(pl2),pyramidY=ps*ps+2*ps*pl;
 const plExact=Number.isInteger(pl)?formula(n(pl)):root(mn(pl2));
 const [mult,ah,av]=d.algebra,x=Math.sqrt(av/(mult*ah));
 const [g,yf]=d.areas,edgeG=Math.sqrt(g),edgeY=Math.sqrt(yf/6);
 const [da,ha,db,hb]=d.pair,ca=(da/2)**2*ha,cb=(db/2)**2*hb,which=ca>cb?0:1,ratio=Math.max(ca,cb)/Math.min(ca,cb);
 const [litres,rh]=d.radius,cc=litres*1000,rr=Math.sqrt(cc/(pi*rh));
 const [ba,bb,bh]=d.box,base2=ba*ba+bb*bb,base=Math.sqrt(base2),diag=Math.sqrt(base2+bh*bh);
 const [jh,jl]=d.joined,jr2=jl*jl-jh*jh,jr=Math.sqrt(jr2),joinedY=pi*jr*jl+2*pi*jr2;
 const jrExact=Number.isInteger(jr)?formula(n(jr)):root(mn(jr2));
 const surfaces=[{text:'Möttull keilunnar, bogið yfirborð hálfkúlunnar og einn hringflötur',wrong:'Hringflöturinn á samskeytunum er inni í hlutnum.'},
 {text:'Möttull keilunnar einn og sér',wrong:'Bogið yfirborð hálfkúlunnar vantar.'}];
 surfaces.splice(round,0,{text:'Möttull keilunnar og bogið yfirborð hálfkúlunnar',wrong:''});
 return [
  group('29.56','Hlutfall rúmmála',[
   numeric('Berðu saman teningana','Hvert er hlutfall rúmmáls stærri teningsins á móti rúmmáli þess minni? Skráðu hlutfallið á forminu tala : 1.','Hlutfall',': 1',cubePair(d.cubes),cubeRatio,
    ['Berðu saman rúmmálin, ekki aðeins hliðarlengdirnar.','Þú getur deilt rúmmáli stærri teningsins með rúmmáli þess minni.'],
    'Hlutfallið er '+frac(n(big)+'³',n(small)+'³')+formula(' = '+n(cubeRatio))+'. Því er það '+formula(n(cubeRatio)+' : 1')+'.',null,
    [[big/small,'Þetta er hlutfall lengdanna. Rúmmál tenings er hliðarlengdin í þriðja veldi.'],[(big/small)**2,'Þetta er flatarmálshlutfall. Hér er spurt um rúmmálshlutfall.']])
  ]),
  group('29.57','Lengd vantar í rúmmálsreikning',[
   numeric('Rúmmál keilunnar','Hæð keilunnar og skáhliðin l eru merktar. Reiknaðu rúmmálið.','R','cm³',coneUnknown(d.cone),coneV,
    ['Finndu radíus (geisla) áður en þú reiknar rúmmálið.','Hæð, radíus og skáhlið mynda rétthyrndan þríhyrning. Notaðu reglu Pýþagórasar.'],
    lines(formula('r = ')+rootDiff(cl,ch)+formula(' = '+n(cr)+' cm.'),formula('R = ')+frac('π · '+n(cr)+'² · '+n(ch),'3')+formula(' ≈ '+n(coneV,2)+' cm³.')),2,
    [[roundTo(pi*cl*cl*ch/3),'Skáhliðin er ekki radíus. Finndu radíus með reglu Pýþagórasar.']]),
   numeric('Rúmmál sívalningsins','Strikið á myndinni er hornalína rétthyrnds sniðs sem fer í gegnum miðjur grunnflatanna. Reiknaðu rúmmál sívalningsins.','R','cm³',cylinderSection(d.cylinder),cylinderV,
    ['Breidd rétthyrnda sniðsins er þvermál sívalningsins.','Finndu breiddina með reglu Pýþagórasar og síðan radíusinn.'],
    lines(formula('þ = ')+rootDiff(yc,yh)+formula(' = '+n(yd)+' cm. r = '+n(yr)+' cm.'),formula('R = π · '+n(yr)+'² · '+n(yh)+' ≈ '+n(cylinderV,2)+' cm³.')),2,
    [[roundTo(pi*yd2*yh),'Lengdin sem þú finnur með reglu Pýþagórasar er þvermál, ekki radíus.']])
  ]),
  group('29.58','Yfirborðsflatarmál pýramída',[
   numeric('Allir fimm fletirnir','Grunnflötur pýramídans er ferningur og hliðarþríhyrningarnir fjórir eru eins. Hliðarbrún frá toppi að hornpunkti er '+n(pe)+' cm. Reiknaðu yfirborðsflatarmálið með grunnfletinum. Ekki námunda milliniðurstöður.','YF','cm²',pyramidSurface(d.pyramid),pyramidY,
    ['Þú þarft flatarmál ferningsins og fjögurra þríhyrninga. Merkt hliðarbrún er ekki hæð þríhyrningsins.','Hæð jafnarma hliðarþríhyrnings skiptir grunnlínunni í tvennt. Notaðu reglu Pýþagórasar til að finna hana.'],
    lines(formula('l = ')+rootDiff(pe,ps/2)+formula(' = ')+plExact+formula(' cm.'),
     formula('YF = '+n(ps)+'² + 2 · '+n(ps)+' · ')+plExact+formula((Number.isInteger(pl)?' = '+n(pyramidY):' ≈ '+n(pyramidY,2))+' cm².')),Number.isInteger(pl)?null:2,
    [[roundTo(2*ps*pl),'Grunnflöturinn á líka að vera með.'],[ps*ps+2*ps*pe,'Hliðarbrúnin er ekki hæð hliðarþríhyrningsins.']],false)
  ]),
  group('29.59','Jafna um grunnbrúnir',[
   numeric('Finndu styttri grunnbrúnina','Grunnbrúnir ferstrendings eru x cm og '+n(mult)+'x cm. Hæðin er '+n(ah)+' cm og rúmmálið '+n(av)+' cm³. Hvert er gildi x?','x','cm',algebraBox(mult,ah),x,
    ['Settu hliðarlengdirnar og hæðina í rúmmálsformúluna.','Margfeldið x · '+n(mult)+'x er '+n(mult)+'x². Leystu jöfnuna og taktu jákvæða ferningsrót.'],
    lines(formula(n(mult*ah)+'x² = '+n(av)+'. x = ')+rootFraction(av,String(mult*ah))+formula(' = '+n(x)+' cm.'),
    'Grunnbrúnirnar eru '+n(x)+' cm og '+n(mult*x)+' cm.'),null,
    [[x*x,'Þetta er x². Finndu jákvæða ferningsrót til að fá lengdina.']])
  ]),
  group('29.60','Rúmmál frá flatarmáli',[
   numeric('Grunnflatarmál tenings','Grunnflatarmál tenings er '+n(g)+' cm². Hvert er rúmmálið?','R','cm³',cubeUnknown(g),edgeG**3,
    ['Grunnflöturinn er ferningur. Finndu hliðarlengd hans.','Í teningi er hæðin jöfn hliðarlengd grunnflatarins.'],
    lines(formula('h = ')+root(mn(g))+formula(' = '+n(edgeG)+' cm.'),formula('R = '+n(edgeG)+'³ = '+n(edgeG**3)+' cm³.'))),
   numeric('Yfirborðsflatarmál tenings','Yfirborðsflatarmál annars tenings er '+n(yf)+' cm². Hvert er rúmmál hans?','R','cm³',cubeUnknown(yf,true),edgeY**3,
    ['Yfirborðsflatarmálið er summa flatarmála sex jafnstórra ferninga.','Finndu flatarmál eins flatar, síðan hliðarlengdina og rúmmálið.'],
    lines(formula('h = ')+rootFraction(yf,'6')+formula(' = '+n(edgeY)+' cm.'),formula('R = '+n(edgeY)+'³ = '+n(edgeY**3)+' cm³.')))
  ]),
  group('29.61','Samanburður sívalninga',[
   {title:'Hvor rúmar meira?',question:'Berðu saman rúmmál sívalninganna. Hvorn velur þú?',board:cylinderPair(d.pair),options:['Sívalningur A','Sívalningur B','Þeir hafa jafnstórt rúmmál'],answer:which,
    hints:['Hvorki hæðin né þvermálið eitt og sér segir til um rúmmálið.','Reiknaðu rúmmál beggja. Þú getur líka borið saman r²h, því þátturinn π er sameiginlegur.'],
    explain:lines('Rúmmál A er '+formula(n(ca)+'π cm³')+' og rúmmál B '+formula(n(cb)+'π cm³')+'.','Sívalningur '+(which===0?'A':'B')+' rúmar því meira.'),
    wrong:[0,1,2].map(i=>i===which?'':'Berðu saman grunnflatarmál sinnum hæð hjá báðum sívalningum.')},
   numeric('Hlutfall rúmmálanna','Finndu hlutfall stærra rúmmálsins á móti því minna. Skráðu það á forminu tala : 1.','Hlutfall',': 1',cylinderPair(d.pair),ratio,
    ['Deildu stærra rúmmálinu með því minna.','Sameiginlegi þátturinn π styttist út.'],
    'Hlutfallið fæst með '+frac(n(Math.max(ca,cb))+'π',n(Math.min(ca,cb))+'π')+formula(' = ')+frac(n(Math.max(ca,cb)),n(Math.min(ca,cb)))+formula((Number.isInteger(ratio*100)?' = ':' ≈ ')+n(ratio,2))+'. Hlutfallið er '+formula(n(ratio,2)+' : 1')+'.',2,[],false)
  ]),
  group('29.62','Óþekktur radíus',[
   numeric('Finndu radíus ílátsins','Sívalningslaga ílát rúmar '+n(litres)+' lítra. Innanhæðin er '+n(rh)+' cm. Hver er radíus grunnflatarins að innan?','r','cm',radiusCylinder(rh),rr,
    ['Breyttu lítrum í cm³ og settu þekktu gildin í rúmmálsformúlu sívalnings.','Einangraðu r² og taktu síðan jákvæða ferningsrót.'],
    lines(formula(n(litres)+' ℓ = '+n(cc)+' cm³.'),formula('r = ')+rootFraction(cc,'π · '+n(rh))+formula(' ≈ '+n(rr,2)+' cm.')),2,
    [[roundTo(rr*rr),'Þetta er r². Taktu ferningsrót til að fá radíusinn.'],[roundTo(2*rr),'Þetta er þvermál. Spurt er um radíus.']])
  ]),
  group('29.63–64','Hornalína í kassa',[
   numeric('Hornalína botnsins','Myndin sýnir innanmál kassa. AC er hornalína rétthyrnda botnsins. Hver er lengd AC?','AC','cm',diagonalBox(d.box),base,
    ['AB og BC eru skammhliðar rétthyrnds þríhyrnings.','Notaðu reglu Pýþagórasar til að finna AC.'],
    formula('AC = ')+rootSum([ba,bb])+formula((Number.isInteger(base)?' = '+n(base):' ≈ '+n(base,2))+' cm.'),2,[],false),
   numeric('Lengsta beina stöngin','Hver er lengsta beina stöng sem kemst í kassann? Hún getur legið eftir AD. Ekki taka tillit til þykktar stangarinnar og ekki námunda milliniðurstöður.','AD','cm',diagonalBox(d.box,true),diag,
    ['C er beint undir D. Þríhyrningurinn ACD er rétthyrndur við C.','Notaðu reglu Pýþagórasar aftur með hornalínu botnsins og hæð kassans.'],
    formula('AD = ')+rootSum([ba,bb,bh])+formula((Number.isInteger(diag)?' = '+n(diag):' ≈ '+n(diag,2))+' cm.'),2,
    [[roundTo(base),'Þetta er hornalína botnsins. Hornalínan AD liggur líka upp um hæð kassans.']],false)
  ],true),
  group('29.65','Ytra yfirborð',[
   {title:'Hvaða fletir teljast með?',question:'Keila og hálfkúla eru festar saman þannig að hringlaga grunnfletir þeirra falla saman. Hvaða fletir mynda ytra yfirborðið?',board:coneUnknown(d.joined,true),
    options:surfaces.map(o=>o.text),answer:round,wrong:surfaces.map(o=>o.wrong),hints:['Teldu aðeins þá fleti sem sjást utan á hlutnum.','Hringflöturinn á samskeytunum er ekki á ytra yfirborðinu.'],
    explain:'Ytra yfirborðið er möttull keilunnar og bogið yfirborð hálfkúlunnar. Hringflöturinn á samskeytunum telst ekki með.'},
   numeric('Flatarmál ytra yfirborðsins','Reiknaðu flatarmál ytra yfirborðs hlutarins. Hæð keilunnar og skáhlið hennar eru merktar á myndinni. Ekki námunda milliniðurstöður.','YF','cm²',coneUnknown(d.joined,true),joinedY,
    ['Finndu sameiginlegan radíus með reglu Pýþagórasar.','Leggðu saman flatarmál möttuls keilunnar og bogna yfirborðs hálfkúlunnar.'],
    lines(formula('r = ')+rootDiff(jl,jh)+formula(' = ')+jrExact+formula(' cm.'),
    formula('YF = π · ')+jrExact+formula(' · '+n(jl)+' + 2π · '+n(jr2)+' ≈ '+n(joinedY,2)+' cm².')),2,
    [[roundTo(joinedY+pi*jr2),'Hringflöturinn inni í hlutnum á ekki að vera með.']])
  ],true)
 ];
}
