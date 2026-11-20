
/* =========================================================================
   과학 3~6학년 — 2022 개정 교육과정 단원 (2025~2026 교과서)
   3·4학년 1학기, 5·6학년 단원명은 경기도교육청 수업-평가 계획 예시 자료 기준,
   3·4학년 2학기는 성취기준 영역(물체와 물질, 지구와 바다 …)으로 구성 — 출판사마다 순서가 조금 다를 수 있어요.
   ========================================================================= */

/* ---------- 과학 그림 ---------- */
const SC={sun:"#ffb703", blu:"#4c8dff", red:"#ef4b5a", brn:"#b07a4a", grn:"#3fb37f", dk:"#2b1f5c", sea:"#5bc0eb", sand:"#f3d9a4", gray:"#c9c3dc"};
const box=(x,y,w,h,s,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx??8}" fill="${o.f||"#fff"}" stroke="${FC.ink}" stroke-width="2"/>`+(s!=null?T(x+w/2,y+h/2+6,s,{fs:o.fs||15,c:o.c}):"");
const arrowR=(x1,y,x2)=>`<path d="M${x1} ${y} L${x2-6} ${y}" stroke="${FC.ink}" stroke-width="2.5"/><path d="M${x2-9} ${y-5} L${x2} ${y} L${x2-9} ${y+5}" fill="${FC.ink}"/>`;
function chainFig(items,label){ const w=items.length*74+(items.length-1)*14; let s="", x=6;
  items.forEach((it,i)=>{ s+=box(x,14,70,40,it,{f:it==="?"?FC.yel:"#fff",fs:it.length>4?12:15}); if(i<items.length-1) s+=arrowR(x+70,34,x+84); x+=84; });
  return SV(w+12,68,s,label||"순서 그림"); }
function magnetFig(a,b){ const bar=(x,l,r)=>`<rect x="${x}" y="20" width="60" height="34" fill="${l==="N"?SC.red:SC.blu}" stroke="${FC.ink}" stroke-width="2"/><rect x="${x+60}" y="20" width="60" height="34" fill="${r==="N"?SC.red:SC.blu}" stroke="${FC.ink}" stroke-width="2"/>`+T(x+30,43,l,{c:"#fff",fs:18})+T(x+90,43,r,{c:"#fff",fs:18});
  return SV(300,74,bar(10,a[0],a[1])+bar(170,b[0],b[1])+`<path d="M138 37 h24" stroke="${FC.ink}" stroke-width="2" stroke-dasharray="4 3"/>`,"두 자석"); }
function insectFig(){ return SV(300,120,
  `<ellipse cx="80" cy="60" rx="26" ry="22" fill="${SC.grn}" stroke="${FC.ink}" stroke-width="2"/><ellipse cx="140" cy="60" rx="30" ry="24" fill="${SC.grn}" stroke="${FC.ink}" stroke-width="2"/><ellipse cx="215" cy="60" rx="46" ry="28" fill="${SC.grn}" stroke="${FC.ink}" stroke-width="2"/>`+
  [125,140,155].map(x=>`<path d="M${x} 80 l-10 26 M${x} 40 l-10 -26" stroke="${FC.ink}" stroke-width="2.5" fill="none"/>`).join("")+
  `<path d="M66 42 q-10 -22 -26 -26 M76 40 q-2 -24 -14 -32" stroke="${FC.ink}" stroke-width="2" fill="none"/>`+T(80,66,"가",{fs:17,c:"#fff"})+T(140,66,"나",{fs:17,c:"#fff"})+T(215,66,"다",{fs:17,c:"#fff"}),"곤충의 몸"); }
function moonFig(ph){ const cx=60,cy=55,r=40; const lit=SC.sun, dark="#3a3264"; let p="";
  if(ph==="보름달") p=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${lit}"/>`;
  else { const right=(ph==="초승달"||ph==="상현달"); const half=(ph==="상현달"||ph==="하현달"); const s1=right?1:0;
    p= half ? `<path d="M${cx} ${cy-r} A${r} ${r} 0 0 ${s1} ${cx} ${cy+r} Z" fill="${lit}"/>`
            : `<path d="M${cx} ${cy-r} A${r} ${r} 0 0 ${s1} ${cx} ${cy+r} A${r*0.62} ${r} 0 0 ${1-s1} ${cx} ${cy-r} Z" fill="${lit}"/>`; }
  return SV(120,112,`<rect width="120" height="112" rx="12" fill="#1d1640"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark}"/>${p}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8d84c0" stroke-width="1.5"/>`,"밤하늘의 달"); }
function layersFig(labels){ const cols=[SC.sand,"#d9a066",SC.gray,"#e8c99b"]; let s="";
  labels.forEach((l,i)=>{ const y=10+i*28; s+=`<path d="M10 ${y+ (i%2?3:0)} Q90 ${y-6} 170 ${y+2} T300 ${y} V${y+28} H10 Z" fill="${cols[i%4]}" stroke="${FC.ink}" stroke-width="1.6"/>`+T(26,y+20,l,{fs:15,b:true}); });
  return SV(310,10+labels.length*28+6,s,"지층"); }
