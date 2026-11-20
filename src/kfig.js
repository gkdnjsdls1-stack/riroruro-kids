
/* =========================================================================
   문제 그림 (SVG를 코드로 그림 · q.fig) — 그림이 있어야 교과서처럼 풀 수 있는 단원 위주
   ========================================================================= */
const FC={ink:"#2b1f5c", red:"#ef4b5a", sky:"#4cc3ff", mint:"#2ec4a0", yel:"#ffc93c", pur:"#7b61ff", soft:"#efeaff", paper:"#fffdf6", grid:"#d6cdf0"};
const SV=(w,h,inner,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label||"문제 그림"}" font-family="Jua, Nanum Gothic, sans-serif">${inner}</svg>`;
const T=(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||"middle"}" font-size="${o.fs||16}" fill="${o.c||FC.ink}"${o.b?' font-weight="700"':""}>${s}</text>`;
const fx=n=>Math.round(n*10)/10;
function F(q,fig){ q.fig=fig; return q; }

/* --- 낱개 그림 --- */
function apple(x,y,s=1){ return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="11" fill="${FC.red}" stroke="${FC.ink}" stroke-width="2"/><path d="M0 -11 q2 -6 6 -7" stroke="${FC.ink}" stroke-width="2" fill="none"/><ellipse cx="6" cy="-15" rx="4" ry="2.2" fill="${FC.mint}"/></g>`; }
function dot(x,y,c,r=10,cross){ return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${FC.ink}" stroke-width="2"/>${cross?`<path d="M${x-r} ${y-r} L${x+r} ${y+r} M${x+r} ${y-r} L${x-r} ${y+r}" stroke="${FC.ink}" stroke-width="2.5"/>`:""}`; }
function applesFig(n){ const per=5, rows=Math.ceil(n/per); let s=""; for(let i=0;i<n;i++) s+=apple(30+(i%per)*42, 26+Math.floor(i/per)*40); return SV(230, rows*40+12, s, `사과 그림`); }
function twoRows(a,b){ let s=T(18,32,"가",{fs:18})+T(18,72,"나",{fs:18}); for(let i=0;i<a;i++) s+=dot(48+i*28,26,FC.red); for(let i=0;i<b;i++) s+=dot(48+i*28,66,FC.sky); return SV(48+Math.max(a,b)*28,90,s,"두 줄의 동그라미"); }
function addDots(a,b){ let s=""; for(let i=0;i<a;i++) s+=dot(22+i*26,26,FC.red); const x0=22+a*26+18; s+=T(x0-9,32,"+",{fs:22}); for(let i=0;i<b;i++) s+=dot(x0+14+i*26,26,FC.sky); return SV(x0+14+b*26,52,s,"동그라미 더하기"); }
function subDots(a,b){ let s=""; for(let i=0;i<a;i++) s+=dot(22+i*26,26,FC.yel,10,i>=a-b); return SV(22+a*26,52,s,"동그라미 빼기"); }
function splitDots(n,a){ let s=""; for(let i=0;i<a;i++) s+=dot(22+i*26,30,FC.red); s+=`<line x1="${22+a*26-4}" y1="8" x2="${22+a*26-4}" y2="52" stroke="${FC.ink}" stroke-width="2" stroke-dasharray="4 3"/>`; for(let i=a;i<n;i++) s+=`<circle cx="${22+i*26+6}" cy="30" r="10" fill="none" stroke="${FC.ink}" stroke-width="2" stroke-dasharray="3 3"/>`; return SV(22+n*26+16,60,s,"가르기"); }
function tenFrame(a,b){ let s=""; for(let i=0;i<10;i++){ const x=10+(i%5)*36, y=10+Math.floor(i/5)*36; s+=`<rect x="${x}" y="${y}" width="36" height="36" fill="#fff" stroke="${FC.ink}" stroke-width="2"/>`; if(i<a) s+=dot(x+18,y+18,FC.red,12); else if(i<a+b) s+=dot(x+18,y+18,FC.sky,12); }
  let x2=200; for(let i=10;i<a+b;i++){ const j=i-10; s+=`<rect x="${x2+(j%5)*36}" y="${10+Math.floor(j/5)*36}" width="36" height="36" fill="#fff" stroke="${FC.ink}" stroke-width="2"/>`+dot(x2+(j%5)*36+18,10+Math.floor(j/5)*36+18,FC.sky,12); }
  return SV(a+b>10?390:200,84,s,"열 칸 상자"); }
function bundles(t,o){ let s=""; for(let i=0;i<t;i++){ const x=14+i*30; for(let k=0;k<10;k++) s+=`<rect x="${x+k*2}" y="10" width="2" height="70" fill="#e0a85a"/>`; s+=`<rect x="${x-2}" y="40" width="24" height="7" fill="${FC.red}" stroke="${FC.ink}" stroke-width="1.5"/>`; }
  const x0=14+t*30+12; for(let i=0;i<o;i++) s+=`<rect x="${x0+i*10}" y="10" width="4" height="70" fill="#e0a85a" stroke="#a06b2a" stroke-width=".8"/>`;
  return SV(x0+o*10+12,92,s,"10개씩 묶은 막대와 낱개"); }
function base10(h,t,o){ let s="", x=10; for(let i=0;i<h;i++){ s+=`<g transform="translate(${x} 10)">`; for(let r=0;r<10;r++) for(let c=0;c<10;c++) s+=`<rect x="${c*6}" y="${r*6}" width="6" height="6" fill="${FC.yel}" stroke="#b47a00" stroke-width=".6"/>`; s+=`</g>`; x+=66; }
  for(let i=0;i<t;i++){ for(let r=0;r<10;r++) s+=`<rect x="${x}" y="${10+r*6}" width="6" height="6" fill="${FC.sky}" stroke="#1b7fc0" stroke-width=".6"/>`; x+=10; } x+=6;
  for(let i=0;i<o;i++){ s+=`<rect x="${x+(i%3)*9}" y="${46+Math.floor(i/3)*9}" width="6" height="6" fill="${FC.red}" stroke="#a8231b" stroke-width=".6"/>`; } x+=30;
  return SV(Math.max(x,120),76,s,"백 모형, 십 모형, 일 모형"); }

/* --- 시계 --- */
function clockFig(h,m){ const cx=80,cy=80,R=68; let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${FC.ink}" stroke-width="4"/>`;
  for(let i=1;i<=12;i++){ const a=(i*30-90)*Math.PI/180; s+=T(fx(cx+Math.cos(a)*52),fx(cy+Math.sin(a)*52+6),i,{fs:16}); }
  for(let i=0;i<60;i++){ const a=(i*6-90)*Math.PI/180, r1=i%5?63:59; s+=`<line x1="${fx(cx+Math.cos(a)*r1)}" y1="${fx(cy+Math.sin(a)*r1)}" x2="${fx(cx+Math.cos(a)*67)}" y2="${fx(cy+Math.sin(a)*67)}" stroke="${FC.ink}" stroke-width="${i%5?1:2}"/>`; }
  const ha=((h%12)+m/60)*30-90, ma=m*6-90, P=(a,l)=>[fx(cx+Math.cos(a*Math.PI/180)*l),fx(cy+Math.sin(a*Math.PI/180)*l)];
  const [hx,hy]=P(ha,34),[mx,my]=P(ma,54);
  s+=`<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="${FC.red}" stroke-width="7" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="${FC.ink}" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="5" fill="${FC.ink}"/>`;
  return SV(160,160,s,"시계"); }

/* --- 자 --- */
function rulerFig(s0,e,max){ max=Math.max(max||0,e+1,10); const u=Math.min(26,300/max), W=u*max+30; let s=`<rect x="10" y="52" width="${u*max+10}" height="34" fill="${FC.yel}" stroke="${FC.ink}" stroke-width="2" rx="3"/>`;
  for(let i=0;i<=max;i++){ const x=15+i*u; s+=`<line x1="${fx(x)}" y1="52" x2="${fx(x)}" y2="${i%5?64:70}" stroke="${FC.ink}" stroke-width="1.5"/>`+T(fx(x),82,i,{fs:11}); }
  const x1=15+s0*u, x2=15+e*u; s+=`<rect x="${fx(x1)}" y="20" width="${fx(x2-x1-12)}" height="18" fill="${FC.sky}" stroke="${FC.ink}" stroke-width="2"/><path d="M${fx(x2-12)} 20 L${fx(x2)} 29 L${fx(x2-12)} 38z" fill="#f4d9a6" stroke="${FC.ink}" stroke-width="2"/><rect x="${fx(x1-6)}" y="20" width="6" height="18" fill="${FC.red}" stroke="${FC.ink}" stroke-width="2"/>`;
  s+=`<line x1="${fx(x1)}" y1="38" x2="${fx(x1)}" y2="52" stroke="${FC.ink}" stroke-dasharray="3 2"/><line x1="${fx(x2)}" y1="38" x2="${fx(x2)}" y2="52" stroke="${FC.ink}" stroke-dasharray="3 2"/>`;
  return SV(W,92,s,"자와 연필"); }

/* --- 클립으로 잰 막대 --- */
function clipBars(a,b){ let s=""; [[a,"가",FC.red],[b,"나",FC.sky]].forEach(([n,l,c],k)=>{ const y=18+k*46; s+=T(14,y+14,l,{fs:18}); s+=`<rect x="30" y="${y}" width="${n*26}" height="16" fill="${c}" stroke="${FC.ink}" stroke-width="2" rx="3"/>`; for(let i=0;i<n;i++) s+=`<rect x="${32+i*26}" y="${y+20}" width="22" height="9" rx="4" fill="none" stroke="#8a8fa0" stroke-width="2"/>`; });
  return SV(40+Math.max(a,b)*26,104,s,"클립으로 잰 막대 가와 나"); }

