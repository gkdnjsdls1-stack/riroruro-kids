
/* =========================================================================
   리로루로게임즈 초등판 — 기획서(개념 탐험대) 적용 레이어
   - 기획서에서 정한 것만 바꾸고, 문제 생성·채점·개념·배치고사·익힘 기록·은행 원장은 개념중공업 코드를 그대로 씀
   ========================================================================= */
const KID = {
  perTest: 5,          // 한 판 = 게임 테스트 5문항
  bossSize: 10, bossPass: 9,   // 스테이지 최종 점검(보스) 10문항 중 9개 이상, 힌트 없이
  checkSize: 3,        // 통과 다음날 확인 문제 3개 → 모두 맞히면 ‘완벽 습득’
  piecesForBoss: 3,    // 테스트 조각 3개 모으면 보스 열림
  dailyPlays: 3,       // 하루 3판(테스트·보스)
  payTest: 300, payBoss: 900, snackPrice: 300,
  conceptsPerStage: 3,
  rankAt: [0,1,4,9,16,25]   // 완성한 스테이지 수(학년 상관없이)
};
COMPANY.splice(0, COMPANY.length, "견습","테스터","개발자","팀장","디렉터","사장");
CONFIG.rankAt = KID.rankAt;
CONFIG.placeMin = 6; CONFIG.placeMax = 12;

const BIZ = {
  goal:{name:"골골 스튜디오", theme:"축구", game:"골골 킥오프", color:"#1fb57a", dark:"#0f7a52", icon:"⚽"},
  race:{name:"붕붕 레이싱팀", theme:"카트", game:"붕붕 그랑프리", color:"#ff7b2e", dark:"#c4521a", icon:"🏎️"},
  dig: {name:"쿵쿵 발굴단",   theme:"공룡 발굴", game:"쿵쿵 다이노", color:"#c98a3c", dark:"#8a5a1c", icon:"🦕"}
};
/* 시리즈 n편 = n학년. 문제 데이터 수준(L)은 1·2학년(0·1)과 3·4학년(2)·5·6학년(3)으로 묶여 있어서,
   3~6학년은 문항(수학은 생성기 하나하나, 국어·과학은 개념)마다 학년을 따로 정해 나눔 */
const SERIES = [1,2,3,4,5,6].map(n=>({n, label:n+"학년"}));
const MAXK = SERIES.length-1, MAXLV = 3;
const gradeToL = g => g<=1?0 : g===2?1 : g<=4?2 : 3;     /* 배치고사 시작 수준 */
const GI_L = [0,1,2,2,3,3];                                /* 편(0~5) → 문제 수준 */
const MATH_GRADE = {   /* "수준:종류-번호" → 학년 (2022 개정 교육과정 기준으로 제가 나눔) */
  "2:0-0":3,"2:0-1":3,"2:1-0":3,"2:1-2":3,"2:0-2":3,"2:0-5":3,"2:0-6":3,"2:1-1":3,"2:1-3":3,"2:0-11":3,"2:0-12":3,"2:0-3":3,"2:0-7":3,
  "2:0-8":4,"2:1-4":4,"2:1-5":4,"2:0-4":4,"2:0-9":4,"2:0-10":4,
  "2:0-13":5,
  "3:0-5":5,"3:0-2":5,"3:0-6":5,"3:0-3":5,"3:0-0":5,"3:0-1":5,"3:0-9":5,"3:0-10":5,"3:0-12":5,"3:1-4":5,
  "3:1-2":6,"3:0-7":6,"3:0-8":6,"3:0-4":6,"3:0-14":6,"3:1-3":6,"3:0-11":6,"3:0-13":6,"3:1-0":6,"3:1-1":6,"3:1-5":6
};
const CONCEPT_GRADE = {
  "국어":{ "높임 표현":3,"소리와 다른 표기":3,"안 / 않":3,"며칠":3,"금세 / 금새":3,
          "기본형과 국어사전":4,"속담과 관용 표현":4,"문장의 종류":4,"문장 성분":4,"표현 방법":4,"글의 종류와 읽기·쓰기":4,"훈민정음과 중세 국어":4,
          "결제 / 결재":5,"어떡해 / 어떻게":5,"맞히다 / 맞추다":5,"부치다 / 붙이다":5,"낫다 / 낳다":5,"-ㄹ게 / -ㄹ께":5 },
  "과학":{ "자석":3,"물질의 상태":3,"지구와 달":3,"소리의 성질":3,
          "물의 상태 변화":4,"식물의 한살이":4,"지층과 화석":4,"흐르는 물의 작용":4,"화산과 지진":4,"무게":4,
          "속력":5,"용해와 용액":5,"태양계와 별":5,"산과 염기":5,"열의 이동":5,"생태계":5,
          "광합성과 증산 작용":6,"우리 몸의 구조와 기능":6,"지구의 운동":6,"연소와 소화":6,"전기 회로":6,"빛과 렌즈":6,"여러 가지 기체":6 }
};
/* 국어 L2의 띄어쓰기는 3학년, L3의 띄어쓰기·속담·문장의 종류는 각각 5·6학년 쪽으로 */
const L3_KOR = {"띄어쓰기":5,"속담과 관용 표현":6,"문장의 종류":6,"표현 방법":6,"글의 종류와 읽기·쓰기":6,"고유어·한자어·외래어":6,"-대 / -데":6};
function entryGrade(subj,e,name){
  if(e.L<=1) return e.L+1;
  if(subj==="수학" && e.bank==null){ const g=MATH_GRADE[e.L+":"+e.kd+"-"+e.i]; if(g) return g; }
  if(subj==="국어" && e.L===2 && name==="띄어쓰기") return 3;
  if(subj==="국어" && e.L===3 && L3_KOR[name]) return L3_KOR[name];
  const g=(CONCEPT_GRADE[subj]||{})[name]; if(g && (g>=3&&g<=4)===(e.L===2)) return g;
  return e.L===2 ? 3 : 5;
}

/* ---------- 상태 ---------- */
function K(){
  const k = S.kid = S.kid || {};
  k.series=k.series||{}; k.maxSeries=k.maxSeries||{}; k.st=k.st||{}; k.released=k.released||[];
  k.day=k.day||{date:"",plays:0}; k.snacks=k.snacks||0; k.clothes=k.clothes||[]; k.wear=k.wear||{};
  k.dex=k.dex||{}; k.hatched=k.hatched||{}; k.nest=k.nest||null; k.play=k.play||{};
  if(!k.v2){ const M=[0,1,2,4]; ["series","maxSeries"].forEach(f=>Object.keys(k[f]).forEach(sj=>{ k[f][sj]=M[k[f][sj]]??0; }));
    Object.keys(k.st).forEach(key=>{ if(!/\|g\d\|/.test(key)) delete k.st[key]; }); k.play={}; k.v2=true; }
  if(!k.v6){ Object.keys(k.st).forEach(key=>{ if(/^과학\|g[3-6]\|/.test(key)) delete k.st[key]; }); if(k.play) delete k.play["과학"]; k.v5=true; k.v6=true; }
  if(!k.v5){ Object.keys(k.st).forEach(key=>{ if(/^과학\|g[3-6]\|/.test(key)) delete k.st[key]; }); if(k.play) delete k.play["과학"]; k.v5=true; }
  if(!k.v4){ Object.keys(k.st).forEach(key=>{ if(/^국어\|/.test(key)) delete k.st[key]; }); if(k.play) delete k.play["국어"]; k.v4=true; }
  if(!k.v3){ Object.keys(k.st).forEach(key=>{ if(/^수학\|g[12]\|/.test(key)) delete k.st[key]; }); if(k.play) delete k.play["수학"]; k.v3=true; }
  return k;
}
function today_(){ return ymd(new Date()); }
function playsToday(){ const k=K(); if(k.day.date!==today_()) k.day={date:today_(),plays:0}; return k.day.plays; }
function canPlay(){ return playsToday() < KID.dailyPlays; }
function bizOf(){ return BIZ[K().biz||"goal"]; }
function applyBiz(){ const b=bizOf(); document.body.dataset.biz=K().biz||"goal"; document.documentElement.style.setProperty("--biz",b.color); document.documentElement.style.setProperty("--biz-dark",b.dark); }

/* ---------- 직급 = 완성한 스테이지 수 ---------- */
function masteredCount(){ return Object.values(K().st).filter(s=>s.mastered).length; }
function companyIdx(n){ const u=n??masteredCount(); let i=0; KID.rankAt.forEach((t,k)=>{ if(u>=t) i=k; }); return i; }
function companyRank(){ return COMPANY[companyIdx()]; }
function nextRankInfo(){ const i=companyIdx(); return i>=COMPANY.length-1?null:{name:COMPANY[i+1], need:KID.rankAt[i+1]-masteredCount()}; }

/* ---------- 스테이지 = 단원(개념 3개 묶음) ---------- */
const STAGE_CACHE={};
function stagesOf(subj,gi){
  const key=subj+gi; if(STAGE_CACHE[key]) return STAGE_CACHE[key];
  if(KUNITS[subj] && KUNITS[subj][gi+1]){ const g=gi+1;
    return STAGE_CACHE[key]=KUNITS[subj][g].map((U,u)=>({key:`${subj}|g${g}|${u}`, subj, L:GI_L[gi], gi, g, i:u, title:U.u, km:true, concepts:kmUnitConcepts(g,u,subj)})); }
  const L=GI_L[gi], g=gi+1, idx=conceptIndex(subj), names=[];
  Object.keys(idx).forEach(n=>{ if(idx[n].some(e=>e.L<=MAXLV&&(e.bank!=null||e.kd<=1)&&entryGrade(subj,e,n)===g)) names.push(n); });
  const groups=[]; for(let i=0;i<names.length;i+=KID.conceptsPerStage) groups.push(names.slice(i,i+KID.conceptsPerStage));
  if(groups.length>1 && groups[groups.length-1].length===1){ groups[groups.length-2].push(...groups.pop()); }
  return STAGE_CACHE[key]=groups.map((cs,i)=>({key:`${subj}|g${g}|${i}`, subj, L, gi, g, i, concepts:cs}));
}
function stageByKey(key){ const [subj,gg,i]=key.split("|"); return stagesOf(subj,+gg.slice(1)-1)[+i]; }
function stSt(key){ const k=K(); return k.st[key]=k.st[key]||{pieces:0, passDay:null, mastered:false, boss:0}; }
function stageStatus(key){
  const s=stSt(key);
  if(s.mastered) return "done";
  if(s.passDay) return s.passDay<today_() ? "check" : "wait";
  if(s.pieces>=KID.piecesForBoss) return "boss";
  return "test";
}
function seriesName(subj,gi){ return `${bizOf().game} ${subj} ${gi+1}편`; }
function curSeries(subj){ const k=K(); return k.series[subj] ?? 0; }