function volcanoFig(){ return SV(300,150,`<path d="M20 140 L120 40 L180 40 L280 140 Z" fill="${SC.brn}" stroke="${FC.ink}" stroke-width="2"/><path d="M140 40 q-4 -18 10 -30 q10 10 6 30" fill="${SC.red}"/><path d="M180 40 q18 30 40 52" stroke="${SC.red}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="150" cy="132" rx="50" ry="12" fill="${SC.red}" stroke="${FC.ink}" stroke-width="1.5"/><path d="M150 120 V46" stroke="${SC.red}" stroke-width="7"/>`+T(150,137,"㉠",{fs:16,c:"#fff",b:true})+T(244,90,"㉡",{fs:16,b:true}),"화산"); }
function circuitFig(par){ const bulb=(x,y)=>`<circle cx="${x}" cy="${y}" r="14" fill="#fff6c2" stroke="${FC.ink}" stroke-width="2"/><path d="M${x-6} ${y+3} l6 -7 l6 7" stroke="${FC.ink}" stroke-width="1.6" fill="none"/>`;
  let s=`<path d="M40 140 V30 H260 V140 Z" stroke="${FC.ink}" stroke-width="2.4" fill="none"/>`;
  if(par) s+=`<path d="M170 30 V140" stroke="${FC.ink}" stroke-width="2.4"/>`+bulb(170,85)+bulb(260,85);
  else s+=bulb(120,30)+bulb(200,30);
  s+=`<rect x="22" y="68" width="36" height="44" rx="4" fill="${SC.sun}" stroke="${FC.ink}" stroke-width="2"/>`+T(40,95,"전지",{fs:11});
  return SV(300,156,s,"전기 회로"); }
function lensFig(order){ const L=(x,k)=> k==="볼록"? `<path d="M${x} 20 Q${x+28} 70 ${x} 120 Q${x-28} 70 ${x} 20 Z" fill="#cfeeff" stroke="${FC.ink}" stroke-width="2"/>` : `<path d="M${x-16} 20 H${x+16} Q${x+4} 70 ${x+16} 120 H${x-16} Q${x-4} 70 ${x-16} 20 Z" fill="#cfeeff" stroke="${FC.ink}" stroke-width="2"/>`;
  return SV(240,150,L(70,order[0])+L(170,order[1])+T(70,142,"가",{b:true})+T(170,142,"나",{b:true}),"렌즈 두 개"); }
function prismFig(){ const cols=["#ef4b5a","#ff8c42","#ffc93c","#3fb37f","#4c8dff","#3a3ab0","#7b61ff"]; let s=`<path d="M10 70 L120 70" stroke="#fff3b0" stroke-width="6"/><path d="M10 70 L120 70" stroke="${FC.ink}" stroke-width="1"/><path d="M110 120 L150 30 L190 120 Z" fill="#e6f6ff" stroke="${FC.ink}" stroke-width="2"/>`;
  cols.forEach((c,i)=>{ s+=`<path d="M170 78 L290 ${50+i*10}" stroke="${c}" stroke-width="5"/>`; }); return SV(300,140,s+T(40,58,"햇빛",{fs:13}),"프리즘"); }
function shadowFig(){ return SV(300,120,`<circle cx="30" cy="60" r="14" fill="${SC.sun}" stroke="${FC.ink}" stroke-width="2"/>`+T(30,96,"손전등",{fs:12})+`<path d="M44 60 L264 20 M44 60 L264 100" stroke="#ffe08a" stroke-width="1.5" stroke-dasharray="5 4"/><rect x="128" y="44" width="16" height="32" fill="${SC.blu}" stroke="${FC.ink}" stroke-width="2"/>`+T(136,96,"물체",{fs:12})+`<rect x="262" y="10" width="10" height="100" fill="${SC.gray}" stroke="${FC.ink}" stroke-width="2"/><rect x="262" y="34" width="10" height="52" fill="${FC.ink}"/>`+T(267,118,"스크린",{fs:12}),"그림자 만들기"); }
function seesawFig(heavyLeft){ const a=heavyLeft?-9:9; return SV(300,110,`<g transform="rotate(${a} 150 60)"><rect x="20" y="56" width="260" height="8" rx="3" fill="${SC.brn}" stroke="${FC.ink}" stroke-width="2"/><rect x="40" y="32" width="34" height="24" fill="${SC.sea}" stroke="${FC.ink}" stroke-width="2"/><rect x="226" y="32" width="34" height="24" fill="${FC.yel}" stroke="${FC.ink}" stroke-width="2"/>`+T(57,50,"가",{fs:14,b:true})+T(243,50,"나",{fs:14,b:true})+`</g><path d="M138 100 L150 66 L162 100 Z" fill="${FC.ink}"/>`,"수평 잡기"); }
function springFig(n,k){ let s=`<rect x="20" y="6" width="120" height="8" fill="${FC.ink}"/>`; const L=30+n*k*4; let d=`M80 14 `; for(let i=0;i<10;i++) d+=`l${i%2?-12:12} ${L/10} `; s+=`<path d="${d}" stroke="${FC.ink}" stroke-width="2" fill="none"/>`;
  for(let i=0;i<n;i++) s+=`<rect x="64" y="${14+L+i*16}" width="32" height="14" fill="${SC.gray}" stroke="${FC.ink}" stroke-width="2"/>`; s+=T(150,40+L/2,`추 ${n}개`,{fs:14,a:"start"});
  return SV(220,14+L+n*16+10,s,"용수철에 매단 추"); }
function thermFig(t){ const top=14,bot=164, mn=0,mx=50, y=v=>bot-(v-mn)/(mx-mn)*(bot-top); let s=`<rect x="54" y="${top-6}" width="16" height="${bot-top+12}" rx="8" fill="#fff" stroke="${FC.ink}" stroke-width="2"/><circle cx="62" cy="${bot+14}" r="13" fill="${SC.red}" stroke="${FC.ink}" stroke-width="2"/><rect x="58" y="${y(t)}" width="8" height="${bot-y(t)+8}" fill="${SC.red}"/>`;
  for(let v=mn;v<=mx;v+=2){ const yy=y(v); s+=`<path d="M70 ${yy} h${v%10===0?14:7}" stroke="${FC.ink}" stroke-width="1.5"/>`; if(v%10===0) s+=T(102,yy+5,String(v),{fs:13,a:"start"}); }
  return SV(150,192,s+T(118,190,"℃",{fs:13}),"온도계"); }