/* --- 그래프 --- */
function barGraph(labels,vals,unit,opt={}){ const n=labels.length, maxV=Math.max(...vals), steps=Math.ceil(maxV/unit)+1, H=150, top=14, base=top+H, bw=40, gap=26, W=48+n*(bw+gap);
  let s=""; for(let i=0;i<=steps;i++){ const y=base-i*H/steps; s+=`<line x1="40" y1="${fx(y)}" x2="${W-6}" y2="${fx(y)}" stroke="${FC.grid}" stroke-width="1"/>`; if(!opt.noAxis) s+=T(34,fx(y+4),i*unit,{a:"end",fs:11}); }
  vals.forEach((v,i)=>{ const x=52+i*(bw+gap), h=v/unit*H/steps; s+=`<rect x="${x}" y="${fx(base-h)}" width="${bw}" height="${fx(h)}" fill="${[FC.red,FC.sky,FC.mint,FC.yel,FC.pur][i%5]}" stroke="${FC.ink}" stroke-width="2"/>`+T(x+bw/2,base+18,labels[i],{fs:13}); });
  s+=`<line x1="40" y1="${base}" x2="${W-6}" y2="${base}" stroke="${FC.ink}" stroke-width="2"/><line x1="40" y1="${top}" x2="40" y2="${base}" stroke="${FC.ink}" stroke-width="2"/>`+T(34,10,opt.ylab||"(명)",{a:"end",fs:11});
  return SV(W,base+28,s,"막대그래프"); }
function lineGraph(labels,vals,ylab){ const n=labels.length, mn=Math.floor((Math.min(...vals)-2)/2)*2, mx=Math.ceil((Math.max(...vals)+2)/2)*2, H=140, top=14, base=top+H, W=60+n*60;
  let s=""; for(let v=mn;v<=mx;v+=2){ const y=base-(v-mn)/(mx-mn)*H; s+=`<line x1="44" y1="${fx(y)}" x2="${W-10}" y2="${fx(y)}" stroke="${FC.grid}"/>`+T(38,fx(y+4),v,{a:"end",fs:10}); }
  const pts=vals.map((v,i)=>[70+i*60, base-(v-mn)/(mx-mn)*H]);
  s+=`<polyline points="${pts.map(p=>p.map(fx).join(",")).join(" ")}" fill="none" stroke="${FC.red}" stroke-width="3"/>`+pts.map((p,i)=>dot(fx(p[0]),fx(p[1]),FC.yel,6)+T(p[0],base+18,labels[i],{fs:13})).join("");
  s+=`<line x1="44" y1="${base}" x2="${W-10}" y2="${base}" stroke="${FC.ink}" stroke-width="2"/><line x1="44" y1="${top}" x2="44" y2="${base}" stroke="${FC.ink}" stroke-width="2"/>`+T(40,10,ylab||"(도)",{a:"end",fs:11});
  return SV(W,base+26,s,"꺾은선그래프"); }
function oGraph(labels,vals){ const n=labels.length, mx=Math.max(...vals), W=70+mx*28; let s="";
  labels.forEach((l,i)=>{ const y=20+i*34; s+=T(30,y+6,l,{fs:15})+`<line x1="56" y1="${y+16}" x2="${W-8}" y2="${y+16}" stroke="${FC.grid}"/>`; for(let k=0;k<vals[i];k++) s+=`<circle cx="${74+k*28}" cy="${y}" r="11" fill="none" stroke="${FC.red}" stroke-width="3"/>`; });
  return SV(W,n*34+14,s,"○ 그래프"); }
function picGraph(big,small){ let s=T(30,40,"우리 반",{fs:14}); for(let i=0;i<big;i++) s+=`<circle cx="${80+i*44}" cy="34" r="18" fill="${FC.sky}" stroke="${FC.ink}" stroke-width="2"/>`+T(80+i*44,40,"10",{fs:13}); for(let i=0;i<small;i++) s+=`<circle cx="${80+big*44+i*26}" cy="40" r="9" fill="${FC.yel}" stroke="${FC.ink}" stroke-width="2"/>`;
  s+=`<circle cx="80" cy="84" r="12" fill="${FC.sky}" stroke="${FC.ink}" stroke-width="2"/>`+T(128,89,"= 10명",{fs:13})+`<circle cx="186" cy="84" r="7" fill="${FC.yel}" stroke="${FC.ink}" stroke-width="2"/>`+T(222,89,"= 1명",{fs:13});
  return SV(Math.max(260,100+big*44+small*26),104,s,"그림그래프"); }
function pieFig(p,label){ const cx=90,cy=90,R=74, a=p/100*2*Math.PI, x=cx+R*Math.sin(a), y=cy-R*Math.cos(a), large=p>50?1:0;
  let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${FC.soft}" stroke="${FC.ink}" stroke-width="2"/><path d="M${cx} ${cy} L${cx} ${cy-R} A${R} ${R} 0 ${large} 1 ${fx(x)} ${fx(y)} Z" fill="${FC.mint}" stroke="${FC.ink}" stroke-width="2"/>`;
  const m=a/2; s+=T(fx(cx+R*0.55*Math.sin(m)),fx(cy-R*0.55*Math.cos(m)),label,{fs:13})+T(fx(cx+R*0.55*Math.sin(m)),fx(cy-R*0.55*Math.cos(m)+16),p+"%",{fs:13,b:1});
  return SV(180,180,s,"원그래프"); }
function bandFig(L,p){ const W=300, w=W*p/100; return SV(320,70,`<rect x="10" y="14" width="${W}" height="34" fill="${FC.soft}" stroke="${FC.ink}" stroke-width="2"/><rect x="10" y="14" width="${fx(w)}" height="34" fill="${FC.yel}" stroke="${FC.ink}" stroke-width="2"/>`+T(10+w/2,36,p+"%",{fs:13,b:1})+T(160,66,`전체 길이 ${L} cm`,{fs:12}),"띠그래프"); }

/* --- 도형 --- */
const regPts=(n,cx,cy,r,rot=-90)=>[...Array(n)].map((_,i)=>{ const a=(rot+i*360/n)*Math.PI/180; return [fx(cx+r*Math.cos(a)),fx(cy+r*Math.sin(a))]; });
const poly=(pts,fill,extra="")=>`<polygon points="${pts.map(p=>p.join(",")).join(" ")}" fill="${fill}" stroke="${FC.ink}" stroke-width="2.5" stroke-linejoin="round" ${extra}/>`;
function polyFig(n,label){ const p=regPts(n,110,86,70); let s=poly(p,FC.soft); if(label){ const mx=(p[0][0]+p[1][0])/2, my=(p[0][1]+p[1][1])/2, dx=mx-110, dy=my-86, d=Math.hypot(dx,dy)||1; s+=T(fx(mx+dx/d*26),fx(my+dy/d*26+5),label,{fs:14,b:1}); } return SV(220,170,s,`${n}각형`); }
function shapesRow(list){ let s="", x=10; list.forEach(([k,lab])=>{ if(k==="tri") s+=poly([[x+40,14],[x+78,82],[x+2,82]],"#ffe1e6"); else if(k==="sq") s+=poly([[x+6,18],[x+74,18],[x+74,82],[x+6,82]],"#e8f7ff"); else if(k==="cir") s+=`<circle cx="${x+40}" cy="50" r="34" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2.5"/>`; else s+=poly(regPts(+k,x+40,50,36),FC.soft); if(lab) s+=T(x+40,104,lab,{fs:14}); x+=92; }); return SV(x,112,s,"도형들"); }
function rightShape(kind){ let s=""; const mark=(x,y,dx,dy)=>`<path d="M${x+dx*12} ${y} L${x+dx*12} ${y+dy*12} L${x} ${y+dy*12}" fill="none" stroke="${FC.red}" stroke-width="2"/>`;
  if(kind==="직사각형") s=poly([[20,20],[200,20],[200,110],[20,110]],"#e8f7ff");
  else if(kind==="정사각형") s=poly([[50,15],[150,15],[150,115],[50,115]],"#e8f7ff");
  else s=poly([[30,20],[30,110],[190,110]],"#ffe1e6");
  return SV(220,130,s,kind); }
function angleFig(v){ const a=v*Math.PI/180, L=120, ox=40+Math.max(0,-L*Math.cos(a)), oy=110; const x=ox+L*Math.cos(a), y=oy-L*Math.sin(a), r=34;
  return SV(fx(ox+L+20),130,`<line x1="${ox}" y1="${oy}" x2="${ox+L}" y2="${oy}" stroke="${FC.ink}" stroke-width="3"/><line x1="${ox}" y1="${oy}" x2="${fx(x)}" y2="${fx(y)}" stroke="${FC.ink}" stroke-width="3"/><path d="M${ox+r} ${oy} A${r} ${r} 0 0 0 ${fx(ox+r*Math.cos(a))} ${fx(oy-r*Math.sin(a))}" fill="none" stroke="${FC.red}" stroke-width="2.5"/>`+T(fx(ox+(r+22)*Math.cos(a/2)),fx(oy-(r+22)*Math.sin(a/2)+5),v+"°",{fs:15,b:1}),`${v}도인 각`); }