/* ---------- 문제 고르기 ---------- */
const KM_GEN_CN={};
function kmGenCn(g,u,j,subj="수학"){ const key=subj+g+":"+u+":"+j; return KM_GEN_CN[key]??(KM_GEN_CN[key]=KUNITS[subj][g][u].gens[j](rng(99+j)).cn); }
function stageCands(st){
  if(st.km) return KUNITS[st.subj][st.g][st.i].gens.map((_,j)=>({km:[st.g,st.i,j,st.subj], L:st.L, n:kmGenCn(st.g,st.i,j,st.subj)}));
  const idx=conceptIndex(st.subj), out=[];
  st.concepts.forEach(n=>(idx[n]||[]).forEach(e=>{ if(e.L<=MAXLV && (e.bank!=null || e.kd<=1) && entryGrade(st.subj,e,n)===st.g) out.push({...e,n}); }));
  return out;
}
function makeQ(st,e,r){ if(e.km) return kmItem(e.km[0],e.km[1],e.km[2],r,e.km[3]); return e.bank!=null ? korItem(e.L,e.bank,r,st.subj) : makeGenItem(st.subj,e.L,e.kd,e.i,r); }
function pickQs(st, n, r, opts){
  opts=opts||{}; const cands=stageCands(st), qs=[], used=new Set(), per={};
  const want=[]; if(opts.cover){ st.concepts.forEach(c=>{ want.push(c); const m=learnOf(st.subj)[c]; if(opts.wrong2 && m && m.seen>m.ok) want.push(c); }); }
  const ek=e=>e.km?e.km.join("-"):e.L+":"+(e.bank??(e.kd+"-"+e.i));
  const take=(pool)=>{ const fresh=pool.filter(e=>!used.has(ek(e))); const list=fresh.length?fresh:pool; if(!list.length) return null;
    const e=pickByPrio(list, x=>x.n, st.subj, null, r); used.add(ek(e)); per[e.n]=(per[e.n]||0)+1; return makeQ(st,e,r); };
  for(const c of want){ if(qs.length>=n) break; const q=take(cands.filter(e=>e.n===c)); if(q) qs.push(q); }
  let guard=0; while(qs.length<n && guard++<60){
    const minPer=Math.min(...st.concepts.map(c=>per[c]||0)); const pool=cands.filter(e=>(per[e.n]||0)===minPer);
    const q=take(pool.length?pool:cands); if(!q) break; qs.push(q); }
  for(let i=qs.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [qs[i],qs[j]]=[qs[j],qs[i]]; }
  return qs;
}
function kidDoc(st, kind){
  S.seq=(S.seq||0)+1; const r=rng((Date.now()^(S.seq*7919))>>>0);
  const n = kind==="boss"?KID.bossSize : kind==="check"?KID.checkSize : KID.perTest;
  let qs=pickQs(st, n, r, {cover:kind!=="test", wrong2:kind==="boss"});
  if(kind==="test") insertSpaced(st.subj,qs,r);
  qs.forEach(q=>{ q.gl = q.spaced?"복습 버그":(kind==="boss"?"최종 점검":kind==="check"?"확인 문제":"버그"); });
  const id="K"+S.seq;
  S.gen[id]={id, subject:st.subj, view:"kid", gen:true, kid:kind, stage:st.key, L:st.L, gi:st.gi, no:"테스트-"+String(S.seq).padStart(4,"0"),
    title: kind==="boss"?"스테이지 최종 점검":kind==="check"?"완벽 습득 확인":"게임 테스트", qs};
  docState(id).kcur=0; save(); return id;
}

/* ---------- 말하는 친구 ---------- */
const K_BY = Object.fromEntries(K_DATA.characters.map(c=>[c.id,c]));
const K_GUIDE="chick";
function buddyId(){ const b=K().buddy; return b && K_BY[b] && K().dex[b] ? b : K_GUIDE; }
function kpick(a){ return a[Math.floor(Math.random()*a.length)]; }
const K_SKIP=/폰|화면|30분|분 버틴|내려놓|내리놔|내리놓|알람|품기|시간 봤/;
function kSafe(list){ const ok=(list||[]).filter(t=>!K_SKIP.test(t)); return ok.length?ok:(list||[""]); }
function kline(cat,id){ id=id||buddyId(); const L=K_LINES[id]&&K_LINES[id][cat]; if(L) return kpick(L); const c=K_BY[id]; return c&&c.lines[cat]?kpick(kSafe(c.lines[cat])):""; }
function charSvg(id,size){ return `<svg width="${size}" height="${size}" viewBox="0 0 60 60" role="img" aria-label="${esc(K_BY[id].name)}">${K_ART[id]}</svg>`; }
function bubble(cat,id,text){ id=id||buddyId(); const t=text||kline(cat,id);
  return `<div class="k-bub"><button class="k-bub-av" data-kact="talk" data-cat="${esc(cat||"greet")}" data-id="${id}" aria-label="${esc(K_BY[id].name)}에게 말 걸기">${charSvg(id,52)}</button><div class="k-bub-tx" aria-live="polite"><small>${esc(K_BY[id].name)}</small><span>${esc(t)}</span></div></div>`; }

/* ---------- 사원증 아바타 + 옷 ---------- */
const CLOTHES = [
  {id:"cap",     name:"빨간 모자",   price:1500, slot:"head"},
  {id:"pin",     name:"별 머리핀",   price:1500, slot:"head2"},
  {id:"glasses", name:"동그란 안경", price:2000, slot:"face"},
  {id:"uniform", name:"사업부 유니폼", price:3000, slot:"body"},
  {id:"headset", name:"개발자 헤드셋", price:3500, slot:"head"},
  {id:"crown",   name:"반짝 왕관",   price:5000, slot:"head"}
];
function avatarSvg(w,h,wear){
  wear=wear||K().wear; const b=bizOf(), body=wear.body==="uniform"?b.color:"#9aa6b5";
  let s=`<svg width="${w}" height="${h}" viewBox="0 0 44 56" aria-hidden="true"><path d="M2 56c2-14 10-20 20-20s18 6 20 20z" fill="${body}"/>`;
  if(wear.body==="uniform") s+=`<text x="22" y="52" text-anchor="middle" font-size="9">${b.icon}</text>`;
  s+=`<circle cx="22" cy="20" r="11" fill="#ffd9b8"/><circle cx="18" cy="20" r="1.4" fill="#2b1f5c"/><circle cx="26" cy="20" r="1.4" fill="#2b1f5c"/><path d="M18.5 25 q3.5 3 7 0" stroke="#2b1f5c" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  if(wear.face==="glasses") s+=`<g fill="none" stroke="#2b1f5c" stroke-width="1.3"><circle cx="18" cy="20" r="3.4"/><circle cx="26" cy="20" r="3.4"/><path d="M21.4 20h1.2"/></g>`;
  if(wear.head==="cap") s+=`<path d="M11 15 q11 -12 22 0 z" fill="#ef4b5a"/><rect x="20" y="13.5" width="18" height="3" rx="1.5" fill="#c4303f"/>`;
  if(wear.head==="headset") s+=`<path d="M10 20 q12 -20 24 0" stroke="#2b1f5c" stroke-width="2.5" fill="none"/><rect x="7.5" y="17" width="5" height="8" rx="2" fill="#7b61ff"/><rect x="31.5" y="17" width="5" height="8" rx="2" fill="#7b61ff"/><path d="M10 25 q2 6 8 5" stroke="#2b1f5c" stroke-width="1.2" fill="none"/>`;
  if(wear.head==="crown") s+=`<path d="M12 12 l3 -8 4 5 3 -7 3 7 4 -5 3 8 z" fill="#ffc93c" stroke="#b47a00" stroke-width="1"/><circle cx="22" cy="9" r="1.3" fill="#ef4b5a"/>`;
  if(wear.head2==="pin") s+=`<path d="M31 9 l1.4 3 3.2.4 -2.4 2.2.7 3.2 -2.9-1.6 -2.9 1.6.7-3.2 -2.4-2.2 3.2-.4z" fill="#ffc93c" stroke="#b47a00" stroke-width=".6"/>`;
  return s+`</svg>`;
}

/* ---------- 게임 화면(버그 연출) ---------- */
function gameArt(kind, total, fixed){
  const b=K().biz||"goal", W=320, H=150;
  let s=`<svg class="k-art" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  if(b==="goal"){ s+=`<rect width="${W}" height="${H}" fill="#3fbf6e"/>`; for(let x=0;x<W;x+=40) s+=`<rect x="${x}" y="0" width="20" height="${H}" fill="#36ad62"/>`;
    s+=`<rect x="8" y="8" width="${W-16}" height="${H-16}" fill="none" stroke="#fff" stroke-width="3"/><line x1="${W/2}" y1="8" x2="${W/2}" y2="${H-8}" stroke="#fff" stroke-width="3"/><circle cx="${W/2}" cy="${H/2}" r="22" fill="none" stroke="#fff" stroke-width="3"/>
      <rect x="8" y="45" width="26" height="60" fill="none" stroke="#fff" stroke-width="3"/><rect x="${W-34}" y="45" width="26" height="60" fill="none" stroke="#fff" stroke-width="3"/>
      <circle cx="${W/2+40}" cy="${H/2+20}" r="9" fill="#fff" stroke="#2b1f5c" stroke-width="2"/><path d="M${W/2+36} ${H/2+16} l4 -2 4 2 -1 4 h-6z" fill="#2b1f5c"/>`; }
  else if(b==="race"){ s+=`<rect width="${W}" height="${H}" fill="#8fd16a"/><path d="M-10 115 C 80 40, 200 150, 340 60 L340 100 C 200 190, 80 80, -10 155z" fill="#5d5f6b"/>
      <path d="M-10 135 C 80 60, 200 170, 340 80" stroke="#fff" stroke-width="3" stroke-dasharray="12 10" fill="none"/>`;
    for(let i=0;i<6;i++) s+=`<rect x="${270+(i%2)*10}" y="${10+Math.floor(i/2)*10}" width="10" height="10" fill="${(i+Math.floor(i/2))%2?"#fff":"#2b1f5c"}"/>`;
    s+=`<rect x="268" y="10" width="2" height="50" fill="#2b1f5c"/><g transform="translate(60 112)"><rect x="-16" y="-8" width="32" height="12" rx="4" fill="#ef4b5a" stroke="#2b1f5c" stroke-width="2"/><circle cx="-10" cy="5" r="5" fill="#2b1f5c"/><circle cx="10" cy="5" r="5" fill="#2b1f5c"/><circle cx="0" cy="-12" r="6" fill="#ffc93c" stroke="#2b1f5c" stroke-width="2"/></g>`; }
  else { s+=`<rect width="${W}" height="${H}" fill="#f4d9a6"/><rect y="50" width="${W}" height="35" fill="#e8c088"/><rect y="85" width="${W}" height="35" fill="#d9a86a"/><rect y="120" width="${W}" height="30" fill="#c58e50"/>
      <g fill="#fffaf0" stroke="#8a5a1c" stroke-width="2"><path d="M60 100 q30 -25 70 -10 q20 8 40 0" fill="none" stroke-width="7" stroke="#fffaf0"/><circle cx="185" cy="88" r="13"/><circle cx="190" cy="85" r="3" fill="#8a5a1c"/>
      <rect x="80" y="100" width="6" height="22" rx="3"/><rect x="120" y="98" width="6" height="22" rx="3"/></g>
      <path d="M250 20 l10 30 h-20z" fill="#7b61ff"/><rect x="246" y="48" width="8" height="30" fill="#8a5a1c"/>`; }
  const pos=[[40,30],[150,24],[255,95],[95,62],[205,58],[30,110],[280,40],[175,118],[120,128],[60,76]];
  for(let i=0;i<total;i++){ const [x,y]=pos[i%pos.length];
    s+= i<fixed ? `<g transform="translate(${x} ${y})"><path d="M0 -10 L3 -3 10 0 3 3 0 10 -3 3 -10 0 -3 -3z" fill="#ffc93c" stroke="#fff" stroke-width="1.5"/></g>`
      : `<g transform="translate(${x} ${y})"><g class="k-bug"><ellipse rx="10" ry="8" fill="#7b2fd6" stroke="#2b1f5c" stroke-width="2"/><line x1="0" y1="-8" x2="0" y2="8" stroke="#2b1f5c" stroke-width="1.5"/><circle cx="-4" cy="-3" r="2" fill="#ffc93c"/><circle cx="4" cy="2" r="2" fill="#ffc93c"/>
         <path d="M-10 -2 l-5 -3 M-10 3 l-5 3 M10 -2 l5 -3 M10 3 l5 3 M-3 -8 l-3 -5 M3 -8 l3 -5" stroke="#2b1f5c" stroke-width="1.5"/></g></g>`; }
  return s+`</svg>`;
}

