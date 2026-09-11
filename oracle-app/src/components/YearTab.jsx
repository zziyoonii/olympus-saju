import { sx } from '../utils/sx.js';

export default function YearTab({ vm }) {
  return (
    <div>
      <div style={sx('position:relative; text-align:center; padding:30px 22px 28px; border:1px solid rgba(201,162,39,.22); background:linear-gradient(180deg, rgba(201,162,39,.08), rgba(201,162,39,.01) 60%, transparent); animation:riseIn .6s ease both')}>
        <div style={sx('position:absolute; inset:0; pointer-events:none; background:radial-gradient(60% 45% at 50% 0%, rgba(201,162,39,.2), transparent 70%)')} />
        <div style={sx('position:relative')}>
          <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.36em; color:#B39A55')}>TURN OF THE YEAR</div>
          <div style={sx('display:flex; align-items:flex-start; justify-content:center; gap:18px; margin:24px 0 20px')}>
            <div style={sx('width:104px')}>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:11px; letter-spacing:.14em; color:#B39A55')}>{vm.yearCur}</div>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:32px; line-height:1.1; color:#F2ECD9; margin-top:8px')}>{vm.yearCurGanji}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.6; color:#8A90AC; margin-top:7px')}>{vm.yearCurKr}<br />{vm.yearCurTen}</div>
            </div>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:17px; color:#B39A55; padding-top:26px')}>&rarr;</div>
            <div style={sx('width:104px')}>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:11px; letter-spacing:.14em; color:#B39A55')}>{vm.yearNext}</div>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:32px; line-height:1.1; color:#F2ECD9; margin-top:8px')}>{vm.yearNextGanji}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.6; color:#8A90AC; margin-top:7px')}>{vm.yearNextKr}<br />{vm.yearNextTen}</div>
            </div>
          </div>
          <div style={sx('width:26px; height:1px; background:rgba(201,162,39,.5); margin:0 auto 18px')} />
          <div style={sx('font-size:19px; font-weight:600; letter-spacing:.08em; color:#DCBB4A')}>{vm.yearHeadline}</div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.7; color:#8A90AC; margin-top:12px')}>{vm.closerName}가 닫고 {vm.openerName}가 연다</div>
        </div>
      </div>

      <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.022); animation:riseIn .55s ease .08s both')}>
        <div style={sx('padding:20px 18px 22px')}>
          <div style={sx('display:flex; gap:12px; align-items:center; padding-bottom:14px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,.07)')}>
            <div style={sx('flex:none')}>{vm.closerIcon}</div>
            <div style={sx('flex:1; min-width:0')}>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.22em; color:#C4C8DA; margin-bottom:5px')}>연말 · {vm.closerTag} · 남은 {vm.yearMonthsLeft}달</div>
              <div style={sx('font-size:15px; font-weight:600; letter-spacing:.05em; color:#E8E3D5')}>{vm.closerName}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C; margin-top:4px')}>{vm.closerRole}</div>
            </div>
            <div style={sx('flex:none; font-family:\'Cinzel\',serif; font-size:10.5px; color:#8A90AC')}>{vm.yearCurGanji}</div>
          </div>
          <div style={sx('display:flex; flex-direction:column; gap:13px')}>
            {vm.yearCurParas.map((para, i) => (
              <p key={i} style={sx('margin:0; font-size:13.5px; line-height:2.05; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div style={sx(`margin-top:14px; border:1px solid ${vm.openerBorder}; background:linear-gradient(180deg, ${vm.openerTint}, rgba(255,255,255,.015)); animation:riseIn .55s ease .16s both`)}>
        <div style={sx(`height:3px; background:linear-gradient(90deg, transparent, ${vm.openerColor}, transparent); opacity:.7`)} />
        <div style={sx('padding:22px 20px 24px')}>
          <div style={sx('display:flex; gap:13px; align-items:center; padding-bottom:15px; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,.07)')}>
            <div style={sx('flex:none')}>{vm.openerIcon}</div>
            <div style={sx('flex:1; min-width:0')}>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.22em; color:#C4C8DA; margin-bottom:5px')}>신년 · {vm.openerTag} · {vm.yearNext}년</div>
              <div style={sx('font-size:19px; font-weight:600; letter-spacing:.05em; color:#F5F0DE')}>{vm.openerName}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC; margin-top:4px')}>{vm.openerRole} · 세운 {vm.yearNextTen}의 자리</div>
            </div>
            <div style={sx('flex:none; font-family:\'Cinzel\',serif; font-size:11px; color:#B39A55')}>{vm.yearNextGanji}</div>
          </div>
          <div style={sx('display:flex; flex-direction:column; gap:13px')}>
            {vm.yearNextParas.map((para, i) => (
              <p key={i} style={sx('margin:0; font-size:13.5px; line-height:2.05; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .55s ease .24s both')}>
        <div style={sx('display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.07)')}>
          <div>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.28em; color:#B39A55')}>SIX MEASURES</div>
            <div style={sx('font-size:15px; font-weight:600; letter-spacing:.06em; margin-top:5px')}>판정의 근거</div>
          </div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C; text-align:right')}>세운 · 대운<br />트랜짓</div>
        </div>
        {vm.yearRows.map((rw, i) => (
          <div key={i} style={sx('display:grid; grid-template-columns:78px 1fr; gap:12px; padding:13px 18px; border-bottom:1px solid rgba(255,255,255,.04)')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.5; color:#B39A55; padding-top:3px')}>{rw.label}</div>
            <div>
              <div style={sx('font-family:\'Cinzel\',serif; font-size:14.5px; color:#E8E3D5; letter-spacing:.04em')}>{rw.value}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; line-height:1.75; color:#8A90AC; margin-top:5px; text-wrap:pretty')}>{rw.note}</div>
            </div>
          </div>
        ))}
        <div style={sx('padding:12px 18px; font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; line-height:1.7; color:#7B819C')}>세운은 입춘을 경계로 갈리며, 대운의 순행·역행은 년간 음양과 성별로 판정된다. 트랜짓은 해당 연도 12월 31일 정오의 천체 위치로 고정한다.</div>
      </div>
    </div>
  );
}
