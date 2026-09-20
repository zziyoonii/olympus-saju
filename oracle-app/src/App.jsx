import { useEffect, useRef, useState } from 'react';
import * as OracleEngine from './engine/oracleEngine.js';
import * as OracleCopy from './engine/oracleCopy.js';
import * as OracleCompat from './engine/oracleCompat.js';
import * as OracleYear from './engine/oracleYear.js';
import * as OraclePersona from './engine/oraclePersona.js';
import { Icon, TempleArt, FlameArt } from './components/icons.jsx';
import { useIsDesktop } from './hooks/useIsDesktop.js';
import Landing from './components/Landing.jsx';
import InputScreen from './components/InputScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import CompareScreen from './components/CompareScreen.jsx';
import ShareOverlay from './components/ShareOverlay.jsx';
import { sx } from './utils/sx.js';

const EL_COLOR = { '목': '#6FA37A', '화': '#C2554A', '토': '#B39158', '금': '#B8BFC6', '수': '#5A7FB8' };
const EL_HANJA = { '목': '木', '화': '火', '토': '土', '금': '金', '수': '水' };
const ELS = ['목', '화', '토', '금', '수'];

// Small wordmark printed on the share cards. Defaults to the live domain so
// anyone who sees a shared Story can find the site; replace with your own
// brand string (e.g. 'SINTAK.KR') once you have a custom domain.
const SHARE_BRAND = (typeof window !== 'undefined' && window.location.hostname)
  ? window.location.hostname.replace(/^www\./, '').toUpperCase()
  : 'ORACLE';

const PHRASES = [
  ['올림포스에 전갈이 도착했습니다…', '여덟 글자를 세우는 중'],
  ['제우스가 번개를 내려놓고 자리에 앉았습니다.', '절기와 간지를 판정하는 중'],
  ['모이라이가 네 실의 길이를 재고 있습니다…', '오행과 십신을 집계하는 중'],
  ['일곱 별이 태어난 밤의 자리로 돌아갑니다.', '황경을 계산하는 중'],
  ['신들이 신탁을 봉인하고 있습니다…', '문장을 새기는 중']
];

const pad2 = (n) => String(n).padStart(2, '0');
const blankPerson = () => ({ name: '', y: '', m: '', d: '', h: '', min: '' });

// Inverse of the "YYYYMMDD" / "YYYYMMDDHHmm" encoding used in share links.
function decodeBirth(str) {
  if (!/^\d{8}$/.test(str) && !/^\d{12}$/.test(str)) return null;
  const y = parseInt(str.slice(0, 4), 10), m = parseInt(str.slice(4, 6), 10), d = parseInt(str.slice(6, 8), 10);
  if (str.length === 12) {
    return { y, m, d, h: parseInt(str.slice(8, 10), 10), mi: parseInt(str.slice(10, 12), 10), unk: false };
  }
  return { y, m, d, h: 12, mi: 0, unk: true };
}
const TONE = 'grave'; // 신탁체 톤 — 근엄체를 기본 목소리로 고정한다

