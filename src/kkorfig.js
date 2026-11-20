/* =========================================================================
   국어 그림 — 1학년 글자 단원(자음자·모음자·글자 만들기·받침)과 흉내 내는 말
   ========================================================================= */
function letterCard(ch,sub){ return SV(150,128,`<rect x="25" y="6" width="100" height="100" rx="14" fill="#fff" stroke="${FC.ink}" stroke-width="3"/>`+T(75,82,ch,{fs:66,b:true})+(sub?T(75,124,sub,{fs:13}):""),"글자 카드"); }
function plusCard(a,b,c){ const tile=(x,s,f)=>`<rect x="${x}" y="10" width="64" height="64" rx="10" fill="${f}" stroke="${FC.ink}" stroke-width="2.5"/>`+T(x+32,56,s,{fs:36,b:true});
  return SV(290,86,tile(6,a,"#e8f4ff")+T(88,54,"+",{fs:28})+tile(108,b,"#fff3d6")+T(190,54,"=",{fs:28})+tile(214,c,c==="?"?FC.yel:"#fff"),"글자 합치기"); }
function syllableBox(ch,mark){ /* mark: "받침" → 아래 칸 강조 */
  return SV(250,140,`<rect x="10" y="10" width="120" height="120" rx="12" fill="#fff" stroke="${FC.ink}" stroke-width="3"/>`+T(70,98,ch,{fs:80,b:true})+
   `<rect x="150" y="14" width="44" height="34" rx="6" fill="#e8f4ff" stroke="${FC.ink}" stroke-width="2"/>`+T(172,37,"첫소리",{fs:11})+`<rect x="200" y="14" width="44" height="34" rx="6" fill="#fff3d6" stroke="${FC.ink}" stroke-width="2"/>`+T(222,37,"모음",{fs:11})+
   `<rect x="150" y="56" width="94" height="34" rx="6" fill="${mark?FC.yel:"#fff"}" stroke="${FC.ink}" stroke-width="2"/>`+T(197,79,"받침 = ?",{fs:13,b:true})+T(197,118,"글자의 짜임",{fs:12}),"글자의 짜임"); }
const EMO={"토끼":"🐰","비가":"🌧️","강아지":"🐶","별이":"✨","아기":"👶","오리":"🦆","시계":"⏰","거북":"🐢","시냇물":"🏞️"};
function emoCard(p){ const k=Object.keys(EMO).find(k=>p.includes(k)); return k?SV(150,110,`<rect x="25" y="5" width="100" height="100" rx="18" fill="#fffbe8" stroke="${FC.ink}" stroke-width="2.5"/><text x="75" y="76" text-anchor="middle" font-size="56">${EMO[k]}</text>`,"그림"):""; }
(function(){ const W=(g,u,j,fn)=>{ const f0=KKOR[g][u].gens[j]; KKOR[g][u].gens[j]=r=>{ const q=f0(r); try{ const fig=fn(q); if(fig) q.fig=fig; }catch(e){} return q; }; };
  const quote=s=>{ const m=String(s).match(/‘([^’]+)’/); return m?m[1]:""; };
  W(1,0,0,q=>letterCard(quote(q.p),"자음자"));
  W(1,1,0,q=>letterCard(quote(q.p),"이 글자의 모음자는?"));
  W(1,2,0,q=>{ const m=q.p.match(/(\S)\s*\+\s*(\S)/); return m?plusCard(m[1],m[2],"?"):""; });
  W(1,2,1,q=>letterCard(quote(q.p),"? + ?"));
  W(1,3,0,q=>syllableBox(quote(q.p),true));
  W(1,6,0,q=>emoCard(q.p));
  const u2=KKOR[2].findIndex(U=>/흉내/.test(U.u)); if(u2>=0) KKOR[2][u2].gens.forEach((_,j)=>W(2,u2,j,q=>emoCard(q.p)));
})();
