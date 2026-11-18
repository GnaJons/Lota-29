const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const C = {ink:'#303C43', dim:'#66747C', hidden:'#7E8B92', blue:'#326E8D', purple:'#80617D', front:'#EAF0F3', side:'#DAE6E4', top:'#F6F8F9', third:'#EEEAE2'};
const esc = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const v = x => `<tspan font-style="italic">${x}</tspan>`;
const sup = x => `<tspan baseline-shift="super" font-size="70%">${x}</tspan>`;
const sub = x => `<tspan baseline-shift="sub" font-size="70%">${x}</tspan>`;
const files = [];
class Diagram {
  constructor(w,h,title) { this.w=w;this.h=h;this.title=title;this.parts=[]; }
  add(s) { this.parts.push(s); return this; }
  path(d,fill='none',stroke=C.ink,width=2.7,dash='') { return this.add(`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`); }
  line(x1,y1,x2,y2,color=C.ink,width=2.7,dash='') {return this.path(`M ${x1} ${y1} L ${x2} ${y2}`,'none',color,width,dash);}
  poly(points,fill=C.front,stroke=C.ink,width=2.7) {return this.path('M '+points.map(p=>p.join(' ')).join(' L ')+' Z',fill,stroke,width);}
  rect(x,y,w,h,fill=C.front,stroke=C.ink) {return this.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],fill,stroke);}
  ellipse(cx,cy,rx,ry,fill='none',stroke=C.ink,width=2.7) {return this.add(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`);}
  dot(x,y,r=4,color=C.blue) {return this.ellipse(x,y,r,r,color,'none');}
  text(x,y,s,size=32,anchor='middle',color=C.ink,angle=0) {return this.add(`<text x="${x}" y="${y}" font-family="Cambria, Georgia, serif" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}"${angle?` transform="rotate(${angle} ${x} ${y})"`:''}>${s}</text>`);}
  arc(cx,cy,rx,ry,front=true,color=C.ink,width=2.7,dash='') {return this.path(`M ${cx-rx} ${cy} A ${rx} ${ry} 0 0 ${front?0:1} ${cx+rx} ${cy}`,'none',color,width,dash);}
  hidden(x1,y1,x2,y2) {return this.line(x1,y1,x2,y2,C.hidden,2.1,'9 7');}
  guide(x1,y1,x2,y2,dashed=true) {return this.line(x1,y1,x2,y2,C.blue,2.7,dashed?'10 7':'');}
  right(x,y,size=18,color=C.blue) {return this.path(`M ${x} ${y-size} H ${x+size} V ${y}`,'none',color,2.2);}
  arrow(x1,y1,x2,y2,both=true,color=C.dim,width=1.9) {
    this.line(x1,y1,x2,y2,color,width);
    const dx=x2-x1,dy=y2-y1,l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l;
    const head=(x,y,s)=>this.poly([[x,y],[x+s*ux*10-uy*3.6,y+s*uy*10+ux*3.6],[x+s*ux*10+uy*3.6,y+s*uy*10-ux*3.6]],color,'none');
    head(x2,y2,-1); if(both)head(x1,y1,1); return this;
  }
  dimH(x1,x2,oy,dy,label,size=32) {const dir=Math.sign(dy-oy);this.line(x1,oy+dir*9,x1,dy+dir*10,C.hidden,1.2);this.line(x2,oy+dir*9,x2,dy+dir*10,C.hidden,1.2);this.arrow(x1,dy,x2,dy);this.text((x1+x2)/2,dy+dir*30,label,size);return this;}
  dimV(y1,y2,ox,dx,label,size=32,rotate=true) {const dir=Math.sign(dx-ox);this.line(ox+dir*9,y1,dx+dir*10,y1,C.hidden,1.2);this.line(ox+dir*9,y2,dx+dir*10,y2,C.hidden,1.2);this.arrow(dx,y1,dx,y2);this.text(dx+dir*(rotate?32:30),(y1+y2)/2,label,size,rotate?'middle':dir>0?'start':'end',C.ink,rotate?-90:0);return this;}
  dimSlant(p1,p2,offset,label,size=32){let dx=p2[0]-p1[0],dy=p2[1]-p1[1],l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l;let a=[p1[0]+nx*offset,p1[1]+ny*offset],b=[p2[0]+nx*offset,p2[1]+ny*offset];this.line(p1[0]+nx*8,p1[1]+ny*8,a[0]+nx*9,a[1]+ny*9,C.hidden,1.2);this.line(p2[0]+nx*8,p2[1]+ny*8,b[0]+nx*9,b[1]+ny*9,C.hidden,1.2);this.arrow(...a,...b);this.text((a[0]+b[0])/2+nx*31,(a[1]+b[1])/2+ny*31,label,size,'middle',C.ink,Math.atan2(dy,dx)*180/Math.PI);return this;}
  svg(){return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.w}" height="${this.h}" viewBox="0 0 ${this.w} ${this.h}" role="img"><title>${esc(this.title)}</title><rect width="100%" height="100%" fill="#fff"/>${this.parts.join('\n')}</svg>`;}
  save(name){files.push({name,title:this.title,w:this.w,h:this.h});fs.writeFileSync(path.join(root,'svg',name+'.svg'),this.svg());return this;}
}

