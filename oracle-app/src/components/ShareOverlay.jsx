import { sx } from '../utils/sx.js';
import Hoverable from './Hoverable.jsx';

export default function ShareOverlay({ vm }) {
  return (
    <div style={sx('position:fixed; inset:0; z-index:40; box-sizing:border-box; display:flex; flex-direction:column; background:#0B0E1A; animation:fadeIn .3s ease both')}>
      <div style={sx('display:flex; justify-content:space-between; align-items:center; padding:20px 22px 14px; flex:none')}>
        <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; letter-spacing:.18em; color:#B39A55')}>{vm.shareTitle}</div>
        <button onClick={vm.closeShare} style={sx('background:none; border:none; padding:0; color:#8A90AC; font-size:20px; line-height:1; cursor:pointer')}>×</button>
      </div>

      {vm.manyShareTabs && (
        <div style={sx('display:flex; gap:7px; padding:0 22px 16px; flex:none')}>
          {vm.shareTabs.map((t) => (
            <button key={t.label} onClick={t.on} style={sx(`flex:1; min-height:40px; padding:0 4px; background:${t.bg}; border:1px solid ${t.bd}; border-radius:2px; color:${t.fg}; font-family:'Noto Sans KR',sans-serif; font-size:11px; cursor:pointer; transition:all .18s`)}>{t.label}</button>
          ))}
        </div>
      )}

      <div className="oq" style={sx('flex:1; overflow-y:auto; display:flex; align-items:flex-start; justify-content:center; padding:4px 22px 10px')}>
        <div style={sx(`transform:scale(${vm.shareScale}); transform-origin:top center`)}>

          {vm.isStory && (
            <div style={sx('width:360px; height:640px; position:relative; overflow:hidden; background:radial-gradient(120% 65% at 50% -5%, #232A4C, #12162A 50%, #080A14 100%); box-shadow:0 30px 70px -30px rgba(0,0,0,.9)')}>
              <div style={sx('position:absolute; inset:0; opacity:.5; background-image:radial-gradient(#C9C7E0 1px, transparent 1.2px); background-size:40px 46px; mask-image:linear-gradient(#000, transparent 65%); -webkit-mask-image:linear-gradient(#000, transparent 65%)')} />
              <div style={sx(`position:absolute; inset:0; background:radial-gradient(55% 32% at 50% 26%, ${vm.guardGlow}, transparent 72%)`)} />
              <div style={sx('position:relative; height:100%; box-sizing:border-box; padding:40px 34px 30px; display:flex; flex-direction:column; text-align:center; color:#E8E3D5')}>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:9px; letter-spacing:.4em; color:#B39A55')}>ORACLE OF THE GODS</div>
                <div style={sx('display:flex; justify-content:center; margin:44px 0 20px')}>{vm.shareIcon}</div>
                <div style={sx(`font-family:'Noto Sans KR',sans-serif; font-size:10.5px; letter-spacing:.26em; color:${vm.guardColor}`)}>{vm.guardSign}의 수호신</div>
                <div style={sx('font-size:38px; font-weight:600; letter-spacing:.1em; margin-top:12px; color:#F5F0DE')}>{vm.guardName}</div>
                <div style={sx('width:24px; height:1px; background:rgba(201,162,39,.6); margin:24px auto')} />
                <div style={sx('font-size:14.5px; line-height:2.05; font-weight:300; color:#CBCFE0; text-wrap:pretty')}>{vm.pullQuote}</div>
                <div style={{ flex: 1 }} />
                <div style={sx('display:flex; justify-content:center; gap:16px; padding:18px 0; border-top:1px solid rgba(201,162,39,.2); border-bottom:1px solid rgba(201,162,39,.2)')}>
                  {vm.elements.map((e) => (
                    <div key={e.name} style={sx('text-align:center')}>
                      <div style={sx(`font-family:'Cinzel',serif; font-size:15px; color:${e.color}`)}>{e.hanja}</div>
                      <div style={sx('font-family:\'Cinzel\',serif; font-size:11px; color:#7B819C; margin-top:4px')}>{e.count}</div>
                    </div>
                  ))}
                </div>
                <div style={sx('display:flex; justify-content:space-between; align-items:center; margin-top:16px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#8A90AC')}>
                  <div>일주 {vm.dayGanjiLabel}</div>
                  <div style={sx('font-family:\'Cinzel\',serif; letter-spacing:.16em; color:#B39A55')}>ORACLE.KR</div>
                </div>
              </div>
            </div>
          )}

          {vm.isCompatStory && (
            <div style={sx('width:360px; height:640px; position:relative; overflow:hidden; background:radial-gradient(120% 65% at 50% -5%, #232A4C, #12162A 50%, #080A14 100%); box-shadow:0 30px 70px -30px rgba(0,0,0,.9)')}>
              <div style={sx('position:absolute; inset:0; opacity:.5; background-image:radial-gradient(#C9C7E0 1px, transparent 1.2px); background-size:40px 46px; mask-image:linear-gradient(#000, transparent 65%); -webkit-mask-image:linear-gradient(#000, transparent 65%)')} />
              <div style={sx(`position:absolute; inset:0; background:radial-gradient(58% 34% at 50% 24%, ${vm.compatGlow}, transparent 72%)`)} />
              <div style={sx('position:relative; height:100%; box-sizing:border-box; padding:34px 30px 26px; display:flex; flex-direction:column; text-align:center; color:#E8E3D5')}>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:9px; letter-spacing:.38em; color:#B39A55')}>GODS ON THIS BOND</div>
                <div style={sx('display:flex; align-items:flex-start; justify-content:center; gap:14px; margin:28px 0 4px')}>
                  <div style={sx('width:84px')}>
                    <div style={sx('display:flex; justify-content:center')}>{vm.aIcon}</div>
                    <div style={sx('font-size:12.5px; margin-top:9px')}>{vm.aGuard}</div>
                    <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#8A90AC; margin-top:3px')}>{vm.aLabel}</div>
                  </div>
                  <div style={sx('font-family:\'Cinzel\',serif; font-size:15px; color:#B39A55; padding-top:14px')}>&times;</div>
                  <div style={sx('width:84px')}>
                    <div style={sx('display:flex; justify-content:center')}>{vm.bIcon}</div>
                    <div style={sx('font-size:12.5px; margin-top:9px')}>{vm.bGuard}</div>
                    <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:9.5px; color:#8A90AC; margin-top:3px')}>{vm.bLabel}</div>
                  </div>
                </div>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:74px; line-height:1; color:#F5F0DE; margin-top:22px')}>{vm.compatScore}</div>
                <div style={sx('font-family:\'Cinzel\',serif; font-size:9px; letter-spacing:.34em; color:#B39A55; margin-top:9px')}>OUT OF 100</div>
                <div style={sx(`font-size:23px; font-weight:600; letter-spacing:.12em; color:${vm.compatGodColor}; margin-top:18px`)}>{vm.compatBand}</div>
                <div style={sx('width:24px; height:1px; background:rgba(201,162,39,.6); margin:18px auto')} />
                <div style={sx('font-size:12.5px; line-height:1.9; font-weight:300; color:#CBCFE0; text-wrap:pretty')}>{vm.compatPull}</div>
                <div style={{ flex: 1 }} />
                <div style={sx('display:flex; justify-content:space-between; gap:4px; padding:15px 0; border-top:1px solid rgba(201,162,39,.2); border-bottom:1px solid rgba(201,162,39,.2)')}>
                  {vm.compatParts.map((c, i) => (
                    <div key={i} style={sx('flex:1; text-align:center')}>
                      <div style={sx(`font-family:'Cinzel',serif; font-size:14px; color:${c.color}`)}>{c.score}</div>
                      <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:8.5px; line-height:1.4; color:#8A90AC; margin-top:5px')}>{c.short}</div>
                    </div>
                  ))}
                </div>
                <div style={sx('display:flex; justify-content:space-between; align-items:center; margin-top:13px; font-family:\'Noto Sans KR\',sans-serif; font-size:10px; color:#7B819C')}>
                  <div>주관 · {vm.compatGod}</div>
                  <div style={sx('font-family:\'Cinzel\',serif; letter-spacing:.16em; color:#B39A55')}>ORACLE.KR</div>
                </div>
              </div>
            </div>
          )}

          {vm.isCompatInvite && (
            <div style={sx('width:400px; height:210px; position:relative; overflow:hidden; background:linear-gradient(100deg, #0D1122 0%, #171D38 60%, #10142A 100%); box-shadow:0 24px 60px -28px rgba(0,0,0,.9)')}>
              <div style={sx(`position:absolute; inset:0; background:radial-gradient(48% 92% at 20% 50%, ${vm.compatGlow}, transparent 70%)`)} />
              <div style={sx('position:absolute; inset:0; opacity:.4; background-image:radial-gradient(#C9C7E0 1px, transparent 1.1px); background-size:34px 38px')} />
              <div style={sx('position:relative; height:100%; box-sizing:border-box; padding:24px 26px; display:flex; align-items:center; gap:22px')}>
                <div style={sx('flex:none; text-align:center; width:96px')}>
                  <div style={sx('font-family:\'Cinzel\',serif; font-size:44px; line-height:1; color:#F5F0DE')}>{vm.compatScore}</div>
                  <div style={sx('font-family:\'Cinzel\',serif; font-size:8px; letter-spacing:.24em; color:#B39A55; margin-top:7px')}>OUT OF 100</div>
                  <div style={sx(`font-size:13px; font-weight:600; letter-spacing:.06em; color:${vm.compatGodColor}; margin-top:10px`)}>{vm.compatBand}</div>
                </div>
                <div style={sx('flex:1; min-width:0; border-left:1px solid rgba(201,162,39,.22); padding-left:22px')}>
                  <div style={sx('font-family:\'Cinzel\',serif; font-size:8.5px; letter-spacing:.3em; color:#B39A55')}>YOU ARE INVITED</div>
                  <div style={sx('font-size:16px; font-weight:600; letter-spacing:.03em; color:#F5F0DE; margin-top:10px; line-height:1.5')}>{vm.inviteLine}</div>
                  <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; line-height:1.6; color:#9BA0BA; margin-top:8px')}>{vm.aGuard} × {vm.bGuard} · 주관 {vm.compatGod}</div>
                  <div style={sx('margin-top:14px; display:inline-block; padding:7px 13px; border:1px solid rgba(201,162,39,.45); font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#DCBB4A')}>내 사주 넣어 확인하기</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={sx('flex:none; padding:0 22px 22px')}>
        <div style={sx('display:flex; align-items:center; gap:10px; padding:11px 13px; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.02); margin-bottom:12px')}>
          <div style={sx('flex:1; min-width:0; font-family:\'Cinzel\',serif; font-size:11.5px; letter-spacing:.04em; color:#9BA0BA; overflow:hidden; text-overflow:ellipsis; white-space:nowrap')}>{vm.shareLinkText}</div>
          <Hoverable as="button" onClick={vm.copyLink}
            style={sx('flex:none; min-height:36px; padding:0 13px; background:none; border:1px solid rgba(201,162,39,.4); border-radius:2px; color:#DCBB4A; font-family:\'Noto Sans KR\',sans-serif; font-size:11px; cursor:pointer; transition:all .18s')}
            hoverStyle={{ background: 'rgba(201,162,39,.12)' }}>{vm.linkLabel}</Hoverable>
        </div>
        <Hoverable as="button" onClick={vm.openInstagram}
          style={sx('width:100%; min-height:52px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:14.5px; font-weight:600; letter-spacing:.1em; cursor:pointer')}
          hoverStyle={{ filter: 'brightness(1.08)' }}>{vm.igLabel}</Hoverable>
        <button onClick={vm.closeShare} style={sx('width:100%; min-height:46px; margin-top:8px; background:none; border:none; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>닫기</button>
      </div>

      {vm.igSaving && (
        <div style={sx('position:fixed; inset:0; z-index:50; display:flex; align-items:center; justify-content:center; background:rgba(8,10,20,.86); animation:fadeIn .2s ease both')}>
          <div style={sx('text-align:center')}>
            <div style={sx('display:flex; justify-content:center; animation:glowPulse 1.4s ease-in-out infinite')}>{vm.flameArt}</div>
            <div style={sx('font-size:14px; color:#C4C8DA; font-weight:300; margin-top:20px')}>카드를 사진첩에 새기는 중</div>
          </div>
        </div>
      )}

      {vm.igReady && (
        <div style={sx('position:fixed; inset:0; z-index:50; display:flex; align-items:flex-end; background:rgba(8,10,20,.72); animation:fadeIn .2s ease both')}>
          <div style={sx('width:100%; box-sizing:border-box; padding:26px 22px 22px; background:#0E1224; border-top:1px solid rgba(201,162,39,.3); animation:riseIn .32s ease both')}>
            <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.3em; color:#B39A55')}>SAVED TO PHOTOS</div>
            <div style={sx('font-size:17px; font-weight:600; letter-spacing:.03em; color:#F2ECD9; margin-top:11px')}>사진첩에 저장했습니다</div>
            <p style={sx('margin:10px 0 0; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; line-height:1.85; color:#8A90AC; font-weight:300; text-wrap:pretty')}>인스타그램은 외부 앱이 스토리에 이미지를 직접 넣을 수 없습니다. 스토리를 열고 방금 저장한 카드를 고르면 됩니다. {vm.igLinkNote}</p>

            {vm.igNeedsLink && (
              <div style={sx('display:flex; align-items:center; gap:10px; margin-top:14px; padding:11px 13px; border:1px solid rgba(201,162,39,.28); background:rgba(255,255,255,.02)')}>
                <div style={sx('flex:1; min-width:0; font-family:\'Cinzel\',serif; font-size:11.5px; letter-spacing:.04em; color:#9BA0BA; overflow:hidden; text-overflow:ellipsis; white-space:nowrap')}>{vm.shareLinkText}</div>
                <Hoverable as="button" onClick={vm.copyLink}
                  style={sx('flex:none; min-height:36px; padding:0 13px; background:none; border:1px solid rgba(201,162,39,.4); border-radius:2px; color:#DCBB4A; font-family:\'Noto Sans KR\',sans-serif; font-size:11px; cursor:pointer; transition:all .18s')}
                  hoverStyle={{ background: 'rgba(201,162,39,.12)' }}>{vm.linkLabel}</Hoverable>
              </div>
            )}
            <Hoverable as="button" onClick={vm.launchInstagram}
              style={sx('width:100%; min-height:52px; margin-top:20px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:14.5px; font-weight:600; letter-spacing:.1em; cursor:pointer')}
              hoverStyle={{ filter: 'brightness(1.08)' }}>인스타그램 열기</Hoverable>
            <button onClick={vm.closeIg} style={sx('width:100%; min-height:44px; margin-top:6px; background:none; border:none; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>나중에</button>
          </div>
        </div>
      )}
    </div>
  );
}