function rightSplitFig(a){ const ox=30, oy=120, L=110, t=a*Math.PI/180; return SV(170,140,`<line x1="${ox}" y1="${oy}" x2="${ox+L}" y2="${oy}" stroke="${FC.ink}" stroke-width="3"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy-L}" stroke="${FC.ink}" stroke-width="3"/><line x1="${ox}" y1="${oy}" x2="${fx(ox+L*Math.cos(t))}" y2="${fx(oy-L*Math.sin(t))}" stroke="${FC.ink}" stroke-width="3"/><path d="M${ox+12} ${oy} L${ox+12} ${oy-12} L${ox} ${oy-12}" fill="none" stroke="${FC.red}" stroke-width="2"/>`+T(fx(ox+50*Math.cos(t/2)),fx(oy-50*Math.sin(t/2)+5),a+"°",{fs:14,b:1})+T(fx(ox+50*Math.cos((t+Math.PI/2)/2)),fx(oy-50*Math.sin((t+Math.PI/2)/2)+5),"?",{fs:16,b:1,c:FC.red}),"직각을 나눈 그림"); }
function triAngleFig(A,B,labA,labB,labC){ const ra=A*Math.PI/180, rb=B*Math.PI/180, base=200; const tA=Math.tan(ra), tB=Math.tan(rb); const x=base*tB/(tA+tB), h=x*tA;
  const sc=Math.min(1,110/h), P=[[20,130],[20+base,130],[fx(20+x),fx(130-h*sc)]]; const pts=[P[0],P[1],[P[2][0],P[2][1]]];
  return SV(240,150,poly(pts,"#ffe1e6")+T(P[0][0]+24,124,labA||A+"°",{fs:14,b:1})+T(P[1][0]-24,124,labB||B+"°",{fs:14,b:1})+T(P[2][0],P[2][1]+26,labC||"?",{fs:15,b:1,c:FC.red}),"삼각형 각"); }
function quadAngleFig(a,b,c){ const P=[[30,130],[210,130],[180,30],[60,20]]; return SV(240,150,poly(P,"#e8f7ff")+T(52,122,a+"°",{fs:13,b:1})+T(188,122,b+"°",{fs:13,b:1})+T(168,52,c+"°",{fs:13,b:1})+T(72,44,"?",{fs:15,b:1,c:FC.red})+T(120,148,"(크기는 정확하지 않아요)",{fs:10,c:"#6f6796"}),"사각형 각"); }
function isoFig(t){ const h=Math.min(110,100/Math.tan(t*Math.PI/360)); const P=[[20,130],[220,130],[120,fx(130-Math.min(h,115))]]; return SV(240,150,poly(P,"#ffe1e6")+T(120,P[2][1]+28,t+"°",{fs:14,b:1})+T(48,124,"?",{fs:15,b:1,c:FC.red})+T(192,124,"?",{fs:15,b:1,c:FC.red})+`<path d="M66 ${fx((130+P[2][1])/2+6)} l10 -6 M168 ${fx((130+P[2][1])/2+6)} l10 6" stroke="${FC.ink}" stroke-width="2"/>`,"이등변삼각형"); }
function paraFig(lab1,lab2,angle){ const P=[[20,120],[180,120],[220,30],[60,30]]; let s=poly(P,"#e8f7ff"); if(angle) s+=T(48,112,angle+"°",{fs:14,b:1})+T(176,112,"?",{fs:15,b:1,c:FC.red}); if(lab1) s+=T(100,140,lab1,{fs:13,b:1}); if(lab2) s+=T(222,84,lab2,{fs:13,b:1,a:"start"}); return SV(270,150,s,"평행사변형"); }
function rhombusFig(lab,diag){ const P=[[130,10],[230,80],[130,150],[30,80]]; let s=poly(P,"#fff6d6"); if(diag) s+=`<line x1="130" y1="10" x2="130" y2="150" stroke="${FC.red}" stroke-width="2" stroke-dasharray="5 4"/><line x1="30" y1="80" x2="230" y2="80" stroke="${FC.red}" stroke-width="2" stroke-dasharray="5 4"/>`+T(142,48,diag[0],{fs:13,b:1,a:"start"})+T(180,100,diag[1],{fs:13,b:1}); if(lab) s+=T(196,36,lab,{fs:13,b:1}); return SV(260,160,s,"마름모"); }
function rectFig(wl,hl,fill){ return SV(300,150,poly([[30,20],[220,20],[220,120],[30,120]],fill||"#e8f7ff")+T(125,142,wl,{fs:14,b:1})+T(228,76,hl,{fs:14,b:1,a:"start"}),"직사각형"); }
function triAreaFig(bl,hl){ return SV(260,150,poly([[20,120],[220,120],[150,20]],"#ffe1e6")+`<line x1="150" y1="20" x2="150" y2="120" stroke="${FC.red}" stroke-width="2" stroke-dasharray="5 4"/><path d="M150 108 h-10 v12" fill="none" stroke="${FC.red}" stroke-width="1.5"/>`+T(120,142,bl,{fs:14,b:1})+T(144,76,hl,{fs:14,b:1,a:"end",c:FC.red}),"삼각형 밑변과 높이"); }
function paraAreaFig(bl,hl){ return SV(260,150,poly([[20,120],[180,120],[230,30],[70,30]],"#e8f7ff")+`<line x1="70" y1="30" x2="70" y2="120" stroke="${FC.red}" stroke-width="2" stroke-dasharray="5 4"/>`+T(100,142,bl,{fs:14,b:1})+T(76,82,hl,{fs:14,b:1,a:"start",c:FC.red}),"평행사변형 밑변과 높이"); }
function trapFig(al,bl,hl){ return SV(260,160,poly([[20,130],[230,130],[170,30],[70,30]],"#fff6d6")+`<line x1="70" y1="30" x2="70" y2="130" stroke="${FC.red}" stroke-width="2" stroke-dasharray="5 4"/>`+T(120,22,al,{fs:13,b:1})+T(125,152,bl,{fs:13,b:1})+T(76,86,hl,{fs:13,b:1,a:"start",c:FC.red}),"사다리꼴"); }
function circleFig(kind,lab){ const cx=90,cy=85,R=66; let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="${FC.ink}"/>`;
  if(kind==="r") s+=`<line x1="${cx}" y1="${cy}" x2="${cx+R}" y2="${cy}" stroke="${FC.red}" stroke-width="3"/>`+T(cx+R/2,cy-8,lab,{fs:14,b:1});
  else s+=`<line x1="${cx-R}" y1="${cy}" x2="${cx+R}" y2="${cy}" stroke="${FC.red}" stroke-width="3"/>`+T(cx,cy-8,lab,{fs:14,b:1});
  return SV(180,170,s,"원"); }
function circleRow(r,k){ const R=26; let s=""; for(let i=0;i<k;i++) s+=`<circle cx="${20+R+i*2*R}" cy="40" r="${R}" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2"/><circle cx="${20+R+i*2*R}" cy="40" r="2.5" fill="${FC.ink}"/>`;
  s+=`<line x1="${20+R}" y1="40" x2="${20+2*R}" y2="40" stroke="${FC.red}" stroke-width="2.5"/>`+T(20+R*1.5,34,r+"cm",{fs:12,b:1})+`<path d="M20 80 h${2*R*k}" stroke="${FC.ink}" stroke-width="2" marker-end=""/><path d="M20 74 v12 M${20+2*R*k} 74 v12" stroke="${FC.ink}" stroke-width="2"/>`+T(20+R*k,98,"?",{fs:15,b:1,c:FC.red});
  return SV(40+2*R*k,106,s,"원을 이어 붙인 그림"); }
function cuboidFig(a,b,c,labs){ const W=120,H=70,D=44; const x=62,y=40+D*0.6; const f=[[x,y],[x+W,y],[x+W,y+H],[x,y+H]], o=[D*0.8,-D*0.6];
  const back=f.map(p=>[fx(p[0]+o[0]),fx(p[1]+o[1])]);
  let s=poly(f,"#e8f7ff")+poly([f[0],back[0],back[1],f[1]],"#cdeeff")+poly([f[1],back[1],back[2],f[2]],"#b5e6ff");
  if(labs){ s+=T(x+W/2,y+H+18,labs[0],{fs:13,b:1})+T(x+W+D*0.4+10,y+H-D*0.3+6,labs[1],{fs:13,b:1,a:"start"})+T(x-6,y+H/2+4,labs[2],{fs:13,b:1,a:"end"}); }
  return SV(270,170,s,"직육면체"); }