// 01 — Ferstrendingur. Falda grunnbrúnin og bakbrúnin eru strikalínur.
{
const d=new Diagram(1060,650,'Ferstrendingur með lengd a, breidd b og hæð h');
const A=[150,490],B=[780,490],Cc=[935,370],D=[305,370],E=[150,180],F=[780,180],G=[935,60],H=[305,60];
d.poly([A,B,F,E],C.front).poly([B,Cc,G,F],C.side).poly([E,F,G,H],C.top);
d.hidden(...A,...D).hidden(...D,...Cc).hidden(...D,...H);
d.dimH(150,780,490,550,v('a')).dimV(180,490,150,85,v('h'),34).dimSlant(B,Cc,62,v('b'),34);
d.save('L29_01_bls02_ferstrendingur');
}
// 02 — Net tenings; sex jafn stórir ferningar.
{
const d=new Diagram(1030,820,'Net tenings úr sex ferningum; hliðarlengd 3,5 cm');
const s=210,x=65,y=335;
for(const [i,j,c] of [[0,0,C.top],[1,0,C.front],[2,0,C.side],[3,0,C.third],[1,-1,C.side],[1,1,C.top]])d.rect(x+i*s,y+j*s,s,s,c);
d.dimH(x+s,x+2*s,y-s,75,`${v('s')} = 3,5 cm`);
d.text(755,205,'Sex ferningar',30).text(755,247,'verða sex fletir.',30);
d.save('L29_02_bls03_net_tenings');
}
// 03 — Þrístrendingur. g er hæð þríhyrningsins; h er lengd strendingsins.
{
const d=new Diagram(1120,700,'Þrístrendingur: b = 6 m, g = 4 m og h = 9 m');
const A=[150,525],B=[565,525],T=[357.5,248.3],D=[585,330],E=[1000,330],F=[792.5,53.3];
d.poly([A,B,T],C.front).poly([B,E,F,T],C.side);
d.hidden(...A,...D).hidden(...D,...E).hidden(...D,...F);
d.guide(...T,357.5,525).right(357.5,525);
d.dimH(150,565,525,580,`${v('b')} = 6 m`).dimV(248.3,525,150,90,`${v('g')} = 4 m`,32).line(100,248.3,348,248.3,C.hidden,1.2);
d.dimSlant(B,E,64,`${v('h')} = 9 m`);
d.save('L29_03_bls05_thristraendingur');
}
// 04 — Möttull þrístrendings; breiddir í réttu hlutfalli 1,5 : 2 : 2,5.
{
const d=new Diagram(1160,620,'Möttull þrístrendings: ummál 6 m og hæð 3,2 m');
const x=140,y=155,k=153,h=326;
d.rect(x,y,1.5*k,h,C.front).rect(x+1.5*k,y,2*k,h,C.side).rect(x+3.5*k,y,2.5*k,h,C.third);
d.dimH(x,x+6*k,y,94,`${v('U')} = 6 m`);
d.dimV(y,y+h,x,88,'3,2 m');
d.text(x+.75*k,530,'1,5 m').text(x+2.5*k,530,'2 m').text(x+4.75*k,530,'2,5 m');
d.save('L29_04_bls06_mottull_thristraendings');
}
// 05 — Tvö þrep: lárétt mál eru 0,42 m og 0,28 m, hvort þrep er 0,18 m hátt.
{
const d=new Diagram(1120,620,'Þversnið tveggja þrepa með gefnum málum í metrum');
const x=150,y=155,k=1170,xb=x+.42*k,xe=x+.70*k,ym=y+.18*k,yb=y+.36*k;
d.poly([[x,y],[xb,y],[xb,ym],[xe,ym],[xe,yb],[x,yb]],C.front);
d.hidden(x,ym,xb,ym);
d.dimH(x,xb,y,95,'0,42 m').dimH(xb,xe,ym,ym-65,'0,28 m');
d.dimV(y,ym,x,94,'0,18 m',30).dimV(ym,yb,xe,xe+55,'0,18 m',30);
d.save('L29_05_bls07_tvo_threp');
}
// 06 — Hliðarsnið laugar. Láréttar lengdir í hlutfallinu 4 : 10 : 6.
{
const d=new Diagram(1180,610,'Hliðarsnið sundlaugar með hallandi botni');
const x=140,y=160,k=45,depth=151.5;
d.poly([[x,y],[x+20*k,y],[x+20*k,y+2.4*depth],[x+14*k,y+2.4*depth],[x+4*k,y+.9*depth],[x,y+.9*depth]],C.front);
d.hidden(x+4*k,y,x+4*k,y+.9*depth).hidden(x+14*k,y,x+14*k,y+2.4*depth);
d.dimH(x,x+4*k,y,93,'4 m').dimH(x+4*k,x+14*k,y,93,'10 m').dimH(x+14*k,x+20*k,y,93,'6 m');
d.dimV(y,y+.9*depth,x,84,'0,9 m',30).dimV(y,y+2.4*depth,x+20*k,x+20*k+55,'2,4 m',30);
d.save('L29_06_bls08_laug_hallandi_botn');
}
// 07 — Sívalningur og formúlur fyrir grunnflöt og rúmmál.
{
const d=new Diagram(720,840,'Sívalningur með geisla r, hæð h og rúmmálsformúlu');
const cx=300,rx=210,ry=53,yt=130,yb=570;
d.path(`M ${cx-rx} ${yt} L ${cx-rx} ${yb} A ${rx} ${ry} 0 0 0 ${cx+rx} ${yb} L ${cx+rx} ${yt} Z`,C.front);
d.ellipse(cx,yt,rx,ry,C.top).arc(cx,yb,rx,ry,false,C.hidden,2.1,'9 7');
d.guide(cx,yt,cx+rx,yt,false).dot(cx,yt).text(cx+rx/2,yt-28,v('r'),34,'middle',C.blue);
d.dimV(yt,yb,cx+rx,590,v('h'),34,false);
d.text(350,708,`${v('G')} = π${v('r')}${sup('2')}`,36);
d.text(350,766,`${v('R')} = ${v('G')}${v('h')} = π${v('r')}${sup('2')}${v('h')}`,36);
d.save('L29_07_bls09_sivalningur');
}
// 08 — Útflattur möttull sívalnings.
{
const d=new Diagram(1080,560,'Möttull sívalnings: M = 2πrh, lengd U = 2πr = πþ');
d.rect(75,70,815,295,C.front);
d.text(482.5,217,`${v('M')} = 2π${v('r')}${v('h')}`,42);
d.dimH(75,890,365,445,`${v('U')} = 2π${v('r')} = πþ`,38);
d.dimV(70,365,890,957,v('h'),38,false);
d.save('L29_08_bls10_mottull_sivalnings');
}
// 09 — Plata rúlluð í sívalning; hæðin helst 24 cm.
{
const d=new Diagram(1180,420,'84 cm löng og 24 cm há plata rúlluð í sívalning');
d.rect(125,110,525,150,C.front).dimH(125,650,260,319,'84 cm').dimV(110,260,125,73,'24 cm',30);
d.arrow(700,185,785,185,false,C.dim,2.4);
const cx=900,rx=83.6,yt=110,yb=260,ry=25;
d.path(`M ${cx-rx} ${yt} L ${cx-rx} ${yb} A ${rx} ${ry} 0 0 0 ${cx+rx} ${yb} L ${cx+rx} ${yt} Z`,C.front);
d.ellipse(cx,yt,rx,ry,C.top).arc(cx,yb,rx,ry,false,C.hidden,1.9,'8 6');
d.dimV(yt,yb,cx+rx,1030,`${v('h')} = 24 cm`,30,true);
d.save('L29_09_bls11_plata_i_sivalning');
}
// 10 — Pýramídi. Hæðin endar í miðju grunnflatar.
{
const d=new Diagram(790,760,'Pýramídi með grunnbrún og hornréttri hæð h');
const A=[85,540],B=[500,630],Cc=[710,420],D=[295,330],O=[397.5,480],T=[397.5,65];
d.poly([A,B,T],C.front).poly([B,Cc,T],C.side);
d.hidden(...A,...D).hidden(...D,...Cc).hidden(...D,...T);
d.guide(...T,...O).right(...O,22).dot(...O,3);
d.text(O[0]-31,300,v('h'),38,'end',C.blue);
d.text(285,636,'grunnbrún',34,'middle',C.ink,Math.atan2(90,415)*180/Math.PI);
d.save('L29_10_bls12_pyramidi');
}
// 11 — Keila með Pýþagórasarþrenndinni 7, 24, 25.
{
const d=new Diagram(770,820,'Keila: h = 24 cm, r = 7 cm, s = 25 cm');
const cx=350,rx=175,yt=65,yb=665,ry=43;
d.path(`M ${cx-rx} ${yb} L ${cx} ${yt} L ${cx+rx} ${yb} A ${rx} ${ry} 0 0 1 ${cx-rx} ${yb} Z`,C.front);
d.arc(cx,yb,rx,ry,false,C.hidden,2.1,'9 7');
d.guide(cx,yt,cx,yb).guide(cx,yb,cx+rx,yb,false).right(cx,yb,22);
d.dimV(yt,yb,cx-rx,95,`${v('h')} = 24 cm`,32);
d.text(525,330,`${v('s')} = 25 cm`,32,'start');
d.text(cx+rx/2,760,`${v('r')} = 7 cm`,34);
d.save('L29_11_bls13_keila');
}
// 12 — Sívalningslaga hylki með keilulaga botni.
{
const d=new Diagram(770,900,'Hylki með keilubotni: þ = 1,2 m, hæðir 1,4 m og 0,5 m');
const cx=300,rx=210,ry=46,yt=185,yj=675,yb=850;
d.path(`M ${cx-rx} ${yj} L ${cx} ${yb} L ${cx+rx} ${yj} Z`,C.side);
d.path(`M ${cx-rx} ${yt} L ${cx-rx} ${yj} A ${rx} ${ry} 0 0 0 ${cx+rx} ${yj} L ${cx+rx} ${yt} Z`,C.front);
d.ellipse(cx,yt,rx,ry,C.top).arc(cx,yj,rx,ry,false,C.hidden,2.1,'9 7');
d.dimH(cx-rx,cx+rx,yt-ry,85,'þ = 1,2 m');
d.dimV(yt,yj,cx+rx,570,'1,4 m',32,false).dimV(yj,yb,cx+rx,570,'0,5 m',32,false);
d.save('L29_12_bls15_hylki_keilubotn');
}
// 13 — Kúla og nákvæmar rúmmáls- og yfirborðsformúlur.
{
const d=new Diagram(1090,650,'Kúla: R = 4/3 πr³ og Y = 4πr²');
const cx=340,cy=325,r=275;
d.ellipse(cx,cy,r,r,C.front).arc(cx,cy,r,68,true,C.hidden,2).arc(cx,cy,r,68,false,C.hidden,2.1,'9 7');
d.guide(cx,cy,cx+r,cy,false).dot(cx,cy).text(cx+r/2,cy-31,v('r'),36,'middle',C.blue);
d.text(857,190,'Rúmmál',32);
d.text(744,264,`${v('R')} =`,40);
d.text(822,243,'4',29).line(804,264,840,264,C.ink,1.8).text(822,286,'3',29);
d.text(908,264,`π${v('r')}${sup('3')}`,40);
d.text(857,408,'Yfirborð',32).text(857,470,`${v('Y')} = 4π${v('r')}${sup('2')}`,40);
d.save('L29_13_bls16_kula');
}
// 14 — Hálfsívalningur. Bakboginn er hulinn; aðeins sýnilegi bogahlutinn er samfelldur.
{
const d=new Diagram(1110,660,'Hálfsívalningsskýli: þvermál 5 m og lengd 12 m');
const cx=290,cy=470,r=205,dx=540,dy=-210;
// Ytra umslag tveggja hálfhringja í skávarpi. Snertilína er reiknuð út frá varpinu.
const norm=Math.hypot(dx,dy),tx=r*dy/norm,ty=-r*dx/norm;
const f=[cx+tx,cy+ty],b=[cx+dx+tx,cy+dy+ty];
d.path(`M ${cx+r} ${cy} L ${cx+dx+r} ${cy+dy} A ${r} ${r} 0 0 0 ${b[0]} ${b[1]} L ${f[0]} ${f[1]} A ${r} ${r} 0 0 0 ${cx-r} ${cy} Z`,C.side);
d.path(`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy} L ${cx-r} ${cy} Z`,C.front);
d.dimH(cx-r,cx+r,cy,535,'þ = 5 m',34).dimSlant([cx+r,cy],[cx+dx+r,cy+dy],60,`${v('L')} = 12 m`,34);
d.save('L29_14_bls20_half_sivalningsskyli');
}
// 15 — Réttur þríhyrningur. Óþekkti geislinn er ekki leystur á myndinni.
{
const d=new Diagram(560,860,'Réttur þríhyrningur: h = 40 cm, s = 41 cm og óþekktur geisli r');
const x=155,y=60,h=700,b=h*9/40;
d.poly([[x,y],[x,y+h],[x+b,y+h]],C.front).right(x,y+h,23);
d.text(80,y+h/2,`${v('h')} = 40 cm`,34,'middle',C.ink,-90);
d.text(325,425,`${v('s')} = 41 cm`,34,'start');
d.text(x+b/2,812,v('r'),40);
d.save('L29_15_bls24_thrihyrningur_keilu');
}
// 16 — Þversnið sívalnings: hæð 24 cm og hornalína 25 cm.
{
const d=new Diagram(610,860,'Rétthyrnt þversnið sívalnings með hæð 24 cm og hornalínu 25 cm');
const x=150,y=60,h=690,b=h*7/24;
d.rect(x,y,b,h,C.front).guide(x,y,x+b,y+h,false).right(x,y+h,22,C.dim);
d.text(78,405,'24 cm',34,'middle',C.ink,-90).text(x+b/2,807,'þ',40);
d.text(460,405,'25 cm',34);
d.arrow(398,405,x+b/2+10,405,false,C.dim,1.9);
d.save('L29_16_bls24_sivalningur_thversnid');
}
// 17 — Hliðarflötur pýramída. h_f er hæð flatarins.
{
const d=new Diagram(750,880,'Jafnarma þríhyrningur: hliðar 26 cm, grunnbrún 20 cm og hæð h_f');
const cx=375,y=55,yb=739,r=285;
d.poly([[cx-r,yb],[cx,y],[cx+r,yb]],C.front);
d.guide(cx,y,cx,yb).right(cx,yb,22);
d.text(cx+35,435,`${v('h')}${sub('f')}`,39,'start',C.blue);
d.text(cx-r/2-38,397,'26 cm',34,'middle',C.ink,-67.38).text(cx+r/2+38,397,'26 cm',34,'middle',C.ink,67.38);
d.text(cx-r/2,806,'10 cm',34).text(cx+r/2,806,'10 cm',34);
d.save('L29_17_bls25_hlidarflotur_pyramida');
}
// 18 — Rúmhornalína kassa. AC er hornalína grunnflatar; AD er rúmhornalína.
{
const d=new Diagram(860,880,'Kassi með málum 12 cm, 9 cm og 20 cm; hornalínur AC og AD');
const A=[120,730],B=[475,730],Cc=[640,610],E=[285,610],F=[120,200],G=[475,200],D=[640,80],H=[285,80];
d.poly([A,B,G,F],C.front).poly([B,Cc,D,G],C.side).poly([F,G,D,H],C.top);
d.hidden(...A,...E).hidden(...E,...Cc).hidden(...E,...H);
d.guide(...A,...Cc,false).line(...A,...D,C.purple,3.4);
d.dot(...A,4,C.ink).dot(...Cc,4,C.ink).dot(...D,4,C.ink);
d.text(88,758,v('A'),36).text(673,625,v('C'),36).text(674,63,v('D'),36);
d.text(297.5,800,'12 cm',34).text(588,716,'9 cm',34,'middle',C.ink,-36.03).text(727,350,'20 cm',34);
d.save('L29_18_bls26_rumhornalina_kassa');
}
// 19 — Keila og hálfkúla með sameiginlegan geisla.
{
const d=new Diagram(820,930,'Keila ofan á hálfkúlu: h = 12 cm, s = 13 cm og sameiginlegur geisli r');
const cx=365,rx=235,yt=65,yj=629,ry=50;
d.path(`M ${cx-rx} ${yj} A ${rx} ${rx} 0 0 0 ${cx+rx} ${yj} Z`,C.side);
d.path(`M ${cx-rx} ${yj} L ${cx} ${yt} L ${cx+rx} ${yj} A ${rx} ${ry} 0 0 1 ${cx-rx} ${yj} Z`,C.front);
d.arc(cx,yj,rx,ry,false,C.hidden,2.1,'9 7');
d.guide(cx,yt,cx,yj).guide(cx,yj,cx+rx,yj,false).right(cx,yj,23);
d.dimV(yt,yj,cx-rx,65,`${v('h')} = 12 cm`,32);
d.text(555,300,`${v('s')} = 13 cm`,32,'start');
d.text(cx+rx/2,yj-30,v('r'),38,'middle',C.blue);
d.save('L29_19_bls27_keila_og_halfkula');
}

