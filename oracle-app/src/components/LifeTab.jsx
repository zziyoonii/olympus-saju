import { sx } from '../utils/sx.js';

export default function LifeTab({ vm }) {
  return (
    <div>
      {/* 한 문장 */}
      <div style={sx('margin-bottom:14px; border:1px solid rgba(201,162,39,.34); background:linear-gradient(180deg, rgba(201,162,39,.09), rgba(255,255,255,.015)); animation:riseIn .55s ease both')}>
        <div style={sx('height:3px; background:linear-gradient(90deg, transparent, #C9A227, transparent); opacity:.75')} />
        <div style={sx('padding:26px 20px 24px')}>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.18em; color:#B39A55')}>한 문장으로</div>
          <p style={sx('margin:16px 0 0; font-size:23px; line-height:1.62; font-weight:600; letter-spacing:0; color:#F5F0DE; text-wrap:pretty')}>{vm.personaHeadline}</p>
          <div style={sx('display:flex; gap:9px; align-items:baseline; margin-top:16px; padding-top:15px; border-top:1px solid rgba(201,162,39,.2)')}>
            <div style={sx('flex:none; font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.16em; color:#B39A55; padding-top:3px')}>근거</div>
            <div style={sx('flex:1; font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; line-height:1.85; color:#9BA0BA; text-wrap:pretty')}>{vm.personaWhy}</div>
          </div>
          <p style={sx('margin:15px 0 0; font-size:13.5px; line-height:2.05; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{vm.personaMore}</p>
        </div>
      </div>

      {/* 부딪히는 자리 */}
      {vm.hasCollisions && (
        <div style={sx('margin-bottom:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .55s ease .08s both')}>
          <div style={sx('padding:18px 18px 16px; border-bottom:1px solid rgba(255,255,255,.07)')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.18em; color:#B39A55')}>부딪히는 자리</div>
            <div style={sx('display:flex; align-items:baseline; gap:10px; margin-top:10px')}>
              <div style={sx('font-size:17px; font-weight:600; letter-spacing:.04em; color:#F2ECD9')}>{vm.strengthLabel}</div>
              <div style={sx('flex:1; font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.6; color:#8A90AC')}>{vm.strengthNote}</div>
            </div>
          </div>

          {vm.collisions.map((c, i) => (
            <div key={i} style={sx('padding:18px; border-bottom:1px solid rgba(255,255,255,.05)')}>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.16em; color:#B39A55')}>{c.section}</div>
              <p style={sx('margin:9px 0 0; font-size:15px; line-height:1.78; color:#F2ECD9; text-wrap:pretty')}>{c.line}</p>
              <p style={sx('margin:10px 0 0; font-family:\'Noto Sans KR\',sans-serif; font-size:11px; line-height:1.85; color:#8A90AC; font-weight:300; text-wrap:pretty')}>{c.why}</p>
            </div>
          ))}

          <div style={sx('padding:18px')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.16em; color:#B39A55; margin-bottom:14px')}>십신 분포</div>
            <div style={sx('display:grid; grid-template-columns:repeat(5,1fr); gap:8px')}>
              {vm.personaGroups.map((gp) => (
                <div key={gp.name} style={sx('text-align:center')}>
                  <div style={sx('position:relative; height:46px; border-bottom:1px solid rgba(255,255,255,.08)')}>
                    <div style={sx(`position:absolute; left:0; right:0; bottom:0; height:${gp.barH}; background:${gp.color}`)} />
                  </div>
                  <div style={sx(`font-family:'Noto Sans KR',sans-serif; font-size:10.5px; color:${gp.labelColor}; margin-top:9px`)}>{gp.name}</div>
                  <div style={sx(`font-family:'Cinzel',serif; font-size:13px; color:${gp.labelColor}; margin-top:3px`)}>{gp.count}</div>
                </div>
              ))}
            </div>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; line-height:1.75; color:#8A90AC; margin-top:16px')}>일간을 뺀 일곱 글자를 십신 다섯 갈래로 몰아 세었다. 셋 이상이면 과다, 없으면 부재로 본다.</div>
          </div>
        </div>
      )}

      {/* 지나온 자리 */}
      {vm.hasPast && (
        <div style={sx('margin-bottom:14px; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.02); padding:20px 18px; animation:riseIn .55s ease .16s both')}>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.18em; color:#B39A55; margin-bottom:16px')}>지나온 자리</div>
          <div style={sx('display:flex; flex-direction:column; gap:12px')}>
            {vm.personaPast.map((pm, i) => (
              <div key={i} style={sx('display:grid; grid-template-columns:52px 1fr; gap:12px; align-items:baseline')}>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:15px; color:#DCBB4A')}>{pm.age}</div>
                <div style={sx('font-size:13px; line-height:1.9; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{pm.note}</div>
              </div>
            ))}
          </div>
          <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; line-height:1.7; color:#7B819C; margin-top:15px; padding-top:13px; border-top:1px solid rgba(255,255,255,.06)')}>대운이 바뀌는 나이다. 틀렸다면 생시를 다시 보라 — 입운 나이는 생일에서 절기까지의 일수로 정해진다.</div>
        </div>
      )}

      {/* 수호신 */}
      <div style={sx('margin-bottom:14px; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.022); animation:riseIn .6s ease .24s both')}>
        <div style={sx('display:flex; gap:15px; align-items:center; padding:18px; border-bottom:1px solid rgba(255,255,255,.07)')}>
          <div style={sx('flex:none')}>{vm.guardIcon}</div>
          <div style={sx('flex:1; min-width:0')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.18em; color:#B39A55')}>그대의 수호신</div>
            <div style={sx('font-size:19px; font-weight:600; letter-spacing:.04em; color:#F2ECD9; margin-top:7px')}>{vm.guardName}</div>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#9BA0BA; margin-top:5px')}>{vm.guardSign} · {vm.guardSymbol}</div>
          </div>
        </div>
        <div style={sx('padding:18px')}>
          <p style={sx('margin:0; font-size:14px; line-height:2; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{vm.greeting}</p>
        </div>
        <div style={sx('display:flex; gap:13px; align-items:flex-start; padding:16px 18px 18px; border-top:1px solid rgba(255,255,255,.06)')}>
          <div style={sx('flex:none; margin-top:3px')}>{vm.pairIcon}</div>
          <div style={sx('flex:1; min-width:0')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.16em; color:#B39A55')}>짝을 이루는 신 · {vm.pairRel}</div>
            <div style={sx('font-size:14px; font-weight:600; letter-spacing:.03em; color:#E8E3D5; margin-top:7px')}>{vm.guardName} ↔ {vm.pairName}</div>
            <p style={sx('margin:8px 0 0; font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; line-height:1.85; color:#8A90AC; font-weight:300; text-wrap:pretty')}>{vm.pairNote}</p>
          </div>
        </div>
      </div>

      {/* 사주 원국 */}
      <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .6s ease .16s both')}>
        <div onClick={vm.togglePillars} style={sx(`display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid ${vm.pillarsBorder}; cursor:pointer`)}>
          <div>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.3em; color:#B39A55')}>FOUR PILLARS</div>
            <div style={sx('font-size:15px; font-weight:600; letter-spacing:.05em; margin-top:6px')}>사주 원국 四柱</div>
          </div>
          <div style={sx('display:flex; align-items:center; gap:12px')}>
            <div style={sx('text-align:right; font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; line-height:1.6; color:#7B819C')}>
              <div>{vm.pillarsSummary}</div>
              <div>{vm.correctionLabel}</div>
            </div>
            <div style={sx(`font-size:11px; color:#B39A55; transform:rotate(${vm.pillarsCaret}); transition:transform .2s`)}>▾</div>
          </div>
        </div>

        {vm.pillarsOpen && (
          <>
            <div style={sx('display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid rgba(255,255,255,.07)')}>
              {vm.pillars.map((pl) => (
                <div key={pl.key} style={sx('padding:14px 6px 16px; text-align:center; border-right:1px solid rgba(255,255,255,.05)')}>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.12em; color:#8A90AC; margin-bottom:12px')}>{pl.key}</div>
                  <div style={sx(`font-family:'Noto Sans KR',sans-serif; font-size:8.5px; color:${pl.stemColor}; letter-spacing:.04em; height:12px`)}>{pl.stemTen}</div>
                  <div style={sx(`font-family:'Cinzel',serif; font-size:30px; line-height:1.15; color:${pl.stemColor}; margin:2px 0 1px`)}>{pl.stemHanja}</div>
                  <div style={sx('height:1px; background:rgba(255,255,255,.07); margin:8px 12px')} />
                  <div style={sx(`font-family:'Cinzel',serif; font-size:30px; line-height:1.15; color:${pl.branchColor}; margin:1px 0 2px`)}>{pl.branchHanja}</div>
                  <div style={sx(`font-family:'Noto Sans KR',sans-serif; font-size:8.5px; color:${pl.branchColor}; letter-spacing:.04em; height:12px`)}>{pl.branchTen}</div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC; margin-top:10px')}>{pl.kr}</div>
                </div>
              ))}
            </div>

            <div style={sx('padding:18px')}>
              <div style={sx('display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px')}>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.2em; color:#B39A55')}>오행 분포 五行</div>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C')}>여덟 글자 집계</div>
              </div>
              <div style={sx('display:flex; flex-direction:column; gap:9px')}>
                {vm.elements.map((e) => (
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
                <div>일간 <span style={{ color: '#E8E3D5' }}>{vm.dayStemLabel}</span></div>
                <div style={{ textAlign: 'right' }}>가장 성한 기운 <span style={{ color: '#E8E3D5' }}>{vm.maxElLabel}</span></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 천체 배치 */}
      <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .6s ease .24s both')}>
        <div onClick={vm.toggleNatal} style={sx(`display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid ${vm.natalBorder}; cursor:pointer`)}>
          <div>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.3em; color:#B39A55')}>NATAL CHART</div>
            <div style={sx('font-size:15px; font-weight:600; letter-spacing:.05em; margin-top:6px')}>천체 배치</div>
          </div>
          <div style={sx('display:flex; align-items:center; gap:12px')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C; text-align:right')}>{vm.natalSummary}<br />{vm.utStamp} UT</div>
            <div style={sx(`font-size:11px; color:#B39A55; transform:rotate(${vm.natalCaret}); transition:transform .2s`)}>▾</div>
          </div>
        </div>
        {vm.natalOpen && (
          <>
            {vm.natal.map((b) => (
              <div key={b.name} style={sx('display:grid; grid-template-columns:20px 52px 1fr auto; gap:10px; align-items:center; padding:11px 18px; border-bottom:1px solid rgba(255,255,255,.04)')}>
                <div style={sx('font-size:15px; color:#C9A227; text-align:center')}>{b.glyph}</div>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:12px; color:#E8E3D5')}>{b.name}</div>
                <div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:12px; color:#B9BDD0')}>{b.sign}</div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#8A90AC; margin-top:2px')}>{b.god}</div>
                </div>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:12.5px; color:#B39A55; letter-spacing:.03em')}>{b.deg}°</div>
              </div>
            ))}
            <div style={sx('padding:12px 18px; font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; line-height:1.7; color:#7B819C')}>케플러 방정식 기반 궤도 요소로 태어난 순간의 황경을 산출하여 12궁으로 환산했다.</div>
          </>
        )}
      </div>

      {/* 다섯 신탁 */}
      <div style={sx('display:flex; align-items:baseline; justify-content:space-between; margin:32px 0 12px')}>
        <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.18em; color:#B39A55')}>다섯 신의 신탁</div>
        <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC')}>눌러서 펼치라</div>
      </div>

      <div style={sx('border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.018)')}>
        {vm.oracles.map((o, i) => (
          <div key={i} style={sx('border-bottom:1px solid rgba(255,255,255,.06)')}>
            <div onClick={o.toggle} style={sx(`display:flex; gap:13px; align-items:center; padding:16px 18px; cursor:pointer; background:${o.headBg}; transition:background .18s`)}>
              <div style={sx('flex:none')}>{o.icon}</div>
              <div style={sx('flex:1; min-width:0')}>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; letter-spacing:.16em; color:#B39A55')}>{o.label}</div>
                <div style={sx(`font-size:15px; font-weight:600; letter-spacing:.04em; color:${o.godColor}; margin-top:6px`)}>{o.god}</div>
              </div>
              <div style={sx(`flex:none; font-size:11px; color:#8A90AC; transform:rotate(${o.caret}); transition:transform .2s`)}>▾</div>
            </div>
            {o.open && (
              <div style={sx('padding:0 18px 20px')}>
                {o.plain && (
                  <div style={sx('margin:0 0 16px; padding:13px 15px; border-left:2px solid #C9A227; background:rgba(201,162,39,.07)')}>
                    <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; letter-spacing:.14em; color:#DCBB4A; margin-bottom:7px')}>쉬이 이르면</div>
                    <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:12.5px; line-height:1.8; color:#D8D4C6; font-weight:300; text-wrap:pretty')}>{o.plain}</div>
                  </div>
                )}
                <div style={sx('display:flex; flex-direction:column; gap:12px')}>
                  {o.paragraphs.map((para, pi) => (
                    <p key={pi} style={sx('margin:0; font-size:13.5px; line-height:2.05; color:#C4C8DA; font-weight:300; text-wrap:pretty')}>{para}</p>
                  ))}
                </div>
                {vm.showEvidence && (
                  <div style={sx('margin-top:16px; padding-top:13px; border-top:1px solid rgba(255,255,255,.06); font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC; line-height:1.75')}>근거 · {o.evidence}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 용어 풀이 */}
      <div style={sx('margin-top:14px; border:1px solid rgba(255,255,255,.09); background:#0E1224; animation:riseIn .6s ease .24s both')}>
        <div onClick={vm.toggleTerms} style={sx(`display:flex; justify-content:space-between; align-items:center; padding:16px 18px; border-bottom:1px solid ${vm.termsBorder}; cursor:pointer`)}>
          <div>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.3em; color:#B39A55')}>GLOSSARY</div>
            <div style={sx('font-size:15px; font-weight:600; letter-spacing:.05em; margin-top:6px')}>용어 풀이</div>
          </div>
          <div style={sx('display:flex; align-items:center; gap:12px')}>
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#7B819C')}>처음 보는 말이 있다면</div>
            <div style={sx(`font-size:11px; color:#B39A55; transform:rotate(${vm.termsCaret}); transition:transform .2s`)}>▾</div>
          </div>
        </div>
        {vm.termsOpen && (
          <div style={sx('padding:4px 18px 14px')}>
            {vm.glossary.map(([term, def]) => (
              <div key={term} style={sx('display:grid; grid-template-columns:82px 1fr; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,.05)')}>
                <div style={sx('font-size:12.5px; font-weight:600; color:#E8E3D5; letter-spacing:.02em')}>{term}</div>
                <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11.5px; line-height:1.8; color:#9BA0BA; font-weight:300; text-wrap:pretty')}>{def}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