function sunPathFig(){ return SV(300,150,`<path d="M10 130 H290" stroke="${FC.ink}" stroke-width="2"/><path d="M30 130 Q150 -40 270 130" stroke="${SC.red}" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/><path d="M70 130 Q150 40 230 130" stroke="${SC.blu}" stroke-width="2.5" fill="none" stroke-dasharray="6 4"/><circle cx="150" cy="47" r="10" fill="${SC.sun}"/><circle cx="150" cy="86" r="10" fill="${SC.sun}"/>`+T(176,40,"가",{b:true})+T(176,82,"나",{b:true})+T(30,146,"동",{fs:13})+T(150,146,"남",{fs:13})+T(270,146,"서",{fs:13}),"태양이 지나는 길"); }
function planetsFig(hide){ const P=[["수성",5],["금성",8],["지구",8],["화성",6],["목성",18],["토성",15],["천왕성",11],["해왕성",11]]; let s=`<circle cx="-20" cy="50" r="40" fill="${SC.sun}"/>`, x=34;
  P.forEach(([n,rr],i)=>{ s+=`<circle cx="${x}" cy="50" r="${rr}" fill="${i===hide?FC.yel:["#b9b0a0","#e8c27a","#4c8dff","#d9603b","#d9a066","#e8cf8a","#8fd3e8","#4c6fff"][i]}" stroke="${FC.ink}" stroke-width="1.5"/>`+(i===5?`<ellipse cx="${x}" cy="50" rx="24" ry="5" fill="none" stroke="${FC.ink}" stroke-width="1.5"/>`:"")+T(x,92,i===hide?"?":n,{fs:i===hide?16:10,b:i===hide}); x+=rr*2+(i===4?18:14); });
  return SV(x,100,s,"태양계 행성"); }
function plantFig(){ return SV(240,190,`<path d="M10 120 H230" stroke="${SC.brn}" stroke-width="3"/><rect x="10" y="120" width="220" height="66" fill="#f0dcc0"/><path d="M120 120 V40" stroke="${SC.grn}" stroke-width="6"/><path d="M120 70 q-40 -10 -50 -36 q36 0 50 30 M120 56 q40 -12 52 -38 q-38 2 -52 32" fill="${SC.grn}" stroke="${FC.ink}" stroke-width="1.5"/><path d="M120 120 l-26 40 M120 120 l24 44 M120 120 v54 M106 140 l-18 10 M132 146 l16 10" stroke="${SC.brn}" stroke-width="2.5" fill="none"/>`+T(46,32,"가",{b:true})+T(152,96,"나",{b:true})+T(176,170,"다",{b:true})+`<path d="M56 36 L74 42 M148 92 L124 88 M168 166 L140 158" stroke="${FC.ink}" stroke-width="1.5"/>`,"식물의 구조"); }
function litmusFig(from,to){ const c=x=>x==="푸른색"?SC.blu:SC.red; return SV(260,120,`<rect x="30" y="20" width="40" height="80" rx="4" fill="${c(from)}" stroke="${FC.ink}" stroke-width="2"/>`+arrowR(90,60,160)+T(125,48,"용액",{fs:13})+`<rect x="190" y="20" width="40" height="80" rx="4" fill="${c(from)}" stroke="${FC.ink}" stroke-width="2"/><rect x="190" y="60" width="40" height="40" rx="4" fill="${c(to)}" stroke="${FC.ink}" stroke-width="2"/>`+T(50,116,"전",{fs:13})+T(210,116,"후",{fs:13}),"리트머스 종이"); }
function carFig(m,s){ return SV(300,90,`<path d="M20 70 H280" stroke="${FC.ink}" stroke-width="2"/><rect x="24" y="40" width="46" height="20" rx="6" fill="${SC.red}" stroke="${FC.ink}" stroke-width="2"/><circle cx="36" cy="64" r="6" fill="${FC.ink}"/><circle cx="60" cy="64" r="6" fill="${FC.ink}"/><path d="M40 84 H270" stroke="${FC.ink}" stroke-width="1.5"/><path d="M40 78 v12 M270 78 v12" stroke="${FC.ink}" stroke-width="1.5"/>`+T(155,82,`${m} m`,{fs:13})+`<circle cx="250" cy="30" r="16" fill="#fff" stroke="${FC.ink}" stroke-width="2"/><path d="M250 30 v-10 M250 30 l7 4" stroke="${FC.ink}" stroke-width="2"/>`+T(250,62,`${s}초`,{fs:13}),"움직이는 자동차"); }
function earthFig(){ return SV(150,150,`<circle cx="75" cy="75" r="60" fill="${SC.sea}" stroke="${FC.ink}" stroke-width="2"/><path d="M40 50 q20 -20 40 -6 q10 14 -6 24 q-20 6 -34 -18 Z M86 86 q24 -6 30 14 q-10 20 -30 10 Z M30 92 q10 -4 16 8 q-8 8 -16 -8 Z" fill="${SC.grn}" stroke="${FC.ink}" stroke-width="1.5"/>`,"지구"); }