export default function App() {
  const isDesktop = useIsDesktop();

  const [screen, setScreen] = useState('landing');
  const [name, setNameState] = useState('');
  const [y, setYState] = useState('');
  const [m, setMState] = useState('');
  const [d, setDState] = useState('');
  const [h, setHState] = useState('');
  const [min, setMinState] = useState('');
  const [gender, setGender] = useState(null);
  const [precise, setPrecise] = useState(true);
  const [unknownTime, setUnknownTime] = useState(false);
  const [error, setError] = useState('');
  const [phrase, setPhrase] = useState(0);
  const [result, setResult] = useState(null);

  const [share, setShare] = useState(false);
  const [shareTab, setShareTab] = useState('story');
  const [shareMode, setShareMode] = useState('reading');
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkFailed, setLinkFailed] = useState(false);

  const [resultTab, setResultTab] = useState('life');
  const [pillarsOpen, setPillarsOpen] = useState(false);
  const [natalOpen, setNatalOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [openOracle, setOpenOracle] = useState(0);

  const [cp, setCpState] = useState([blankPerson(), blankPerson()]);
  const [cpError, setCpError] = useState('');
  const [compat, setCompat] = useState(null);
  const [cpA, setCpA] = useState(null);
  const [cpB, setCpB] = useState(null);

  const phraseTimer = useRef(null);
  const doneTimer = useRef(null);
  useEffect(() => () => { clearInterval(phraseTimer.current); clearTimeout(doneTimer.current); }, []);

  const tone = () => TONE;

  const set = (setter) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setter(v);
    setError('');
  };

  const setCp = (i, k) => (e) => {
    const v = e && e.target ? e.target.value : e;
    setCpState((prev) => prev.map((p, ix) => (ix === i ? { ...p, [k]: v } : p)));
    setCpError('');
  };

  const personData = (p) => {
    const py = parseInt(p.y, 10), pm = parseInt(p.m, 10), pd = parseInt(p.d, 10);
    if (!(py >= 1900 && py <= 2026) || !(pm >= 1 && pm <= 12)) return null;
    const dim = new Date(py, pm, 0).getDate();
    if (!(pd >= 1 && pd <= dim)) return null;
    const unk = p.h === '';
    const ph = unk ? 12 : (parseInt(p.h, 10) || 0);
    const pmi = unk ? 0 : (parseInt(p.min, 10) || 0);
    if (ph < 0 || ph > 23 || pmi < 0 || pmi > 59) return null;
    return {
      saju: OracleEngine.saju(py, pm, pd, ph, pmi, { trueSolar: true, lon: 126.978 }),
      natal: OracleEngine.natal(py, pm, pd, ph, pmi),
      guardian: OracleEngine.guardian(pm, pd),
      y: py, m: pm, d: pd, h: ph, mi: pmi, unk, name: (p.name || '').trim()
    };
  };

  const runCompare = () => {
    const A = personData(cp[0]);
    const B = personData(cp[1]);
    if (!A || !B) { setCpError('두 사람의 생년월일을 바르게 적어야 판정하리라. 시각은 비울 수 있다.'); return; }
    setCpA(A); setCpB(B);
    setCompat(OracleCompat.compare(A, B, tone()));
    setCpError('');
  };

  const compute = (fields) => {
    const f = fields || { y, m, d, h, min, unknownTime, precise };
    const cy = parseInt(f.y, 10), cm = parseInt(f.m, 10), cd = parseInt(f.d, 10);
    const unk = f.unknownTime;
    const ch = unk ? 12 : (parseInt(f.h, 10) || 0);
    const cmi = unk ? 0 : (parseInt(f.min, 10) || 0);
    const s = OracleEngine.saju(cy, cm, cd, ch, cmi, { trueSolar: f.precise, lon: 126.978 });
    const n = OracleEngine.natal(cy, cm, cd, ch, cmi);
    const g = OracleEngine.guardian(cm, cd);
    return { saju: s, natal: n, guardian: g, y: cy, m: cm, d: cd, h: ch, mi: cmi, unk };
  };

  // Opening a shared link (?r=YYYYMMDD[HHmm] or ?pair=A-B) jumps straight to
  // the same reading/compat result the sharer saw, rather than dumping the
  // recipient on a blank form — that's the whole point of sharing it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rParam = params.get('r');
    const pairParam = params.get('pair');
    if (!rParam && !pairParam) return;

    if (rParam) {
      const dec = decodeBirth(rParam);
      if (dec) {
        setYState(String(dec.y)); setMState(pad2(dec.m)); setDState(pad2(dec.d));
        setHState(dec.unk ? '' : pad2(dec.h)); setMinState(dec.unk ? '' : pad2(dec.mi));
        setUnknownTime(dec.unk);
        const r = compute({
          y: String(dec.y), m: pad2(dec.m), d: pad2(dec.d),
          h: dec.unk ? '' : pad2(dec.h), min: dec.unk ? '' : pad2(dec.mi),
          unknownTime: dec.unk, precise: true
        });
        setResult(r);
        setScreen('result');
      }
    } else if (pairParam) {
      const [aStr, bStr] = pairParam.split('-');
      const aDec = aStr && decodeBirth(aStr);
      const bDec = bStr && decodeBirth(bStr);
      if (aDec && bDec) {
        const toPerson = (dec) => ({
          name: '', y: String(dec.y), m: pad2(dec.m), d: pad2(dec.d),
          h: dec.unk ? '' : pad2(dec.h), min: dec.unk ? '' : pad2(dec.mi)
        });
        const cpNew = [toPerson(aDec), toPerson(bDec)];
        setCpState(cpNew);
        setScreen('compare');
        const A = personData(cpNew[0]), B = personData(cpNew[1]);
        if (A && B) { setCpA(A); setCpB(B); setCompat(OracleCompat.compare(A, B, tone())); }
      }
    }
    // Drop the query string once consumed so it doesn't linger in the address
    // bar or get re-parsed after the user navigates elsewhere in the app.
    window.history.replaceState(null, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyOf = (r) => {
    if (!r) return null;
    return OracleCopy.build({ saju: r.saju, natal: r.natal, guardian: r.guardian, name: name.trim() }, tone());
  };

  const personaOf = (r) => {
    if (!r) return null;
    try {
      const du = OracleYear.daeun({ y: r.y, m: r.m, d: r.d }, r.saju, gender);
      return OraclePersona.read(r.saju, r.natal, du, r.y, tone());
    } catch (e) { return null; }
  };

  const yearOf = (r) => {
    if (!r) return null;
    try {
      return OracleYear.reading(r.saju, r.natal, gender, { y: r.y, m: r.m, d: r.d }, tone());
    } catch (e) { return null; }
  };

  const submit = () => {
    const cy = parseInt(y, 10), cm = parseInt(m, 10), cd = parseInt(d, 10);
    if (!gender) return setError('대운은 년간 음양과 성별로 순행·역행이 갈리니, 성별을 밝혀야 하리라.');
    if (!(cy >= 1900 && cy <= 2026)) return setError('1900년부터 2026년 사이의 해를 적으라.');
    if (!(cm >= 1 && cm <= 12)) return setError('월은 1에서 12 사이여야 하니라.');
    const dim = new Date(cy, cm, 0).getDate();
    if (!(cd >= 1 && cd <= dim)) return setError(cy + '년 ' + cm + '월은 ' + dim + '일까지 있느니라.');
    if (!unknownTime) {
      const hh = parseInt(h, 10), mm = parseInt(min, 10);
      if (h !== '' && !(hh >= 0 && hh <= 23)) return setError('시는 0에서 23 사이여야 하니라.');
      if (min !== '' && !(mm >= 0 && mm <= 59)) return setError('분은 0에서 59 사이여야 하니라.');
    }
    const r = compute();
    if (!r) return setError('신탁 엔진을 불러오는 중이다. 잠시 후 다시 청하라.');
    setResult(r);
    setScreen('loading');
    setPhrase(0);
    setError('');
    clearInterval(phraseTimer.current); clearTimeout(doneTimer.current);
    phraseTimer.current = setInterval(() => setPhrase((p) => (p + 1) % PHRASES.length), 780);
    doneTimer.current = setTimeout(() => { clearInterval(phraseTimer.current); setScreen('result'); }, 3400);
  };

  const copyToClipboard = (txt) => {
    try {
      const p = navigator.clipboard && navigator.clipboard.writeText(txt);
      return p && p.then ? p.then(() => true, () => false) : Promise.resolve(false);
    } catch (e) { return Promise.resolve(false); }
  };

  const copyText = () => {
    const cc = copyOf(result);
    if (!cc) return;
    const txt = [cc.greeting].concat(cc.sections.map((s) => '[' + s.label + ' — ' + s.god + ']\n' + s.paragraphs.join('\n'))).join('\n\n');
    copyToClipboard(txt).then((ok) => {
      if (!ok) { setCopyFailed(true); setTimeout(() => setCopyFailed(false), 2400); return; }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // The deployed origin + Vite's configured base path, so the link is real
  // and clickable on whichever host this build is running on (Vercel root
  // domain, or the GitHub Pages /olympus-saju/ subpath) rather than the
  // placeholder oracle.kr domain from the design prototype.
  const shareLink = () => {
    const base = window.location.origin + import.meta.env.BASE_URL;
    if (shareMode === 'compat' && cpA && cpB) {
      const enc = (p) => p.y + '' + pad2(p.m) + pad2(p.d) + (p.unk ? '' : pad2(p.h) + pad2(p.mi));
      return base + '?pair=' + enc(cpA) + '-' + enc(cpB);
    }
    if (!result) return base;
    return base + '?r=' + result.y + pad2(result.m) + pad2(result.d) + (result.unk ? '' : pad2(result.h) + pad2(result.mi));
  };

  const inviteMessage = () => {
    const link = shareLink();
    if (shareMode === 'compat' && cpA && cpB) {
      const me = (cpA.name || '내').trim();
      const k = compat;
      return [
        me + '와 그대의 연을 신들에게 물었습니다.',
        k ? '판정 — ' + k.bandTitle + ' ' + k.score + '/100 · 주관 ' + k.god : '',
        '그대의 사주를 넣으면 무엇이 어긋났는지 나옵니다.',
        link
      ].filter(Boolean).join('\n');
    }
    const r = result;
    const pe = r ? personaOf(r) : null;
    return [
      '신들이 나를 이렇게 보았습니다.',
      pe ? '"' + pe.headline + '"' : '',
      '수호신 ' + (r ? r.guardian.god : '') + ' · 생년월일시로 계산합니다.',
      link
    ].filter(Boolean).join('\n');
  };

  const copyLink = () => {
    copyToClipboard(inviteMessage()).then((ok) => {
      if (!ok) { setLinkFailed(true); setTimeout(() => setLinkFailed(false), 2400); return; }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    });
  };

  const goInput = () => { setScreen('input'); setShare(false); };
  const goLanding = () => setScreen('landing');
  const goCompare = () => {
    setCpState((prev) => {
      if (y && !prev[0].y) {
        return [{ name, y, m, d, h, min }, prev[1]];
      }
      return prev;
    });
    setScreen('compare'); setShare(false);
  };

  const r = result;
  const cpy = copyOf(r);
  const g = r ? r.guardian : { god: '제우스', color: '#C9A227', sign: '사수자리', symbol: '번개' };

  const elements = r ? ELS.map((elName, i) => ({
    name: elName, hanja: EL_HANJA[elName], count: r.saju.elements[i],
    color: EL_COLOR[elName], labelColor: r.saju.elements[i] === 0 ? '#7B819C' : '#C4C8DA',
    width: Math.round((r.saju.elements[i] / 8) * 100) + '%'
  })) : [];

  const pillars = r ? r.saju.pillars.slice().reverse().map((p) => ({
    key: p.key, kr: p.kr, stemHanja: p.stemHanja, branchHanja: p.branchHanja,
    stemTen: p.stemTen, branchTen: p.branchTen,
    stemColor: EL_COLOR[ELS[p.stemEl]], branchColor: EL_COLOR[ELS[p.branchEl]]
  })) : [];

  const oracles = cpy ? cpy.sections.map((s, i) => {
    const ev = i === 0 ? '일간 ' + r.saju.pillars[2].kr + ' · ' + ELS[r.saju.maxEl] + ' ' + r.saju.elements[r.saju.maxEl] + '자 · 절기 ' + r.saju.termName
      : i === 1 ? '금성 ' + (r.natal[3] || {}).sign + ' · 원국 재성·식상 판정'
        : i === 2 ? '달 ' + (r.natal[1] || {}).sign + ' · 월지 ' + r.saju.pillars[1].branchKr
          : i === 3 ? '수성 ' + (r.natal[2] || {}).sign + ' · 목성 ' + (r.natal[5] || {}).sign
            : '화성 ' + (r.natal[4] || {}).sign + ' · ' + ELS[r.saju.maxEl] + ' 과다';
    return {
      label: s.label, sub: s.sub, god: s.god, color: s.color,
      icon: <Icon god={s.god} size={30} color={s.color} stroke={1.05} />,
      paragraphs: s.paragraphs, evidence: ev,
      open: openOracle === i,
      caret: openOracle === i ? '180deg' : '0deg',
      headBg: openOracle === i ? 'rgba(255,255,255,.03)' : 'transparent',
      godColor: openOracle === i ? '#F2ECD9' : '#C4C8DA',
      toggle: () => setOpenOracle(openOracle === i ? -1 : i)
    };
  }) : [];

  const pair = r ? (OracleEngine.PAIRS[g.god] || ['헤라', '부부의 연', '']) : ['헤라', '부부의 연', ''];
  const pairGod = OracleEngine.ROSTER.find((x) => x.god === pair[0]) || { color: '#9C7BC4' };

  const genders = [['여성', 'f'], ['남성', 'm']].map(([label, key]) => {
    const on = gender === key;
    return {
      label, on: () => setGender(key),
      bg: on ? 'rgba(201,162,39,.14)' : 'transparent',
      bd: on ? 'rgba(201,162,39,.55)' : '#2A3050',
      fg: on ? '#DCBB4A' : '#8A90AC'
    };
  });

  const shareTabs = (shareMode === 'compat'
    ? [['궁합 스토리 9:16', 'cstory'], ['초대 링크 카드', 'cinvite']]
    : [['스토리 9:16', 'story']]).map(([label, key]) => {
    const on = shareTab === key;
    return {
      label, on: () => setShareTab(key),
      bg: on ? 'rgba(201,162,39,.14)' : 'transparent',
      bd: on ? 'rgba(201,162,39,.5)' : '#232945',
      fg: on ? '#DCBB4A' : '#8A90AC'
    };
  });

  const valid = y.length === 4 && m !== '' && d !== '' && !!gender;
  const p = precise;
  const firstOpen = cpy ? cpy.sections[0] : null;

  // Person II gets its own example date so the two blocks never show the same
  // placeholder — with identical placeholders it read as if person II's
  // fields already had person I's data typed into them.
  const people = cp.map((pp, i) => ({
    name: pp.name, y: pp.y, m: pp.m, d: pp.d, h: pp.h, min: pp.min,
    setName: setCp(i, 'name'), setY: setCp(i, 'y'), setM: setCp(i, 'm'),
    setD: setCp(i, 'd'), setH: setCp(i, 'h'), setMin: setCp(i, 'min'),
    tag: i === 0 ? 'PERSON I' : 'PERSON II',
    hint: i === 0 ? '나' : '상대',
    placeholder: i === 0 ? '내 이름 (선택)' : '상대의 이름 (선택)',
    yPh: i === 0 ? '1996' : '1994', mPh: i === 0 ? '07' : '03', dPh: i === 0 ? '14' : '02',
    border: i === 0 ? 'rgba(201,162,39,.28)' : 'rgba(255,255,255,.09)',
    tagColor: i === 0 ? '#C9A227' : '#B39A55'
  }));

  const k = compat;
  const yr = yearOf(r);
  const pe = personaOf(r);
  const SHORT = ['일간', '일지', '오행', '수호신', '천체'];
  const resultTabs = [
    ['인생 신탁', 'life', 'LIFETIME'],
    ['연말 신탁', 'year', yr ? yr.curYear + ' → ' + yr.nextYear : 'TURN OF YEAR']
  ].map(([label, key, sub]) => {
    const on = resultTab === key;
    return {
      label, sub, on: () => setResultTab(key),
      bg: on ? 'rgba(201,162,39,.16)' : 'transparent',
      fg: on ? '#DCBB4A' : '#8A90AC',
      subColor: on ? '#B39A55' : '#8A90AC'
    };
  });

  const vm = {
    isDesktop,
    colMax: isDesktop ? '620px' : '100%',
    topPad: isDesktop ? '30px' : '62px',
    topPadLanding: isDesktop ? '54px' : '74px',

    isLanding: screen === 'landing', isInput: screen === 'input',
    isLoading: screen === 'loading', isResult: screen === 'result' && !share,
    isCompare: screen === 'compare' && !share,
    goInput, goLanding, goCompare,
    submit,
    templeArt: <TempleArt />,
    flameArt: <FlameArt />,

    steps: [
      { n: 'I', title: '태어난 순간을 적는다', body: '생년월일과 출생 시각. 진태양시 보정을 켜면 표준시와 실제 경도차까지 반영한다.' },
      { n: 'II', title: '계산이 먼저 돌아간다', body: '절기 기준 년·월주, 60갑자 일주, 오호둔·오서둔 시주, 오행과 십신, 그리고 일곱 천체의 황경.' },
      { n: 'III', title: '신들이 해석한다', body: '지어낸 운세가 아니라, 계산된 데이터를 다섯 신이 각자의 목소리로 읽어낸다.' }
    ],

    fName: name, fY: y, fM: m, fD: d, fH: h, fMin: min,
    setName: set(setNameState), setY: set(setYState), setM: set(setMState),
    setD: set(setDState), setH: set(setHState), setMin: set(setMinState),
    genders,
    toggleUnknown: () => setUnknownTime((v) => !v),
    unknownLabel: unknownTime ? '시간을 아는 경우' : '시간을 모른다',
    unknownColor: unknownTime ? '#DCBB4A' : '#8A90AC',
    timeOpacity: unknownTime ? 0.32 : 1,
    timeDisabled: unknownTime,
    togglePrecise: () => setPrecise((v) => !v),
    preciseBorder: p ? 'rgba(201,162,39,.4)' : '#20263F',
    preciseTrack: p ? 'rgba(201,162,39,.75)' : '#2A3050',
    preciseKnob: p ? '#14100A' : '#8A90AC',
    preciseKnobX: p ? '18px' : '2px',
    preciseNote: p ? '서울 기준 약 −32분.' : '지금은 표준시 그대로 판정한다.',
    submitDisabled: !valid,
    ctaBg: valid ? 'linear-gradient(#C9A227,#A6821A)' : '#181D33',
    ctaFg: valid ? '#14100A' : '#7B819C',
    ctaCursor: valid ? 'pointer' : 'not-allowed',
    ctaShadow: valid ? '0 0 0 1px rgba(201,162,39,.5), 0 10px 30px -12px rgba(201,162,39,.6)' : 'none',
    ctaLabel: unknownTime ? '시각 없이 신탁 청하기' : '신탁을 청하다',
    formError: error,

    loadingPhrase: PHRASES[phrase][0],
    loadingStep: PHRASES[phrase][1],

    birthStamp: r ? r.y + '.' + pad2(r.m) + '.' + pad2(r.d) + (r.unk ? '' : ' · ' + pad2(r.h) + ':' + pad2(r.mi)) : '',
    utStamp: r ? pad2((r.h + 24 - 9) % 24) + ':' + pad2(r.mi) : '',
    guardName: g.god, guardSign: g.sign, guardSymbol: g.symbol, guardColor: g.color,
    guardGlow: g.color + '30',
    guardIcon: <Icon god={g.god} size={54} color={g.color} stroke={1} />,
    shareIcon: <Icon god={g.god} size={62} color={g.color} stroke={1} />,
    pairIcon: <Icon god={pair[0]} size={34} color={pairGod.color} stroke={1.05} />,
    pairName: pair[0], pairRel: pair[1], pairNote: pair[2], pairColor: pairGod.color,
    greeting: cpy ? cpy.greeting : '',
    pullQuote: firstOpen ? firstOpen.paragraphs[firstOpen.paragraphs.length - 1] : '',

    pillars, elements, natal: r ? r.natal : [], oracles,
    correctionLabel: r ? (r.saju.correctionMin ? '진태양시 ' + r.saju.hourLabel + ' (' + r.saju.correctionMin + '분)' : '표준시 그대로') : '',
    dayStemLabel: r ? r.saju.dayStemKr : '',
    dayGanjiLabel: r ? r.saju.pillars[2].kr : '',
    maxElLabel: r ? ELS[r.saju.maxEl] : '',
    shareBrand: SHARE_BRAND,

    openShare: () => { setShare(true); setShareMode('reading'); setShareTab('story'); },
    closeShare: () => setShare(false),
    shareOpen: share,
    shareTabs, manyShareTabs: shareTabs.length > 1,
    shareTitle: shareMode === 'compat' ? '궁합 공유' : '스토리 공유',
    isStory: shareTab === 'story',
    shareScale: (shareTab === 'story' || shareTab === 'cstory') ? (isDesktop ? 0.86 : 0.78) : 1,
    copyText,
    copyLabel: copyFailed ? '복사하지 못했다' : copied ? '복사되었다' : '신탁 복사',
    copyLink,
    linkLabel: linkFailed ? '복사 안 됨' : linkCopied ? '초대글이 복사되었다' : '초대글 복사',
    shareLinkText: shareLink(),
    shareText: inviteMessage(),

    resultTabs, isLifeTab: resultTab === 'life', isYearTab: resultTab === 'year',

    personaHeadline: pe ? pe.headline : '',
    personaWhy: pe ? pe.headlineWhy : '',
    personaMore: pe ? pe.headlineMore : '',
    hasCollisions: !!pe,
    collisions: pe ? pe.collisions : [],
    strengthLabel: pe ? pe.strengthLabel : '',
    strengthNote: pe ? pe.strengthNote : '',
    personaGroups: pe ? pe.groups.map((gr) => ({
      name: gr.name, count: gr.count, width: gr.width,
      barH: Math.max(2, Math.round((gr.count / 4) * 46)) + 'px',
      color: gr.heavy ? '#C9A227' : gr.empty ? 'transparent' : '#5B6180',
      labelColor: gr.heavy ? '#DCBB4A' : gr.empty ? '#7B819C' : '#C4C8DA'
    })) : [],
    hasPast: !!(pe && pe.past.length),
    personaPast: pe ? pe.past : [],
    togglePillars: () => setPillarsOpen((v) => !v),
    toggleNatal: () => setNatalOpen((v) => !v),
    toggleTerms: () => setTermsOpen((v) => !v),
    pillarsOpen, natalOpen, termsOpen,
    pillarsCaret: pillarsOpen ? '180deg' : '0deg',
    natalCaret: natalOpen ? '180deg' : '0deg',
    termsCaret: termsOpen ? '180deg' : '0deg',
    pillarsBorder: pillarsOpen ? 'rgba(255,255,255,.07)' : 'transparent',
    natalBorder: natalOpen ? 'rgba(255,255,255,.07)' : 'transparent',
    termsBorder: termsOpen ? 'rgba(255,255,255,.07)' : 'transparent',
    // 흐르는 신탁 문장은 그대로 두고, 처음 보는 사주 용어만 여기서 한 번 풀어준다.
    glossary: [
      ['일간', '태어난 날을 나타내는 글자. 사주에서 ‘나’를 뜻하는 가장 중요한 글자예요.'],
      ['원국 · 팔자', '태어난 연·월·일·시로 세운 여덟 글자. 내가 타고난 밑바탕 전체를 말해요.'],
      ['오행', '나무·불·흙·쇠·물(목·화·토·금·수) 다섯 기운. 뭐가 많고 적은지가 성격을 좌우해요.'],
      ['십신', '‘나(일간)’와 나머지 글자의 관계를 나눈 것. 크게 비겁·식상·재성·관성·인성 다섯 갈래예요.'],
      ['세운', '그 해에 들어오는 기운. ‘올해 운의 분위기’라고 보면 돼요.'],
      ['신강 · 신약', '내 기운이 센 편(신강)인지 약한 편(신약)인지. 세면 혼자서도 잘 서고, 약하면 사람·환경 도움을 받는 게 유리해요.']
    ],
    pillarsSummary: r ? '절기 ' + r.saju.termName + ' · 일주 ' + r.saju.pillars[2].kr : '',
    natalSummary: r && r.natal[0] ? '태양 ' + r.natal[0].sign : '',

    closerIcon: yr ? <Icon god={yr.closer.god} size={30} color={yr.closer.color} stroke={1.05} /> : null,
    closerName: yr ? yr.closer.god : '',
    closerRole: yr ? yr.closer.role : '',
    closerTag: yr ? yr.closer.tag : '',
    openerIcon: yr ? <Icon god={yr.opener.god} size={34} color={yr.opener.color} stroke={1.05} /> : null,
    openerName: yr ? yr.opener.god : '',
    openerRole: yr ? yr.opener.role : '',
    openerTag: yr ? yr.opener.tag : '',
    openerColor: yr ? yr.opener.color : '#C9A227',
    openerBorder: yr ? yr.opener.color + '4D' : 'rgba(201,162,39,.3)',
    openerTint: yr ? yr.opener.color + '1A' : 'rgba(201,162,39,.07)',
    yearCur: yr ? yr.curYear : '', yearNext: yr ? yr.nextYear : '',
    yearCurGanji: yr ? yr.aGanji : '', yearNextGanji: yr ? yr.bGanji : '',
    yearCurKr: yr ? yr.aKr : '', yearNextKr: yr ? yr.bKr : '',
    yearCurTen: yr ? yr.aTen : '', yearNextTen: yr ? yr.bTen : '',
    yearHeadline: yr ? yr.headline : '',
    yearMonthsLeft: yr ? yr.monthsLeft : '',
    yearCurParas: yr ? yr.paragraphs.cur : [],
    yearNextParas: yr ? yr.paragraphs.next : [],
    yearRows: yr ? yr.rows : [],

    showEvidence: true,

    people, cpError, runCompare,
    compareCta: k ? '다시 판정하기' : '궁합 판정하기',
    resetCompare: () => { setCompat(null); setCpA(null); setCpB(null); setCpState([blankPerson(), blankPerson()]); },
    openCompatShare: () => { setShare(true); setShareMode('compat'); setShareTab('cstory'); },
    isCompatStory: shareTab === 'cstory', isCompatInvite: shareTab === 'cinvite',
    hasCompat: !!k,
    compatScore: k ? k.score : '',
    compatBand: k ? k.bandTitle : '',
    compatText: k ? k.bandText : '',
    compatPull: k ? k.bandText : '',
    inviteLine: cpA ? (cpA.name || '어느 필멸자') + '님이 그대와의 연을 신들에게 보였습니다' : '',
    compatParts: k ? k.parts.map((x, i) => {
      const ratio = x.score / x.max;
      return { label: x.label, note: x.note, score: x.score, max: x.max, pct: x.pct, short: SHORT[i], color: ratio >= .75 ? '#C9A227' : ratio >= .5 ? '#B39158' : '#C2554A' };
    }) : [],
    compatElements: k ? k.combined.map((e) => ({
      name: e.name, hanja: e.hanja, count: e.count, width: e.width,
      color: EL_COLOR[e.name], labelColor: e.count === 0 ? '#7B819C' : '#C4C8DA'
    })) : [],
    compatStrong: k ? k.strongestLabel : '', compatWeak: k ? k.weakestLabel : '',
    compatGod: k ? k.god : '', compatGodColor: k ? k.godColor : '#C9A227',
    compatGodNote: k ? k.godNote : '',
    compatGodIcon: k ? <Icon god={k.god} size={34} color={k.godColor} stroke={1.05} /> : null,
    compatGlow: k ? k.godColor + '30' : 'transparent',
    aIcon: cpA ? <Icon god={cpA.guardian.god} size={42} color={cpA.guardian.color} stroke={1} /> : null,
    bIcon: cpB ? <Icon god={cpB.guardian.god} size={42} color={cpB.guardian.color} stroke={1} /> : null,
    aGuard: cpA ? cpA.guardian.god : '',
    bGuard: cpB ? cpB.guardian.god : '',
    aLabel: cpA ? (cpA.name || '첫째 사람') : '',
    bLabel: cpB ? (cpB.name || '둘째 사람') : ''
  };

  return (
    <div style={sx('position:relative; width:100%; min-height:100vh; background:#0B0E1A; font-family:\'Noto Serif KR\',serif; color:#E8E3D5; overflow-x:hidden')}>
      <div style={sx('position:absolute; inset:0; pointer-events:none; background:radial-gradient(120% 70% at 50% -10%, #1E2340 0%, #12162A 45%, #0B0E1A 100%)')} />
      <div style={sx('position:absolute; inset:0; pointer-events:none; opacity:.55; background-image:radial-gradient(#C9C7E0 1px, transparent 1.2px); background-size:44px 52px; background-position:8px 12px; mask-image:linear-gradient(#000 0%, transparent 70%); -webkit-mask-image:linear-gradient(#000 0%, transparent 70%)')} />
      <div style={sx('position:absolute; top:60px; left:14%; width:3px; height:3px; border-radius:50%; background:#F0E6C0; animation:twinkle 3.6s ease-in-out infinite')} />
      <div style={sx('position:absolute; top:140px; left:76%; width:2px; height:2px; border-radius:50%; background:#F0E6C0; animation:twinkle 4.8s ease-in-out .8s infinite')} />
      <div style={sx('position:absolute; top:230px; left:36%; width:2px; height:2px; border-radius:50%; background:#F0E6C0; animation:twinkle 5.4s ease-in-out 1.6s infinite')} />
      <div style={sx('position:absolute; top:96px; left:52%; width:2px; height:2px; border-radius:50%; background:#C9A227; animation:twinkle 4.2s ease-in-out 2.2s infinite')} />

      <div style={sx(`position:relative; width:100%; max-width:${vm.colMax}; margin:0 auto; padding:0 22px 40px; box-sizing:border-box`)}>
        {vm.isLanding && <Landing vm={vm} />}
        {vm.isInput && <InputScreen vm={vm} />}
        {vm.isLoading && <LoadingScreen vm={vm} />}
        {vm.isResult && <ResultScreen vm={vm} />}
        {vm.isCompare && <CompareScreen vm={vm} />}
      </div>

      {vm.shareOpen && <ShareOverlay vm={vm} />}
    </div>
  );
}
