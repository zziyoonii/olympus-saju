import { sx } from '../utils/sx.js';
import Hoverable from './Hoverable.jsx';
import LifeTab from './LifeTab.jsx';
import YearTab from './YearTab.jsx';
import { ShareGlyph } from './icons.jsx';

export default function ResultScreen({ vm }) {
  return (
    <div style={sx(`padding-top:${vm.topPad}; padding-bottom:70px`)}>
      <div style={sx('display:flex; justify-content:space-between; align-items:center; margin-bottom:22px')}>
        <button onClick={vm.goInput} style={sx('background:none; border:none; padding:0; margin-left:-2px; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12px; cursor:pointer')}>← 다시 묻기</button>
        <div style={sx('font-family:\'Cinzel\',serif; font-size:9.5px; letter-spacing:.3em; color:#B39A55')}>{vm.birthStamp}</div>
      </div>

      {/* 스크롤 위치와 상관없이 항상 손닿는 곳에 두는 공유 버튼 —
          기존 공유 버튼은 신탁 전체를 다 내려야 나온다는 피드백 반영 */}
      <Hoverable as="button" onClick={vm.openShare}
        style={sx('position:fixed; left:50%; transform:translateX(-50%); bottom:calc(18px + env(safe-area-inset-bottom)); z-index:25; display:flex; align-items:center; gap:8px; padding:0 22px; min-height:48px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:999px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:13.5px; font-weight:600; letter-spacing:.08em; cursor:pointer; box-shadow:0 12px 28px -8px rgba(0,0,0,.6), 0 0 0 1px rgba(201,162,39,.5); animation:riseIn .4s ease .3s both')}
        hoverStyle={{ filter: 'brightness(1.08)' }}>
        <ShareGlyph /> 공유하기
      </Hoverable>

      <div style={sx('display:grid; grid-template-columns:1fr 1fr; margin-bottom:22px; border:1px solid rgba(201,162,39,.22)')}>
        {vm.resultTabs.map((t) => (
          <button key={t.label} onClick={t.on} style={sx(`min-height:54px; padding:0 6px; background:${t.bg}; border:none; color:${t.fg}; font-family:'Noto Serif KR',serif; font-size:13.5px; letter-spacing:.06em; cursor:pointer; transition:all .18s`)}>
            <div>{t.label}</div>
            <div style={sx(`font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:.18em; color:${t.subColor}; margin-top:4px`)}>{t.sub}</div>
          </button>
        ))}
      </div>

      {vm.isLifeTab && <LifeTab vm={vm} />}
      {vm.isYearTab && <YearTab vm={vm} />}

      <div style={sx('display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:26px')}>
        <Hoverable as="button" onClick={vm.openShare}
          style={sx('min-height:52px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:14px; font-weight:600; letter-spacing:.1em; cursor:pointer')}
          hoverStyle={{ filter: 'brightness(1.08)' }}>공유용 카드</Hoverable>
        <Hoverable as="button" onClick={vm.copyText}
          style={sx('min-height:52px; background:none; border:1px solid rgba(201,162,39,.4); border-radius:2px; color:#DCBB4A; font-family:\'Noto Serif KR\',serif; font-size:14px; letter-spacing:.1em; cursor:pointer')}
          hoverStyle={{ background: 'rgba(201,162,39,.1)' }}>{vm.copyLabel}</Hoverable>
      </div>
      <div style={sx('margin-top:10px')}>
        <Hoverable as="button" onClick={vm.goCompare}
          style={sx('width:100%; min-height:48px; background:none; border:1px solid #232945; border-radius:2px; color:#9BA0BA; font-family:\'Noto Serif KR\',serif; font-size:13px; cursor:pointer; transition:all .18s')}
          hoverStyle={{ borderColor: 'rgba(201,162,39,.45)', color: '#DCBB4A' }}>이 사주로 궁합 보기</Hoverable>
      </div>
      <button onClick={vm.goInput} style={sx('width:100%; min-height:48px; margin-top:10px; background:none; border:none; color:#8A90AC; font-family:\'Noto Sans KR\',sans-serif; font-size:12.5px; cursor:pointer')}>다른 사주 다시 묻기</button>
    </div>
  );
}