/* 그림이 있는 문제 */
const SF={
 magnet:r=>{ const {pick}=mk(r); const L=pick([["S","N"],["N","S"]]), R=pick([["N","S"],["S","N"]]); const same=L[1]===R[0];
   return F(KC(r,"자석의 이용",0,"그림처럼 두 자석을 가까이 하면 어떻게 될까요?",same?"서로 밀어 낸다":"서로 끌어당긴다",[same?"서로 끌어당긴다":"서로 밀어 낸다","아무 일도 없다","자석이 녹는다"],`마주 보는 극이 ${L[1]}극과 ${R[0]}극 → ${same?"같은 극은 밀어 내요":"다른 극은 끌어당겨요"}.`,"가운데에서 마주 보는 두 극을 봐요."),magnetFig(L,R)); },
 insect:r=>{ const {pick}=mk(r); const [q,a,w,ex]=pick([["다리 세 쌍이 붙어 있는 곳은?","나 (가슴)",["가 (머리)","다 (배)"],"곤충의 다리 6개(3쌍)는 가슴에 붙어 있어요."],["더듬이와 눈이 있는 곳은?","가 (머리)",["나 (가슴)","다 (배)"],"머리에는 눈·입·더듬이가 있어요."],["몸에서 가장 뒤에 있고 마디가 있는 곳은?","다 (배)",["가 (머리)","나 (가슴)"],"배는 맨 뒤에 있어요."]]);
   return F(KC(r,"동물의 생활",2,`그림은 곤충의 몸이에요. ${q}`,a,w,ex,"곤충의 몸은 머리·가슴·배로 나뉘어요."),insectFig()); },
 cycle:r=>{ const {pick,ri}=mk(r); const [cn,st]=pick([["동물의 한살이",["알","애벌레","번데기","어른벌레"]],["식물의 한살이",["씨","싹","꽃","열매"]]]); const h=ri(0,3); const it=st.slice(); it[h]="?";
   return F(KC(r,cn,2,"?에 알맞은 단계는?",st[h],st.filter((_,i)=>i!==h).concat(cn==="동물의 한살이"?["올챙이"]:["뿌리"]),`${st.join(" → ")}`,"앞뒤 단계를 보고 생각해요."),chainFig(it,"한살이 순서")); },
 moon:r=>{ const {pick}=mk(r); const ph=pick(["초승달","상현달","보름달","하현달","그믐달"]);
   return F(KC(r,"밤하늘 관찰",3,"그림과 같은 모양의 달 이름은?",ph,["초승달","상현달","보름달","하현달","그믐달"].filter(x=>x!==ph),{초승달:"오른쪽이 가늘게 빛나는 달이에요.",상현달:"오른쪽 반이 빛나는 반달이에요.",보름달:"둥글게 다 보이는 달이에요.",하현달:"왼쪽 반이 빛나는 반달이에요.",그믐달:"왼쪽이 가늘게 빛나는 달이에요."}[ph],"달 모양: 초승달 → 상현달 → 보름달 → 하현달 → 그믐달"),moonFig(ph)); },
 planets:r=>{ const {ri}=mk(r); const P=["수성","금성","지구","화성","목성","토성","천왕성","해왕성"]; const h=ri(0,7);
   return F(KC(r,"밤하늘 관찰",3,"그림에서 ?에 알맞은 행성은?",P[h],P.filter((_,i)=>i!==h&&Math.abs(i-h)<=3),`태양에서 가까운 순서: ${P.join("·")}.`,"‘수금지화목토천해’"),planetsFig(h)); },
 layers:r=>{ const lab=kshuf(r,["가","나","다","라"]);
   return F(KC(r,"지층과 화석",3,"그림의 지층에서 가장 먼저 쌓인 층은?",lab[3],lab.slice(0,3),"지층은 아래에서부터 쌓여서 맨 아래층이 가장 오래됐어요.","먼저 쌓인 것이 아래에 있어요."),layersFig(lab)); },
 volcano:r=>{ const {pick}=mk(r); const k=pick(["㉠","㉡"]);
   return F(KC(r,"땅의 변화",3,`그림에서 ${k}은 무엇일까요?`,k==="㉠"?"마그마":"용암",[k==="㉠"?"용암":"마그마","화산재","지층"],"땅속에 있으면 마그마, 땅 위로 흘러나오면 용암이에요.","땅속인지 땅 위인지 봐요."),volcanoFig()); },
 circuit:r=>{ const par=r()<0.5;
   return F(KC(r,"전기의 이용",0,"그림처럼 전구를 연결하는 방법은?",par?"병렬연결":"직렬연결",[par?"직렬연결":"병렬연결","단열","굴절"],par?"전구가 여러 갈래로 나뉘어 연결되면 병렬연결이에요.":"전구가 한 줄로 이어지면 직렬연결이에요.","전기가 지나가는 길이 한 줄인지 봐요."),circuitFig(par)); },
 lens:r=>{ const o=r()<0.5?["볼록","오목"]:["오목","볼록"];
   return F(KC(r,"빛의 성질",0,"그림에서 볼록 렌즈는 어느 것일까요?",o[0]==="볼록"?"가":"나",[o[0]==="볼록"?"나":"가"],"가운데가 가장자리보다 두꺼운 것이 볼록 렌즈예요.","가운데가 두꺼운 렌즈를 찾아요."),lensFig(o)); },
 prism:r=>F(KC(r,"빛의 성질",0,"그림처럼 햇빛을 프리즘에 통과시키면 어떻게 될까요?","여러 가지 색의 빛으로 나뉜다",["빛이 사라진다","검은색이 된다","한 가지 색만 보인다"],"햇빛은 여러 가지 색의 빛이 섞여 있어요.","무지개를 떠올려요."),prismFig()),
 shadow:r=>{ const near=r()<0.5;
   return F(KC(r,"빛의 성질",0,`그림에서 손전등을 물체에 더 ${near?"가까이":"멀리"} 하면 그림자의 크기는?`,near?"커진다":"작아진다",[near?"작아진다":"커진다","변하지 않는다","없어진다"],"손전등이 물체에 가까울수록 그림자가 커요.","빛이 퍼지는 모양을 봐요."),shadowFig()); },
 seesaw:r=>{ const hl=r()<0.5;
   return F(KC(r,"힘과 우리 생활",0,"받침점에서 같은 거리에 물체를 올렸더니 그림처럼 기울었어요. 더 무거운 물체는?",hl?"가":"나",[hl?"나":"가"],"아래로 내려간 쪽 물체가 더 무거워요.","어느 쪽이 내려갔는지 봐요."),seesawFig(hl)); },
 spring:r=>{ const {ri}=mk(r); const k=ri(2,4), n=ri(2,4);
   return F(KN("힘과 우리 생활",0,`추 1개를 달 때마다 용수철이 ${k} cm씩 늘어나요. 그림처럼 추 ${n}개를 달면 몇 cm 늘어날까요?`,k*n,`${k} × ${n} = ${k*n} cm.`,"추가 2배면 늘어난 길이도 2배."),springFig(n,k)); },
 therm:r=>{ const {ri}=mk(r); const t=ri(5,24)*2;
   return F(KN("열과 우리 생활",0,"온도계가 가리키는 온도는 몇 ℃일까요?",t,`빨간 액체 끝이 ${t}에 있어요. 작은 눈금 한 칸은 2℃예요.`,"10, 20 … 사이 작은 눈금 한 칸이 몇 ℃인지 세어 봐요."),thermFig(t)); },
 sunpath:r=>{ const s=r()<0.5;
   return F(KC(r,"계절의 변화",3,`그림에서 ${s?"여름":"겨울"}에 태양이 지나는 길은?`,s?"가":"나",[s?"나":"가"],"여름에는 태양이 높이 떠서 남중 고도가 높고 낮이 길어요.","여름엔 해가 더 높이 떠요."),sunPathFig()); },
 plant:r=>{ const {pick}=mk(r); const [k,n,job]=pick([["가","잎","광합성으로 양분을 만들어요."],["나","줄기","물이 이동하는 통로예요."],["다","뿌리","물을 흡수하고 식물을 지탱해요."]]);
   return F(KC(r,"식물의 구조와 기능",2,`그림에서 ${k}의 이름은?`,n,["잎","줄기","뿌리","꽃"].filter(x=>x!==n),`${k}는 ${n} — ${job}`,"위에서부터 잎·줄기·뿌리."),plantFig()); },
 litmus:r=>{ const acid=r()<0.5;
   return F(KC(r,"산과 염기",1,"그림처럼 리트머스 종이의 색이 변했어요. 이 용액은?",acid?"산성 용액":"염기성 용액",[acid?"염기성 용액":"산성 용액","물(중성)"],acid?"푸른색 리트머스 종이가 붉게 변하면 산성이에요.":"붉은색 리트머스 종이가 푸르게 변하면 염기성이에요.","산성은 ‘푸른 → 붉은’."),acid?litmusFig("푸른색","붉은색"):litmusFig("붉은색","푸른색")); },
 car:r=>{ const {ri}=mk(r); const v=ri(2,8), t=ri(3,9);
   return F(KN("물체의 운동",0,`그림의 자동차가 ${v*t} m를 ${t}초 동안 갔어요. 속력은 몇 m/s?`,v,`${v*t} ÷ ${t} = ${v} m/s.`,"속력 = 거리 ÷ 시간."),carFig(v*t,t)); },
 food:r=>{ const {pick,ri}=mk(r); const [c,w]=pick([[["벼","메뚜기","개구리","뱀"],["독수리","토끼","소나무"]],[["풀","토끼","여우","호랑이"],["메뚜기","벼","곰팡이"]],[["식물 플랑크톤","동물 플랑크톤","작은 물고기","큰 물고기"],["벼","토끼","곰팡이"]]]); const h=ri(1,3); const it=c.slice(); it[h]="?";
   return F(KC(r,"생물과 환경",2,"먹이 사슬에서 ?에 알맞은 생물은?",c[h],c.filter((_,i)=>i!==h).slice(0,1).concat(w).slice(0,3),`${c.join(" → ")} (화살표는 ‘먹힌다 → 먹는다’)`,"앞 생물을 먹고, 뒤 생물에게 먹혀요."),chainFig(it,"먹이 사슬")); },
 digest:r=>{ const {ri}=mk(r); const st=["입","식도","위","작은창자","큰창자"]; const h=ri(1,4); const it=st.slice(); it[h]="?";
   return F(KC(r,"우리 몸의 구조와 기능",2,"음식물이 지나가는 순서예요. ?에 알맞은 기관은?",st[h],st.filter((_,i)=>i!==h&&i!==0).concat(["폐","심장"]).slice(0,3),st.join(" → "),"입에서 시작해 큰창자까지."),chainFig(it,"소화 기관 순서")); },
 water:r=>{ const {ri}=mk(r); const st=["바다","증발","구름","비"]; const h=ri(1,3); const it=st.slice(); it[h]="?";
   return F(KC(r,"물의 상태 변화",1,"물의 이동 순서예요. ?에 알맞은 말은?",st[h],["응결","얼음","바람","증발","구름","비"].filter(x=>x!==st[h]).slice(0,3),"바닷물이 증발 → 수증기가 구름 → 비가 되어 다시 땅과 바다로.","물은 모습을 바꾸며 돌고 돌아요."),chainFig(it,"물의 순환")); },
 earth:r=>F(KC(r,"지구와 바다",3,"그림은 지구예요. 지구 표면에서 더 넓은 곳은?","바다",["육지","사막","산"],"지구 표면의 약 70%가 바다예요.","파란 부분과 초록 부분을 비교해 봐요."),earthFig())
};