function prismFig(n,pyr){ const cx=110, Rx=70, Ry=22, yb=150, yt=40; const base=[...Array(n)].map((_,i)=>{ const a=(i*360/n+90)*Math.PI/180; return [fx(cx+Rx*Math.cos(a)),fx(yb+Ry*Math.sin(a))]; });
  let s=""; const front=i=>Math.sin((i*360/n+90)*Math.PI/180)>-0.2;
  if(pyr){ const ap=[cx,25]; s+=poly(base,FC.soft,'fill-opacity=".7"'); base.forEach((p,i)=>{ s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${ap[0]}" y2="${ap[1]}" stroke="${FC.ink}" stroke-width="2" ${front(i)?"":'stroke-dasharray="4 3"'}/>`; }); }
  else { const top=base.map(p=>[p[0],fx(p[1]-(yb-yt))]); s+=poly(base,FC.soft,'fill-opacity=".7"')+poly(top,"#e8f7ff"); base.forEach((p,i)=>{ s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${top[i][0]}" y2="${top[i][1]}" stroke="${FC.ink}" stroke-width="2" ${front(i)?"":'stroke-dasharray="4 3"'}/>`; }); }
  return SV(220,180,s,pyr?"각뿔":"각기둥"); }
function solidsFig(list){ let s="", x=10; list.forEach(k=>{ if(k==="cyl") s+=`<ellipse cx="${x+45}" cy="94" rx="36" ry="11" fill="#cdeeff" stroke="${FC.ink}" stroke-width="2"/><rect x="${x+9}" y="30" width="72" height="64" fill="#cdeeff"/><line x1="${x+9}" y1="30" x2="${x+9}" y2="94" stroke="${FC.ink}" stroke-width="2"/><line x1="${x+81}" y1="30" x2="${x+81}" y2="94" stroke="${FC.ink}" stroke-width="2"/><ellipse cx="${x+45}" cy="30" rx="36" ry="11" fill="#e8f7ff" stroke="${FC.ink}" stroke-width="2"/>`;
    else if(k==="cone") s+=`<ellipse cx="${x+45}" cy="94" rx="36" ry="11" fill="#ffe1e6" stroke="${FC.ink}" stroke-width="2"/><path d="M${x+9} 94 L${x+45} 18 L${x+81} 94" fill="#ffe1e6" stroke="${FC.ink}" stroke-width="2"/>`;
    else if(k==="sph") s+=`<circle cx="${x+45}" cy="62" r="38" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2"/><ellipse cx="${x+45}" cy="62" rx="38" ry="10" fill="none" stroke="${FC.ink}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    else if(k==="box") s+=poly([[x+8,44],[x+70,44],[x+70,104],[x+8,104]],"#e8f7ff")+poly([[x+8,44],[x+26,28],[x+88,28],[x+70,44]],"#cdeeff")+poly([[x+70,44],[x+88,28],[x+88,88],[x+70,104]],"#b5e6ff");
    else if(k==="ball") s+=`<circle cx="${x+45}" cy="64" r="38" fill="#fff" stroke="${FC.ink}" stroke-width="2"/>`+poly(regPts(5,x+45,64,13),FC.ink)+`<path d="M${x+45} 51 L${x+45} 28 M${x+57} 60 l20 -8 M${x+53} 75 l12 18 M${x+37} 75 l-12 18 M${x+33} 60 l-20 -8" stroke="${FC.ink}" stroke-width="2"/>`;
    x+=100; }); return SV(x,120,s,"입체도형"); }
function cylNetFig(r){ return SV(300,200,`<circle cx="130" cy="32" r="26" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2"/><line x1="130" y1="32" x2="156" y2="32" stroke="${FC.red}" stroke-width="2.5"/>`+T(164,36,`반지름 ${r} cm`,{fs:12,b:1,a:"start"})+`<rect x="30" y="58" width="200" height="84" fill="#cdeeff" stroke="${FC.ink}" stroke-width="2"/><circle cx="130" cy="168" r="26" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2"/>`+`<path d="M36 82 H224 M42 76 l-6 6 6 6 M218 76 l6 6 -6 6" fill="none" stroke="${FC.red}" stroke-width="2"/>`+T(130,76,"가로 ?",{fs:13,b:1,c:FC.red})+T(130,118,"옆면",{fs:14}),"원기둥 전개도"); }
function stacksFront(a,b,c){ const u=24, W=Math.max(a,1)*u+40; let s=""; [[a,0],[b,1],[c,2]].forEach(([n,l])=>{ const x0=20+(a-n)*u/2; for(let i=0;i<n;i++) s+=`<rect x="${fx(x0+i*u)}" y="${fx(110-(l+1)*u)}" width="${u}" height="${u}" fill="${["#ffc93c","#4cc3ff","#2ec4a0"][l]}" stroke="${FC.ink}" stroke-width="2"/>`; });
  return SV(W+60,120,s+T(W+30,104,"1층",{fs:12,a:"start"})+T(W+30,80,"2층",{fs:12,a:"start"})+T(W+30,56,"3층",{fs:12,a:"start"}),"층별 쌓기나무"); }
function topView(v){ let s=""; v.forEach((n,i)=>{ const x=20+(i%2)*56, y=14+Math.floor(i/2)*56; s+=`<rect x="${x}" y="${y}" width="56" height="56" fill="#e8f7ff" stroke="${FC.ink}" stroke-width="2"/>`+T(x+28,y+36,n,{fs:22,b:1}); }); return SV(150,140,s,"위에서 본 모양"); }
function fracBar(d,n,lab){ const W=280, w=W/d; let s=""; for(let i=0;i<d;i++) s+=`<rect x="${fx(10+i*w)}" y="14" width="${fx(w)}" height="40" fill="${i<n?FC.yel:"#fff"}" stroke="${FC.ink}" stroke-width="2"/>`; if(lab) s+=T(10+W/2,74,lab,{fs:13}); return SV(300,lab?82:62,s,"분수 막대"); }
function twoFracBars(a,b){ const bar=(d,y,lab)=>{ let s=T(26,y+24,lab,{fs:14,b:1}); const w=230/d; for(let i=0;i<d;i++) s+=`<rect x="${fx(52+i*w)}" y="${y}" width="${fx(w)}" height="34" fill="${i<1?FC.yel:"#fff"}" stroke="${FC.ink}" stroke-width="2"/>`; return s; };
  return SV(300,96,bar(a,8,"1/"+a)+bar(b,54,"1/"+b),"분수 막대 두 개"); }
function groupsFig(a,b){ let s=""; for(let g=0;g<b;g++){ const x=12+g*(a<=3?70:90); s+=`<rect x="${x}" y="8" width="${a<=3?60:80}" height="64" rx="14" fill="#fff6d6" stroke="${FC.ink}" stroke-width="2"/>`; for(let i=0;i<a;i++) s+=dot(x+16+(i%3)*24,26+Math.floor(i/3)*26,FC.red,9); } return SV(12+b*(a<=3?70:90),80,s,"묶음 그림"); }
function ballsFig(a,b,c){ let s=""; const all=[...Array(a).fill(FC.red),...Array(b).fill(FC.sky),...Array(c).fill(FC.yel)]; const r=rng(all.length*31+a); for(let i=all.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [all[i],all[j]]=[all[j],all[i]]; }
  all.forEach((col,i)=>{ s+=dot(22+(i%9)*30,22+Math.floor(i/9)*30,col,11); }); return SV(22+Math.min(9,all.length)*30,Math.ceil(all.length/9)*30+14,s,"빨강·파랑·노랑 공"); }
function gridMoveFig(a,b){ const u=26, W=12*u; let s=""; for(let i=0;i<=12;i++) s+=`<line x1="${10+i*u}" y1="10" x2="${10+i*u}" y2="${10+3*u}" stroke="${FC.grid}"/>`; for(let j=0;j<=3;j++) s+=`<line x1="10" y1="${10+j*u}" x2="${10+W}" y2="${10+j*u}" stroke="${FC.grid}"/>`;
  const x0=10+2*u, y=10+1.5*u; s+=dot(x0,y,FC.red,7)+T(x0,y-12,"처음",{fs:11}); s+=`<path d="M${x0} ${y+14} h${a*u}" stroke="${FC.mint}" stroke-width="3"/><path d="M${x0+a*u-6} ${y+9} l6 5 -6 5" fill="none" stroke="${FC.mint}" stroke-width="3"/>`+T(x0+a*u/2,y+30,`오른쪽 ${a}칸`,{fs:11})+`<path d="M${x0+a*u} ${y-14} h${-b*u}" stroke="${FC.pur}" stroke-width="3"/><path d="M${x0+(a-b)*u+6} ${y-19} l-6 5 6 5" fill="none" stroke="${FC.pur}" stroke-width="3"/>`+T(x0+(a-b/2)*u,y-22,`왼쪽 ${b}칸`,{fs:11});
  return SV(W+20,10+3*u+14,s,"모눈 위 점 옮기기"); }
function flipFig(){ const L=(ox)=>poly([[ox,20],[ox+30,20],[ox+30,70],[ox+60,70],[ox+60,100],[ox,100]],"#cdeeff"); const R=(ox)=>poly([[ox+60,20],[ox+30,20],[ox+30,70],[ox,70],[ox,100],[ox+60,100]],"#ffe1e6");
  return SV(250,130,L(20)+`<path d="M100 60 h40" stroke="${FC.ink}" stroke-width="2.5"/><path d="M134 54 l8 6 -8 6" fill="none" stroke="${FC.ink}" stroke-width="2.5"/>`+R(165)+T(50,122,"처음",{fs:12})+T(195,122,"뒤집은 모양",{fs:12}),"뒤집기"); }
function matchFig(k){ let s=""; for(let i=0;i<k;i++){ const x=20+i*50; s+=`<line x1="${x}" y1="20" x2="${x+50}" y2="20" stroke="#c4521a" stroke-width="5" stroke-linecap="round"/><line x1="${x}" y1="70" x2="${x+50}" y2="70" stroke="#c4521a" stroke-width="5" stroke-linecap="round"/><line x1="${x+50}" y1="20" x2="${x+50}" y2="70" stroke="#c4521a" stroke-width="5" stroke-linecap="round"/>`; } s+=`<line x1="20" y1="20" x2="20" y2="70" stroke="#c4521a" stroke-width="5" stroke-linecap="round"/>`; return SV(40+k*50,90,s,"성냥개비 정사각형"); }
function stonesFig(){ let s=""; [1,3,5,7].forEach((n,k)=>{ const x0=14+k*70; for(let i=0;i<n;i++) s+=dot(x0+((i%2)?14:0)+Math.floor(i/2)*0, 0,"#000",0); }); s="";
  [1,3,5,7].forEach((n,k)=>{ const x0=20+k*78; for(let i=0;i<n;i++){ const row=Math.floor(i/4), col=i%4; s+=dot(x0+col*15,20+row*16,k%2?"#fff":FC.ink,7); } s+=T(x0+22,74,(k+1)+"번째",{fs:11}); }); return SV(330,84,s,"바둑돌 규칙"); }
function objFig(name){ const m={"축구공":["ball"],"구슬":["sph"],"필통":["box"],"주사위":["box"],"음료수 캔":["cyl"],"휴지 심":["cyl"]}; return m[name]?solidsFig(m[name]):""; }
function flatObjFig(name){ if(name==="동전"||name==="접시") return SV(120,110,`<circle cx="60" cy="55" r="44" fill="${name==="동전"?"#ffd34d":"#fff"}" stroke="${FC.ink}" stroke-width="3"/><circle cx="60" cy="55" r="32" fill="none" stroke="${FC.ink}" stroke-width="1.5" stroke-dasharray="3 3"/>`,name);
  if(name==="삼각김밥") return SV(140,120,poly([[70,10],[130,110],[10,110]],"#fff")+`<rect x="30" y="78" width="80" height="32" fill="${FC.ink}"/>`,name);
  return SV(150,120,poly([[20,14],[130,14],[130,106],[20,106]],name==="창문"?"#cdeeff":"#fff6d6")+(name==="창문"?`<line x1="75" y1="14" x2="75" y2="106" stroke="${FC.ink}" stroke-width="2"/><line x1="20" y1="60" x2="130" y2="60" stroke="${FC.ink}" stroke-width="2"/>`:`<line x1="34" y1="14" x2="34" y2="106" stroke="${FC.red}" stroke-width="2"/>`),name); }

/* ===================== 문항에 그림 붙이기 (생성기 교체) ===================== */
const G=(g,u,j,f)=>{ KMATH[g][u].gens[j]=f; };
/* 1학년 */
G(1,0,2,r=>{ const {ri}=mk(r); const n=ri(2,9); return F(KN("9까지의 수",0,"그림의 사과는 몇 개인가요?",n,`하나씩 세면 ${n}개예요.`,"하나, 둘, 셋… 손가락으로 짚으며 세어요."),applesFig(n)); });
G(1,0,3,r=>{ const {ri}=mk(r); const a=ri(2,8); let b=ri(2,8); if(b===a) b=a%8+2; return F(KN("9까지의 수",0,`가는 ${a}개, 나는 ${b}개예요. 더 많은 쪽의 수는?`,Math.max(a,b),`하나씩 짝을 지으면 남는 쪽이 더 많아요 → ${Math.max(a,b)}.`,"위아래로 짝을 지어 봐요."),twoRows(a,b)); });
[0,1,2].forEach(j=>{ const old=KMATH[1][1].gens[j], figs=[["ball","box","cyl"]]; G(1,1,j,r=>F(old(r),solidsFig(["box","ball","cyl"]))); });
G(1,1,3,r=>{ const {pick}=mk(r); const [t,a]=pick([["축구공","공 모양"],["필통","상자 모양"],["음료수 캔","둥근 기둥 모양"],["주사위","상자 모양"],["구슬","공 모양"],["휴지 심","둥근 기둥 모양"]]); return F(KC(r,"입체 모양",3,`${t}은(는) 어떤 모양?`,a,["공 모양","상자 모양","둥근 기둥 모양"].filter(x=>x!==a),`${t}은(는) ${a}이에요.`,"굴러가는지, 쌓이는지 생각해 봐요."),objFig(t)); });
G(1,2,0,r=>{ const {ri}=mk(r); const a=ri(1,6), b=ri(1,9-a); return F(KN("가르기와 모으기",0,`${a} + ${b}`,a+b,`${a}에서 ${b}만큼 더 세면 ${a+b}.`,"그림의 동그라미를 모두 세어 봐요."),addDots(a,b)); });
G(1,2,1,r=>{ const {ri}=mk(r); const a=ri(3,9), b=ri(1,a-1); return F(KN("가르기와 모으기",0,`${a} − ${b}`,a-b,`${a}개 중 ${b}개를 지우면 ${a-b}개 남아요.`,"그림에서 X 표시가 없는 것을 세어요."),subDots(a,b)); });
G(1,2,2,r=>{ const {ri}=mk(r); const n=ri(4,9), a=ri(1,n-1); return F(KN("가르기와 모으기",0,`${n}은(는) ${a}와(과) □로 가를 수 있어요. □는?`,n-a,`${a}와 ${n-a}를 모으면 ${n}.`,"점선 동그라미를 세어 봐요."),splitDots(n,a)); });
G(1,3,1,r=>{ const {ri}=mk(r); const a=ri(3,9); let B=ri(3,9); if(B===a) B=a===9?8:a+1; return F(KC(r,"비교하기",3,`막대 가와 나의 길이를 클립으로 재었어요. 더 긴 막대는?`,a>B?"가":"나",[a>B?"나":"가","둘이 같아요"],`가는 클립 ${a}개, 나는 클립 ${B}개 → 클립이 더 많이 필요한 쪽이 더 길어요.`,"클립 수를 세어 봐요."),clipBars(a,B)); });
G(1,4,0,r=>{ const {ri}=mk(r); const t=ri(1,4), o=ri(1,9); return F(KN("자릿값",0,"그림의 막대는 모두 몇 개인가요? (10개씩 묶음과 낱개)",t*10+o,`10개씩 ${t}묶음 = ${t*10}, 낱개 ${o} → ${t*10+o}.`,"묶음 하나는 10개예요."),bundles(t,o)); });
G(1,5,0,r=>{ const {ri}=mk(r); const t=ri(5,9), o=ri(1,9); return F(KN("자릿값",0,"그림의 막대는 모두 몇 개인가요?",t*10+o,`${t*10} + ${o} = ${t*10+o}.`,"묶음 하나는 10개예요."),bundles(t,o)); });
G(1,7,0,r=>{ const {pick}=mk(r); const [s,n,k]=pick([["세모(△)",3,"tri"],["네모(□)",4,"sq"]]); return F(KN("평면 모양",3,`그림과 같은 ${s} 모양에는 뾰족한 곳(꼭짓점)이 몇 개?`,n,`${s} 모양은 뾰족한 곳이 ${n}개예요.`,"손가락으로 짚어 세어 봐요."),shapesRow([[k,""]])); });
G(1,7,1,r=>F(KC(r,"평면 모양",3,"뾰족한 곳이 없고 둥근 모양은?","동그라미(○)",["세모(△)","네모(□)"],"동그라미는 뾰족한 곳이 하나도 없어요.","그림에서 뾰족한 곳이 없는 것을 찾아요."),shapesRow([["tri","세모"],["sq","네모"],["cir","동그라미"]])));
G(1,7,2,r=>{ const {pick}=mk(r); const [t,a]=pick([["동전","동그라미(○)"],["삼각김밥","세모(△)"],["공책","네모(□)"],["접시","동그라미(○)"],["창문","네모(□)"]]); return F(KC(r,"평면 모양",3,`${t}을(를) 위에서 보면 어떤 모양?`,a,["동그라미(○)","세모(△)","네모(□)"].filter(x=>x!==a),`${t}은(는) ${a} 모양이에요.`,"테두리를 따라 그려 봐요."),flatObjFig(t)); });
G(1,8,0,r=>{ const {ri}=mk(r); const h=ri(1,12); return F(KN("시계 보기",3,"시계가 가리키는 시각은 몇 시인가요?",h,`긴바늘이 12를 가리키면 ‘정각’, 짧은바늘이 가리키는 수가 시예요 → ${h}시.`,"짧은바늘(빨간 바늘)이 ‘시’예요."),clockFig(h,0)); });
G(1,8,1,r=>{ const {ri}=mk(r); const h=ri(1,11); return F(KC(r,"시계 보기",3,"시계가 가리키는 시각은?",`${h}시 30분`,[`${h+1}시 30분`,`${h}시`,`6시 ${h}분`],`긴바늘이 6이면 30분, 짧은바늘이 ${h}와 ${h+1} 사이니까 ${h}시 30분.`,"긴바늘(검은 바늘)이 6이면 30분이에요."),clockFig(h,30)); });
G(1,8,2,r=>{ const {ri}=mk(r); const h=ri(1,10); return F(KN("시계 보기",3,"지금 시계가 가리키는 시각에서 2시간 뒤에는 몇 시?",h+2,`지금은 ${h}시. ${h} + 2 = ${h+2}시.`,"먼저 지금 몇 시인지 읽어요."),clockFig(h,0)); });
G(1,9,0,r=>{ const {ri}=mk(r); const a=ri(5,9), b=ri(11-a,9); return F(KN("받아올림이 있는 덧셈",0,`${a} + ${b}`,a+b,`${a}에 ${10-a}를 더해 10을 만들고, 남은 ${b-(10-a)}를 더하면 ${a+b}.`,"열 칸 상자를 먼저 채워요."),tenFrame(a,b)); });
G(1,9,1,r=>{ const {ri}=mk(r); const a=ri(1,9); return F(KN("가르기와 모으기",0,`${a} + □ = 10. □는?`,10-a,`빈칸 ${10-a}개를 채우면 10.`,"열 칸 상자에서 빈칸을 세어요."),tenFrame(a,0)); });
KMATH[1][10].gens.push(r=>{ return F(KN("수의 규칙 찾기",2,"바둑돌을 1개, 3개, 5개, 7개로 놓았어요. 다음(5번째)에는 몇 개?",9,"2개씩 늘어나요. 7 + 2 = 9.","몇 개씩 늘어나는지 세어 봐요."),stonesFig()); });
G(1,11,1,r=>{ const {ri}=mk(r); const m=ri(1,9); return F(KN("받아내림이 있는 뺄셈",0,`10 − ${m}`,10-m,`${m}과(와) ${10-m}을(를) 모으면 10이니까 ${10-m}.`,"열 칸 상자에서 X를 뺀 나머지를 세어요."),(()=>{ let s=""; for(let i=0;i<10;i++){ const x=10+(i%5)*36,y=10+Math.floor(i/5)*36; s+=`<rect x="${x}" y="${y}" width="36" height="36" fill="#fff" stroke="${FC.ink}" stroke-width="2"/>`+dot(x+18,y+18,FC.red,12,i>=10-m); } return SV(200,84,s,"열 칸 상자 빼기"); })()); });
/* 2학년 */
G(2,0,0,r=>{ const {ri}=mk(r); const h=ri(1,4), t=ri(1,9), o=ri(1,9); return F(KN("자릿값",0,"그림의 수 모형이 나타내는 수는?",h*100+t*10+o,`백 모형 ${h}개 = ${h*100}, 십 모형 ${t}개 = ${t*10}, 일 모형 ${o}개 → ${h*100+t*10+o}.`,"큰 정사각형은 100, 긴 막대는 10, 작은 칸은 1이에요."),base10(h,t,o)); });
G(2,1,0,r=>{ const {pick}=mk(r); const [s,n]=pick([["삼각형",3],["사각형",4],["오각형",5],["육각형",6]]); return F(KN("여러 가지 도형",3,`그림의 ${s}에서 변은 몇 개?`,n,`${s}은(는) 변이 ${n}개, 꼭짓점도 ${n}개예요.`,"곧은 선을 하나씩 세어요."),polyFig(n)); });
G(2,1,1,r=>F(KC(r,"여러 가지 도형",3,"곧은 선(변)과 꼭짓점이 없는 도형은?","원",["삼각형","사각형","오각형"],"원은 곧은 선(변)과 꼭짓점이 없어요.","그림에서 둥근 도형을 찾아요."),shapesRow([["tri","삼각형"],["sq","사각형"],["5","오각형"],["cir","원"]])));
G(2,3,0,r=>{ const {ri}=mk(r); const n=ri(3,11); return F(KN("길이 재기",3,"연필의 길이는 몇 cm인가요?",n,`0에서 ${n}까지 → ${n} cm.`,"연필 끝이 가리키는 눈금을 읽어요."),rulerFig(0,n,12)); });
G(2,3,1,r=>{ const {ri}=mk(r); const s0=ri(1,4), e=s0+ri(3,8); return F(KN("길이 재기",3,"연필의 길이는 몇 cm인가요? (0에서 시작하지 않았어요)",e-s0,`${e} − ${s0} = ${e-s0} cm. 0이 아닌 곳에서 시작하면 빼요.`,"끝 눈금 − 시작 눈금."),rulerFig(s0,e,12)); });
G(2,4,0,r=>{ const {ri}=mk(r); const a=ri(3,7), b=ri(2,6), c=ri(1,5); return F(KN("분류하기",4,"그림의 공을 색깔별로 세어 보세요. 파란 공은 몇 개?",b,`색깔별로 세면 빨강 ${a}, 파랑 ${b}, 노랑 ${c}.`,"하나씩 표시하며 세면 빠뜨리지 않아요."),ballsFig(a,b,c)); });
G(2,5,0,r=>{ const {ri}=mk(r); const a=ri(2,5), b=ri(2,5); return F(KN("곱셈",0,`그림은 ${a}씩 몇 묶음인가요? 모두 몇 개?`,a*b,`${a}씩 ${b}묶음 = ${a} × ${b} = ${a*b}.`,"한 묶음에 몇 개인지 먼저 세어요."),groupsFig(a,b)); });
G(2,9,0,r=>{ const {ri}=mk(r); const h=ri(1,11), n=ri(1,11); return F(KN("시계 보기",3,`시계가 가리키는 시각은 ${h}시 몇 분인가요? (분만 쓰세요)`,n*5,`긴바늘이 ${n}을(를) 가리키면 ${n} × 5 = ${n*5}분.`,"긴바늘이 숫자 하나 갈 때마다 5분이에요."),clockFig(h,n*5)); });
G(2,10,1,r=>{ const {ri}=mk(r); const a=ri(4,8), b=ri(2,a-1), c=ri(1,6); return F(KN("자료의 정리",4,"좋아하는 과일 그래프예요. 사과는 배보다 몇 명 더 많나요?",a-b,`사과 ○ ${a}개, 배 ○ ${b}개 → ${a-b}명.`,"○ 개수를 세어 빼요."),oGraph(["사과","배","포도"],[a,b,c])); });
/* 3학년 */
G(3,1,0,r=>{ const {pick}=mk(r); const [s,n]=pick([["직사각형",4],["정사각형",4],["직각삼각형",1]]); return F(KN("선분과 직각",3,`그림의 ${s}에는 직각이 몇 개 있나요?`,n,`${s}의 직각은 ${n}개예요.`,"모서리마다 직각인지 삼각자를 대 보듯 확인해요."),rightShape(s)); });
G(3,1,3,r=>{ const {ri}=mk(r); const n=ri(3,6); return F(KN("선분과 직각",3,`꼭짓점이 ${n}개인 도형에는 변이 몇 개 있나요?`,n,`꼭짓점 수와 변의 수는 같아요. ${n}개.`,"그림에서 변을 세어 봐요."),polyFig(n)); });
G(3,5,0,r=>{ const {pick}=mk(r); const [a,b]=pick([[2,5],[3,7],[4,9],[2,8],[3,6]]); return F(KC(r,"분수와 소수의 기초",0,`1/${a} 과 1/${b} 중 더 큰 수는?`,`1/${a}`,[`1/${b}`,"둘이 같아요"],`색칠한 부분을 비교하면 1/${a}이(가) 더 커요.`,"그림에서 색칠한 칸의 길이를 비교해요."),twoFracBars(a,b)); });
G(3,5,3,r=>{ const {ri}=mk(r); const d=ri(4,9), n=ri(1,d-1); return F(KN("분수와 소수의 기초",0,`색칠한 부분을 분수 □/${d}로 나타내면 □는?`,n,`${d}칸 중 ${n}칸 → ${n}/${d}.`,"색칠한 칸을 세어요."),fracBar(d,n)); });
G(3,8,0,r=>{ const {ri}=mk(r); const n=ri(3,15); return F(KN("원의 반지름과 지름",3,`반지름이 ${n} cm인 원의 지름은 몇 cm?`,n*2,`지름 = 반지름 × 2 = ${n*2} cm.`,"지름은 반지름 두 개를 이은 길이예요."),circleFig("r",`${n} cm`)); });
G(3,8,1,r=>{ const {ri}=mk(r); const n=ri(3,15); return F(KN("원의 반지름과 지름",3,`지름이 ${n*2} cm인 원의 반지름은 몇 cm?`,n,`반지름 = 지름 ÷ 2 = ${n} cm.`,"반지름은 지름의 반이에요."),circleFig("d",`${n*2} cm`)); });
G(3,8,2,r=>{ const {ri}=mk(r); const n=ri(2,6), k=ri(3,5); return F(KN("원의 반지름과 지름",3,`반지름 ${n} cm인 원 ${k}개를 옆으로 붙여 놓았어요. 전체 길이(?)는 몇 cm?`,n*2*k,`원 하나의 지름 ${n*2} cm × ${k}개 = ${n*2*k} cm.`,"원 하나가 차지하는 길이는 지름이에요."),circleRow(n,k)); });
G(3,11,2,r=>{ const {ri}=mk(r); const big=ri(2,4), small=ri(1,5); return F(KN("자료의 정리",4,"그림그래프를 보고 우리 반 학생 수를 구하세요.",big*10+small,`큰 그림 ${big}개 = ${big*10}명, 작은 그림 ${small}개 = ${small}명 → ${big*10+small}명.`,"큰 그림 하나가 10명이에요."),picGraph(big,small)); });
/* 4학년 */
G(4,1,0,r=>{ const {ri}=mk(r); const a=ri(40,80), b=ri(40,Math.min(85,170-a-10)); return F(KN("삼각형의 내각의 합",3,`삼각형의 두 각이 ${a}°, ${b}°일 때 나머지 한 각(?)은 몇 도?`,180-a-b,`삼각형 세 각의 합은 180°. 180 − ${a} − ${b} = ${180-a-b}.`,"세 각을 더하면 180°예요."),triAngleFig(a,b)); });
G(4,1,1,r=>{ const {ri}=mk(r); const a=ri(70,110), b=ri(60,100), c=ri(70,110); return F(KN("각도",3,`사각형의 세 각이 ${a}°, ${b}°, ${c}°일 때 나머지 한 각(?)은 몇 도?`,360-a-b-c,`사각형 네 각의 합은 360°. 360 − ${a+b+c} = ${360-a-b-c}.`,"사각형은 삼각형 2개로 나눌 수 있어요."),quadAngleFig(a,b,c)); });
G(4,1,2,r=>{ const {ri,pick}=mk(r); const t=pick(["예","둔"]), v=t==="예"?ri(20,85):ri(95,170); return F(KC(r,"각도",3,`그림처럼 ${v}°인 각은 어떤 각인가요?`,t==="예"?"예각":"둔각",[t==="예"?"둔각":"예각","직각","평각"],`0°보다 크고 90°보다 작으면 예각, 90°보다 크고 180°보다 작으면 둔각이에요.`,"직각(90°)보다 벌어졌는지 봐요."),angleFig(v)); });
G(4,1,3,r=>{ const {ri}=mk(r); const a=ri(25,65); return F(KN("각도",3,`직각을 두 각으로 나눴더니 한 각이 ${a}°예요. 다른 한 각(?)은?`,90-a,`직각 = 90°. 90 − ${a} = ${90-a}.`,"직각은 90°예요."),rightSplitFig(a)); });
G(4,3,2,r=>F(KC(r,"평면도형의 이동",3,"도형을 오른쪽으로 뒤집으면 무엇이 바뀌나요?","왼쪽과 오른쪽",["위와 아래","크기","색깔"],"오른쪽(왼쪽)으로 뒤집으면 왼쪽과 오른쪽이 바뀌어요.","그림의 처음 모양과 뒤집은 모양을 비교해요."),flipFig()));
G(4,3,3,r=>{ const {ri}=mk(r); const a=ri(4,8), b=ri(1,a-1); return F(KN("평면도형의 이동",3,`점을 오른쪽으로 ${a}칸 민 다음, 다시 왼쪽으로 ${b}칸 밀었어요. 처음 자리보다 오른쪽으로 몇 칸에 있나요?`,a-b,`${a} − ${b} = ${a-b}칸 오른쪽.`,"오른쪽은 더하고 왼쪽은 빼요."),gridMoveFig(a,b)); });
G(4,4,0,r=>{ const {ri}=mk(r); const v=[ri(4,14),ri(4,14),ri(4,14),ri(4,14)]; const mx=Math.max(...v), mn=Math.min(...v); return F(KN("막대그래프",4,"취미 조사 막대그래프예요. 가장 긴 막대와 가장 짧은 막대는 몇 명 차이?",mx-mn,`가장 많은 ${mx}명 − 가장 적은 ${mn}명 = ${mx-mn}.`,"세로 눈금을 읽어 가장 큰 값과 작은 값을 찾아요."),barGraph(["운동","독서","게임","그림"],v,2)); });
G(4,4,1,r=>{ const {ri}=mk(r); const u=ri(2,5), k=ri(3,8); return F(KN("막대그래프",4,`세로 눈금 한 칸이 ${u}명이에요. 막대가 나타내는 수는 몇 명?`,u*k,`${k}칸 × ${u}명 = ${u*k}명.`,"칸 수 × 한 칸의 크기."),barGraph(["우리 반"],[u*k],u,{noAxis:true})); });
G(4,5,2,r=>F(KN("수의 규칙 찾기",2,"바둑돌을 1개, 3개, 5개, 7개 … 로 놓아요. 6번째에는 몇 개?",11,"2개씩 늘어나요. 1, 3, 5, 7, 9, 11 → 11개.","몇 개씩 늘어나는지 봐요."),stonesFig()));
G(4,7,0,r=>{ const {ri}=mk(r); const t=ri(4,14)*10; return F(KN("삼각형의 분류",3,`이등변삼각형에서 꼭지각이 ${t}°이면 한 밑각(?)은?`,(180-t)/2,`(180 − ${t}) ÷ 2 = ${(180-t)/2}°.`,"두 밑각은 크기가 같아요."),isoFig(t)); });
G(4,7,3,r=>{ const {pick}=mk(r); const [a,ans]=pick([[[50,60,70],"예각삼각형"],[[30,50,100],"둔각삼각형"],[[40,50,90],"직각삼각형"],[[20,35,125],"둔각삼각형"]]); return F(KC(r,"삼각형의 분류",3,`세 각이 ${a.join("°, ")}°인 삼각형은?`,ans,["예각삼각형","둔각삼각형","직각삼각형"].filter(x=>x!==ans),`가장 큰 각이 90°보다 작으면 예각, 90°면 직각, 90°보다 크면 둔각삼각형이에요.`,"가장 큰 각을 봐요."),triAngleFig(a[0],a[1],a[0]+"°",a[1]+"°",a[2]+"°")); });
G(4,9,0,r=>{ const {ri}=mk(r); const a=ri(55,85); return F(KN("여러 가지 사각형",3,`평행사변형에서 한 각이 ${a}°이면 이웃한 각(?)은?`,180-a,`이웃한 두 각의 합은 180°. 180 − ${a} = ${180-a}°.`,"이웃한 두 각을 더하면 180°."),paraFig(null,null,a)); });
G(4,9,1,r=>{ const {ri}=mk(r); const s=ri(3,15); return F(KN("여러 가지 사각형",3,`한 변이 ${s} cm인 마름모의 네 변의 길이의 합은?`,s*4,`마름모는 네 변이 같아요. ${s} × 4 = ${s*4}.`,"네 변이 모두 같아요."),rhombusFig(`${s} cm`)); });
G(4,9,3,r=>{ const {ri}=mk(r); const a=ri(5,14), b=ri(3,a-1); return F(KN("여러 가지 사각형",3,`평행사변형의 두 변이 ${a} cm, ${b} cm예요. 네 변의 길이의 합은?`,2*(a+b),`마주 보는 변의 길이가 같아요. (${a} + ${b}) × 2 = ${2*(a+b)}.`,"마주 보는 변끼리 같아요."),paraFig(`${a} cm`,`${b} cm`)); });
G(4,10,0,r=>{ const {ri}=mk(r); const t=[ri(2,8)]; for(let i=0;i<3;i++) t.push(t[i]+ri(2,7)); const m=["3월","4월","5월","6월"]; let d=[1,2,3].map(i=>t[i]-t[i-1]); let mx=d.indexOf(Math.max(...d)); if(d.filter(x=>x===d[mx]).length>1){ for(let i=mx+1;i<4;i++) t[i]++; } d=[1,2,3].map(i=>t[i]-t[i-1]); const k=d.indexOf(Math.max(...d)); const opts=[0,1,2].map(i=>`${m[i]}~${m[i+1]}`); return F(KC(r,"꺾은선그래프",4,"월별 기온 꺾은선그래프예요. 기온이 가장 많이 오른 때는?",opts[k],opts.filter((_,i)=>i!==k),`이웃한 달의 차: ${d.join(", ")}도. 가장 큰 차는 ${opts[k]}.`,"선이 가장 가파르게 올라간 곳을 찾아요."),lineGraph(m,t)); });
G(4,11,1,r=>{ const {ri}=mk(r); const n=ri(5,8), s=ri(3,12); const nm={5:"정오각형",6:"정육각형",7:"정칠각형",8:"정팔각형"}[n]; return F(KN("다각형과 대각선",3,`한 변이 ${s} cm인 ${nm}의 둘레는?`,n*s,`변이 ${n}개, ${s} × ${n} = ${n*s} cm.`,"정다각형은 변이 모두 같아요."),polyFig(n,`${s} cm`)); });
G(4,11,0,r=>{ const {ri}=mk(r); const n=ri(4,8); const nm={4:"사각형",5:"오각형",6:"육각형",7:"칠각형",8:"팔각형"}[n]; return F(KN("다각형과 대각선",3,`${nm}의 대각선은 모두 몇 개?`,n*(n-3)/2,`한 꼭짓점에서 ${n-3}개씩, ${n}개 꼭짓점 → ${n}×${n-3}÷2 = ${n*(n-3)/2}개(두 번 센 것 나누기).`,"그림에 직접 대각선을 그어 봐도 좋아요."),polyFig(n)); });
/* 5학년 */
G(5,2,3,r=>{ const {ri}=mk(r); const n=ri(5,15); return F(KN("규칙과 대응",2,`성냥개비로 정사각형을 옆으로 이어 붙여요. 1개는 4개, 2개는 7개, 3개는 10개(그림). 정사각형 ${n}개는 성냥개비 몇 개?`,3*n+1,`3개씩 늘어나요 → 3 × ${n} + 1 = ${3*n+1}.`,"정사각형이 하나 늘 때 성냥개비는 몇 개 느는지 봐요."),matchFig(3)); });
G(5,5,0,r=>{ const {ri}=mk(r); const a=ri(3,15), b=ri(2,12); return F(KN("직사각형의 둘레",3,`가로 ${a} cm, 세로 ${b} cm인 직사각형의 둘레는?`,2*(a+b),`(${a} + ${b}) × 2 = ${2*(a+b)} cm.`,"가로와 세로가 두 번씩 있어요."),rectFig(`${a} cm`,`${b} cm`)); });
G(5,5,1,r=>{ const {ri}=mk(r); const a=ri(3,15), b=ri(2,12); return F(KN("직사각형의 넓이",3,`가로 ${a} cm, 세로 ${b} cm인 직사각형의 넓이는 몇 cm²?`,a*b,`가로 × 세로 = ${a*b} cm².`,"1 cm² 정사각형이 몇 개 들어가는지 생각해요."),rectFig(`${a} cm`,`${b} cm`,"#fff6d6")); });
G(5,5,2,r=>{ const {ri}=mk(r); const a=ri(3,14), h=ri(2,10)*2; return F(KN("삼각형의 넓이",3,`밑변 ${a} cm, 높이 ${h} cm인 삼각형의 넓이는 몇 cm²?`,a*h/2,`밑변 × 높이 ÷ 2 = ${a*h/2}.`,"같은 평행사변형의 반이에요."),triAreaFig(`${a} cm`,`${h} cm`)); });
G(5,5,3,r=>{ const {ri}=mk(r); const a=ri(3,12), h=ri(2,10); return F(KN("평행사변형의 넓이",3,`밑변 ${a} cm, 높이 ${h} cm인 평행사변형의 넓이는 몇 cm²?`,a*h,`밑변 × 높이 = ${a*h}.`,"잘라 붙이면 직사각형이 돼요."),paraAreaFig(`${a} cm`,`${h} cm`)); });
G(5,5,4,r=>{ const {ri}=mk(r); const a=ri(3,9), b=ri(a+1,14), h=ri(2,8)*2; return F(KN("사다리꼴과 마름모의 넓이",3,`윗변 ${a} cm, 아랫변 ${b} cm, 높이 ${h} cm인 사다리꼴의 넓이는 몇 cm²?`,(a+b)*h/2,`(윗변 + 아랫변) × 높이 ÷ 2 = (${a}+${b}) × ${h} ÷ 2 = ${(a+b)*h/2}.`,"똑같은 사다리꼴 두 개를 붙이면 평행사변형이에요."),trapFig(`${a} cm`,`${b} cm`,`${h} cm`)); });
G(5,5,5,r=>{ const {ri}=mk(r); const p=ri(2,9)*2, q=ri(3,12); return F(KN("사다리꼴과 마름모의 넓이",3,`두 대각선이 ${p} cm, ${q} cm인 마름모의 넓이는 몇 cm²?`,p*q/2,`대각선 × 대각선 ÷ 2 = ${p*q/2}.`,"마름모를 둘러싼 직사각형의 반이에요."),rhombusFig(null,[`${p} cm`,`${q} cm`])); });
G(5,10,1,r=>{ const {ri}=mk(r); const s=ri(2,12); return F(KN("직육면체와 정육면체",3,`한 모서리가 ${s} cm인 정육면체의 모든 모서리 길이의 합은?`,12*s,`모서리 12개 × ${s} = ${12*s} cm.`,"그림에서 모서리를 세어 보면 12개예요."),cuboidFig(s,s,s,[`${s} cm`,`${s} cm`,`${s} cm`])); });
G(5,10,3,r=>{ const {ri}=mk(r); const a=ri(2,9), b=ri(2,9), c=ri(2,9); return F(KN("직육면체와 정육면체",3,`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 모든 모서리 길이의 합은?`,4*(a+b+c),`같은 길이 모서리가 4개씩: (${a}+${b}+${c}) × 4 = ${4*(a+b+c)}.`,"같은 길이의 모서리가 4개씩 있어요."),cuboidFig(a,b,c,[`${a} cm`,`${b} cm`,`${c} cm`])); });
/* 6학년 */
G(6,1,0,r=>{ const {ri,pick}=mk(r); const n=ri(3,8), w=pick([["꼭짓점",2*n],["모서리",3*n],["면",n+2]]); const nm={3:"삼",4:"사",5:"오",6:"육",7:"칠",8:"팔"}[n]+"각기둥"; return F(KN("각기둥과 각뿔",3,`그림의 ${nm}에서 ${w[0]}은(는) 몇 개?`,w[1],`□각기둥: 꼭짓점 □×2, 모서리 □×3, 면 □+2. → ${w[1]}.`,"밑면 2개와 옆면을 생각해요."),prismFig(n,false)); });
G(6,1,1,r=>{ const {ri,pick}=mk(r); const n=ri(3,8), w=pick([["꼭짓점",n+1],["모서리",2*n],["면",n+1]]); const nm={3:"삼",4:"사",5:"오",6:"육",7:"칠",8:"팔"}[n]+"각뿔"; return F(KN("각기둥과 각뿔",3,`그림의 ${nm}에서 ${w[0]}은(는) 몇 개?`,w[1],`□각뿔: 꼭짓점 □+1, 모서리 □×2, 면 □+1. → ${w[1]}.`,"밑면 1개와 뾰족한 꼭짓점을 생각해요."),prismFig(n,true)); });
G(6,4,0,r=>{ const {ri,pick}=mk(r); const t=ri(2,8)*100, p=pick([10,15,20,25,30,35,40]); return F(KN("비율그래프",4,`전체 ${t}명을 조사한 원그래프에서 ‘축구’가 ${p}%예요. 축구를 좋아하는 학생은?`,t*p/100,`${t} × ${p}/100 = ${t*p/100}명.`,"전체 × 백분율."),pieFig(p,"축구")); });
G(6,4,1,r=>{ const {pick}=mk(r); const [L,p]=pick([[20,25],[10,30],[20,15],[10,40],[15,20]]); return F(KN("비율그래프",4,`길이 ${L} cm 띠그래프에서 ${p}%인 항목의 길이는 몇 cm?`,kfix(L*p/100,1),`${L} × ${p}/100 = ${kfix(L*p/100,1)} cm.`,"띠 전체 길이가 100%예요."),bandFig(L,p)); });
G(6,5,0,r=>{ const {ri}=mk(r); const a=ri(2,9), b=ri(2,9), c=ri(2,9); return F(KN("직육면체의 부피",3,`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 부피는 몇 cm³?`,a*b*c,`${a} × ${b} × ${c} = ${a*b*c}.`,"가로 × 세로 × 높이."),cuboidFig(a,b,c,[`${a} cm`,`${b} cm`,`${c} cm`])); });
G(6,5,1,r=>{ const {ri}=mk(r); const a=ri(2,8), b=ri(2,8), c=ri(2,8); return F(KN("직육면체의 겉넓이",3,`가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 겉넓이는 몇 cm²?`,2*(a*b+b*c+a*c),`(${a*b} + ${b*c} + ${a*c}) × 2 = ${2*(a*b+b*c+a*c)}.`,"서로 다른 세 면의 넓이를 두 번씩 더해요."),cuboidFig(a,b,c,[`${a} cm`,`${b} cm`,`${c} cm`])); });
G(6,8,0,r=>{ const {ri}=mk(r); const a=ri(4,7), b=ri(2,a-1), c=ri(1,b-1); return F(KN("쌓기나무",3,"쌓기나무를 그림처럼 쌓았어요(앞에서 본 모양, 층마다 한 줄). 모두 몇 개?",a+b+c,`1층 ${a} + 2층 ${b} + 3층 ${c} = ${a+b+c}.`,"층별로 세어 더해요."),stacksFront(a,b,c)); });
G(6,8,1,r=>{ const {ri}=mk(r); const v=[ri(1,3),ri(1,3),ri(1,3),ri(1,3)]; return F(KN("쌓기나무",3,"위에서 본 모양의 각 칸에 쌓인 개수를 적었어요. 쌓기나무는 모두 몇 개?",v.reduce((a,b)=>a+b,0),`${v.join(" + ")} = ${v.reduce((a,b)=>a+b,0)}.`,"칸에 적힌 수를 모두 더해요."),topView(v)); });
G(6,10,0,r=>{ const {ri}=mk(r); const d=ri(2,12)*2; return F(KN("원주와 원주율",3,`지름이 ${d} cm인 원의 원주는? (원주율 3.14)`,kfix(d*3.14,2),`원주 = 지름 × 3.14 = ${kfix(d*3.14,2)} cm.`,"원주 = 지름 × 원주율."),circleFig("d",`${d} cm`)); });
G(6,10,2,r=>{ const {ri}=mk(r); const rr=ri(2,10); return F(KN("원의 넓이",3,`반지름 ${rr} cm인 원의 넓이는 몇 cm²? (원주율 3.14)`,kfix(rr*rr*3.14,2),`반지름 × 반지름 × 3.14 = ${kfix(rr*rr*3.14,2)}.`,"원의 넓이 = 반지름 × 반지름 × 원주율."),circleFig("r",`${rr} cm`)); });
G(6,11,0,r=>{ const {ri}=mk(r); const rr=ri(2,8); return F(KN("원기둥·원뿔·구",3,`반지름 ${rr} cm인 원기둥의 전개도에서 옆면의 가로(?)는 몇 cm? (원주율 3.14)`,kfix(rr*2*3.14,2),`옆면의 가로 = 밑면의 원주 = ${rr*2} × 3.14 = ${kfix(rr*2*3.14,2)}.`,"옆면을 감으면 밑면 둘레와 꼭 맞아요."),cylNetFig(rr)); });
G(6,11,1,r=>F(KC(r,"원기둥·원뿔·구",3,"그림의 입체도형 중 뾰족한 꼭짓점이 있는 것은?","원뿔",["원기둥","구","삼각기둥"],"원뿔은 꼭짓점이 1개 있어요. 원기둥과 구는 없어요.","뾰족한 곳을 찾아요."),solidsFig(["cyl","cone","sph"])));
