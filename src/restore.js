
/* =========================================================================
   보호자 화면 › 진도·알 직접 지정 (저장이 날아갔을 때 복구용)
   - 지정한 기록은 주간 리포트의 ‘이 주의 성과’에 넣지 않아요 (masteredAt/at = 1)
   ========================================================================= */
let RS={subj:"수학", gi:0};
let PR_TAB="report";
const RS_STATES=[["처음",0],["조각 1",1],["조각 2",2],["보스 열림",3],["보스 통과",4],["⭐ 완성",5]];
function stLevel(s){ return s.mastered?5 : s.passDay?4 : Math.min(3,s.pieces||0); }
function setStage(key,lv){ const k=K(); const s=k.st[key]={pieces:Math.min(3,lv), passDay:null, mastered:false, boss:0, seen:true};
  if(lv>=4){ s.pieces=3; s.passDay=lv===4?ymd(new Date(Date.now()-86400000)):s.passDay; }
  if(lv===5){ s.mastered=true; s.masteredAt=1; s.restored=true; }
  if(lv===0){ s.seen=false; } }
function syncSeries(subj){ const k=K(); k.released=(k.released||[]).filter(r=>!(r.subj===subj && !stagesOf(subj,r.gi).every(x=>stSt(x.key).mastered)));
  for(let gi=0; gi<=MAXK; gi++){ if(stagesOf(subj,gi).every(x=>stSt(x.key).mastered) && !k.released.some(r=>r.subj===subj&&r.gi===gi)) k.released.push({subj, gi, title:seriesName(subj,gi), at:1, restored:true}); }
  const top=Math.max(-1,...k.released.filter(r=>r.subj===subj).map(r=>r.gi));
  k.maxSeries[subj]=Math.max(curSeries(subj), Math.min(MAXK, top+1));
}
function ensurePlaced(subj,gi){ if(!S.placed[subj]) S.placed[subj]={est:null, L:gi, at:Date.now(), restored:true}; }
function renderRestore(){ const k=K(), sj=RS.subj, gi=RS.gi, st=stagesOf(sj,gi), cur=curSeries(sj), placed=!!S.placed[sj];
  const done=st.filter(x=>stSt(x.key).mastered).length;
  return `<div class="k-head"><button class="k-back" data-kact="rs-back">← 보호자 화면</button><div class="k-ttl"><b>진도·알 직접 지정</b><small>저장이 날아갔을 때 원래대로 맞춰 주세요</small></div></div>
  <div class="k-wrap pr rs">
    <section class="k-shop"><h3>1. 과목과 편 고르기</h3>
      <div class="k-row">${Object.keys(DEPTS).map(s=>`<button class="k-btn small ${s===sj?"hot":""}" data-kact="rs-subj" data-s="${s}">${esc(s)}</button>`).join("")}</div>
      <div class="rs-gi">${SERIES.map((S_,i)=>`<button class="${i===gi?"on":""} ${i===cur&&placed?"cur":""}" data-kact="rs-gi" data-n="${i}"><b>${i+1}편</b><small>${esc(S_.label)}</small></button>`).join("")}</div>
      <p class="k-sub">${placed?`지금 아이가 하는 편: <b>${cur+1}편</b>`:"이 과목은 아직 입사 테스트 전이에요. 아래 ‘지금 하는 편으로 정하기’를 누르면 테스트 없이 바로 시작돼요."}</p>
      <div class="k-row"><button class="k-btn small hot" data-kact="rs-cur">${gi+1}편을 지금 하는 편으로 정하기</button>${gi>0?`<button class="k-btn small" data-kact="rs-before">1~${gi}편 모두 ⭐ 완성 처리</button>`:""}</div></section>
    <section class="k-shop"><h3>2. ${esc(sj)} ${gi+1}편 스테이지 <small class="rs-cnt">${done}/${st.length} 완성</small></h3>
      <div class="k-row" style="margin-bottom:10px"><button class="k-btn small" data-kact="rs-all" data-lv="5">전체 ⭐ 완성</button><button class="k-btn small" data-kact="rs-all" data-lv="0">전체 처음으로</button></div>
      <ol class="rs-st">${st.map(x=>{ const lv=stLevel(stSt(x.key)); return `<li><b>${esc(x.title)}</b><div class="rs-seg">${RS_STATES.map(([l,v])=>`<button class="${v===lv?"on":""} ${v===5?"star":""}" data-kact="rs-st" data-key="${x.key}" data-lv="${v}">${l}</button>`).join("")}</div></li>`; }).join("")}</ol>
      <p class="k-sub">조각 = 통과한 게임 테스트 수(3개면 최종 점검이 열려요). ‘보스 통과’는 다음 날 확인 문제가 열리는 상태예요. 편의 모든 스테이지를 ⭐로 하면 그 편이 출시되고 다음 편이 열려요.</p></section>
    <section class="k-shop"><h3>3. 옥상 알·도감</h3>
      <p class="k-sub">캐릭터마다 몇 마리 있는지 맞춰 주세요. 1마리 이상이면 도감에 열려요.</p>
      <ul class="rs-dex">${K_DATA.characters.map(c=>{ const n=k.dex[c.id]||0; return `<li class="${n?"own":""}"><span class="rs-av">${typeof charSvg==="function"?charSvg(c.id,40):""}</span><div><b>${esc(c.name)}</b><small>${esc(c.grade)} · 시즌 ${c.season}${k.buddy===c.id?" · 🐾 같이 다니는 중":""}</small></div>
        <div class="rs-num"><button data-kact="rs-dex" data-id="${c.id}" data-d="-1" ${n?"":"disabled"}>−</button><b>${n}</b><button data-kact="rs-dex" data-id="${c.id}" data-d="1">+</button></div>${n&&k.buddy!==c.id?`<button class="k-btn small ghost rs-bud" data-kact="rs-buddy" data-id="${c.id}">같이 다니기</button>`:""}</li>`; }).join("")}</ul>
      <h3 style="margin-top:16px">알 종류별 부화 횟수</h3><p class="k-sub">타조알은 달걀 3번, 공룡알은 타조알 2번 부화하면 열려요.</p>
      <ul class="k-list">${K_EGG_ORDER.map(e=>`<li class="rs-line"><b>${esc(K_EGGS[e].name)}</b><div class="rs-num"><button data-kact="rs-hatch" data-e="${e}" data-d="-1" ${(k.hatched[e]||0)?"":"disabled"}>−</button><b>${k.hatched[e]||0}</b><button data-kact="rs-hatch" data-e="${e}" data-d="1">+</button></div></li>`).join("")}</ul>
      <h3 style="margin-top:16px">지금 품고 있는 알</h3>
      <div class="k-row"><button class="k-btn small ${!k.nest?"hot":""}" data-kact="rs-nest" data-e="">없음</button>${K_EGG_ORDER.map(e=>`<button class="k-btn small ${k.nest&&k.nest.egg===e?"hot":""}" data-kact="rs-nest" data-e="${e}">${esc(K_EGGS[e].name)}</button>`).join("")}</div>
      ${k.nest?`<div class="rs-line" style="margin-top:8px"><span>먹인 간식</span><div class="rs-num"><button data-kact="rs-fed" data-d="-1" ${k.nest.fed?"":"disabled"}>−</button><b>${k.nest.fed}/${K_EGGS[k.nest.egg].need}</b><button data-kact="rs-fed" data-d="1" ${k.nest.fed<K_EGGS[k.nest.egg].need-1?"":"disabled"}>+</button></div></div>`:""}
      <div class="rs-line" style="margin-top:8px"><span>가진 간식</span><div class="rs-num"><button data-kact="rs-snack" data-d="-1" ${k.snacks?"":"disabled"}>−</button><b>${k.snacks}</b><button data-kact="rs-snack" data-d="1">+</button></div></div></section>
    <section class="k-shop"><h3>4. 통장 잔액</h3><p class="k-sub">지금 ${balance().toLocaleString()}원. 원래 잔액을 넣으면 그 금액으로 맞춰요.</p>
      <div class="k-row"><input id="rs-bal" type="number" inputmode="numeric" min="0" step="100" value="${balance()}" class="rs-in"><button class="k-btn small hot" data-kact="rs-bal">잔액 맞추기</button></div></section>
    <p class="k-sub" style="text-align:center">여기서 지정한 기록은 주간 리포트의 ‘이 주의 성과’에는 넣지 않아요.</p>
  </div>`; }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-kact]"); if(!b||b.disabled) return; const a=b.dataset.kact; if(a==="parent-out") PR_TAB="report"; if(!/^rs-/.test(a)) return;
  e.stopPropagation(); const k=K(), sj=RS.subj; const re=()=>{ save(); render(false); };
  ({ "rs-open":()=>{ PR_TAB="restore"; render(true); window.scrollTo(0,0); },
     "rs-back":()=>{ PR_TAB="report"; render(true); window.scrollTo(0,0); },
     "rs-subj":()=>{ RS.subj=b.dataset.s; RS.gi=curSeries(RS.subj); re(); },
     "rs-gi":()=>{ RS.gi=+b.dataset.n; re(); },
     "rs-cur":()=>{ ensurePlaced(sj,RS.gi); k.series[sj]=RS.gi; syncSeries(sj); re(); toast(`${sj} ${RS.gi+1}편을 지금 하는 편으로 정했어요`); },
     "rs-before":()=>{ for(let g=0; g<RS.gi; g++) stagesOf(sj,g).forEach(x=>setStage(x.key,5)); ensurePlaced(sj,RS.gi); syncSeries(sj); re(); toast(`1~${RS.gi}편을 모두 완성으로 바꿨어요`); },
     "rs-all":()=>{ const lv=+b.dataset.lv; stagesOf(sj,RS.gi).forEach(x=>setStage(x.key,lv)); ensurePlaced(sj,RS.gi); syncSeries(sj); re(); },
     "rs-st":()=>{ setStage(b.dataset.key,+b.dataset.lv); ensurePlaced(sj,RS.gi); syncSeries(sj); re(); },
     "rs-dex":()=>{ const id=b.dataset.id, n=Math.max(0,(k.dex[id]||0)+(+b.dataset.d)); if(n) k.dex[id]=n; else { delete k.dex[id]; if(k.buddy===id) k.buddy=Object.keys(k.dex)[0]||null; } if(!k.buddy&&n) k.buddy=id; re(); },
     "rs-buddy":()=>{ k.buddy=b.dataset.id; re(); toast(`${K_BY[b.dataset.id].name}와(과) 같이 다녀요`); },
     "rs-hatch":()=>{ const eg=b.dataset.e; k.hatched[eg]=Math.max(0,(k.hatched[eg]||0)+(+b.dataset.d)); re(); },
     "rs-nest":()=>{ const eg=b.dataset.e; k.nest=eg?{egg:eg, fed:k.nest&&k.nest.egg===eg?k.nest.fed:0, at:Date.now()}:null; re(); },
     "rs-fed":()=>{ if(!k.nest) return; k.nest.fed=Math.max(0,Math.min(K_EGGS[k.nest.egg].need-1,k.nest.fed+(+b.dataset.d))); re(); },
     "rs-snack":()=>{ k.snacks=Math.max(0,k.snacks+(+b.dataset.d)); re(); },
     "rs-bal":()=>{ const v=Math.max(0,Math.round(+(document.getElementById("rs-bal").value||0))); const d=v-balance(); if(!d) return; S.ledger=S.ledger||[]; S.ledger.push({key:"restore-"+Date.now(), label:"보호자 잔액 맞추기", amount:d, tax:"복구", at:1}); re(); toast(`잔액을 ${v.toLocaleString()}원으로 맞췄어요`); }
  })[a]?.();
}, true);