async function build() {
for (const f of files) {
  await sharp(path.join(root,'svg',f.name+'.svg'),{density:192}).png().toFile(path.join(root,'myndir',f.name+'.png'));
}
fs.writeFileSync(path.join(root,'frumkodi','myndaskra.json'),JSON.stringify(files,null,2));
const css=`body{margin:0;background:#f3f5f5;color:#303c43;font:17px/1.6 system-ui,sans-serif}main{max-width:1200px;margin:48px auto;padding:0 24px}h1{font:38px Cambria,Georgia,serif;margin:0}header p{max-width:760px;color:#66747c}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{background:#fff;border:1px solid #e0e6e8;margin:0;padding:24px;break-inside:avoid}img{width:100%;height:420px;object-fit:contain}figcaption{border-top:1px solid #e8edef;padding-top:16px;font-size:15px}a{color:#326e8d}.links{display:flex;gap:18px;margin-top:8px}@media(max-width:800px){.grid{grid-template-columns:1fr}img{height:auto}}@media print{body{background:#fff}main{margin:0}.grid{gap:12px}img{height:250px}.links{display:none}}`;
fs.writeFileSync(path.join(root,'Yfirlit.html'),`<!doctype html><html lang="is"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Lota 29 – stílhreinar myndir</title><style>${css}</style></head><body><main><header><h1>Lota 29 · stílhreinar myndir</h1><p>19 rúmfræðimyndir með fínum útlínum, ljósum litaflötum og skýrum málsetningum. Smelltu á mynd til að skoða hana stærri.</p></header><div class="grid">${files.map((f,i)=>`<figure><a href="svg/${f.name}.svg"><img src="svg/${f.name}.svg" alt="${esc(f.title)}"></a><figcaption><strong>${String(i+1).padStart(2,'0')}.</strong> ${esc(f.title)}<div class="links"><a href="myndir/${f.name}.png" download>PNG</a><a href="svg/${f.name}.svg" download>SVG</a></div></figcaption></figure>`).join('')}</div></main></body></html>`);
// Yfirlitsmyndir til sjónrænnar yfirferðar, fjórar myndir á hverri.
async function sheet(indices,out){
const width=1400,height=1120,composite=[];
const shortTitles=['Ferstrendingur','Net tenings','Þrístrendingur','Möttull þrístrendings','Tvö þrep','Sundlaug með hallandi botni','Sívalningur','Möttull sívalnings','Plata rúlluð í sívalning','Pýramídi','Keila','Hylki með keilubotni','Kúla','Hálfsívalningsskýli','Réttur þríhyrningur','Þversnið sívalnings','Hliðarflötur pýramída','Rúmhornalína kassa','Keila og hálfkúla'];
const head=Buffer.from(`<svg width="1400" height="90"><rect width="100%" height="100%" fill="white"/><text x="50" y="52" font-family="Cambria" font-size="31" fill="${C.ink}">Lota 29 · stílhreinar rúmfræðimyndir</text></svg>`);
composite.push({input:head,left:0,top:0});
for(let i=0;i<indices.length;i++) {const f=files[indices[i]],col=i%2,row=Math.floor(i/2),left=col*700,top=90+row*510;
const im=await sharp(path.join(root,'myndir',f.name+'.png')).resize(620,440,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
composite.push({input:im.data,left:left+Math.round((700-im.info.width)/2),top:top+Math.round((440-im.info.height)/2)});
const txt=Buffer.from(`<svg width="700" height="45"><text x="350" y="29" text-anchor="middle" font-family="Cambria" font-size="22" fill="${C.dim}">${String(indices[i]+1).padStart(2,'0')} · ${shortTitles[indices[i]]}</text></svg>`);
composite.push({input:txt,left,top:top+450});}
await sharp({create:{width,height,channels:3,background:'white'}}).composite(composite).png().toFile(out);
}
for(let i=0;i<5;i++)await sheet(Array.from({length:Math.min(4,files.length-i*4)},(_,j)=>i*4+j),path.join(root,`Yfirlit_${i+1}.png`));
await sheet([0,6,10,12],path.join(root,'Lota29_stilsynishorn.png'));
fs.writeFileSync(path.join(root,'LESTU_MIG.txt'),`LOTA 29 – STÍLHREINAR RÚMFRÆÐIMYNDIR\n\n19 endurteiknaðar myndir. Tölur, formúlur og óþekktar stærðir fylgja myndunum sem kennari lagði fram. R táknar rúmmál; þ táknar þvermál. Myndirnar eru skýringarmyndir og ekki ætlaðar til lengdarmælinga.\n\nSKRÁR\nmyndir/: 19 PNG-myndir með hvítum bakgrunni, í góðri upplausn.\nsvg/: sömu 19 myndir sem breytanlegar SVG-vektormyndir.\nYfirlit.html: opnast í vafra án nettengingar, sýnir allar myndir og tengla.\nYfirlit_1.png til Yfirlit_5.png: smækkað yfirlit yfir allt safnið.\nLota29_stilsynishorn.png: fjórar valdar myndir.\nfrumkodi/: Node.js-kóði og myndaskrá. Keyra með Node.js og sharp.\n\nVEFSÍÐAN\nPNG-skrárnar í myndir/ bera nákvæmlega sömu heiti og 19 myndirnar á https://gnajons.github.io/Lota-29/. Þær eru því tilbúnar til að skipta út samsvarandi skrám í myndir/ í GitHub-safninu. Pakkinn hefur ekki sjálfur verið birtur á vefsíðunni.\n\nLETUR OG LITIR\nCambria (vara: Georgia eða serif). Dökkgráar útlínur, ljósblágráir og ljósgrænir fletir. Blátt merkir hjálparlínur, hæðir og geisla. Fjólublátt aðgreinir rúmhornalínu. Engin áferð, vatnsmerki eða skraut.\nSVG notar texta svo auðvelt sé að breyta merkingum. PNG heldur nákvæmlega letrinu sem var notað við útflutning.\n`);
console.log(JSON.stringify({count:files.length,root,files:files.map(x=>x.name)},null,2));
}
build().catch(e=>{console.error(e);process.exit(1)});
