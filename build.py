"""리로루로게임즈 (초등판) 빌드 스크립트
src/ 의 원본(base.html + 모듈 JS + CSS)을 합쳐 루트의 index.html 하나로 만들어요.
실행:  python3 build.py
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parent
SRC=ROOT/'src'
s=open(SRC/'base.html',encoding='utf-8').read()
def rep(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:70],s.count(a)); s=s.replace(a,b)
rep('storageKey: "gaenyeom.phase0.v3"','storageKey: "riroruro.kids.v1"')
i=s.index('const BUILDING = ['); j=s.index('];',i)+2
s=s[:i]+open(SRC/'building.js',encoding='utf-8').read()+s[j:]
rep('function scene(type){','function scene0(type){')
rep('function submit(i){','function submit0(i){')
rep('name:"수리정비과", label:"수학"','name:"수학 개발실", label:"수학"')
rep('name:"문해교정과", label:"국어"','name:"국어 개발실", label:"국어"')
rep('name:"과학실험과", label:"과학"','name:"과학 개발실", label:"과학"')
rep('toast("회신란이 비어 있습니다.")','toast("답을 먼저 써 주세요.")')
rep('toast("숫자로 입력해 주세요. 모르면 ‘모름’이라고 써도 됩니다.")','toast("숫자로 써 주세요. 모르면 ‘모름’이라고 써도 돼요.")')
rep('<title>리로루로게임즈 작업지시서 (초등판)</title>','<title>리로루로게임즈 (초등판)</title>')
css=open(SRC/'kid.css',encoding='utf-8').read()
rep('</style>\n</head>', css+'</style>\n</head>')
mod=''.join(open(SRC/f,encoding='utf-8').read() for f in ['eggdata.js','lines.js','kmath.js','kmath12.js','kfig.js','kkor.js','kkorfig.js','ksci.js','ksci22.js','kid.js','parent.js','restore.js','sfx.js'])
rep('/* 시작 */\n', mod+'\n/* 시작 */\n')
open(ROOT/'index.html','w',encoding='utf-8').write(s)
print("built",len(s))