/* ---------- 새 단원 문제 ---------- */
const O=(g,name)=>KSCI_OLD[g].find(U=>U.u===name).gens;
const SN={
 force:LG("힘과 우리 생활",0,[
  ["물체를 밀거나 당길 때 필요한 것은?","힘",["빛","소리","온도"],"밀고 당기는 것은 힘을 주는 거예요."],
  ["무거운 상자와 가벼운 상자를 같은 힘으로 밀면 더 쉽게 움직이는 것은?","가벼운 상자",["무거운 상자","둘이 같다","움직이지 않는다"],"가벼울수록 적은 힘으로 움직여요."],
  ["무게를 정확하게 비교하려면 무엇이 필요할까요?","저울",["자","돋보기","온도계"],"손으로 들어 보면 정확하지 않아요."],
  ["지레를 이용하면 무거운 물체를 들 때 힘이 어떻게 될까요?","적게 든다",["더 많이 든다","똑같다","들 수 없다"],"받침점에서 멀리 누를수록 힘이 적게 들어요."],
  ["무거운 짐을 수레에 싣고 비스듬한 판(빗면)으로 올리는 까닭은?","힘이 적게 들어서",["더 빨라서","더 무거워져서","소리가 나서"],"빗면을 이용하면 적은 힘으로 올릴 수 있어요."],
  ["지레를 이용한 도구는?","병따개",["유리컵","공책","풍선"],"병따개·가위·장도리는 지레를 이용해요."]]),
 earthsea:LG("지구와 바다",3,[
  ["바닷물의 맛은?","짜다",["달다","시다","아무 맛도 없다"],"바닷물에는 소금 같은 물질이 녹아 있어요."],
  ["바다가 우리에게 주는 것은?","해산물과 소금",["석탄","모래 바람","눈"],"물고기·김·미역·소금을 얻어요."],
  ["지구를 둘러싸고 있는 공기를 무엇이라고 할까요?","대기",["바다","지층","용암"],"공기층을 대기라고 해요."],
  ["달에는 없지만 지구에는 있어 생물이 살 수 있게 해 주는 것은?","물과 공기",["돌","흙","충돌 구덩이"],"지구에는 물과 공기가 있어요."],
  ["바다를 지키는 방법으로 알맞은 것은?","바닷가에 쓰레기를 버리지 않는다",["플라스틱을 바다에 버린다","기름을 흘려보낸다","물고기를 마구 잡는다"],"바다 쓰레기는 생물에게 해로워요."]]),
 health:LG("감염병과 건강한 생활",2,[
  ["감기·독감처럼 다른 사람에게 옮을 수 있는 병은?","감염병",["골절","충치만","근육통"],"병원체가 옮겨 가며 걸리는 병이에요."],
  ["감염병을 일으키는 아주 작은 것은?","세균이나 바이러스",["햇빛","모래","돌멩이"],"눈에 보이지 않을 만큼 작아요."],
  ["감염병을 막는 가장 쉬운 방법은?","비누로 손을 30초 이상 씻는다",["손을 씻지 않는다","수건을 같이 쓴다","기침을 손바닥에 한다"],"손 씻기가 기본이에요."],
  ["기침이 날 때 바른 예절은?","옷소매로 입과 코를 가린다",["친구 얼굴 쪽으로 한다","손바닥에 하고 문손잡이를 만진다","가리지 않는다"],"침방울이 퍼지지 않게 해요."],
  ["건강한 생활 습관은?","골고루 먹고 충분히 잔다",["밤늦게까지 게임한다","간식만 먹는다","운동을 하지 않는다"],"몸이 튼튼해야 병을 이겨요."]]),
 sky:LG("밤하늘 관찰",3,[
  ["밤하늘에서 국자 모양으로 보이는 별자리는?","북두칠성",["오리온자리","카시오페이아자리","백조자리"],"북두칠성은 국자 모양이에요."],
  ["북쪽 하늘에서 거의 움직이지 않는 별은?","북극성",["금성","시리우스","태양"],"북극성으로 북쪽을 찾아요."],
  ["W자(M자) 모양으로 보이는 별자리는?","카시오페이아자리",["북두칠성","전갈자리","사자자리"],"북극성을 찾을 때 함께 이용해요."],
  ["스스로 빛을 내는 것은?","별",["달","행성","지구"],"달과 행성은 햇빛을 반사해서 보여요."],
  ["밤하늘을 관찰할 때 알맞은 태도는?","어른과 함께 안전한 곳에서 관찰한다",["혼자 밤늦게 산에 간다","망원경으로 태양을 본다","차도에서 관찰한다"],"태양은 절대 맨눈이나 망원경으로 보면 안 돼요."]]),
 climate:LG("기후변화와 우리 생활",3,[
  ["지구의 평균 기온이 점점 높아지는 현상은?","지구 온난화",["지진","일식","월식"],"온실 기체가 늘어 지구가 더워져요."],
  ["지구 온난화의 주요 원인이 되는 기체는?","이산화 탄소",["산소","질소","헬륨"],"화석 연료를 태우면 많이 나와요."],
  ["기후변화로 생길 수 있는 일은?","빙하가 녹아 해수면이 높아진다",["바다가 사라진다","해가 뜨지 않는다","달이 커진다"],"폭염·가뭄·홍수도 잦아져요."],
  ["기후변화를 줄이는 실천은?","가까운 거리는 걷거나 자전거를 탄다",["전등을 켜 둔다","일회용품을 많이 쓴다","냉방을 세게 오래 한다"],"에너지를 아끼면 이산화 탄소가 줄어요."],
  ["나무를 많이 심으면 좋은 까닭은?","나무가 이산화 탄소를 흡수해서",["그늘이 없어져서","산소를 없애서","비가 안 와서"],"식물은 광합성에 이산화 탄소를 써요."]]),
 resource:LG("자원과 에너지",0,[
  ["석탄·석유·천연가스처럼 오래전 생물이 묻혀 만들어진 자원은?","화석 연료",["태양 에너지","바람","물"],"쓰면 다시 만들기 어려워요."],
  ["쓰고 나서도 다시 쓸 수 있는 에너지는?","태양광·풍력 같은 재생 에너지",["석유","석탄","천연가스"],"햇빛과 바람은 계속 얻을 수 있어요."],
  ["자원을 아끼는 방법은?","분리배출하고 재활용한다",["쓰레기를 섞어 버린다","물을 틀어 둔다","새 물건만 산다"],"재활용하면 자원을 다시 쓸 수 있어요."],
  ["에너지 전환: 전기밥솥이 밥을 할 때는?","전기 에너지 → 열에너지",["열에너지 → 전기 에너지","빛에너지 → 소리 에너지","화학 에너지 → 빛에너지"],"전기가 열로 바뀌어요."]]),
 career:LG("과학과 나의 진로",0,[
  ["과학자가 궁금한 것을 해결하는 첫 단계는?","문제를 정하고 질문하기",["결론 먼저 쓰기","실험 없이 발표하기","결과를 바꾸기"],"질문 → 가설 → 실험 → 결론."],
  ["실험 결과를 정리하는 바른 태도는?","나온 결과를 있는 그대로 기록한다",["원하는 결과로 고친다","기록하지 않는다","친구 것을 베낀다"],"정직하게 기록해야 해요."],
  ["날씨를 연구하고 예보하는 사람은?","기상 예보관",["요리사","조각가","작곡가"],"과학 지식을 쓰는 직업이에요."],
  ["로봇을 설계하고 만드는 직업은?","로봇 공학자",["제빵사","화가","가수"],"과학과 기술을 함께 써요."],
  ["동물의 병을 치료하는 직업은?","수의사",["건축가","운전기사","작가"],"생명 과학과 관련 있어요."],
  ["과학 탐구에서 다르게 할 조건만 하나 바꾸고 나머지는 같게 하는 까닭은?","무엇 때문에 결과가 달라졌는지 알려고",["실험을 빨리 끝내려고","결과를 예쁘게 만들려고","재료를 아끼려고"],"공정한 실험이에요."]]),
 light:LG("빛의 성질",0,[
  ["빛이 곧게 나아가는 성질을 무엇이라고 할까요?","직진",["반사","굴절","흡수"],"그래서 그림자가 생겨요."],
  ["물속에 넣은 젓가락이 꺾여 보이는 까닭은?","빛이 굴절해서",["빛이 사라져서","젓가락이 휘어서","물이 빛을 만들어서"],"빛이 공기에서 물로 갈 때 꺾여요."],
  ["거울에 비친 모습의 특징은?","왼쪽과 오른쪽이 바뀌어 보인다",["위아래가 바뀐다","색이 바뀐다","크기가 커진다"],"좌우가 바뀌어 보여요."],
  ["볼록 렌즈를 이용한 도구는?","돋보기",["평면거울","창문 유리","나침반"],"볼록 렌즈는 빛을 모아요."]])
};
const KSCI={
3:[
 {u:"힘과 우리 생활", gens:[SN.force, SF.seesaw, SF.spring, ...O(4,"물체의 무게").slice(0,1)]},
 {u:"동물의 생활", gens:[...O(3,"동물의 생활"), SF.insect]},
 {u:"식물의 생활", gens:[...O(4,"식물의 생활")]},
 {u:"생물의 한살이", gens:[...O(3,"동물의 한살이"), ...O(4,"식물의 한살이"), SF.cycle]},
 {u:"물체와 물질", gens:[...O(3,"물질의 성질"), ...O(3,"물질의 상태")]},
 {u:"지구와 바다", gens:[...O(3,"지구의 모습"), SN.earthsea, SF.earth]},
 {u:"소리의 성질", gens:[...O(3,"소리의 성질")]},
 {u:"감염병과 건강한 생활", gens:[SN.health]}
],
4:[
 {u:"자석의 이용", gens:[...O(3,"자석의 이용"), SF.magnet]},
 {u:"물의 상태 변화", gens:[...O(4,"물의 상태 변화"), ...O(4,"물의 여행"), SF.water]},
 {u:"땅의 변화", gens:[...O(3,"지표의 변화"), ...O(4,"화산과 지진"), SF.volcano]},
 {u:"다양한 생물과 우리 생활", gens:[...O(5,"다양한 생물")]},
 {u:"밤하늘 관찰", gens:[SN.sky, ...O(5,"태양계와 별"), SF.moon, SF.planets]},
 {u:"생물과 환경", gens:[...O(5,"생물과 환경"), SF.food]},
 {u:"여러 가지 기체", gens:[...O(6,"여러 가지 기체")]},
 {u:"기후변화와 우리 생활", gens:[SN.climate]}
],
5:[
 {u:"지층과 화석", gens:[...O(4,"지층과 화석"), SF.layers]},
 {u:"빛의 성질", gens:[SN.light, ...O(4,"그림자와 거울"), ...O(6,"빛과 렌즈"), SF.lens, SF.prism, SF.shadow]},
 {u:"용해와 용액", gens:[...O(5,"용해와 용액")]},
 {u:"우리 몸의 구조와 기능", gens:[...O(6,"우리 몸의 구조와 기능"), SF.digest]},
 {u:"혼합물의 분리", gens:[...O(4,"혼합물의 분리")]},
 {u:"날씨와 우리 생활", gens:[...O(5,"날씨와 우리 생활")]},
 {u:"열과 우리 생활", gens:[...O(5,"온도와 열"), SF.therm]},
 {u:"자원과 에너지", gens:[SN.resource, ...O(6,"에너지와 생활")]}
],
6:[
 {u:"산과 염기", gens:[...O(5,"산과 염기"), SF.litmus]},
 {u:"물체의 운동", gens:[...O(5,"물체의 운동"), SF.car]},
 {u:"식물의 구조와 기능", gens:[...O(6,"식물의 구조와 기능"), SF.plant]},
 {u:"지구의 운동", gens:[...O(6,"지구와 달의 운동"), SF.moon]},
 {u:"계절의 변화", gens:[...O(6,"계절의 변화"), SF.sunpath]},
 {u:"물질의 연소", gens:[...O(6,"연소와 소화")]},
 {u:"전기의 이용", gens:[...O(6,"전기의 이용"), SF.circuit]},
 {u:"과학과 나의 진로", gens:[SN.career]}
]};
KUNITS["과학"]=KSCI;
Object.assign(KM_CONCEPTS,{
 "힘과 우리 생활":["물체를 밀거나 당길 때 힘이 필요해요. 무게는 수평 잡기나 저울로 비교하고, 지레·빗면 같은 도구를 쓰면 적은 힘으로 물체를 들어 올릴 수 있어요.","밀기·당기기 = 힘, 지레·빗면 = 힘을 덜어 주는 도구","병따개는 지레를 이용해요."],
 "지구와 바다":["지구는 둥글고 표면의 약 70%가 바다예요. 바닷물은 짜고, 바다에서 해산물과 소금을 얻어요. 지구에는 물과 공기(대기)가 있어 생물이 살아요.","지구는 바다가 더 넓어요.","바닷물은 짜요."],
 "감염병과 건강한 생활":["감염병은 세균이나 바이러스 같은 병원체가 옮겨 가며 생기는 병이에요. 손 씻기, 기침 예절, 골고루 먹고 푹 자기로 예방해요.","손 씻기 30초, 기침은 옷소매에","감기·독감은 감염병"],
 "밤하늘 관찰":["밤하늘에는 별자리(북두칠성, 카시오페이아자리)와 행성, 달이 보여요. 북극성으로 북쪽을 찾고, 달은 날마다 모양이 바뀌어 보여요.","별은 스스로 빛나요.","초승달 → 상현달 → 보름달 → 하현달 → 그믐달"],
 "기후변화와 우리 생활":["이산화 탄소 같은 온실 기체가 늘어 지구 평균 기온이 높아지는 것이 지구 온난화예요. 에너지를 아끼고 나무를 심으면 줄일 수 있어요.","지구가 점점 더워져요.","걷기·자전거·전등 끄기"],
 "자원과 에너지":["석탄·석유 같은 화석 연료는 쓰면 다시 만들기 어렵고, 햇빛·바람 같은 재생 에너지는 계속 쓸 수 있어요. 에너지는 모습을 바꾸며(전환) 쓰여요.","화석 연료는 아끼고, 재생 에너지는 늘려요.","전기밥솥: 전기 → 열"],
 "과학과 나의 진로":["과학자는 질문하고, 예상하고, 실험하고, 결과를 정직하게 기록해 결론을 내려요. 과학 지식은 기상 예보관·로봇 공학자·수의사 같은 여러 직업에 쓰여요.","질문 → 실험 → 결론","바꿀 조건은 하나만"],
 "빛의 성질":["빛은 곧게 나아가고(직진), 거울에 부딪히면 반사되며, 물이나 렌즈를 지날 때 꺾여요(굴절). 볼록 렌즈는 빛을 모으고, 햇빛은 여러 색이 섞여 있어요.","직진 · 반사 · 굴절","돋보기 = 볼록 렌즈"],
 "열과 우리 생활":KM_CONCEPTS["온도와 열"],
 "지구의 운동":KM_CONCEPTS["지구와 달의 운동"],
 "물질의 연소":KM_CONCEPTS["연소와 소화"],
 "땅의 변화":["흐르는 물은 땅을 깎고(침식), 옮기고, 쌓아요(퇴적). 땅속의 마그마가 땅 위로 나오면 화산이 되고, 땅이 흔들리는 것은 지진이에요.","깎기 · 옮기기 · 쌓기, 마그마 → 용암","제주 돌하르방 = 현무암"],
 "물체와 물질":KM_CONCEPTS["물질의 성질"]
});
var KSCI_CN=new Set(); Object.values(KSCI).forEach(us=>us.forEach(U=>U.gens.forEach((f,j)=>{ for(let s=0;s<4;s++) KSCI_CN.add(f(rng(13+s*5+j)).cn); })));
KSCI_CN.forEach(n=>{ const c=KM_CONCEPTS[n]; if(c){ NEW_CONCEPT[n]=c[0]; EASY[n]=[c[1],c[2]]; } });
