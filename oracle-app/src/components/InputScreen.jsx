import { sx } from '../utils/sx.js';

export default function InputScreen({ vm }) {
  return (
    <div style={sx(`padding-top:${vm.topPad}; animation:fadeIn .45s ease both`)}>
      <button onClick={vm.goLanding} style={sx('background:none; border:none; padding:0 0 22px; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>← 처음으로</button>
      <div style={sx('font-family:\'Cinzel\',serif; font-size:10px; letter-spacing:.36em; color:#B39A55; margin-bottom:10px')}>STEP 01 — YOUR BIRTH</div>
      <h2 style={sx('margin:0 0 8px; font-size:25px; font-weight:600; letter-spacing:.03em; color:#F2ECD9')}>태어난 때를 적으라</h2>
      <p style={sx('margin:0 0 30px; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; line-height:1.8; color:#7B819C; font-weight:300')}>시각을 알수록 신탁이 정밀해진다. 모른다면 비워두어도 좋다.</p>

      <div style={sx('display:flex; flex-direction:column; gap:26px')}>
        <div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; letter-spacing:.16em; color:#B39A55; margin-bottom:10px')}>이름 <span style={{ color: '#7B819C' }}>선택</span></div>
          <input className="oinp" value={vm.fName} onChange={vm.setName} placeholder="비우면 '이름을 감춘 자'"
            style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Noto Serif KR\',serif; font-size:17px; transition:border-color .2s')} />
        </div>

        <div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; letter-spacing:.16em; color:#B39A55; margin-bottom:10px')}>생년월일</div>
          <div style={sx('display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px')}>
            <input className="oinp" value={vm.fY} onChange={vm.setY} inputMode="numeric" maxLength={4} placeholder="1996"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:20px; letter-spacing:.06em; transition:border-color .2s')} />
            <input className="oinp" value={vm.fM} onChange={vm.setM} inputMode="numeric" maxLength={2} placeholder="07"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:20px; letter-spacing:.06em; transition:border-color .2s')} />
            <input className="oinp" value={vm.fD} onChange={vm.setD} inputMode="numeric" maxLength={2} placeholder="14"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:20px; letter-spacing:.06em; transition:border-color .2s')} />
          </div>
          <div style={sx('display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:12px; margin-top:7px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C')}>
            <div>년</div><div>월</div><div>일</div>
          </div>
        </div>

        <div>
          <div style={sx('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; letter-spacing:.16em; color:#B39A55')}>출생 시각 <span style={{ color: '#7B819C' }}>선택</span></div>
            <button onClick={vm.toggleUnknown} style={sx(`background:none; border:none; padding:0; font-family:'Noto Sans KR',sans-serif; font-size:11px; color:${vm.unknownColor}; cursor:pointer`)}>{vm.unknownLabel}</button>
          </div>
          <div style={sx(`display:grid; grid-template-columns:1fr 1fr; gap:12px; opacity:${vm.timeOpacity}`)}>
            <input className="oinp" value={vm.fH} onChange={vm.setH} disabled={vm.timeDisabled} inputMode="numeric" maxLength={2} placeholder="09"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:20px; transition:border-color .2s')} />
            <input className="oinp" value={vm.fMin} onChange={vm.setMin} disabled={vm.timeDisabled} inputMode="numeric" maxLength={2} placeholder="40"
              style={sx('width:100%; box-sizing:border-box; background:none; border:none; border-bottom:1px solid #2A3050; padding:8px 0; color:#E8E3D5; font-family:\'Cinzel\',serif; font-size:20px; transition:border-color .2s')} />
          </div>
          <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:7px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C')}><div>시</div><div>분</div></div>
        </div>

        <div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; letter-spacing:.16em; color:#B39A55; margin-bottom:10px')}>성별 <span style={{ color: '#7B819C' }}>대운 판정에 필요</span></div>
          <div style={sx('display:flex; gap:8px')}>
            {vm.genders.map((gd) => (
              <button key={gd.label} onClick={gd.on} style={sx(`flex:1; min-height:44px; background:${gd.bg}; border:1px solid ${gd.bd}; border-radius:2px; color:${gd.fg}; font-family:'Noto Serif KR',serif; font-size:13.5px; cursor:pointer; transition:all .18s`)}>{gd.label}</button>
            ))}
          </div>
        </div>

        <button onClick={vm.togglePrecise} style={sx(`display:flex; align-items:flex-start; gap:13px; text-align:left; background:rgba(255,255,255,.02); border:1px solid ${vm.preciseBorder}; border-radius:2px; padding:15px 16px; cursor:pointer; transition:border-color .2s`)}>
          <div style={sx(`flex:none; width:36px; height:20px; border-radius:11px; background:${vm.preciseTrack}; position:relative; transition:background .22s; margin-top:2px`)}>
            <div style={sx(`position:absolute; top:2px; left:${vm.preciseKnobX}; width:16px; height:16px; border-radius:50%; background:${vm.preciseKnob}; transition:left .22s`)} />
          </div>
          <div>
            <div style={sx('font-family:\'Noto Serif KR\',serif; font-size:13.5px; color:#E8E3D5; margin-bottom:4px')}>정밀 모드 · 진태양시 보정</div>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11px; line-height:1.65; color:#7B819C; font-weight:300')}>표준시(동경 135°)와 실제 경도차·균시차를 반영해 시주를 다시 판정한다. {vm.preciseNote}</div>
          </div>
        </button>

        <button onClick={vm.submit} disabled={vm.submitDisabled}
          style={sx(`width:100%; min-height:56px; background:${vm.ctaBg}; border:none; border-radius:2px; color:${vm.ctaFg}; font-family:'Noto Serif KR',serif; font-size:16px; font-weight:600; letter-spacing:.14em; cursor:${vm.ctaCursor}; box-shadow:${vm.ctaShadow}; transition:all .2s`)}>
          {vm.ctaLabel}
        </button>
        {vm.formError && (
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; color:#C2554A; margin-top:-16px')}>{vm.formError}</div>
        )}
      </div>
    </div>
  );
}
