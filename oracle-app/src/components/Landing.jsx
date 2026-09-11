import { sx } from '../utils/sx.js';
import Hoverable from './Hoverable.jsx';

export default function Landing({ vm }) {
  return (
    <div style={sx(`padding-top:${vm.topPadLanding}; text-align:center; animation:fadeIn .6s ease both`)}>
      <div style={sx('display:flex; justify-content:center; margin-bottom:26px')}>{vm.templeArt}</div>
      <div style={sx('font-family:\'Cinzel\',serif; font-size:11px; letter-spacing:.42em; color:#B39A55; margin-bottom:14px')}>ORACLE OF THE GODS</div>
      <h1 style={sx('margin:0; font-size:38px; line-height:1.24; font-weight:600; letter-spacing:.06em; color:#F2ECD9')}>신들의<br />신탁</h1>
      <div style={sx('width:34px; height:1px; background:#C9A227; margin:22px auto')} />
      <p style={sx('margin:0 auto; max-width:300px; font-size:14.5px; line-height:1.95; color:#9BA0BA; font-weight:300; text-wrap:pretty')}>
        네가 태어난 순간의 여덟 글자와 일곱 별의 자리를 계산하여, 올림포스의 신들이 각자의 영역에서 직접 신탁을 내린다.
      </p>

      <div style={sx('display:flex; flex-direction:column; gap:2px; margin:34px 0 0; text-align:left')}>
        {vm.steps.map((s) => (
          <div key={s.n} style={sx('display:flex; gap:16px; align-items:flex-start; padding:16px 4px; border-top:1px solid rgba(201,162,39,.16)')}>
            <div style={sx('flex:none; width:22px; font-family:\'Cinzel\',serif; font-size:12px; color:#C9A227; padding-top:2px')}>{s.n}</div>
            <div>
              <div style={sx('font-size:14px; font-weight:500; color:#E8E3D5; margin-bottom:5px')}>{s.title}</div>
              <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:12px; line-height:1.7; color:#7B819C; font-weight:300')}>{s.body}</div>
            </div>
          </div>
        ))}
        <div style={sx('border-top:1px solid rgba(201,162,39,.16)')} />
      </div>

      <Hoverable
        as="button"
        onClick={vm.goInput}
        style={sx('margin-top:30px; width:100%; min-height:56px; background:linear-gradient(#C9A227,#A6821A); border:none; border-radius:2px; color:#14100A; font-family:\'Noto Serif KR\',serif; font-size:16px; font-weight:600; letter-spacing:.14em; cursor:pointer; box-shadow:0 0 0 1px rgba(201,162,39,.5), 0 10px 30px -12px rgba(201,162,39,.6)')}
        hoverStyle={{ filter: 'brightness(1.08)' }}
      >
        신탁을 청하다
      </Hoverable>
      <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#8A90AC; margin-top:14px; letter-spacing:.02em')}>실제 명리학·천체 계산 엔진 기반 · 전부 무료</div>

      <div style={sx('display:flex; gap:10px; margin-top:26px; padding-top:20px; border-top:1px solid rgba(201,162,39,.16)')}>
        <Hoverable
          as="button"
          onClick={vm.goCompare}
          style={sx('flex:1; min-height:48px; background:none; border:1px solid #232945; border-radius:2px; color:#9BA0BA; font-family:\'Noto Serif KR\',serif; font-size:13px; cursor:pointer; transition:all .18s')}
          hoverStyle={{ borderColor: 'rgba(201,162,39,.45)', color: '#DCBB4A' }}
        >
          두 사람 궁합 비교
        </Hoverable>
      </div>
    </div>
  );
}
