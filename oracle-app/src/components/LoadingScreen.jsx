import { sx } from '../utils/sx.js';

export default function LoadingScreen({ vm }) {
  return (
    <div style={sx('min-height:520px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:80px 0; animation:fadeIn .4s ease both')}>
      <div style={sx('position:relative; width:96px; height:120px; display:flex; align-items:flex-end; justify-content:center')}>
        <div style={sx('position:absolute; bottom:26px; width:78px; height:78px; border-radius:50%; background:radial-gradient(circle, rgba(201,162,39,.42), transparent 70%); animation:glowPulse 2.1s ease-in-out infinite')} />
        <div style={sx('position:relative; margin-bottom:20px; transform-origin:50% 100%; animation:flame 1.15s ease-in-out infinite')}>{vm.flameArt}</div>
        <div style={sx('position:absolute; bottom:0; width:66px; height:12px; border-top:1px solid rgba(201,162,39,.5); border-left:1px solid rgba(201,162,39,.25); border-right:1px solid rgba(201,162,39,.25)')} />
      </div>
      <div style={sx('font-family:\'Cinzel\',serif; font-size:10px; letter-spacing:.4em; color:#B39A55; margin:34px 0 16px')}>CONSULTING</div>
      <div style={sx('font-size:16.5px; line-height:1.8; color:#E8E3D5; min-height:60px; max-width:270px; font-weight:400')}>{vm.loadingPhrase}</div>
      <div style={sx('width:180px; height:1px; background:rgba(201,162,39,.18); margin-top:20px; overflow:hidden; position:relative')}>
        <div style={sx('position:absolute; inset:0; width:45%; background:linear-gradient(90deg,transparent,#C9A227,transparent); animation:sweep 1.5s linear infinite')} />
      </div>
      <div style={sx('font-family:\'Noto Sans KR\',sans-serif; font-size:10.5px; color:#7B819C; margin-top:18px')}>{vm.loadingStep}</div>
    </div>
  );
}