/* ---------- 문제 한 개 화면 ---------- */
function readBtn(q){ return `<button class="k-read" data-kact="read" data-text="${esc(q.p+(q.t==="choice"?". "+q.c.map((c,j)=>(j+1)+"번 "+c).join(". "):""))}" aria-label="문제 읽어 주기">🔊</button>`; }
function qCard(doc,ds,i,opt){
  const q=doc.qs[i], a=ds.answers[i]; opt=opt||{};
  const editable = !a || (opt.retry && !a.correct);
  let ans="";
  if(q.t==="choice"){ const sel=ds.draft[i] ?? (editable?null:a.resp);
    ans=`<div class="k-choices">${q.c.map((c,j)=>`<button class="k-choice ${!editable&&a&&j===q.a&&a.correct?"ok":""} ${!editable&&a&&j===a.resp&&!a.correct?"no":""}" data-choice="${i}" data-val="${j}" aria-pressed="${sel===j}" ${editable?"":"disabled"}><span>${j+1}</span>${esc(c)}</button>`).join("")}</div>
      ${editable?`<button class="k-go" data-submit="${i}" ${sel==null?"disabled":""}>확인</button>`:""}`; }
  else { const val=editable ? (ds.draft[i]??"") : a.resp;
    ans=`<div class="k-input"><label class="sr" for="in-${doc.id}-${i}">답</label><input id="in-${doc.id}-${i}" data-input="${i}" ${q.t==="num"?'inputmode="numeric"':'inputmode="text"'} autocomplete="off" enterkeyhint="done" placeholder="답을 써요" value="${esc(val)}" ${editable?"":"disabled"}>
      ${editable?`<button class="k-go" data-submit="${i}">확인</button>`:""}</div>`; }
  return `<div class="k-q"><div class="k-q-top"><span class="k-tag">${esc(q.gl||"버그")} ${i+1}</span>${readBtn(q)}</div>${q.fig?`<div class="k-fig">${q.fig}</div>`:""}<p class="k-p">${esc(q.p)}</p>${ans}</div>`;
}

/* ---------- 층 화면 (수학·국어·과학 개발실) ---------- */
function kHead(title, sub, back){
  return `<div class="k-head"><button class="k-back" data-kact="${back||"lift"}">${back==="home"||back==="card-close"?"← 스테이지":"← 건물"}</button><div class="k-ttl"><b>${esc(title)}</b>${sub?`<small>${esc(sub)}</small>`:""}</div><div class="k-plays" title="오늘 테스트">🎮 ${playsToday()}/${dailyMax()}</div></div>`;
}
function renderFloor(){
  const subj=S.subject, k=K(); S.free=null;
  const D=DEPTS[subj];
  if(!S.placed[subj]) return renderKidPlacement(subj);
  if(k.card){ const cs=stageByKey(k.card); if(cs && cs.subj===subj) return renderCard(cs); }
  const p=k.play[subj]; k.hold=k.hold||{};
  if(p && getDoc(p) && !docState(p).completedAt && k.hold[subj]!==p) return renderPlay(getDoc(p));
  if(p && getDoc(p) && docState(p).completedAt && docState(p).kshow) return renderResult(getDoc(p));
  return renderStageHome(subj);
}
function renderStageHome(subj){
  const k=K(), D=DEPTS[subj], L=curSeries(subj), stages=stagesOf(subj,L), done=stages.filter(s=>stSt(s.key).mastered).length;
  const max=Math.max(k.maxSeries[subj]??0, L);
  const wrongN=pendingWrong().filter(w=>getDoc(w.docId).subject===subj).length;
  const statusUi=st=>{ const s=stSt(st.key), ss=stageStatus(st.key);
    const pieces=`<span class="k-pcs">${Array.from({length:KID.piecesForBoss},(_,j)=>`<i class="${j<Math.min(s.pieces,KID.piecesForBoss)?"on":""}"></i>`).join("")}</span>`;
    const btn = ss==="done" ? `<button class="k-btn ghost" data-kact="test" data-stage="${st.key}" ${canPlay()?"":"disabled"}>복습 테스트</button>`
      : ss==="check" ? `<button class="k-btn hot" data-kact="check" data-stage="${st.key}">확인 문제 3개 풀기</button>`
      : ss==="wait" ? `<button class="k-btn ghost" disabled>내일 확인 문제가 열려요</button>`
      : ss==="boss" ? `<button class="k-btn hot" data-kact="boss" data-stage="${st.key}" ${canPlay()?"":"disabled"}>👾 최종 점검 도전</button><button class="k-btn ghost" data-kact="test" data-stage="${st.key}" ${canPlay()?"":"disabled"}>테스트 더 하기</button>`
      : `<button class="k-btn" data-kact="test" data-stage="${st.key}" ${canPlay()?"":"disabled"}>🐛 게임 테스트 (버그 5개)</button>`;
    const lab = {done:"⭐ 완성",check:"✅ 확인 문제 열림",wait:"⏳ 최종 점검 통과! 내일 확인",boss:"👾 최종 점검 열림",test:"테스트 중"}[ss];
    return `<li class="k-stage ${ss}"><div class="k-st-h"><b>스테이지 ${st.i+1}${st.title?`<small class="k-st-t">${esc(st.title)}</small>`:""}</b><span class="k-st-lab">${lab}</span></div>
      ${st.concepts.length===1&&st.concepts[0]===st.title?"":`<div class="k-chips">${st.concepts.map(c=>`<span class="k-chip ${learnState(subj,c)}">${esc(c)}</span>`).join("")}</div>`}
      ${ss==="test"||ss==="boss"?`<div class="k-st-p">테스트 조각 ${pieces} <small>${Math.min(s.pieces,KID.piecesForBoss)}/${KID.piecesForBoss}</small></div>`:""}
      <div class="k-st-b">${btn}<button class="k-btn small ghost" data-kact="card" data-stage="${st.key}">📖 개념 보기</button></div></li>`; };
  const rel=k.released.filter(r=>r.subj===subj);
  const st2=stages.map(s=>({s,ss:stageStatus(s.key)}));
  const firstTest=st2.find(x=>x.ss==="test");
  const now=st2.filter(x=>["check","boss","wait"].includes(x.ss) || x===firstTest);
  const doneL=st2.filter(x=>x.ss==="done"), later=st2.filter(x=>x.ss==="test" && x!==firstTest);
  const path=`<div class="k-path" aria-label="스테이지 지도: ${stages.length}개 중 ${done}개 완성">${st2.map(x=>`<span class="k-node ${x.ss} ${now.includes(x)?"now":""}" title="스테이지 ${x.s.i+1}${x.s.title?" "+esc(x.s.title):""}">${x.ss==="done"?"⭐":x.s.i+1}</span>`).join("")}</div>`;
  const mini=x=>`<li class="k-mini"><span><b>${x.s.i+1}</b> ${esc(x.s.title||x.s.concepts.join(" · "))}</span><button class="k-btn small ghost" data-kact="test" data-stage="${x.s.key}" ${canPlay()?"":"disabled"}>${x.ss==="done"?"복습":"미리 해 보기"}</button></li>`;
  const p=k.play[subj], resume = p&&getDoc(p)&&!docState(p).completedAt ? `<button class="k-repair-link resume" data-kact="resume">▶ 하던 ${esc(getDoc(p).title)} 이어 하기 (${Object.keys(docState(p).answers).length}/${getDoc(p).qs.length})</button>` : "";
  return kHead(`${D.floor} ${D.name}`, `${seriesName(subj,L)} · ${SERIES[L].label}`) + `<div class="k-wrap">
    ${resume}
    ${now.length?`<ul class="k-stages">${now.map(x=>statusUi(x.s)).join("")}</ul>`:`<section class="k-res"><h2>모두 완성! 🎉</h2><p>이 편의 스테이지를 다 완성했어요.</p></section>`}
    ${canPlay()?bubble("greet"):`<div class="k-done-day">${bubble("greet",null,"오늘 테스트 끝! 내일 또 만나요.")}<p>${esc(stopReason())}. 버그 수리실·매점·부화소는 계속 갈 수 있어요.</p></div>`}
    ${wrongN?`<button class="k-repair-link" data-kact="go-repair">🔧 고칠 버그 ${wrongN}개가 수리실에서 기다려요 →</button>`:""}
    ${path}
    ${later.length?`<details class="k-det"><summary>다음 스테이지 ${later.length}개</summary><ul class="k-list">${later.map(mini).join("")}</ul></details>`:""}
    ${doneL.length?`<details class="k-det"><summary>⭐ 완성한 스테이지 ${doneL.length}개</summary><ul class="k-list">${doneL.map(mini).join("")}</ul></details>`:""}
    <details class="k-det"><summary>다른 편 · 출시한 게임</summary>
      <div class="k-eps" role="tablist" aria-label="시리즈" style="margin-top:8px">${SERIES.map((s,i)=>`<button class="k-ep ${i===L?"on":""}" data-kact="series" data-l="${i}" ${i>max?"disabled":""} aria-label="${i+1}편 ${esc(SERIES[i].label)}${i>max?" (잠김)":""}">${i+1}편</button>`).join("")}</div>
      <p class="k-sub">스테이지를 다 완성하면 게임이 출시되고 다음 편이 열려요.</p>
      ${rel.length?rel.map(r=>`<span class="k-cart">${esc(r.title)}</span>`).join(""):""}
      <p class="k-foot" style="margin-top:10px"><button class="linkbtn" data-kact="replace" data-subj="${esc(subj)}">입사 테스트 다시 보기</button></p></details>
  </div>`;
}
function renderPlay(doc){
  activeDocId=doc.id; const ds=docState(doc.id), n=doc.qs.length, st=stageByKey(doc.stage);
  let cur=ds.kcur??0; if(cur>=n) cur=n-1;
  const fixed=doc.qs.filter((_,i)=>ds.answers[i]?.correct).length, answered=doc.qs.filter((_,i)=>ds.answers[i]).length;
  const a=ds.answers[cur];
  let fb="";
  if(a){ const last=cur>=n-1 || doc.qs.every((_,j)=>ds.answers[j]);
    fb = a.correct ? `<div class="k-fb ok"><b>버그 해결! ✨</b>${bubble("right")}</div>`
      : `<div class="k-fb no"><b>앗, 아까워요!</b><p>${doc.kid==="boss"?"이 문제는 버그 수리실로 보내 둘게요. 점검이 끝나면 같이 고쳐요.":"이 버그는 버그 수리실(2F)로 보냈어요. 거기서 힌트 보면서 다시 풀어요."}</p>${bubble("retry")}</div>`;
    fb += `<div class="k-next">${answered>=n?`<button class="k-btn hot big" data-kact="finish">${doc.kid==="boss"?"점검 끝내기":doc.kid==="check"?"확인 끝내기":"테스트 끝내기"}</button>`:`<button class="k-btn big" data-kact="next-q">다음 버그 →</button>`}</div>`; }
  const label = doc.kid==="boss"?"👾 스테이지 최종 점검":doc.kid==="check"?"✅ 완벽 습득 확인":"🐛 게임 테스트";
  return kHead(label, `${seriesName(doc.subject,doc.gi)} · 스테이지 ${st.i+1}${st.title?" "+st.title:""}`, "home") + `<div class="k-wrap">
    <div class="k-game">${gameArt(doc.kid,n,fixed)}<div class="k-prog">${doc.qs.map((_,i)=>`<i class="${ds.answers[i]?(ds.answers[i].correct?"ok":"no"):i===cur?"cur":""}"></i>`).join("")}</div></div>
    ${doc.kid==="boss"?`<p class="k-note">힌트 없이 ${n}문제 중 ${KID.bossPass}개 이상 맞히면 통과예요. 천천히 해요.</p>`:""}
    ${qCard(doc,ds,cur)}${fb}</div>`;
}
function renderResult(doc){
  const ds=docState(doc.id), r=ds.kres||{}, n=doc.qs.length, ok=doc.qs.filter((_,i)=>ds.answers[i]?.correct).length, st=stageByKey(doc.stage);
  let head, body="";
  if(doc.kid==="test"){ head="테스트 끝!"; body=`<p>버그 <b>${ok}/${n}</b>개 해결 · 월급 <b>${won(KID.payTest)}</b> · 테스트 조각 +1</p>${r.bossOpen?`<p class="k-hl">👾 조각을 다 모았어요! 이제 스테이지 최종 점검에 도전할 수 있어요.</p>`:""}`; }
  else if(doc.kid==="boss"){ head=r.pass?"최종 점검 통과! 🎉":"최종 점검 결과";
    body= r.pass ? `<p><b>${ok}/${n}</b> 정답 · 월급 ${won(KID.payTest)} + 보너스 <b>${won(KID.payBoss)}</b></p><p class="k-hl">내일 확인 문제 3개를 모두 맞히면 ‘완벽 습득’으로 스테이지가 완성돼요.</p>`
      : `<p><b>${ok}/${n}</b> 정답 · 통과까지 ${KID.bossPass-ok}개 남았어요. 월급 ${won(KID.payTest)}</p><p>틀린 문제는 버그 수리실에 있어요. 고치고 다시 도전해요. 벌점은 없어요!</p>`; }
  else { head=r.pass?"스테이지 완성! ⭐":"한 번 더 다지기";
    body= r.pass ? `<p>확인 문제 <b>${ok}/${n}</b> — 이 스테이지는 완벽하게 익혔어요!</p>` : `<p>확인 문제 <b>${ok}/${n}</b>. 틀린 개념을 수리실에서 복습하고, 최종 점검을 한 번 더 봐요.</p>`; }
  const cat = doc.kid==="check"&&r.pass ? "clear" : (doc.kid==="boss"&&r.pass) ? "clear" : ok>=n-1 ? "right" : "retry";
  return kHead(head, `${seriesName(doc.subject,doc.gi)} · 스테이지 ${st.i+1}${st.title?" "+st.title:""}`, "home") + `<div class="k-wrap"><section class="k-res">
    <div class="k-game">${gameArt(doc.kid,n,ok)}</div><h2>${esc(head)}</h2>${body}${bubble(cat)}
    <div class="k-next"><button class="k-btn big hot" data-kact="home">스테이지로</button>${pendingWrong().some(w=>w.docId===doc.id)?`<button class="k-btn big" data-kact="go-repair">버그 수리실 가기</button>`:""}</div></section></div>`;
}

