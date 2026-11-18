'use strict';

// Comparable practice variants; the worksheet's numbers are deliberately not reused.
const rounds = [
  {given:[42,18],tri:[4.8,3.5,6],upright:[5,3.6,8.4],right:[3,4,6.5],closed:[.9,1.2,2.8],stairs:[40,30,15,100],ditch:[.4,.6,1.5,10],house:[8,5.8,2.6,14],pool:[26,10,1.2,2.7,7,10]},
  {given:[54,16],tri:[6,2.5,7.2],upright:[7.2,4.5,6],right:[3.6,4.8,7.5],closed:[1.2,1.6,3.5],stairs:[50,35,18,110],ditch:[.6,.8,1.4,15],house:[10,6.2,3.2,12],pool:[28,12,1,3,8,12]},
  {given:[48,22],tri:[7.5,3.2,4.5],upright:[6.4,4.8,9.2],right:[4.5,6,8],closed:[1.5,2,2.6],stairs:[36,24,20,90],ditch:[.75,1,1.6,9],house:[7,5.5,2.5,15],pool:[30,11,1.1,3.1,8,12]}
];
function formatNumber(n,places){
  const s=places===undefined?String(Number(n.toFixed(8))):n.toFixed(places);
  const [a,b]=s.split('.');
  return a.replace(/\B(?=(\d{3})+(?!\d))/g,' ')+(b===undefined?'':','+b);
}
const n=formatNumber;
const rounded=x=>Math.round((x+Number.EPSILON)*10)/10;
const frac=(a,b)=>'<math xmlns="http://www.w3.org/1998/Math/MathML"><mstyle displaystyle="true" scriptlevel="0"><mfrac><mtext>'+a+'</mtext><mtext>'+b+'</mtext></mfrac></mstyle></math>';
const formula=s=>'<span class="formula">'+s+'</span>';
const lab=(x,y,t,anchor='middle')=>'<text class="measure" x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+t+'</text>';
const path=(points,cls)=>'<path class="'+cls+'" d="M'+points.map(p=>p.join(',')).join(' L')+' Z"/>';
const line=(a,b,cls='dimension')=>'<path class="'+cls+'" d="M'+a.join(',')+' L'+b.join(',')+'"/>';
const rightMark=(x,y,dx=10,dy=-10)=>'<path class="dimension" d="M'+x+','+(y+dy)+' h'+dx+' v'+(-dy)+'"/>';
function dimension(x1,y1,x2,y2){
  const dx=x2-x1,dy=y2-y1,k=5/Math.hypot(dx,dy),tx=-dy*k,ty=dx*k;
  return line([x1,y1],[x2,y2])+line([x1-tx,y1-ty],[x1+tx,y1+ty])+line([x2-tx,y2-ty],[x2+tx,y2+ty]);
}
function drawing(content,description){
  return '<svg viewBox="0 0 520 280" role="img" aria-label="'+description+'">'+content+'</svg>';
}
function prism(points,dx,dy,theme=''){
  const back=points.map(([x,y])=>[x+dx,y+dy]);
  const orientation=Math.sign(points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0));
  let body='';
  points.forEach((p,i)=>{
    const j=(i+1)%points.length,q=points[j],cross=(q[0]-p[0])*dy-(q[1]-p[1])*dx;
    if(cross*orientation<0)body+=path([p,back[i],back[j],q],Math.abs(q[0]-p[0])<1?'side':'lid');
  });
  return '<g class="solid '+theme+'">'+body+path(points,'front')+'</g>';
}
function givenDrawing([G,h]){
  return drawing(prism([[100,220],[280,220],[190,100]],125,-55)+lab(190,195,'G = '+n(G)+' cm²')+lab(385,199,'h = '+n(h)+' cm')+dimension(290,237,415,182),
    'Strendingur með grunnflatarmálið '+n(G)+' fersentimetra og hæð '+n(h)+' sentimetra. Litaði þríhyrningurinn er grunnflöturinn.');
}
function triangleDrawing([b,g,h],unit='m',right=false){
  const a=[85,220],v=[265,220],c=right?[85,75]:[145,75],dx=140,dy=-45;
  return drawing(prism([a,v,c],dx,dy,'gold')+
    (right?rightMark(85,220):line(c,[145,220],'altitude')+rightMark(145,220))+
    lab(175,252,n(b)+' '+unit)+lab(right?73:132,155,n(g)+' '+unit,'end')+
    dimension(280,236,420,191)+lab(402,240,'h = '+n(h)+' '+unit),
    'Þrístrendingur. Grunnlína þríhyrningsins er '+n(b)+' '+unit+', hornrétt hæð hans er '+n(g)+' '+unit+' og hæð strendingsins er '+n(h)+' '+unit+'.');
}
function uprightDrawing([b,g,h],right=false){
  const A=[130,90],B=[340,90],C=[214,27],a=[130,230],bpt=[340,230],c=[214,167];
  const body='<g class="solid green">'+path([C,B,bpt,c],'side')+path([A,B,bpt,a],'front')+path([A,B,C],'lid')+
    line(a,c,'hidden-edge')+line(c,bpt,'hidden-edge')+line(C,c,'hidden-edge')+'</g>';
  const lengths=right?
    // The projected legs at C are perpendicular in the triangular base.
    '<path class="dimension" d="M202,36 l12,6 12,-6"/>'+lab(153,43,n(b)+' cm')+lab(293,43,n(g)+' cm'):
    line(c,[214,230],'altitude')+rightMark(214,230)+lab(210,203,n(g)+' dm','end')+lab(234,263,n(b)+' dm');
  return drawing(body+lengths+dimension(365,90,365,230)+lab(380,165,n(h)+' '+(right?'cm':'dm'),'start'),
    right?'Þrístrendingur með rétthyrndum þríhyrningi sem grunnflöt. Skammhliðar hans eru '+n(b)+' og '+n(g)+' cm. Hæð strendingsins er '+n(h)+' cm.':
    'Þrístrendingur. Neðsti þríhyrningurinn hefur grunnlínu '+n(b)+' dm og hornrétta hæð '+n(g)+' dm. Lóðrétt hæð strendingsins er '+n(h)+' dm.');
}
function stairsDrawing([upper,lower,rise,width]){
  const total=upper+lower,k=210/total,mid=95+upper*k;
  const p=[[95,220],[305,220],[305,170],[mid,170],[mid,120],[95,120]];
  return drawing(prism(p,105,-55,'peach')+lab((95+mid)/2,110,n(upper)+' cm')+lab((mid+305)/2,160,n(lower)+' cm')+
    dimension(76,120,76,170)+dimension(76,170,76,220)+lab(64,153,n(rise)+' cm','end')+lab(64,203,n(rise)+' cm','end')+
    dimension(318,237,423,182)+lab(410,252,n(width)+' cm'),
    'Tvö gegnheil þrep, bæði '+n(rise)+' cm há. Efri þrepflötur er '+n(upper)+' cm djúpur og sá neðri '+n(lower)+' cm. Breidd beggja þrepa er '+n(width)+' cm.');
}
function ditchDrawing([side,bottom,depth,length]){
  const k=240/(2*side+bottom),x=95,u=x+side*k,v=u+bottom*k;
  const content=prism([[x,95],[335,95],[v,215],[u,215]],100,-45,'gold')+
    line([u,95],[u,215],'altitude')+line([v,95],[v,215],'altitude')+rightMark(u,215)+
    dimension(x,77,u,77)+dimension(u,77,v,77)+dimension(v,77,335,77)+
    lab((x+u)/2,66,n(side)+' m')+lab((u+v)/2,66,n(bottom)+' m')+lab((v+335)/2,66,n(side)+' m')+
    dimension(70,95,70,215)+lab(60,164,n(depth)+' m','end')+lab((u+v)/2,247,n(bottom)+' m')+
    dimension(350,108,450,63)+lab(427,125,n(length)+' m');
  return drawing(content,'Skurður með sama þversnið eftir allri lengdinni. Þversniðið er trapisa. Efri breidd skiptist í '+n(side)+', '+n(bottom)+' og '+n(side)+' m; neðri breidd er '+n(bottom)+' m; dýpt '+n(depth)+' m og lengd '+n(length)+' m.');
}
function houseDrawing([width,total,wall,length]){
  const base=225,top=60,wallTop=base-165*wall/total;
  const pts=[[135,base],[325,base],[325,wallTop],[230,top],[135,wallTop]];
  return drawing(prism(pts,95,-37,'peach')+line([135,wallTop],[325,wallTop],'altitude')+
    lab(230,256,n(width)+' m')+dimension(105,base,105,top)+lab(93,148,n(total)+' m','end')+
    dimension(435,base-37,435,wallTop-37)+lab(448,(base+wallTop)/2-30,n(wall)+' m','start')+
    dimension(335,241,430,204)+lab(405,263,n(length)+' m'),
    'Hús með sama þversnið eftir lengdinni. Breidd '+n(width)+' m, lengd '+n(length)+' m, vegghæð '+n(wall)+' m og heildarhæð '+n(total)+' m.');
}
function poolDrawing([length,width,shallow,deep,flat1,flat2],floor=false){
  const k=340/length,x=90,right=430,top=70,sy=top+125*shallow/deep,dy=195,a=x+flat1*k,b=right-flat2*k;
  return drawing('<g class="solid">'+path([[x,top],[right,top],[right,dy],[b,dy],[a,sy],[x,sy]],'front')+'</g>'+
    (floor?'<path class="highlight" d="M'+x+','+sy+' H'+a+' L'+b+','+dy+' H'+right+'"/>':'')+
    dimension(x,47,right,47)+lab(260,35,n(length)+' m')+
    dimension(72,top,72,sy)+lab(60,(top+sy)/2+7,n(shallow)+' m','end')+
    dimension(447,top,447,dy)+lab(459,(top+dy)/2+7,n(deep)+' m','start')+
    dimension(x,228,a,228)+dimension(b,228,right,228)+lab((x+a)/2,253,n(flat1)+' m')+lab((b+right)/2,253,n(flat2)+' m'),
    'Mynd af lauginni frá hlið. Lengd '+n(length)+' m, grynning '+n(shallow)+' m, dýpt hinum megin '+n(deep)+' m. Láréttu botnhlutarnir eru '+n(flat1)+' og '+n(flat2)+' m. Á milli þeirra hallar botninum jafnt. Breidd laugarinnar er '+n(width)+' m.');
}
function buildLesson(round){
  const d=rounds[round];
  const numeric=(title,question,label,unit,board,answer,hints,explain,errors=[])=>({title,question,label,unit,board,answer:Number(answer.toFixed(8)),hints,explain,errors});
  const group=(ref,name,questions,optional=false)=>({ref,name,questions,optional});
  const [G0,h0]=d.given,[b,g,h]=d.tri,G=b*g/2;
  const [ub,ug,uh]=d.upright,[ra,rb,rh]=d.right;
  const [a,c,hc]=d.closed,hyp=Math.hypot(a,c),Gc=a*c/2,M=(a+c+hyp)*hc,Rc=Gc*hc;
  const [up,low,rise,width]=d.stairs,stairG=up*2*rise+low*rise;
  const [side,bottom,depth,len]=d.ditch,top=2*side+bottom,ditchG=(top+bottom)*depth/2;
  const [hw,total,wall,hl]=d.house,roof=total-wall,houseG=hw*wall+hw*roof/2;
  const [pl,pw,shallow,deep,p1,p2]=d.pool,run=pl-p1-p2,delta=deep-shallow,slope=Math.hypot(run,delta);
  const poolG=p1*shallow+run*(shallow+deep)/2+p2*deep;
  const poolPrompt='Laugin er '+n(pw)+' m breið og hliðarveggirnir eru lóðréttir. Myndin sýnir innanmálin frá hlið. Botninn hallar jafnt milli láréttu hlutanna. ';
  const oneDecimal=' <strong>Námundaðu að einum aukastaf.</strong>';
  const poolQuestion=(title,question,label,unit,answer,hints,explain,floor=false)=>Object.assign(
    numeric(title,poolPrompt+question+oneDecimal,label,unit,poolDrawing(d.pool,floor),rounded(answer),hints,explain),{rounding:1});
  return [
    group('29.9','Grunnflötur og hæð',[
      numeric('Frá grunnfleti að rúmmáli','Flatarmál grunnflatarins er '+n(G0)+' cm² og hæð strendingsins er '+n(h0)+' cm. Hvert er rúmmálið?','R','cm³',givenDrawing(d.given),G0*h0,
        ['Rúmmál strendings er flatarmál grunnflatar margfaldað með hæð strendingsins.',formula('R = G · h')],formula('R = '+n(G0)+' · '+n(h0)+' = '+n(G0*h0)+' cm³.'))
    ]),
    group('29.10','Þríhyrningur sem grunnflötur',[
      numeric('Finndu grunnflatarmálið','Litaði þríhyrningurinn er grunnflötur strendingsins. Hvert er flatarmál hans?','G','m²',triangleDrawing(d.tri),G,
        ['Notaðu grunnlínu þríhyrningsins og hornrétta hæð hans.',formula('G = ')+frac('grunnlína · hæð þríhyrnings','2')],formula('G = ')+frac(n(b)+' · '+n(g),'2')+formula(' = '+n(G)+' m².'),[[b*g,'Flatarmál þríhyrnings er helmingur af margfeldi grunnlínu og hæðar.']]),
      numeric('Finndu rúmmálið','Flatarmál grunnflatarins er '+n(G)+' m². Hvert er rúmmál strendingsins?','R','m³',triangleDrawing(d.tri),G*h,
        ['Hæð strendingsins er fjarlægðin milli þríhyrndu grunnflatanna.',formula('R = G · h')],formula('R = '+n(G)+' · '+n(h)+' = '+n(G*h)+' m³.'))
    ]),
    group('29.11','Hvaða hæð á við?',[
      {title:'Hæð þríhyrningsins',question:'Neðsti þríhyrningurinn er grunnflötur strendingsins. Hvaða lengd er hornrétt hæð þess þríhyrnings?',board:uprightDrawing(d.upright),options:[n(uh)+' dm',n(ug)+' dm',n(ub)+' dm'],answer:1,
        hints:['Leitaðu að strikinu sem liggur í þríhyrningnum og myndar rétt horn við grunnlínu hans.','Lóðréttu brúnirnar sýna hæð strendingsins. Þær eru ekki hæð þríhyrningsins.'],
        explain:'Hæð þríhyrningsins er '+n(ug)+' dm. Hæð strendingsins er '+n(uh)+' dm.',wrong:['Þetta er hæð strendingsins. Finndu hornréttu hæðina í þríhyrningnum.','','Þetta er grunnlína þríhyrningsins. Hæðin stendur hornrétt á hana.']},
      numeric('Rétthyrndur þríhyrningur','Grunnflöturinn er rétthyrndur þríhyrningur. Gefnar eru skammhliðar hans og hæð strendingsins. Hvert er rúmmálið?','R','cm³',uprightDrawing(d.right,true),ra*rb*rh/2,
        ['Skammhliðar rétthyrnds þríhyrnings geta verið grunnlína og hæð hans.',formula('G = ')+frac('skammhlið · skammhlið','2')+formula(' og R = G · h.')],formula('G = ')+frac(n(ra)+' · '+n(rb),'2')+formula(' = '+n(ra*rb/2)+' cm². R = '+n(ra*rb/2)+' · '+n(rh)+' = '+n(ra*rb*rh/2)+' cm³.'))
    ]),
    group('29.12','Rúmmál, möttull og yfirborð',[
      numeric('Hve margir lítrar?','Grunnflötur þrístrendingsins er rétthyrndur þríhyrningur. Hvert er rúmmál hans í lítrum?','R','ℓ',triangleDrawing([c,a,hc],'m',true),Rc*1000,
        ['Finndu fyrst flatarmál þríhyrningsins og margfaldaðu með hæð strendingsins.','Einn rúmmetri er 1 000 lítrar.'],formula('G = '+n(Gc)+' m². R = '+n(Gc)+' · '+n(hc)+' = '+n(Rc)+' m³ = '+n(Rc*1000)+' ℓ.'),[[Rc,'Þú hefur fundið rúmmálið í rúmmetrum. Breyttu því í lítra.']]),
      numeric('Flatarmál möttulsins','Finndu samanlagt flatarmál þriggja rétthyrndu hliðarfletanna. Þríhyrndu grunnfletirnir teljast ekki með.','M','m²',triangleDrawing([c,a,hc],'m',true),M,
        ['Þú þarft allar þrjár hliðarlengdir þríhyrningsins. Finndu langhliðina með reglu Pýþagórasar.','Margfaldaðu ummál þríhyrningsins með hæð strendingsins.'],
        'Langhlið þríhyrningsins er '+n(hyp)+' m. '+formula('M = ('+n(a)+' + '+n(c)+' + '+n(hyp)+') · '+n(hc)+' = '+n(M)+' m².')),
      numeric('Allt yfirborðið','Flatarmál möttulsins er '+n(M)+' m². Hvert er yfirborðsflatarmál strendingsins þegar báðir endafletirnir eru lokaðir?','YF','m²',triangleDrawing([c,a,hc],'m',true),M+2*Gc,
        ['Bættu við flatarmáli beggja þríhyrndu grunnflatanna.',formula('YF = M + 2G')],formula('YF = '+n(M)+' + 2 · '+n(Gc)+' = '+n(M+2*Gc)+' m².'),[[M+Gc,'Það eru tveir þríhyrndir endafletir. Báðir teljast með.']])
    ]),
    group('29.13','Tvö þrep',[
      numeric('Rúmmál tröppunnar','Trappan er gegnheil og þrepin tvö eru jafnhá. Hvert er rúmmál hennar í rúmmetrum?','R','m³',stairsDrawing(d.stairs),stairG*width/1e6,
        ['Skiptu tröppunni í tvo ferstrendinga. Gættu þess að enginn hluti teljist tvisvar.','Þú getur reiknað í sentimetrum fyrst. Einn rúmmetri er 1 000 000 rúmsentimetrar.'],
        'Með lóðréttri skiptingu fæst '+formula('R = ('+n(up)+' · '+n(2*rise)+' + '+n(low)+' · '+n(rise)+') · '+n(width)+' = '+n(stairG*width)+' cm³ = '+n(stairG*width/1e6)+' m³.'))
    ]),
    group('29.14','Trapisa sem grunnflötur',[
      numeric('Moldin úr skurðinum','Skurðurinn hefur sama þversnið eftir allri lengdinni. Hve marga rúmmetra af mold þarf að fjarlægja?','R','m³',ditchDrawing(d.ditch),ditchG*len,
        ['Þversniðið er trapisa. Finndu heildarbreiddina efst áður en þú reiknar flatarmálið.','Látum a og b tákna samsíða hliðar trapisunnar og h dýptina. '+formula('G = ')+frac('(a + b) · h','2')+formula('. R = G · lengd.')],
        'Efri breiddin er '+n(top)+' m. '+formula('G = ')+frac('('+n(top)+' + '+n(bottom)+') · '+n(depth),'2')+formula(' = '+n(ditchG)+' m². R = '+n(ditchG)+' · '+n(len)+' = '+n(ditchG*len)+' m³.'))
    ]),
    group('29.15','Húsið',[
      numeric('Rúmmál hússins','Húsið hefur sama þversnið eftir allri lengdinni. Reiknaðu rúmmál rúmhlutarins sem myndin sýnir.','R','m³',houseDrawing(d.house),houseG*hl,
        ['Skiptu framhliðinni í rétthyrning og þríhyrning.','Hæð þríhyrningsins er mismunur heildarhæðar og vegghæðar. Margfaldaðu samanlagt flatarmál framhliðarinnar með lengd hússins.'],
        'Hæð þríhyrningsins er '+n(roof)+' m. '+formula('G = '+n(hw)+' · '+n(wall)+' + ')+frac(n(hw)+' · '+n(roof),'2')+formula(' = '+n(houseG)+' m². R = '+n(houseG)+' · '+n(hl)+' = '+n(houseG*hl)+' m³.'))
    ],true),
    group('29.16','Sundlaugin',[
      poolQuestion('Rúmmál laugarinnar','Hvert er rúmmál hennar?','R','m³',poolG*pw,
        ['Myndin frá hlið er grunnflötur strendings. Skiptu henni í rétthyrninga og trapisu.','Finndu lárétta lengd miðhlutans með því að draga lengdir láréttu botnhlutanna frá heildarlengdinni. Margfaldaðu flatarmál hliðarmyndarinnar með breidd laugarinnar.'],
        'Miðhlutinn er '+n(run)+' m langur lárétt. Flatarmál hliðarmyndarinnar er '+n(poolG)+' m². '+formula('R = '+n(poolG)+' · '+n(pw)+' = '+n(poolG*pw,1)+' m³.')),
      poolQuestion('Flatarmál botnsins','Hvert er flatarmál alls botnsins, með hallandi hlutanum?','F','m²',(p1+p2+slope)*pw,
        ['Hallandi botnhlutinn er lengri en lárétta vegalengdin undir honum.','Notaðu reglu Pýþagórasar á miðhlutann. Skammhliðar eru lárétta lengdin og munurinn á dýptunum. Leggðu saman lengdir botnhlutanna og margfaldaðu með breiddinni.'],
        'Hæðarmunurinn er '+n(delta)+' m og lárétta lengdin '+n(run)+' m. Hallandi hlutinn er um '+n(slope,4)+' m langur. Með ónámundaðri lengd í reikningnum fæst '+formula('F ≈ '+n(rounded((p1+p2+slope)*pw),1)+' m².'),true),
      poolQuestion('Flatarmál veggjanna','Hvert er samanlagt flatarmál veggjanna fjögurra? Botninn telst ekki með.','F','m²',2*poolG+pw*(shallow+deep),
        ['Langveggirnir tveir eru eins og myndin frá hlið. Endaveggirnir eru rétthyrningar.','Báðir endaveggirnir eru jafnbreiðir og laugin en misháir. Leggðu saman flatarmál allra fjögurra veggjanna.'],
        formula('F = 2 · '+n(poolG)+' + '+n(pw)+' · '+n(shallow)+' + '+n(pw)+' · '+n(deep)+' = '+n(2*poolG+pw*(shallow+deep),1)+' m².'))
    ],true)
  ];
}
