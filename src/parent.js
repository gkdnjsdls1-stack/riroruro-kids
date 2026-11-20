
/* =========================================================================
   보호자 화면 (기획서: 비밀번호로 보호 · 이번 주 접속일 · 풀이 시간 · 어려워한 개념 3개 · 하루 이용 시간 제한)
   ========================================================================= */
function PAR(){ const k=K(); k.parent=k.parent||{pin:null, maxPlays:3, maxMin:0}; k.usage=k.usage||{}; return k.parent; }
function dailyMax(){ return PAR().maxPlays||KID.dailyPlays; }
function usedSecToday(){ PAR(); return K().usage[today_()]||0; }
function timeOver(){ const m=PAR().maxMin; return m>0 && usedSecToday()>=m*60; }
function canPlay(){ return playsToday() < dailyMax() && !timeOver(); }
function stopReason(){ return timeOver() ? `오늘 이용 시간(${PAR().maxMin}분)을 다 썼어요` : `오늘 테스트 ${dailyMax()}판을 다 했어요`; }

/* 이용 시간: 화면이 켜져 있는 동안 15초씩 쌓음 */
setInterval(()=>{ try{ if(document.visibilityState!=="visible" || !K().onboard) return; const k=K(), d=today_(); PAR(); k.usage[d]=(k.usage[d]||0)+15;
  const keys=Object.keys(k.usage).sort(); while(keys.length>40) delete k.usage[keys.shift()]; save(); }catch(e){} }, 15000);

