import { useEffect, useRef, useState } from 'react';
import { sx } from '../utils/sx.js';
import Hoverable from './Hoverable.jsx';
import { nodeToImageFile, shareFile, downloadFile, canShareImages, prewarmFontEmbed, resetFontEmbedPrewarm } from '../utils/shareImage.js';

export default function ShareOverlay({ vm }) {
  const cardRef = useRef(null);
  const [shareState, setShareState] = useState('idle'); // idle | working | shared | saved | failed
  // When the OS share sheet isn't available (mostly desktop, some in-app
  // browsers), we render the finished PNG right here so the user can save it
  // by long-press / right-click — this is the path that reliably works on
  // iOS Safari, where a script-triggered download is silently ignored.
  const [previewUrl, setPreviewUrl] = useState(null);

  const canShare = canShareImages();

  // Start fetching the card's web fonts as soon as it's on screen, well
  // before the user taps the share button — see shareImage.js for why. Also
  // drop any previous inline preview when the selected card changes.
  useEffect(() => {
    resetFontEmbedPrewarm();
    prewarmFontEmbed(cardRef.current);
    setShareState('idle');
    setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return null; });
  }, [vm.isStory, vm.isCompatStory, vm.isCompatInvite]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleShare = async () => {
    setShareState('working');
    try {
      // Export the story cards at 3× (1080×1920) so they stay crisp as a
      // full-screen Instagram Story; the small invite card only needs 2×.
      const pixelRatio = vm.isCompatInvite ? 2 : 3;
      const file = await nodeToImageFile(cardRef.current, 'sintak-oracle.png', pixelRatio);
      if (!file) { setShareState('failed'); setTimeout(() => setShareState('idle'), 2600); return; }

      // Mobile: hand the PNG to the OS share sheet, where "Instagram → 스토리"
      // is one of the targets. (A web app cannot post to a Story directly —
      // Instagram exposes no web API for it — so the share sheet is the real,
      // supported one-tap path.)
      const result = await shareFile(file, { title: '신들의 신탁', text: vm.shareText });
      if (result === 'shared') { vm.copyLink(); setShareState('shared'); setTimeout(() => setShareState('idle'), 2600); return; }
      if (result === 'cancelled') { setShareState('idle'); return; }

      // No share sheet (mostly desktop): show the image inline so it can be
      // saved manually, trigger a direct download too, and copy the caption.
      const url = URL.createObjectURL(file);
      setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return url; });
      downloadFile(file);
      vm.copyLink();
      setShareState('saved');
    } catch (e) {
      setShareState('failed');
      setTimeout(() => setShareState('idle'), 2600);
    }
  };

  const shareLabel = {
    idle: canShare ? '인스타그램 스토리로 공유' : '스토리 이미지 저장',
    working: '카드를 만드는 중…',
    shared: '공유창을 열었다 · 초대글도 복사됨',
    saved: '이미지 저장됨 · 초대글도 복사됨',
    failed: '실패했다 · 다시 시도'
  }[shareState];

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
            <div ref={cardRef} style={sx('width:360px; height:640px; position:relative; overflow:hidden; background:radial-gradient(120% 65% at 50% -5%, #232A4C, #12162A 50%, #080A14 100%); box-shadow:0 30px 70px -30px rgba(0,0,0,.9)')}>
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
                  <div style={sx('font-family:\'Cinzel\',serif; letter-spacing:.16em; color:#B39A55')}>{vm.shareBrand}</div>
                </div>
              </div>
            </div>
          )}

          {vm.isCompatStory && (
            <div ref={cardRef} style={sx('width:360px; height:640px; position:relative; overflow:hidden; background:radial-gradient(120% 65% at 50% -5%, #232A4C, #12162A 50%, #080A14 100%); box-shadow:0 30px 70px -30px rgba(0,0,0,.9)')}>
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
                  <div style={sx('font-family:\'Cinzel\',serif; letter-spacing:.16em; color:#B39A55')}>{vm.shareBrand}</div>
                </div>
              </div>
            </div>
          )}

          {vm.isCompatInvite && (
            <div ref={cardRef} style={sx('width:400px; height:210px; position:relative; overflow:hidden; background:linear-gradient(100deg, #0D1122 0%, #171D38 60%, #10142A 100%); box-shadow:0 24px 60px -28px rgba(0,0,0,.9)')}>
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
        {previewUrl && (
          <div style={sx('margin-bottom:12px; padding:12px; border:1px solid rgba(201,162,39,.35); background:rgba(201,162,39,.06); display:flex; gap:12px; align-items:center')}>
            <img src={previewUrl} alt="공유 카드" style={{ flex: 'none', width: '68px', height: 'auto', borderRadius: '2px', boxShadow: '0 6px 18px -8px rgba(0,0,0,.8)' }} />
            <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:11px; line-height:1.7; color:#DCBB4A')}>이미지가 저장됐다. 저장이 안 되면 위 카드를 <b>길게 눌러</b>(데스크톱은 우클릭) 저장한 뒤, 인스타그램 스토리에 올리면 된다.</div>
          </div>
        )}
        <div style={sx('display:flex; align-items:center; gap:10px; padding:11px 13px; border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.02); margin-bottom:12px')}>
          <div style={sx('flex:1; min-width:0; font-family:\'Cinzel\',serif; font-size:11.5px; letter-spacing:.04em; color:#9BA0BA; overflow:hidden; text-overflow:ellipsis; white-space:nowrap')}>{vm.shareLinkText}</div>
          <Hoverable as="button" onClick={vm.copyLink}
            style={sx('flex:none; min-height:36px; padding:0 13px; background:none; border:1px solid rgba(201,162,39,.4); border-radius:2px; color:#DCBB4A; font-family:\'Noto Sans KR\',sans-serif; font-size:11px; cursor:pointer; transition:all .18s')}
            hoverStyle={{ background: 'rgba(201,162,39,.12)' }}>{vm.linkLabel}</Hoverable>
        </div>
        <Hoverable as="button" onClick={handleShare} disabled={shareState === 'working'}
          style={sx(`width:100%; min-height:52px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:'Noto Serif KR',serif; font-size:14.5px; font-weight:600; letter-spacing:.1em; cursor:${shareState === 'working' ? 'default' : 'pointer'}; opacity:${shareState === 'working' ? 0.75 : 1}`)}
          hoverStyle={shareState === 'working' ? {} : { filter: 'brightness(1.08)' }}>{shareLabel}</Hoverable>
        <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10px; line-height:1.6; color:#7B819C; text-align:center; margin-top:10px')}>
          휴대폰에서는 공유창의 <b>인스타그램 → 스토리</b>를 고르면 이 카드가 그대로 올라간다(카카오톡·사진 앱도 같은 창에서 고를 수 있다). 공유창이 없는 기기에서는 이미지가 저장되고 초대글이 복사된다.
        </div>
        <button onClick={vm.closeShare} style={sx('width:100%; min-height:46px; margin-top:8px; background:none; border:none; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>닫기</button>
      </div>
    </div>
  );
}
