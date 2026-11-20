
/* =========================================================================
   효과음 (Web Audio로 직접 합성 · 외부 파일 없음) — 8층·보호자 화면에서 끄고 켤 수 있음
   ========================================================================= */
let KAC=null;
function kAC(){ try{ if(!KAC){ const A=window.AudioContext||window.webkitAudioContext; if(!A) return null; KAC=new A(); } if(KAC.state==="suspended") KAC.resume(); return KAC; }catch(e){ return null; } }
function soundOn(){ try{ return K().sound!==false; }catch(e){ return true; } }
function kTone(ctx,f,t0,dur,type="sine",vol=.12,f2){ const o=ctx.createOscillator(), g=ctx.createGain(), t=ctx.currentTime+t0;
  o.type=type; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+dur+0.05); }
function kNoise(ctx,t0,dur,vol=.08){ const n=Math.floor(ctx.sampleRate*dur), buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
  const s=ctx.createBufferSource(), g=ctx.createGain(), f=ctx.createBiquadFilter(); f.type="bandpass"; f.frequency.value=1800; s.buffer=buf; g.gain.value=vol; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(ctx.currentTime+t0); }
const SFX={
  right:c=>{ kNoise(c,0,.06,.06); [784,988,1319].forEach((f,i)=>kTone(c,f,.04+i*.07,.16,"triangle",.13)); kTone(c,1568,.26,.22,"sine",.08); },
  wrong:c=>{ kTone(c,392,0,.16,"triangle",.09,330); kTone(c,330,.15,.22,"triangle",.08,294); },
  coin:c=>{ kTone(c,988,0,.08,"square",.05); kTone(c,1319,.08,.28,"square",.05); },
  done:c=>{ [523,659,784].forEach((f,i)=>kTone(c,f,i*.08,.18,"triangle",.11)); },
  clear:c=>{ [523,659,784,1047].forEach((f,i)=>kTone(c,f,i*.11,.22,"triangle",.12)); kTone(c,1047,.46,.5,"sine",.1); kTone(c,1319,.46,.5,"sine",.07); kTone(c,1568,.46,.5,"sine",.06); },
  hatch:c=>{ kNoise(c,0,.12,.1); kTone(c,300,.05,.35,"sine",.1,900); [1319,1568,2093].forEach((f,i)=>kTone(c,f,.38+i*.08,.18,"sine",.08)); },
  munch:c=>{ kNoise(c,0,.05,.07); kNoise(c,.09,.05,.06); kTone(c,220,0,.08,"square",.03); },
  pop:c=>{ kTone(c,600,0,.09,"sine",.1,1100); },
  ding:c=>{ kTone(c,1319,0,.18,"sine",.08); kTone(c,1047,.16,.3,"sine",.08); },
  tap:c=>{ kTone(c,1760,0,.06,"sine",.05); }
};
function kSfx(name){ if(!soundOn()) return; const c=kAC(); if(!c||!SFX[name]) return; try{ SFX[name](c); }catch(e){} }
/* 원래 코드의 beep()도 여기로 (엘리베이터 도착 등) */
function beep(ding){ kSfx(ding?"ding":"tap"); try{ !ding && soundOn() && navigator.vibrate && navigator.vibrate(30); }catch(e){} }
/* 답 확인할 때 정답·오답 소리 (입사 테스트 중엔 정답을 알려 주지 않으니 짧은 소리만) */
function submit(i){
  const doc=getDoc(activeDocId), ds=doc?docState(activeDocId):null; const before=ds&&ds.answers[i]?JSON.stringify(ds.answers[i]):null;
  const r=submit0(i);
  try{ const a=ds&&ds.answers[i]; if(a && JSON.stringify(a)!==before){ if(doc.placement) kSfx("tap"); else { kSfx(a.correct?"right":"wrong"); if(!a.correct) try{ soundOn()&&navigator.vibrate&&navigator.vibrate(40); }catch(e){} } } }catch(e){}
  return r;
}
document.addEventListener("click",e=>{ const b=e.target.closest("[data-kact]"); if(!b||b.disabled) return; const a=b.dataset.kact;
  if(a==="talk") kSfx("pop"); else if(a==="feed") kSfx("munch"); else if(a==="sound"){ const k=K(); k.sound=!soundOn(); save(); render(false); if(soundOn()) kSfx("done"); toast(soundOn()?"소리를 켰어요":"소리를 껐어요"); } }, true);