function weekDays(off=0){ const out=[]; const now=new Date(); for(let i=6;i>=0;i--){ const d=new Date(now); d.setDate(now.getDate()-i-off*7); out.push(ymd(d)); } return out; }
function weekStats(off=0){
  const days=weekDays(off), from=new Date(days[0]+"T00:00:00").getTime(), to=new Date(days[6]+"T00:00:00").getTime()+86400000, inW=t=>t>=from&&t<to;
  const visited=new Set((S.clockLog||[]).map(c=>c.date).filter(d=>days.includes(d)));
  const perDay=Object.fromEntries(days.map(d=>[d,{ms:0,n:0,ok:0}])), wrong={}, subj={};
  Object.keys(S.docs||{}).forEach(id=>{ const doc=getDoc(id), ds=S.docs[id]; if(!doc||!doc.qs) return;
    Object.entries(ds.answers||{}).forEach(([i,a])=>{ if(!a||!a.at||!inW(a.at)) return; const q=doc.qs[+i]; if(!q) return;
      const d=ymd(new Date(a.at)); if(!perDay[d]) return; perDay[d].ms+=a.ms||0; perDay[d].n++; if(a.firstCorrect) perDay[d].ok++;
      const sj=subj[doc.subject]=subj[doc.subject]||{n:0,ok:0,ms:0}; sj.n++; sj.ms+=a.ms||0; if(a.firstCorrect) sj.ok++;
      if(!a.firstCorrect && !doc.review && !doc.placement){ const c=conceptOf(q,doc.subject).name, key=doc.subject+"|"+c; const w=wrong[key]=wrong[key]||{subj:doc.subject,name:c,n:0,fixed:0,ex:q.p}; w.n++; if(a.correct) w.fixed++; } }); });
  days.forEach(d=>{ if(perDay[d].n) visited.add(d); });
  const hard=Object.values(wrong).sort((a,b)=>b.n-a.n).slice(0,3);
  const tot=Object.values(perDay).reduce((a,x)=>({ms:a.ms+x.ms,n:a.n+x.n,ok:a.ok+x.ok}),{ms:0,n:0,ok:0});
  const k=K(), mastered=[]; Object.entries(k.st||{}).forEach(([key,s])=>{ if(s.mastered&&s.masteredAt&&inW(s.masteredAt)){ const [sj,g,u]=key.split("|"); const st=stagesOf(sj,(+g.slice(1)||1)-1).find(x=>x.key===key); mastered.push({subj:sj,title:st?st.title:key}); } });
  const pay=(S.ledger||[]).filter(t=>t.at&&inW(t.at)&&t.amount>0).reduce((a,t)=>a+t.amount,0);
  const hatched=(k.hatchLog||[]).filter(h=>inW(h.at)).map(h=>h.id);
  const released=(k.released||[]).filter(r=>r.at&&inW(r.at));
  return {days, visited, perDay, hard, tot, subj, mastered, pay, hatched, released};
}
function pct(o){ return o.n?Math.round(o.ok/o.n*100):0; }
function delta(a,b,unit=""){ if(b==null) return ""; const d=a-b; return d===0?`<em class="pr-dl">지난주와 같음</em>`:`<em class="pr-dl ${d>0?"up":"dn"}">${d>0?"▲":"▼"} ${Math.abs(d)}${unit}</em>`; }
function reportComment(w,lw){ const out=[]; const r=pct(w.tot), lr=pct(lw.tot);
  if(!w.tot.n) return ["이번 주는 아직 푼 문제가 없어요. 짧게 1판부터 같이 시작해 보세요."];
  if(w.visited.size>=5) out.push(`일주일 중 ${w.visited.size}일 출근했어요. 꾸준함이 정말 좋아요.`);
  else if(w.visited.size>=3) out.push(`${w.visited.size}일 출근했어요. 하루 1판씩만 더하면 습관이 돼요.`);
  else out.push(`${w.visited.size}일 출근했어요. 정해진 시간(예: 저녁 먹고 바로)에 1판 하기를 추천해요.`);
  if(lw.tot.n && r>lr+4) out.push(`첫 시도 정답률이 지난주보다 ${r-lr}%p 올랐어요. 칭찬해 주세요!`);
  else if(lw.tot.n && r<lr-4) out.push(`정답률이 지난주보다 ${lr-r}%p 내려갔어요. 새 단원이라 그럴 수 있어요. 개념 카드를 같이 읽어 보세요.`);
  else if(r>=85) out.push("첫 시도 정답률이 높아요. 다음 편으로 넘어갈 준비가 됐어요.");
  if(w.mastered.length) out.push(`스테이지 ${w.mastered.length}개를 완벽 습득했어요.`);
  if(w.hard[0]) out.push(`‘${w.hard[0].name}’을(를) 가장 어려워했어요. 아래 도와주는 방법을 참고하세요.`);
  return out.map(kjosa); }
function reportText(w,lw){ const nm=S.name||"우리 아이", d0=w.days[0].slice(5).replace("-","/"), d1=w.days[6].slice(5).replace("-","/");
  const L=[`[리로루로게임즈 주간 리포트] ${nm} · ${d0}~${d1}`, `출근 ${w.visited.size}일 · 공부 ${fmtMin(w.tot.ms)} · 문제 ${w.tot.n}개 · 첫 시도 정답률 ${pct(w.tot)}%`];
  Object.entries(w.subj).forEach(([s,o])=>L.push(`- ${s}: ${o.n}문제, 정답률 ${pct(o)}%`));
  if(w.mastered.length) L.push(`완벽 습득: ${w.mastered.map(m=>m.title).join(", ")}`);
  if(w.hard.length) L.push(`어려워한 개념: ${w.hard.map(h=>h.name).join(", ")}`);
  L.push(...reportComment(w,lw)); return L.join("\n"); }