/* ---------- 입사 테스트 (배치고사) ---------- */
function plStart(subj){
  S.pl[subj]={items:[], done:false, startedAt:Date.now()}; delete S.docs["PL-"+subj];
  const L0 = gradeToL(K().grade||3);
  S.pl[subj].items.push(plItem(subj, L0, [])); save();
}
function plAfterAnswer(subj){
  const pl=S.pl[subj], ds=docState("PL-"+subj), n=pl.items.length;
  CONFIG.placeStart = gradeToL(K().grade||3);
  const {m,sd}=eap(pl.items, ds.answers); pl.theta=m; pl.sd=sd;
  const top=m>MAXLV-0.2 && sd<0.9, bottom=m<0.2 && sd<0.9;
  if((n>=CONFIG.placeMin && (sd<0.6 || top || bottom)) || n>=CONFIG.placeMax){
    pl.done=true; pl.est=Math.max(0,Math.min(MAXLV,Math.floor(m+0.25))); pl.n=n; archivePlacementWrong(subj);
    pl.ok=pl.items.filter((_,i)=>ds.answers[i]?.correct).length; save(); render(false); showPlacementResult(subj); return; }
  const next=Math.max(0,Math.min(MAXLV,Math.round(m)));
  pl.items.push(plItem(subj,next,pl.items.map(q=>q.bank).filter(Boolean))); save();
}
function renderKidPlacement(subj){
  const k=K(), D=DEPTS[subj];
  if(!S.pl[subj]) { if(!k.plIntro || k.plIntro!==subj) return kHead(`${D.floor} ${D.name}`,"입사 테스트") + `<div class="k-wrap"><section class="k-res"><h2>입사 테스트</h2>
      <p>${esc(D.label)} 문제를 몇 개 풀면, 어느 편부터 만들면 좋을지 알려 줘요. 틀려도 괜찮아요. 모르면 ‘모름’이라고 써도 돼요.</p>${bubble("greet")}
      <div class="k-next"><button class="k-btn big hot" data-kact="pl-go" data-subj="${esc(subj)}">시작하기</button></div></section></div>`;
    plStart(subj); }
  const pl=S.pl[subj], doc=getDoc("PL-"+subj), ds=docState(doc.id); activeDocId=doc.id;
  if(pl.done) return kHead(`${D.floor} ${D.name}`,"입사 테스트") + `<div class="k-wrap"><section class="k-res"><h2>입사 테스트 끝!</h2><p>결과를 보고 시작할 편을 골라요.</p><div class="k-next"><button class="k-btn big hot" data-act="pl-result">결과 보기</button></div></section></div>`;
  const i=doc.qs.findIndex((_,j)=>!ds.answers[j]);
  return kHead("입사 테스트", `${D.label} · ${Object.keys(ds.answers).length+1}번째 문제`) + `<div class="k-wrap"><p class="k-note">정답은 끝나고 알려 줘요. 생각나는 대로 써요.</p>${qCard(doc,ds,i<0?doc.qs.length-1:i)}</div>`;
}
function showPlacementResult(subj){
  const kg=K().grade||6, pl=S.pl[subj], lv=pl.est??0, cap=kg-1;
  /* 배치 수준(0~3) → 편: 3·4학년, 5·6학년 수준은 학년에 맞춰 둘 중 하나 */
  const raw = lv<=1 ? lv : lv===2 ? (kg>=4?3:2) : (kg>=6?5:4), est=Math.min(raw,cap), D=DEPTS[subj];
  showModal(`<div class="nt-h">입사 테스트 결과</div><p class="nt-to">${esc(D.name)} · ${esc(S.name||"신입사원")}</p>
    <div class="nt-rank"><small>추천 시작</small><b>${est+1}편</b><span>${esc(SERIES[est].label)} 과정 · ${esc(bizOf().game)}</span></div>
    <p class="nt-meta">${pl.n}문제 중 ${pl.ok}개 정답${raw>cap?` · 실력은 더 위 편도 되지만, 지금 학년(${kg}학년) 편까지만 열어요`:""}</p>
    <button class="btn primary" style="width:100%" data-kact="pick-series" data-l="${est}">${est+1}편부터 시작</button>
    ${est>0?`<div class="pick-grid" style="margin-top:10px">${SERIES.slice(0,est).map((s,i)=>`<button class="btn" data-kact="pick-series" data-l="${i}">${i+1}편<small>${esc(s.label)}</small></button>`).reverse().join("")}</div>`:""}`);
}

/* ---------- 끝내기 · 월급 · 승진 · 출시 ---------- */
function kidFinish(){
  const doc=getDoc(activeDocId), ds=docState(activeDocId); if(!doc||!doc.kid||!allSubmitted(doc,ds)||ds.completedAt) return;
  const k=K(), st=stageByKey(doc.stage), s=stSt(st.key), n=doc.qs.length, ok=doc.qs.filter((_,i)=>ds.answers[i]?.correct).length;
  ds.completedAt=Date.now(); ds.kshow=true; const r=ds.kres={};
  const beforeRank=companyIdx();
  let pay=0;
  if(doc.kid==="test"||doc.kid==="boss"){ playsToday(); k.day.plays++;
    if(post("kpay-"+doc.id, doc.kid==="boss"?"최종 점검 월급":"게임 테스트 월급", KID.payTest, "월급")) pay+=KID.payTest; }
  if(doc.kid==="test"){ s.pieces++; r.bossOpen = s.pieces===KID.piecesForBoss && !s.mastered && !s.passDay; }
  if(doc.kid==="boss"){ s.boss++; r.pass = ok>=KID.bossPass && doc.qs.every((_,i)=>!ds.answers[i]?.hint);
    if(r.pass){ s.passDay=today_(); if(post("kboss-"+doc.id,"최종 점검 통과 보너스",KID.payBoss,"보너스 월급")) pay+=KID.payBoss; } }
  if(doc.kid==="check"){ r.pass = ok===n;
    if(r.pass){ s.mastered=true; s.masteredAt=Date.now(); }
    else { s.passDay=null; } }
  save(); render(false); window.scrollTo(0,0);
  if(pay) depositPopup(pay, "월급이 들어왔어요");
  setTimeout(()=>kSfx(r.pass?"clear":"done"), pay?650:0);
  if(doc.kid==="check" && r.pass){
    const after=()=>{ const up=companyIdx()>beforeRank, upTxt=up?`<p class="nt-meta" style="font-weight:700">그리고 승진했어요! ${esc(COMPANY[companyIdx()-1])} → ${esc(COMPANY[companyIdx()])}</p>`:""; const all=stagesOf(st.subj,st.gi).every(x=>stSt(x.key).mastered);
      if(all && !k.released.some(x=>x.subj===st.subj&&x.gi===st.gi)){ const title=seriesName(st.subj,st.gi);
        k.released.push({subj:st.subj, gi:st.gi, title, at:Date.now()}); if(st.gi<MAXK){ k.maxSeries[st.subj]=Math.max(k.maxSeries[st.subj]??0, st.gi+1); if(curSeries(st.subj)===st.gi) k.series[st.subj]=st.gi+1; } save();
        showModal(`<div class="nt-h">게임 출시! 🎮</div><p class="nt-to">${esc(bizOf().name)}</p><div class="nt-rank"><small>${esc(SERIES[st.gi].label)} 스테이지 전부 완성</small><b style="font-size:24px">${esc(title)}</b><span>출시 목록에 올라갔어요</span></div>${upTxt}${bubble("clear")}<button class="btn primary" style="width:100%" data-act="close-modal">야호!</button>`); }
      else if(companyIdx()>beforeRank){ const i=companyIdx();
        showModal(`<div class="nt-h">승진 발표</div><p class="nt-to">리로루로게임즈 · ${esc(S.name||"신입사원")}</p><div class="nt-rank"><small>완성한 스테이지 ${masteredCount()}개</small><b>${esc(COMPANY[i-1])} → ${esc(COMPANY[i])}</b><span>축하해요!</span></div>${bubble("clear")}<button class="btn primary" style="width:100%" data-act="close-modal">고마워요!</button>`); } };
    showModal(`<div class="nt-h">스테이지 완성! ⭐</div><p class="nt-to">${esc(seriesName(st.subj,st.gi))} · 스테이지 ${st.i+1}</p><div class="nt-rank"><small>완벽 습득</small><b style="font-size:24px">${st.concepts.map(esc).join(" · ")}</b><span>게임 지도에 불이 켜졌어요</span></div>${bubble("clear")}<button class="btn primary" style="width:100%" data-kact="after-clear">좋아요!</button>`);
    KAFTER=after; }
}
let KAFTER=null;

