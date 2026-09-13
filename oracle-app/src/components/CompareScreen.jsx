import { sx } from '../utils/sx.js';
import Hoverable from './Hoverable.jsx';

export default function CompareScreen({ vm }) {
  return (
    <div style={sx(`padding-top:${vm.topPad}; animation:fadeIn .45s ease both`)}>
      <button onClick={vm.goLanding} style={sx('background:none; border:none; padding:0 0 22px; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>← 처음으로</button>
      <div style={sx('font-family:\'Cinzel\',serif; font-size:10px; letter-spacing:.36em; color:#B39A55; margin-bottom:10px')}>TWO CHARTS</div>
      <h2 style={sx('margin:0 0 8px; font-size:25px; font-weight:600; letter-spacing:.03em; color:#F2ECD9')}>두 사람의 궁합</h2>
      <p style={sx('margin:0 0 4px; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; line-height:1.8; color:#7B819C; font-weight:300')}>두 원국의 일간·일지 관계, 열여섯 글자의 오행 상보, 수호신 배치, 태양·달·금성의 각을 대조해 판정한다. 시각은 비워도 좋다.</p>

      {vm.people.map((pp, i) => (
        <div key={i} style={sx(`margin-top:20px; padding:18px; border:1px solid ${pp.border}; background:rgba(255,255,255,.02)`)}>
          <div style={sx('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:18px')}>
            <div style={sx(`font-family:'Cinzel',serif; font-size:10px; letter-spacing:.3em; color:${pp.tagColor}`)}>{pp.tag}</div>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#8A90AC')}>{pp.hint}</div>
          </div>
          <input className="oinp" value={pp.name} onChange={pp.setName} placeholder={pp.placeholder}
            style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Noto Serif KR\',serif; font-size:16px; transition:border-color .2s')} />
          <div style={sx('display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px; margin-top:18px')}>
            <input className="oinp" value={pp.y} onChange={pp.setY} inputMode="numeric" maxLength={4} placeholder={pp.yPh}
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:19px; letter-spacing:.05em; transition:border-color .2s')} />
            <input className="oinp" value={pp.m} onChange={pp.setM} inputMode="numeric" maxLength={2} placeholder={pp.mPh}
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:19px; transition:border-color .2s')} />
            <input className="oinp" value={pp.d} onChange={pp.setD} inputMode="numeric" maxLength={2} placeholder={pp.dPh}
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:19px; transition:border-color .2s')} />
          </div>
          <div style={sx('display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px; margin-top:7px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C')}><div>년</div><div>월</div><div>일</div></div>
          <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px')}>
            <input className="oinp" value={pp.h} onChange={pp.setH} inputMode="numeric" maxLength={2} placeholder="--"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:19px; transition:border-color .2s')} />
            <input className="oinp" value={pp.min} onChange={pp.setMin} inputMode="numeric" maxLength={2} placeholder="--"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:19px; transition:border-color .2s')} />
          </div>
          <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:7px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C')}><div>시 · 비우면 정오로 본다</div><div>분</div></div>
        </div>
      ))}

      <Hoverable as="button" onClick={vm.runCompare}
        style={sx('width:100%; min-height:56px; margin-top:22px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:16px; font-weight:600; letter-spacing:.14em; cursor:pointer; box-shadow:0 0 0 1px rgba(201,162,39,.5), 0 10px 30px -12px rgba(201,162,39,.6)')}
        hoverStyle={{ filter: 'brightness(1.08)' }}>{vm.compareCta}</Hoverable>
      {vm.cpError && (
        <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; color:#C2554A; margin-top:12px')}>{vm.cpError}</div>
      )}

      {vm.hasCompat && (
        <div style={sx('margin-top:34px')}>
          <div style={sx(`position:relative; text-align:center; padding:32px 22px 30px; border:1px solid rgba(201,162,39,.22); background:linear-gradient(180deg, rgba(201,162,39,.07), rgba(201,162,39,.01) 60%, transparent); animation:riseIn .6s ease both`)}>
            <div style={sx(`position:absolute; inset:0; pointer-events:none; background:radial-gradient(60% 45% at 50% 0%, ${vm.compatGlow}, transparent 70%)`)} />
            <div style={sx('position:relative')}>
              <div style={sx('display:flex; align-items:flex-start; justify-content:center; gap:20px; margin-bottom:24px')}>
                <div style={sx('width:88px')}>
                  <div style={sx('display:flex; justify-content:center')}>{vm.aIcon}</div>
                  <div style={sx('font-size:13.5px; color:#E8E3D5; margin-top:10px')}>{vm.aGuard}</div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC; margin-top:4px')}>{vm.aLabel}</div>
                </div>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:16px; color:#B39A55; padding-top:14px')}>×</div>
                <div style={sx('width:88px')}>
                  <div style={sx('display:flex; justify-content:center')}>{vm.bIcon}</div>
                  <div style={sx('font-size:13.5px; color:#E8E3D5; margin-top:10px')}>{vm.bGuard}</div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC; margin-top:4px')}>{vm.bLabel}</div>
                </div>
              </div>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:58px; line-height:1; color:#F2ECD9; letter-spacing:.02em')}>{vm.compatScore}</div>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.36em; color:#B39A55; margin-top:12px')}>OUT OF 100</div>
              <div style={sx('width:26px; height:1px; background:rgba(201,162,39,.5); margin:22px auto')} />
              <div style={sx(`font-size:21px; font-weight:600; letter-spacing:.1em; color:${vm.compatGodColor}`)}>{vm.compatBand}</div>
              <p style={sx('margin:14px auto 0; max-width:330px; font-size:13.5px; line-height:2; color:#B9BDD0; font-weight:300; text-wrap:pretty')}>{vm.compatText}</p>
            </div>
          </div>

          <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .6s ease .08s both')}>
            <div style={sx('display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.07)')}>
              <div>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.28em; color:#B39A55')}>FIVE MEASURES</div>
                <div style={sx('font-size:15px; font-weight:600; letter-spacing:.06em; margin-top:5px')}>판정의 근거</div>
              </div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C; text-align:right')}>가중 합산<br />100점 만점</div>
            </div>
            {vm.compatParts.map((c, i) => (
              <div key={i} style={sx('padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.04)')}>
                <div style={sx('display:flex; justify-content:space-between; align-items:baseline; gap:12px')}>
                  <div style={sx('font-size:14px; color:#E8E3D5; letter-spacing:.03em')}>{c.label}</div>
                  <div style={sx('flex:none; font-family:\'Cinzel\',serif; font-size:12.5px; color:#B39A55')}>{c.score} / {c.max}</div>
                </div>
                <div style={sx('height:4px; background:rgba(255,255,255,.06); margin:11px 0; position:relative')}>
                  <div style={sx(`position:absolute; top:0; left:0; bottom:0; width:${c.pct}; background:${c.color}`)} />
                </div>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; line-height:1.85; color:#8A90AC; font-weight:300; text-wrap:pretty')}>{c.note}</div>
              </div>
            ))}
          </div>

          <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; padding:18px; animation:riseIn .6s ease .16s both')}>
            <div style={sx('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px')}>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.2em; color:#B39A55')}>합산 오행 十六字</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C')}>두 원국 열여섯 글자</div>
            </div>
            <div style={sx('display:flex; flex-direction:column; gap:9px')}>
              {vm.compatElements.map((e) => (
                <div key={e.name} style={sx('display:grid; grid-template-columns:44px 1fr 22px; gap:10px; align-items:center')}>
                  <div style={sx(`font-family:'Noto Sans KR',sans-serif; font-size:11px; color:${e.labelColor}`)}>{e.hanja} {e.name}</div>
                  <div style={sx('height:5px; background:rgba(255,255,255,.06); position:relative')}>
                    <div style={sx(`position:absolute; top:0; left:0; bottom:0; width:${e.width}; background:${e.color}`)} />
                  </div>
                  <div style={sx(`font-family:'Cinzel',serif; font-size:12px; text-align:right; color:${e.labelColor}`)}>{e.count}</div>
                </div>
              ))}
            </div>
            <div style={sx('margin-top:16px; padding-top:14px; border-top:1px solid rgba(255,255,255,.06); display:grid; grid-template-columns:1fr 1fr; gap:12px; font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#7B819C')}>
              <div>함께 성한 기운 <span style={{ color: '#E8E3D5' }}>{vm.compatStrong}</span></div>
              <div style={{ textAlign: 'right' }}>함께 빈 기운 <span style={{ color: '#E8E3D5' }}>{vm.compatWeak}</span></div>
            </div>
          </div>

          <div style={sx('margin-top:14px; display:flex; gap:16px; align-items:flex-start; padding:22px 20px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.02); animation:riseIn .6s ease .24s both')}>
            <div style={sx('flex:none; margin-top:2px')}>{vm.compatGodIcon}</div>
            <div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.24em; color:#B39A55; margin-bottom:8px')}>이 연을 주관하는 신</div>
              <div style={sx(`font-size:18px; font-weight:600; letter-spacing:.05em; color:${vm.compatGodColor}; margin-bottom:11px`)}>{vm.compatGod}</div>
              <p style={sx('margin:0; font-size:13px; line-height:1.95; color:#9BA0BA; font-weight:300; text-wrap:pretty')}>{vm.compatGodNote}</p>
            </div>
          </div>

          <Hoverable as="button" onClick={vm.openCompatShare}
            style={sx('width:100%; min-height:52px; margin-top:20px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:14px; font-weight:600; letter-spacing:.1em; cursor:pointer')}
            hoverStyle={{ filter: 'brightness(1.08)' }}>궁합 공유 카드</Hoverable>
          <button onClick={vm.resetCompare} style={sx('width:100%; min-height:48px; margin-top:10px; background:none; border:none; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12.5px; cursor:pointer')}>다른 두 사람 비교하기</button>
        </div>
      )}
    </div>
  );
}