function fmtMin(ms){ const m=Math.round(ms/60000); return m<1&&ms>0?"1분 미만":`${m}분`; }
const WD=["일","월","화","수","목","금","토"];
function renderParent(){
  if(PR_TAB==="restore") return renderRestore();
  activeDocId=null; const p=PAR(), w=weekStats(RW), lw=weekStats(RW+1), k=K();
  const maxMs=Math.max(60000,...w.days.map(d=>w.perDay[d].ms));
  return `<div class="k-head"><button class="k-back" data-kact="parent-out">← 잠그기</button><div class="k-ttl"><b>보호자 화면</b><small>${esc(S.name||"신입사원")} · ${k.grade?k.grade+"학년":""}</small></div></div>
  <div class="k-wrap pr">
    <div class="k-row pr-tabs"><button class="k-btn small ${!RW?"hot":""}" data-kact="p-week" data-n="0">이번 주</button><button class="k-btn small ${RW?"hot":""}" data-kact="p-week" data-n="1">지난주</button><button class="k-btn small" data-kact="p-copy">📋 리포트 복사</button></div>
    <section class="k-shop pr-rep"><h3>📊 주간 리포트 <small>${w.days[0].slice(5).replace("-","/")} ~ ${w.days[6].slice(5).replace("-","/")}</small></h3>
      <ul class="pr-say">${reportComment(w,lw).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
      <div class="pr-kv"><div><b>${w.visited.size}일</b><span>출근한 날</span>${delta(w.visited.size,lw.visited.size,"일")}</div><div><b>${fmtMin(w.tot.ms)}</b><span>문제 푼 시간</span>${delta(Math.round(w.tot.ms/60000),Math.round(lw.tot.ms/60000),"분")}</div><div><b>${pct(w.tot)}%</b><span>첫 시도 정답률 (${w.tot.n}문제)</span>${lw.tot.n?delta(pct(w.tot),pct(lw.tot),"%p"):""}</div></div>
      <div class="pr-days">${w.days.map(d=>{ const x=w.perDay[d], dt=new Date(d+"T00:00:00"); return `<div class="pr-day ${w.visited.has(d)?"on":""}"><div class="pr-bar"><i style="height:${Math.round(x.ms/maxMs*100)}%"></i></div><b>${WD[dt.getDay()]}</b><small>${x.ms?fmtMin(x.ms):"–"}</small></div>`; }).join("")}</div>
      <p class="k-sub">노란 요일 = 사원증을 찍고 들어온 날, 막대 = 문제 푼 시간.${RW?"":` 오늘 앱 사용 ${Math.round(usedSecToday()/60)}분.`}</p></section>
    <section class="k-shop"><h3>과목별</h3>${Object.keys(w.subj).length?`<div class="pr-subj">${Object.keys(DEPTS).filter(s=>w.subj[s]).map(s=>{ const o=w.subj[s]; return `<div><b>${esc(s)}</b><div class="pr-meter"><i style="width:${pct(o)}%"></i></div><small>${o.n}문제 · 정답률 ${pct(o)}% · ${fmtMin(o.ms)}</small></div>`; }).join("")}</div>`:`<p class="k-sub">이 주에 푼 문제가 없어요.</p>`}</section>
    <section class="k-shop"><h3>어려워한 개념 · 집에서 도와주기</h3>${w.hard.length?`<ol class="pr-hard">${w.hard.map(h=>{ const ez=EASY[h.name]||[]; return `<li><b>${esc(h.name)}</b><small>${esc(h.subj)} · 첫 시도에서 ${h.n}번 틀림${h.fixed?` · 그중 ${h.fixed}번은 다시 풀어서 맞힘`:""}</small><small>예: ${esc(h.ex)}</small>${ez[0]?`<p class="pr-tip">💡 ${esc(ez[0])}${ez[1]?`<br>👉 같이 해 보기: ${esc(ez[1])}`:""}</p>`:""}</li>`; }).join("")}</ol>`:`<p class="k-sub">이 주에 틀린 문제가 없거나 아직 푼 문제가 없어요.</p>`}
      <p class="k-sub">틀린 문제는 2층 버그 수리실에서 힌트를 보며 다시 풀 수 있어요. 지금 남은 버그 ${pendingWrong().length}개.</p></section>
    <section class="k-shop"><h3>이 주의 성과</h3><ul class="k-list">
      <li><b>⭐ 완벽 습득 ${w.mastered.length}개</b><small>${w.mastered.length?w.mastered.map(m=>esc(m.subj+" · "+m.title)).join(", "):"아직 없어요"}</small></li>
      <li><b>🎮 출시한 게임 ${w.released.length}편</b><small>${w.released.length?w.released.map(r=>esc(r.title)).join(", "):"편의 모든 스테이지를 완성하면 출시돼요"}</small></li>
      <li><b>💰 번 월급 ${w.pay.toLocaleString()}원</b><small>테스트 통과 300원 · 최종 점검 보너스 900원</small></li>
      <li><b>🐣 부화 ${w.hatched.length}마리</b><small>${w.hatched.length?w.hatched.map(id=>esc(K_BY[id]?.name||id)).join(", "):"옥상에서 알에 간식을 주면 부화해요"}</small></li></ul></section>
    <section class="k-shop"><h3>진도</h3><ul class="k-list">${Object.keys(DEPTS).map(sj=>{ if(!S.placed[sj]) return `<li><b>${esc(DEPTS[sj].label)}</b><small>아직 입사 테스트 전</small></li>`; const L=curSeries(sj), st=stagesOf(sj,L), d=st.filter(x=>stSt(x.key).mastered).length; return `<li><b>${esc(DEPTS[sj].label)} ${L+1}편 (${esc(SERIES[L].label)})</b><small>스테이지 ${d}/${st.length} 완성${k.released.filter(r=>r.subj===sj).length?` · 출시 ${k.released.filter(r=>r.subj===sj).length}편`:""}</small></li>`; }).join("")}</ul>
      <p class="k-sub">완성한 스테이지 모두 ${masteredCount()}개 · 직급 ${esc(companyRank())}</p></section>
    <section class="k-shop"><h3>하루 이용 제한</h3>
      <p class="k-sub">게임 테스트 판 수 (최종 점검 포함)</p><div class="k-row">${[1,2,3,4,5].map(n=>`<button class="k-btn small ${dailyMax()===n?"hot":""}" data-kact="p-plays" data-n="${n}">${n}판</button>`).join("")}</div>
      <p class="k-sub" style="margin-top:12px">앱 이용 시간 (넘으면 새 테스트를 시작할 수 없어요. 하던 테스트는 마칠 수 있어요)</p><div class="k-row">${[0,15,20,30,45,60].map(n=>`<button class="k-btn small ${p.maxMin===n?"hot":""}" data-kact="p-min" data-n="${n}">${n?n+"분":"제한 없음"}</button>`).join("")}</div>
      <p class="k-sub" style="margin-top:12px">효과음</p><div class="k-row"><button class="k-btn small ${soundOn()?"hot":""}" data-kact="sound">${soundOn()?"🔊 켜짐":"🔇 꺼짐"}</button></div>
      <p class="k-sub" style="margin-top:12px">학년</p><div class="k-row">${[1,2,3,4,5,6].map(g=>`<button class="k-btn small ${k.grade===g?"hot":""}" data-kact="set-grade" data-g="${g}">${g}학년</button>`).join("")}</div></section>
    <section class="k-shop"><h3>🛠 진도·알 직접 지정</h3><p class="k-sub">휴대폰을 바꾸거나 기록이 지워졌을 때, 과목별 편·스테이지 진도와 옥상 알·도감, 통장 잔액을 원래대로 맞출 수 있어요.</p><button class="k-btn small hot" data-kact="rs-open">진도·알 지정하러 가기</button></section>
    <section class="k-shop"><h3>비밀번호</h3><p class="k-sub">숫자 4자리. 이 기기에만 저장돼요. 아이가 보는 앞에서 누르지 마세요.</p><button class="k-btn small" data-kact="p-repin">비밀번호 바꾸기</button></section>
  </div>`;
}
let RW=0;
let PIN_BUF="", PIN_MODE=null, PIN_FIRST="";
function pinPad(title,sub){
  showModal(`<div class="nt-h" id="mdl-t">${esc(title)}</div><p class="nt-to">${esc(sub||"")}</p>
    <div class="pin-dots">${[0,1,2,3].map(i=>`<i class="${i<PIN_BUF.length?"on":""}"></i>`).join("")}</div>
    <div class="pin-pad">${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(n=>n===""?"<span></span>":`<button class="btn" data-kact="pin" data-n="${n}">${n}</button>`).join("")}</div>
    <div class="actions" style="margin-top:10px"><button class="btn" style="width:100%" data-kact="pin-cancel">취소</button></div>`);
}
function openParent(){ const p=PAR(); PIN_BUF=""; if(!p.pin){ PIN_MODE="set1"; pinPad("보호자 비밀번호 만들기","보호자만 아는 숫자 4자리를 정해 주세요"); } else { PIN_MODE="enter"; pinPad("보호자 화면","비밀번호 4자리를 눌러 주세요"); } }
function pinDone(){
  const p=PAR();
  if(PIN_MODE==="enter"){ if(PIN_BUF===p.pin){ closeModal(); S.screen="parent"; save(); render(true); } else { PIN_BUF=""; pinPad("보호자 화면","비밀번호가 달라요. 다시 눌러 주세요"); } return; }
  if(PIN_MODE==="set1"){ PIN_FIRST=PIN_BUF; PIN_BUF=""; PIN_MODE="set2"; pinPad("한 번 더","같은 숫자 4자리를 다시 눌러 주세요"); return; }
  if(PIN_MODE==="set2"){ if(PIN_BUF===PIN_FIRST){ p.pin=PIN_BUF; save(); closeModal(); S.screen="parent"; save(); render(true); toast("보호자 비밀번호를 만들었어요"); }
    else { PIN_BUF=""; PIN_MODE="set1"; pinPad("보호자 비밀번호 만들기","두 번 누른 숫자가 달라요. 처음부터 다시 정해 주세요"); } }
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-kact]"); if(!b||b.disabled) return; const a=b.dataset.kact, p=PAR();
  if(a==="parent") return openParent();
  if(a==="pin"){ const n=b.dataset.n; if(n==="⌫") PIN_BUF=PIN_BUF.slice(0,-1); else if(PIN_BUF.length<4) PIN_BUF+=n;
    if(PIN_BUF.length===4) return pinDone(); const t=$("#mdl-t")?.textContent, s=$(".ntc .nt-to")?.textContent; return pinPad(t,s); }
  if(a==="pin-cancel"){ PIN_BUF=""; closeModal(); return; }
  if(a==="parent-out"){ S.screen="my"; save(); render(true); return; }
  if(a==="p-week"){ RW=+b.dataset.n; render(false); return; }
  if(a==="p-copy"){ const t=reportText(weekStats(RW),weekStats(RW+1)); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("리포트를 복사했어요. 가족 채팅에 붙여 넣어 보세요"),()=>{ showModal(`<div class="nt-h">리포트</div><textarea style="width:100%;height:220px;font-size:14px">${esc(t)}</textarea><div class="actions"><button class="btn" data-kact="pin-cancel" style="width:100%">닫기</button></div>`); }); return; }
  if(a==="p-plays"){ p.maxPlays=+b.dataset.n; save(); render(false); toast(`하루 ${p.maxPlays}판으로 정했어요`); return; }
  if(a==="p-min"){ p.maxMin=+b.dataset.n; save(); render(false); toast(p.maxMin?`하루 ${p.maxMin}분으로 정했어요`:"이용 시간 제한을 껐어요"); return; }
  if(a==="p-repin"){ PIN_BUF=""; PIN_MODE="set1"; pinPad("새 비밀번호","새 숫자 4자리를 눌러 주세요"); return; }
});