/* ---------- 2F 버그 수리실 (오답) ---------- */
function renderWrongFloor(){
  activeDocId=null; const k=K();
  const rid=k.repair && getDoc(k.repair) ? k.repair : null;
  if(rid && !docState(rid).completedAt) return renderRepair(getDoc(rid));
  const pend=pendingWrong();
  const by=Object.keys(DEPTS).map(sj=>[sj,pend.filter(w=>getDoc(w.docId).subject===sj).length]);
  return kHead("2F 버그 수리실","틀린 문제를 힌트 보며 고쳐요") + `<div class="k-wrap">
    ${bubble(pend.length?"retry":"greet", null, pend.length?null:"고칠 버그가 하나도 없네요. 대단해요!")}
    <ul class="k-stages">${by.map(([sj,n])=>`<li class="k-stage"><div class="k-st-h"><b>${esc(DEPTS[sj].label)} 버그</b><span class="k-st-lab">${n}개</span></div>
      <div class="k-st-b"><button class="k-btn ${n?"hot":"ghost"}" data-kact="repair" data-subj="${esc(sj)}" ${n?"":"disabled"}>🔧 수리 시작${n>5?" (5개씩)":""}</button></div></li>`).join("")}</ul>
    ${pend.length?`<details class="k-det"><summary>고칠 버그 목록 ${pend.length}개</summary><ul class="k-list">${pend.slice().reverse().map(w=>{ const d=getDoc(w.docId), q=d.qs[w.qi]; return `<li><b>${esc(q.p)}</b><small>${esc(DEPTS[d.subject].label)} · ${esc(conceptOf(q,d.subject).name)}</small></li>`; }).join("")}</ul></details>`:""}
  </div>`;
}
function renderRepair(doc){
  const ds=docState(doc.id), n=doc.qs.length; activeDocId=doc.id;
  let cur=ds.kcur??0; if(cur>=n) cur=n-1;
  const q=doc.qs[cur], a=ds.answers[cur], steps=hintSteps(q,doc.subject);
  const fixed=doc.qs.filter((_,i)=>ds.answers[i]?.correct).length;
  let extra="";
  if(a && a.correct){ extra=`<div class="k-fb ok"><b>수리 완료! 🔧✨</b>${bubble("right")}</div>`; }
  else if(a){ const tries=a.attempts||1, shown=Math.min(tries,steps.length);
    extra=`<div class="k-fb no"><b>${tries===1?"아깝다! 힌트를 줄게요":"거의 다 왔어요!"}</b>${steps.slice(0,shown).map(h=>`<div class="concept">${h}</div>`).join("")}
      ${tries>steps.length?`<div class="concept"><span class="concept-h">설명</span><span class="concept-b">정답: <b>${esc(answerLabel(q))}</b><br>${esc(q.ex||"")}</span></div>${conceptsHtml(q,doc.subject)}`:""}
      <p>${tries>steps.length?"설명을 읽고 한 번 더 풀어 봐요.":"힌트를 보고 다시 풀어 봐요."}</p></div>`; }
  const isLast=cur>=n-1, nav = (a&&a.correct) ? `<div class="k-next">${isLast?`<button class="k-btn big hot" data-kact="repair-end">수리 끝내기</button>`:`<button class="k-btn big" data-kact="next-q">다음 버그 →</button>`}</div>`
    : (a && (a.attempts||1)>steps.length) ? `<div class="k-next"><button class="k-btn ghost" data-kact="${isLast?"repair-end":"next-q"}">${isLast?"나중에 고칠게요":"이건 나중에, 다음 버그 →"}</button></div>` : "";
  return kHead("🔧 버그 수리", `${DEPTS[doc.subject].label} · ${cur+1}/${n}`, "repair-out") + `<div class="k-wrap">
    <div class="k-game">${gameArt("repair",n,fixed)}</div>${qCard(doc,ds,cur,{retry:true})}${extra}${nav}</div>`;
}

/* ---------- 1F 리로루로은행 · 매점 ---------- */
function acctNo(){ return "리로루로 "+(S.empNo||"GN-0000-0000").slice(3).replace("-","-0")+"-01"; }
function renderBank(){
  activeDocId=null; const k=K(), bal=balance(), tx=(S.ledger||[]).slice().reverse();
  return `<div class="k-wrap">
    <section class="k-bankcard"><small>리로루로은행 월급 통장 · 가상 돈</small><b>${won(bal)}</b><span>${esc(acctNo())}</span></section>
    ${bubble("pay")}
    <section class="k-shop"><h3>🍪 회사 매점 · 간식</h3><p class="k-sub">간식 하나 ${won(KID.snackPrice)} · 부화소에서 알에게 먹여요 · 지금 간식 <b>${k.snacks}개</b></p>
      <div class="k-row"><button class="k-btn" data-kact="buy-snack" data-n="1" ${bal<KID.snackPrice?"disabled":""}>간식 1개 사기</button><button class="k-btn" data-kact="buy-snack" data-n="3" ${bal<KID.snackPrice*3?"disabled":""}>3개 사기</button></div></section>
    <section class="k-shop"><h3>👕 회사 매점 · 옷</h3><p class="k-sub">산 옷은 8층 인사팀에서 입고 벗을 수 있어요. 사원증에 보여요.</p>
      <ul class="k-clo">${CLOTHES.map(c=>{ const own=k.clothes.includes(c.id);
        return `<li><div class="k-clo-av">${avatarSvg(44,56,{[c.slot]:c.id})}</div><b>${esc(c.name)}</b><small>${won(c.price)}</small>${own?`<span class="pill ok">가지고 있어요</span>`:`<button class="k-btn small" data-kact="buy-cloth" data-id="${c.id}" ${bal<c.price?"disabled":""}>사기</button>`}</li>`; }).join("")}</ul></section>
    <section class="k-shop"><h3>통장 내역</h3>${tx.length?`<ul class="k-tx">${tx.slice(0,40).map(t=>{ const d=new Date(t.at); return `<li><span><b>${esc(t.label)}</b><small>${d.getMonth()+1}.${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}</small></span><em class="${t.amount<0?"out":""}">${t.amount<0?"−":"+"}${won(Math.abs(t.amount))}</em></li>`; }).join("")}</ul>`:`<p class="k-sub">아직 내역이 없어요. 게임 테스트를 하면 월급이 들어와요.</p>`}</section>
  </div>`;
}
function spend(amount,label){ if(balance()<amount) return false; S.ledger.push({key:"buy-"+Date.now()+"-"+Math.random().toString(36).slice(2,6), label, amount:-amount, tax:"매점", at:Date.now()}); return true; }
function depositPopup(amount,label){
  kSfx("coin");
  const after=balance(), before=Math.max(0,after-amount);
  const old=document.getElementById("dep"); if(old) old.remove();
  const el=document.createElement("div"); el.className="dep-back"; el.id="dep";
  el.innerHTML=`<div class="dep-card" role="alert"><div class="dep-h">리로루로은행 · 월급 알림<span class="bk-virtual">가상 돈</span></div>
    <div class="dep-lbl">${esc(label||"월급")}</div><div class="dep-amt">+${won(amount)}</div>
    <div class="dep-bal-l">지금 통장</div><div class="dep-bal" id="dep-bal">${won(before)}</div>
    <button class="btn primary" id="dep-ok" style="margin-top:14px;width:100%">좋아요</button></div>`;
  document.body.appendChild(el);
  const balEl=el.querySelector("#dep-bal"), card=el.querySelector(".dep-card"), close=()=>el.remove();
  el.querySelector("#dep-ok").onclick=close; el.onclick=e=>{ if(e.target===el) close(); };
  if(reduce){ balEl.textContent=won(after); return; }
  const dur=1200, t0=performance.now();
  const step=now=>{ if(!document.getElementById("dep")) return; const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
    balEl.textContent=won(Math.round(before+(after-before)*e)); if(p<1) requestAnimationFrame(step); else { card.classList.add("done"); setTimeout(()=>{ if(document.getElementById("dep")===el) close(); },3000); } };
  setTimeout(()=>requestAnimationFrame(step),300);
}

/* ---------- 옥상 부화소 ---------- */
const K_EGGS = {
  quail:  {name:"메추리알", need:3,  odds:[100,0,0], fill:"#F1E6D2", spots:"#B79F7A", days:"약 1일"},
  chicken:{name:"달걀",     need:6,  odds:[85,14,1], fill:"#FFE9C7", days:"약 2일"},
  ostrich:{name:"타조알",   need:12, odds:[65,30,5], fill:"#F6EEDF", spots:"#D9CBB2", days:"약 4일"},
  dino:   {name:"공룡알",   need:24, odds:[40,45,15], fill:"#CFE8B4", spots:"#8DBB6A", days:"약 8일"}
};
const K_EGG_ORDER=["quail","chicken","ostrich","dino"];
function eggOpen(e){ const h=K().hatched; return e==="ostrich" ? (h.chicken||0)>=3 : e==="dino" ? (h.ostrich||0)>=2 : true; }
function eggLock(e){ const h=K().hatched; return e==="ostrich" ? `달걀 3개 부화하면 열려요 (${Math.min(3,h.chicken||0)}/3)` : `타조알 2개 부화하면 열려요 (${Math.min(2,h.ostrich||0)}/2)`; }
function eggSvg(e,size,cracks,shake){
  const E=K_EGGS[e]; const sp=E.spots?`<circle cx="22" cy="30" r="3.5" fill="${E.spots}"/><circle cx="39" cy="46" r="4.5" fill="${E.spots}"/><circle cx="28" cy="58" r="3" fill="${E.spots}"/>`:"";
  const cr=["M30 20 l4 6 -4 4 5 6","M18 44 l6 2 2 6 6 1","M40 30 l-5 6 4 5 -3 6"].slice(0,cracks).map(d=>`<path d="${d}" stroke="#5b4a3a" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("");
  return `<svg class="${shake?"k-shake":""}" width="${size}" height="${size*1.2}" viewBox="0 0 60 72" aria-hidden="true"><ellipse cx="30" cy="68" rx="18" ry="3" fill="rgba(0,0,0,.12)"/><path d="M30 4 C 14 4, 6 30, 6 44 C 6 60, 17 68, 30 68 C 43 68, 54 60, 54 44 C 54 30, 46 4, 30 4z" fill="${E.fill}" stroke="#2b1f5c" stroke-width="2.2"/>${sp}${cr}<ellipse cx="20" cy="22" rx="4" ry="7" fill="#fff" opacity=".6"/></svg>`;
}
function rollChar(e){
  const odds=K_EGGS[e].odds; let r=Math.random()*100, g=0; for(;g<3;g++){ if(r<odds[g]) break; r-=odds[g]; } g=Math.min(g,2);
  const G=["일반","레어","전설"], s1=K_DATA.characters.filter(c=>c.season===1).every(c=>K().dex[c.id]), seasons=s1?[1,2]:[1];
  let pool=K_DATA.characters.filter(c=>seasons.includes(c.season)&&c.grade===G[g]); if(!pool.length) pool=K_DATA.characters.filter(c=>seasons.includes(c.season)&&c.grade==="일반");
  return kpick(pool).id;
}
let KSHAKE=false;
function renderRoof(){
  activeDocId=null; const k=K(), nest=k.nest;
  const own=K_DATA.characters.filter(c=>k.dex[c.id]), s1=K_DATA.characters.filter(c=>c.season===1).every(c=>k.dex[c.id]);
  const shown=K_DATA.characters.filter(c=>c.season===1||s1);
  let main;
  if(nest){ const E=K_EGGS[nest.egg], fed=nest.fed, need=E.need, cr=fed===0?0:Math.min(3,Math.ceil(fed/need*3)-(fed>=need?0:0));
    main=`<section class="k-nest"><h3>${esc(E.name)} 품는 중</h3><div class="k-egg">${eggSvg(nest.egg,120,Math.min(3,Math.floor(fed/need*3)),KSHAKE)}</div>
      <div class="k-bar"><i style="width:${fed/need*100}%"></i></div><p class="k-sub">간식 ${fed}/${need}개 · 가진 간식 <b>${k.snacks}개</b></p>
      <div class="k-row"><button class="k-btn hot big" data-kact="feed" ${k.snacks?"":"disabled"}>🍪 간식 먹이기</button></div>
      ${k.snacks?"":`<p class="k-sub">간식은 1층 매점에서 사요. 간식이 모자라도 알은 식지 않고 기다려요.</p>`}</section>`; }
  else main=`<section class="k-nest"><h3>어떤 알을 깨울까요?</h3><ul class="k-eggs">${K_EGG_ORDER.map(e=>{ const E=K_EGGS[e], u=eggOpen(e), od=E.odds[2]?`레어 ${E.odds[1]}% · 전설 ${E.odds[2]}%`:E.odds[1]?`레어 ${E.odds[1]}%`:"일반만";
      return `<li class="${u?"":"lock"}">${eggSvg(e,46,0)}<div><b>${esc(E.name)}</b><small>간식 ${E.need}개 · ${esc(E.days)} · ${esc(od)}</small>${u?"":`<small>🔒 ${esc(eggLock(e))}</small>`}</div><button class="k-btn small" data-kact="pick-egg" data-egg="${e}" ${u?"":"disabled"}>고르기</button></li>`; }).join("")}</ul></section>`;
  return kHead("옥상 부화소","간식으로 알을 깨워요") + `<div class="k-wrap">${bubble("greet")}${main}
    <section class="k-shop"><h3>📖 동물 도감 ${own.length}/${shown.length}</h3><p class="k-sub">친구를 누르면 함께 다니는 친구가 돼요. 지금: <b>${esc(K_BY[buddyId()].name)}</b></p>
      <ul class="k-dex">${shown.map(c=>k.dex[c.id]?`<li><button class="k-dexb ${buddyId()===c.id?"on":""}" data-kact="buddy" data-id="${c.id}">${charSvg(c.id,52)}<b>${esc(c.name)}</b><small>${esc(c.grade)}${k.dex[c.id]>1?` ×${k.dex[c.id]}`:""}</small></button></li>`:`<li><div class="k-dexb no"><span>?</span><small>${esc(c.grade)}</small></div></li>`).join("")}</ul></section></div>`;
}
function hatchNow(){
  const k=K(), nest=k.nest; if(!nest) return; const id=rollChar(nest.egg), first=!k.dex[id];
  k.dex[id]=(k.dex[id]||0)+1; (k.hatchLog=k.hatchLog||[]).push({id,at:Date.now()}); k.hatched[nest.egg]=(k.hatched[nest.egg]||0)+1; k.nest=null; if(!k.buddy) k.buddy=id; save(); render(false);
  const c=K_BY[id]; kSfx("hatch");
  showModal(`<div class="nt-h">알이 깨어났어요!</div><div style="text-align:center;margin:8px 0">${charSvg(id,120)}</div>
    <div class="nt-rank"><small>${esc(c.grade)}${first?" · 새 친구":""}</small><b style="font-size:26px">${esc(c.name)}</b><span>“${esc(kpick(kSafe(c.lines.hatch)))}”</span></div>
    <button class="btn primary" style="width:100%" data-kact="buddy" data-id="${id}">함께 다니기</button><div class="actions" style="margin-top:8px"><button class="btn" style="width:100%" data-act="close-modal">도감에 넣기</button></div>`);
}

/* ---------- 8F 인사팀 · 내 사원증 ---------- */
function renderMy(){
  activeDocId=null; const k=K(), nr=nextRankInfo(), ci=companyIdx(), mc=masteredCount();
  return `<div class="k-wrap">
    <section class="k-id"><div class="k-id-band"><span>리로루로게임즈</span><span>${esc(bizOf().icon)} ${esc(bizOf().name)}</span></div>
      <div class="k-id-b"><div class="k-id-ph">${avatarSvg(70,88)}</div><div><b>${esc(S.name||"신입사원")}</b><small>${esc(companyRank())} · ${k.grade?k.grade+"학년":""}</small><small class="mono">${esc(S.empNo||"")}</small></div></div>
      <p class="k-sub">완성한 스테이지 <b>${mc}개</b>${nr?` · ${esc(nr.name)}까지 ${nr.need}개 남았어요`:" · 최고 직급이에요!"}</p>
      <div class="k-bar"><i style="width:${nr?Math.min(100,(mc-KID.rankAt[ci])/(KID.rankAt[ci+1]-KID.rankAt[ci])*100):100}%"></i></div>
      <ol class="k-ranks">${COMPANY.map((c,i)=>`<li class="${i===ci?"on":i<ci?"past":""}">${esc(c)}<small>${KID.rankAt[i]}</small></li>`).join("")}</ol></section>
    <section class="k-shop"><h3>사업부 바꾸기</h3><p class="k-sub">고른 사업부 테마로 화면이 바뀌어요. 진도는 그대로예요.</p><div class="k-bizs">${Object.entries(BIZ).map(([id,b])=>`<button class="k-bizb ${k.biz===id?"on":""}" data-kact="biz" data-id="${id}" style="--c:${b.color}"><span>${b.icon}</span><b>${esc(b.name)}</b><small>${esc(b.theme)} · ${esc(b.game)}</small></button>`).join("")}</div></section>
    <section class="k-shop"><h3>옷장</h3>${k.clothes.length?`<ul class="k-clo">${CLOTHES.filter(c=>k.clothes.includes(c.id)).map(c=>{ const on=k.wear[c.slot]===c.id; return `<li><div class="k-clo-av">${avatarSvg(44,56,{[c.slot]:c.id})}</div><b>${esc(c.name)}</b><button class="k-btn small ${on?"hot":""}" data-kact="wear" data-id="${c.id}">${on?"벗기":"입기"}</button></li>`; }).join("")}</ul>`:`<p class="k-sub">아직 옷이 없어요. 1층 매점에서 살 수 있어요.</p>`}</section>
    <section class="k-shop"><h3>과목별 진도</h3><ul class="k-list">${Object.keys(DEPTS).map(sj=>{ const L=curSeries(sj), st=stagesOf(sj,L), d=st.filter(x=>stSt(x.key).mastered).length; return `<li><b>${esc(DEPTS[sj].floor)} ${esc(DEPTS[sj].label)}</b><small>${S.placed[sj]?`${esc(seriesName(sj,L))} · 스테이지 ${d}/${st.length}`:"아직 입사 테스트 전"}</small></li>`; }).join("")}</ul>
      ${k.released.length?`<h3 style="margin-top:12px">🎮 출시한 게임</h3>${k.released.map(r=>`<span class="k-cart">${esc(r.title)}</span>`).join("")}`:""}</section>
    <details class="sec"><summary>학습 지도 <span>어디가 어려운지</span></summary><div class="in">${Object.keys(DEPTS).map(sj=>`<h3 style="font-size:15px;margin:10px 0 4px">${esc(DEPTS[sj].label)}</h3><p style="margin:0 0 6px;font-size:14px">${esc(stopLine(sj))}</p>`).join("")}</div></details>
    <details class="sec"><summary>이름·학년 · 기록 <span>설정</span></summary><div class="in">
      <h3 style="font-size:15px;margin:4px 0 6px">별명</h3><div class="k-input"><label class="sr" for="nm">별명</label><input id="nm" maxlength="10" value="${esc(S.name||"")}" placeholder="신입사원"><button class="k-go" data-act="set-name">저장</button></div>
      <h3 style="font-size:15px;margin:14px 0 6px">효과음</h3><button class="k-btn small ${soundOn()?"hot":""}" data-kact="sound">${soundOn()?"🔊 소리 켜짐":"🔇 소리 꺼짐"}</button>
      <h3 style="font-size:15px;margin:14px 0 6px">학년</h3><div class="k-row">${[1,2,3,4,5,6].map(g=>`<button class="k-btn small ${k.grade===g?"hot":""}" data-kact="set-grade" data-g="${g}">${g}학년</button>`).join("")}</div>
      <p class="k-sub" style="margin-top:14px">기록은 이 기기에만 저장돼요. 다른 기기로 옮기려면 내보내기를 복사해 두세요.</p>
      <textarea id="exp" readonly>${esc(JSON.stringify(S))}</textarea><div class="actions" style="margin-top:8px"><button class="btn" data-act="copy">복사</button></div>
      <label class="sr" for="imp">백업 붙여넣기</label><textarea id="imp" placeholder="내보낸 내용을 붙여 넣어요"></textarea>
      <div class="actions" style="margin-top:8px"><button class="btn" data-act="import">가져오기</button><button class="btn" data-act="reset-all">모든 기록 지우기</button></div></div></details>
    <button class="k-btn ghost" data-kact="parent">👪 보호자 화면 (비밀번호)</button>
  </div>`;
}

/* ---------- 건물 ---------- */
function floorChip(b){
  if(b.closed) return "";
  if(DEPTS[b.key]){ const sj=b.key; if(!S.placed[sj]) return `<span class="chip">입사 테스트</span>`;
    const L=curSeries(sj), st=stagesOf(sj,L), d=st.filter(x=>stSt(x.key).mastered).length, boss=st.some(x=>["boss","check"].includes(stageStatus(x.key)));
    return `<span class="chip ${boss?"alert":""}">${L+1}편 · ${d}/${st.length}${boss?" 👾":""}</span>`; }
  if(b.key==="wrong"){ const n=pendingWrong().length; return n?`<span class="chip alert">버그 ${n}</span>`:""; }
  if(b.key==="bank"){ return `<span class="chip money">${won(balance())}</span>`; }
  if(b.key==="my"){ return `<span class="chip">${esc(companyRank())}</span>`; }
  if(b.key==="roof"){ const k=K(); return k.nest?`<span class="chip">${esc(K_EGGS[k.nest.egg].name)} ${k.nest.fed}/${K_EGGS[k.nest.egg].need}</span>`:(k.snacks?`<span class="chip">간식 ${k.snacks}</span>`:""); }
  return "";
}
function scene(type){
  if(type==="roof"){ const W=460,H=118,fl=H-8;
    let s=`<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMax slice" aria-hidden="true"><rect width="${W}" height="${H}" fill="#bfe9ff"/><circle cx="400" cy="30" r="16" fill="#ffd34d"/>
      <rect y="${fl}" width="${W}" height="8" fill="#7ed957"/><path d="M170 ${fl} q40 -26 80 0z" fill="#c98a3c"/><path d="M168 ${fl-4} q42 -20 84 0" stroke="#8a5a1c" stroke-width="3" fill="none"/>`;
    s+=`<ellipse cx="195" cy="${fl-16}" rx="9" ry="12" fill="#FFE9C7" stroke="#2b1f5c" stroke-width="1.5"/><ellipse cx="215" cy="${fl-19}" rx="11" ry="15" fill="#CFE8B4" stroke="#2b1f5c" stroke-width="1.5"/><ellipse cx="233" cy="${fl-14}" rx="7" ry="9" fill="#F1E6D2" stroke="#2b1f5c" stroke-width="1.5"/>`;
    s+=`<g transform="translate(320 ${fl-24})">${'<path d="M0 0 l8 -14 8 14z" fill="#ffc93c"/>'}</g>`;
    return s+`</svg>`; }
  let s=scene0(type); const b=K().biz||"goal", fl=110;
  let p="";
  if(type==="math"||type==="kor"||type==="sci"){
    p = b==="goal" ? `<g transform="translate(410 ${fl-26})"><rect x="-22" y="-18" width="44" height="26" fill="none" stroke="#fff" stroke-width="3"/><circle cx="-34" cy="16" r="9" fill="#fff" stroke="#2b1f5c" stroke-width="2"/></g>`
      : b==="race" ? `<g transform="translate(405 ${fl-10})"><rect x="-18" y="-10" width="36" height="12" rx="4" fill="#ff7b2e" stroke="#2b1f5c" stroke-width="2"/><circle cx="-11" cy="4" r="5" fill="#2b1f5c"/><circle cx="11" cy="4" r="5" fill="#2b1f5c"/></g>`
      : `<g transform="translate(410 ${fl-20})"><path d="M-20 10 q10 -30 34 -18 q8 6 4 16z" fill="#fffaf0" stroke="#8a5a1c" stroke-width="2"/><circle cx="8" cy="-4" r="2" fill="#8a5a1c"/></g>`;
    p += `<g transform="translate(95 ${fl-40})"><rect width="40" height="28" rx="3" fill="#2b1f5c"/><rect x="3" y="3" width="34" height="20" fill="${BIZ[b].color}"/><ellipse cx="20" cy="13" rx="6" ry="5" fill="#7b2fd6"/></g>`;
  }
  if(type==="bank") p=`<g transform="translate(40 ${fl-46})"><rect width="60" height="46" fill="#ffe1a8" stroke="#2b1f5c" stroke-width="2"/><rect x="4" y="8" width="52" height="3" fill="#2b1f5c"/><rect x="4" y="26" width="52" height="3" fill="#2b1f5c"/><circle cx="14" cy="20" r="5" fill="#c98a3c"/><circle cx="30" cy="20" r="5" fill="#ef4b5a"/><circle cx="46" cy="20" r="5" fill="#ffc93c"/><rect x="10" y="32" width="8" height="10" fill="#4cc3ff"/><rect x="26" y="32" width="8" height="10" fill="#2ec4a0"/></g>`;
  return s.replace(/<\/svg>$/, p+"</svg>");
}
function renderBuilding(){
  const at=FLOOR_ORDER.indexOf(S.atFloor||"1F"), top=(BUILDING.length-1-at)*FH;
  return `<div class="bldg">
    <div class="bldg-top"><span>${esc(bizOf().icon)} ${esc(bizOf().name)} · ${esc(companyRank())} ${esc(S.name||"신입사원")}</span><span>${S.clock?`출근 ${esc(S.clock.time)}`:""}</span></div>
    <div class="roof"><div class="ant"></div><div class="signboard">리로루로게임즈</div><div class="parapet"></div></div>
    <div class="tower"><div class="tower-in" id="tower">
      <div class="shaft" aria-hidden="true"><div class="car" id="car" style="top:${top}px;--fh:${FH-8}px"></div></div>
      ${BUILDING.map(b=>`<button class="flr ${b.closed?"closed":""} ${S.atFloor===b.f?"here":""}" id="flr-${b.f}" data-enter="${b.f}" ${b.closed?"disabled":""} aria-label="${b.f} ${esc(b.name)}${b.closed?" (입주 예정)":" 들어가기"}" style="--fh:${FH}px">
        ${scene(b.scene)}<span class="tag"><span class="no">${b.f}</span><span class="nm">${esc(b.name)}<small>${esc(b.sub)}</small></span></span>${floorChip(b)}</button>`).join("")}
    </div></div>
    <div class="ground"><div class="walk"></div><div class="street"></div></div>
  </div>
  <nav class="flrbar" aria-label="층 버튼">${BUILDING.filter(b=>!b.closed).slice().reverse().map(b=>`<button class="fb ${S.lit===b.f?"lit":""}" data-enter="${b.f}">${b.f}<small>${esc(b.btn||b.sub)}</small></button>`).join("")}</nav>`;
}
function enterFloor(f){
  const b=BUILDING.find(x=>x.f===f); if(!b||b.closed) return;
  ride(f,()=>{ if(b.key==="my") S.screen="my"; else if(b.key==="wrong") S.screen="wrong"; else if(b.key==="bank") S.screen="bank"; else if(b.key==="roof") S.screen="roof";
    else { S.screen="floor"; S.subject=b.key; S.free=null; }
    save(); render(true); });
}
function renderBar(){
  const bar=$("#bar");
  if(S.screen==="lift"||S.screen==="floor"||S.screen==="wrong"||S.screen==="roof"||S.screen==="parent"){ bar.hidden=true; return; }
  bar.hidden=false;
  const loc = S.screen==="my" ? ["8F","인사팀 · 내 사원증"] : S.screen==="bank" ? ["1F","리로루로은행 · 매점"] : ["",""];
  $("#loc").innerHTML=`<small>${esc(loc[0])}</small>${esc(loc[1])}`; $("#who").textContent=companyRank();
}
function render(restore){
  applyBiz(); renderBar(); markFloorHistory();
  const m=$("#main");
  if(S.screen==="lift"){ activeDocId=null; m.className="full"; m.innerHTML=renderBuilding();
    if(restore) requestAnimationFrame(()=>{ const el=document.getElementById("flr-"+(S.atFloor||"1F")); el&&el.scrollIntoView({block:"center"}); }); return; }
  m.className=""; activeDocId=null;
  m.innerHTML = S.screen==="parent" ? renderParent() : S.screen==="my" ? renderMy() : S.screen==="bank" ? renderBank() : S.screen==="wrong" ? renderWrongFloor() : S.screen==="roof" ? renderRoof() : renderFloor();
  const id=activeDocId; if(id!==tickDoc){ tickDoc=id; if(id) docState(id).tick=Date.now(); }
  if(restore) window.scrollTo(0,0);
  requestAnimationFrame(()=>{ const inp=document.querySelector(".k-input input:not([disabled])"); if(inp && restore===false){ try{ inp.focus({preventScroll:true}); }catch(e){} } });
}

/* ---------- 출입 게이트 (처음엔 입사 서류) ---------- */
function showGate(){
  const g=$("#gate"), k=K(); applyBiz();
  g.className="gate"; g.hidden=false;
  if(!k.onboard){
    g.innerHTML=`<div class="lobby-sign"><div class="co">리로루로게임즈</div><small>RIRORURO GAMES · 입사 서류</small></div>
      <form class="k-join" id="kjoin"><label>별명 <small>(진짜 이름 말고 별명으로 써요)</small><input id="kj-nm" maxlength="10" placeholder="예: 번개토끼" autocomplete="off"></label>
        <fieldset><legend>몇 학년이에요?</legend><div class="k-row">${[1,2,3,4,5,6].map(n=>`<button type="button" class="k-btn small" data-kj-g="${n}">${n}학년</button>`).join("")}</div></fieldset>
        <fieldset><legend>어느 사업부에서 일할까요?</legend><div class="k-bizs">${Object.entries(BIZ).map(([id,b])=>`<button type="button" class="k-bizb" data-kj-b="${id}" style="--c:${b.color}"><span>${b.icon}</span><b>${esc(b.name)}</b><small>${esc(b.theme)} 게임 「${esc(b.game)}」</small></button>`).join("")}</div></fieldset>
        <button type="submit" class="k-btn hot big" id="kj-go" disabled>입사하기</button></form>`;
    let gsel=null,bsel=null; const upd=()=>{ $("#kj-go").disabled=!(gsel&&bsel); };
    g.querySelectorAll("[data-kj-g]").forEach(x=>x.onclick=()=>{ gsel=+x.dataset.kjG; g.querySelectorAll("[data-kj-g]").forEach(y=>y.classList.toggle("hot",y===x)); upd(); });
    g.querySelectorAll("[data-kj-b]").forEach(x=>x.onclick=()=>{ bsel=x.dataset.kjB; g.querySelectorAll("[data-kj-b]").forEach(y=>y.classList.toggle("on",y===x)); k.biz=bsel; applyBiz(); upd(); });
    $("#kjoin").onsubmit=e=>{ e.preventDefault(); if(!(gsel&&bsel)) return; const nm=$("#kj-nm").value.trim().slice(0,10); if(nm) S.name=nm; k.grade=gsel; k.biz=bsel; k.onboard=true;
      Object.keys(DEPTS).forEach(sj=>{ k.maxSeries[sj]=Math.max(k.maxSeries[sj]??0,0); }); save(); showGate(); };
    return; }
  const todayIn = S.clock && S.clock.date===ymd(new Date()) ? S.clock.time : null;
  g.innerHTML=`<div class="lobby-sign"><div class="co">리로루로게임즈</div><small>RIRORURO GAMES · 본사 1F 로비</small></div>
    <div class="reader-zone"><button class="idcard" id="idcard" aria-label="사원증을 찍고 출근하기">
        <div class="band"><span>리로루로게임즈</span><span>${esc(bizOf().icon)} 사원증</span></div>
        <div class="body"><div class="ph" aria-hidden="true">${avatarSvg(44,56)}</div>
          <div><div class="nm">${esc(S.name||"신입사원")}</div><div class="rk">${esc(bizOf().name)} · ${esc(companyRank())}</div><div class="no">${esc(S.empNo)}</div></div></div></button>
      <div class="reader" id="reader"><span class="led"></span>사원증 찍는 곳</div>
      <div class="gate-msg" id="gmsg" aria-live="polite">${todayIn?`오늘 <b>${todayIn}</b>에 출근했어요.`:`<b>사원증을 찍어 주세요</b>`}</div></div>`;
  $("#idcard").addEventListener("click",tagIn,{once:true});
  setTimeout(()=>$("#idcard")&&$("#idcard").focus(),50);
}
function tagIn(){
  const now=new Date(), first=!(S.clock && S.clock.date===ymd(now));
  if(first){ S.clock={date:ymd(now), time:hhmm(now)}; S.clockLog=(S.clockLog||[]).concat([S.clock]).slice(-60); }
  S.screen="lift"; S.atFloor="1F"; save(); beep(false);
  $("#idcard").classList.add("tagged"); $("#reader").classList.add("ok");
  $("#gmsg").innerHTML=`<b>${first?"출근했어요!":"다시 왔네요!"} · ${S.clock.time}</b><div class="sub">엘리베이터로 가요</div>`;
  render(true);
  const g=$("#gate"); let done=false; const finish=()=>{ if(done) return; done=true; g.classList.add("out"); setTimeout(()=>{ g.hidden=true; g.innerHTML=""; },reduce?0:450); };
  setTimeout(()=>g.addEventListener("click",finish),0); setTimeout(finish, reduce?400:1100);
}

/* ---------- 버튼 ---------- */
function goHomeFloor(){ const sj=S.subject, k=K(), p=k.play[sj]; k.hold=k.hold||{};
  if(p && getDoc(p) && docState(p).completedAt){ docState(p).kshow=false; k.play[sj]=null; } else if(p) k.hold[sj]=p; save(); render(true); }
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-kact]"); if(!b || b.disabled) return;
  const a=b.dataset.kact, k=K();
  const A={
    lift:()=>{ try{ if(history.state&&history.state.inFloor){ history.back(); return; } }catch(_){} S.screen="lift"; save(); render(true); },
    home:goHomeFloor,
    resume:()=>{ k.hold=k.hold||{}; k.hold[S.subject]=null; save(); render(true); },
    card:()=>{ k.card=b.dataset.stage; save(); render(true); },
    "card-close":()=>{ k.card=null; save(); render(true); },
    "card-go":()=>{ const key=b.dataset.stage; stSt(key).seen=true; k.card=null; if(!canPlay()){ save(); render(true); return toast(stopReason()+". 내일 또 만나요!"); } const st=stageByKey(key); k.play[st.subj]=kidDoc(st,"test"); (k.hold=k.hold||{})[st.subj]=null; save(); render(true); },
    test:()=>{ if(!canPlay()) return toast(stopReason()+". 내일 또 만나요!"); if(!stSt(b.dataset.stage).seen){ k.card=b.dataset.stage; save(); render(true); return; } const st=stageByKey(b.dataset.stage); k.play[st.subj]=kidDoc(st,"test"); (k.hold=k.hold||{})[st.subj]=null; save(); render(true); },
    boss:()=>{ if(!canPlay()) return toast(stopReason()+". 내일 또 만나요!"); const st=stageByKey(b.dataset.stage); k.play[st.subj]=kidDoc(st,"boss"); (k.hold=k.hold||{})[st.subj]=null; save(); render(true); },
    check:()=>{ const st=stageByKey(b.dataset.stage); k.play[st.subj]=kidDoc(st,"check"); (k.hold=k.hold||{})[st.subj]=null; save(); render(true); },
    "next-q":()=>{ const d=getDoc(activeDocId), ds=docState(activeDocId); if(!d) return; let j=(ds.kcur??0)+1; while(j<d.qs.length && ds.answers[j] && (d.kid||ds.answers[j].correct)) j++; if(j>=d.qs.length){ j=d.qs.findIndex((_,x)=>!ds.answers[x]); if(j<0) j=d.qs.length-1; } ds.kcur=j; save(); render(false); },
    finish:kidFinish,
    series:()=>{ k.series[S.subject]=+b.dataset.l; save(); render(true); },
    "pick-series":()=>{ const sj=S.subject, L=+b.dataset.l, pl=S.pl[sj]; k.series[sj]=L; k.maxSeries[sj]=Math.max(k.maxSeries[sj]??0, L);
      S.placed[sj]={est:pl&&pl.done?pl.est:null, L, at:Date.now()}; closeModal(); save(); render(true); toast(`${seriesName(sj,L)}부터 시작해요!`); },
    "pl-go":()=>{ k.plIntro=b.dataset.subj; save(); render(true); },
    replace:()=>{ const sj=b.dataset.subj; confirmDlg("입사 테스트 다시 보기","시작할 편을 다시 정해요. 지금까지 완성한 스테이지는 그대로 남아요.",()=>{ closeModal(); delete S.placed[sj]; delete S.pl[sj]; delete S.docs["PL-"+sj]; k.plIntro=null; save(); render(true); }); },
    "go-repair":()=>{ ride("2F",()=>{ S.screen="wrong"; save(); render(true); }); },
    repair:()=>{ const sj=b.dataset.subj, items=pendingWrong().filter(w=>getDoc(w.docId).subject===sj).slice(0,5); if(!items.length) return;
      S.seq=(S.seq||0)+1; const id="R"+S.seq;
      const qs=items.map(w=>{ const q=JSON.parse(JSON.stringify(getDoc(w.docId).qs[w.qi])); q.k="수리"; q.gl="수리할 버그"; q.ref={docId:w.docId,qi:w.qi}; delete q.bank; delete q.spaced; return q; });
      S.gen[id]={id, subject:sj, view:"kid", review:true, no:"수리-"+String(S.seq).padStart(4,"0"), title:"버그 수리", qs}; docState(id).kcur=0; k.repair=id; save(); render(true); },
    "repair-end":()=>{ const r=k.repair; if(r){ docState(r).completedAt=Date.now(); } k.repair=null; save(); render(true); toast("수리한 버그는 목록에서 빠져요."); },
    "repair-out":()=>{ const r=k.repair; if(r){ docState(r).completedAt=Date.now(); } k.repair=null; save(); render(true); },
    read:()=>{ try{ const u=new SpeechSynthesisUtterance(b.dataset.text); u.lang="ko-KR"; u.rate=0.95; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(_){ toast("이 기기에서는 읽어 주기를 쓸 수 없어요."); } },
    "buy-snack":()=>{ const n=+b.dataset.n||1; if(!spend(KID.snackPrice*n,`간식 ${n}개`)) return toast("통장 돈이 모자라요."); k.snacks+=n; kSfx("coin"); save(); render(false); toast(`간식 ${n}개를 샀어요! 옥상 부화소에서 먹여요.`); },
    "buy-cloth":()=>{ const c=CLOTHES.find(x=>x.id===b.dataset.id); if(!c||k.clothes.includes(c.id)) return; if(!spend(c.price,c.name)) return toast("통장 돈이 모자라요."); k.clothes.push(c.id); k.wear[c.slot]=c.id; kSfx("coin"); save(); render(false); toast(`${c.name}${josa(c.name)?"을":"를"} 샀어요! 바로 입었어요.`); },
    wear:()=>{ const c=CLOTHES.find(x=>x.id===b.dataset.id); if(!c) return; if(k.wear[c.slot]===c.id) delete k.wear[c.slot]; else k.wear[c.slot]=c.id; save(); render(false); },
    biz:()=>{ k.biz=b.dataset.id; save(); render(false); toast(`${BIZ[k.biz].name}${josa(BIZ[k.biz].name)?"으로":"로"} 옮겼어요!`); },
    "set-grade":()=>{ k.grade=+b.dataset.g; save(); render(false); },
    "pick-egg":()=>{ const e=b.dataset.egg; if(!eggOpen(e)) return; k.nest={egg:e, fed:0, at:Date.now()}; save(); render(false); },
    feed:()=>{ if(!k.nest||k.snacks<1) return; k.snacks--; k.nest.fed++; save(); const need=K_EGGS[k.nest.egg].need;
      if(k.nest.fed>=need){ hatchNow(); return; } KSHAKE=true; render(false); KSHAKE=false; try{ navigator.vibrate&&navigator.vibrate(30); }catch(_){}
      if(Math.random()<0.4) toast(`${K_BY[buddyId()].name}: ${kline("snack")}`); },
    buddy:()=>{ const id=b.dataset.id; if(!k.dex[id]) return; k.buddy=id; closeModal(); save(); render(false); toast(`${K_BY[id].name}${josa(K_BY[id].name)?"과":"와"} 함께 다녀요!`); },
    talk:()=>{ const box=b.closest(".k-bub"), sp=box&&box.querySelector(".k-bub-tx span"); if(!sp) return; const id=b.dataset.id, cat=b.dataset.cat||"greet";
      let t=sp.textContent, tries=0; while(t===sp.textContent && tries++<8) t=kline(cat,id);
      if(t===sp.textContent){ t=kline("greet",id); }
      sp.textContent=t; b.classList.remove("k-hop"); void b.offsetWidth; b.classList.add("k-hop"); try{ navigator.vibrate&&navigator.vibrate(15); }catch(_){} },
    "after-clear":()=>{ closeModal(); const f=KAFTER; KAFTER=null; f&&f(); }
  };
  (A[a]||(()=>{}))();
});
/* 문제 입력 후 Enter → 확인 (원래 코드 그대로 submit) · 끝난 테스트는 자동으로 결과로 넘어가지 않고 ‘끝내기’를 눌러야 함 */

/* 간격 복습: 틀렸던 그 문제(기억해 둔 것) → 같은 개념 문항(기존 은행·생성기, 초등 단원 생성기) */
function kmFind(name,subj="수학"){ const U=KUNITS[subj]; if(!U) return null; for(const g of Object.keys(U).map(Number)) for(let u=0;u<U[g].length;u++) for(let j=0;j<U[g][u].gens.length;j++) if(kmGenCn(g,u,j,subj)===name) return [g,u,j]; return null; }
function insertSpaced(subj,qs,r){
  const due=dueConcepts(subj); if(!due.length||!qs.length) return;
  const st=learnOf(subj)[due[0]]; let q=null;
  if(st.src){ try{ q=JSON.parse(JSON.stringify(st.src)); }catch(e){} }
  if(!q){ const list=(conceptIndex(subj)[due[0]]||[]).filter(e=>e.L<=3&&(e.bank!=null||e.kd<=1));
    if(list.length){ const e=list[Math.floor(r()*list.length)]; q=e.bank!=null?korItem(e.L,e.bank,r,subj):makeGenItem(subj,e.L,e.kd,e.i,r); }
    else { const km=kmFind(due[0],subj); if(km) q=kmItem(km[0],km[1],km[2],r,subj); } }
  if(!q){ st.due=0; return; }
  q.spaced=true; qs[0]=q;
}

/* ---------- 개념 카드 1장 (스테이지 첫 테스트 전) ---------- */
function cardFig(st){ try{ const cands=stageCands(st); for(const e of cands){ const q=makeQ(st,e,rng(7)); if(q.fig) return q.fig; } }catch(e){} return ""; }
function renderCard(st){
  const s=stSt(st.key), first=!s.seen, fig=cardFig(st);
  const blocks=st.concepts.map(c=>{ const body=conceptBody(c,st.subj)||""; const ez=EASY[c]||[]; const easy=ez[0]||body, ex=ez[1]||"";
    const plain=String(body).replace(/<[^>]+>/g,""), short=plain && plain.length<=170;
    return `<section class="k-cc"><h3>${esc(c)}</h3>${short?`<p class="k-cc-body">${esc(plain)}</p>`:""}<p class="k-cc-easy">💡 ${esc(easy)}</p>${ex?`<p class="k-cc-ex">예) ${esc(ex)}</p>`:""}${!short&&plain&&plain!==easy?`<details><summary>조금 더 알아보기</summary><p>${body}</p></details>`:""}</section>`; }).join("");
  return kHead("📖 개념 카드", `${seriesName(st.subj,st.gi)} · 스테이지 ${st.i+1}${st.title?" "+st.title:""}`, "card-close") + `<div class="k-wrap">
    <section class="k-card"><div class="k-card-top"><span>스테이지 ${st.i+1}</span><b>${esc(st.title||st.concepts.join(" · "))}</b></div>
      ${blocks}${fig?`<p class="k-cc-cap">이 스테이지에서는 이런 그림을 보고 풀어요</p><div class="k-fig">${fig}</div>`:""}</section>
    ${bubble("greet",null,first?"먼저 이걸 보고 가면 버그가 훨씬 잘 잡힐 거예요!":null)}
    <div class="k-next">${first?`<button class="k-btn big hot" data-kact="card-go" data-stage="${st.key}">알겠어요! 게임 테스트 시작</button>`:`<button class="k-btn big" data-kact="card-close">스테이지로 돌아가기</button>`}</div></div>`;
}
