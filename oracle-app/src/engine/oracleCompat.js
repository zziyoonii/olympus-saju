/* 신들의 신탁 — 궁합 비교 엔진
   두 사람의 원국(일간·일지·오행)과 천체 배치를 실제로 대조해 점수와 근거를 산출 */
import { PAIRS, ROSTER } from './oracleEngine.js';

const ELS = ['목', '화', '토', '금', '수'];
const EL_HANJA = ['木', '火', '土', '金', '水'];
const STEM_EL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
const STEM_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

function tenGod(dayStem, el, yin) {
  const dEl = STEM_EL[dayStem], dYin = STEM_YIN[dayStem];
  const same = dYin === yin;
  if (el === dEl) return same ? '비견' : '겁재';
  if ((dEl + 1) % 5 === el) return same ? '식신' : '상관';
  if ((dEl + 2) % 5 === el) return same ? '편재' : '정재';
  if ((dEl + 3) % 5 === el) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}

const TEN = {
  '정인': [22, '상대가 그대를 기르는 자리에 섰다. 배우고 기대는 연이니, 오래 갈수록 깊어진다.'],
  '편인': [19, '상대가 그대의 생각을 흔들어 키운다. 편한 연은 아니나 정신이 자라는 연이다.'],
  '정재': [21, '상대가 그대의 재물의 자리에 든다. 실물과 살림이 맞물리는, 현실이 잘 굴러가는 연이다.'],
  '편재': [19, '상대가 그대의 편재를 건드린다. 판이 커지고 돈이 도나, 씀씀이도 함께 커진다.'],
  '식신': [18, '그대가 상대를 먹여 기른다. 베푸는 쪽이 그대이니, 받는 태도를 반드시 보라.'],
  '상관': [16, '그대의 말과 재주가 상대에게 쏟아진다. 빛나되 상하기 쉬우니 혀를 다스려라.'],
  '정관': [15, '상대가 그대를 다스리는 자리다. 규율이 잡히는 연이나, 답답함을 견뎌야 한다.'],
  '편관': [12, '상대가 그대를 밀어붙인다. 성장은 빠르되 소모가 크니, 물러설 자리를 두어라.'],
  '비견': [15, '같은 결의 두 사람이다. 어깨를 나란히 하되, 같은 것을 두고 다투기도 한다.'],
  '겁재': [12, '닮았으나 겨루는 자리다. 나눌 것이 분명하지 않으면 반드시 부딪힌다.']
};

function stemRel(a, b) {
  if (Math.abs(a - b) === 5) return { label: '천간합', score: 25, note: '두 일간이 서로를 묶는 합이다. 처음부터 말이 통하고, 떨어져도 다시 이어진다.' };
  if (Math.abs(a - b) === 6) return { label: '천간충', score: 9, clash: true, note: '두 일간이 정면으로 부딪친다. 끌리는 힘도 세지만 밀어내는 힘이 그만큼 세다.' };
  if (a === b) return { label: '같은 일간', score: 16, note: '같은 천간을 쓰는 두 사람이다. 서로를 거울처럼 읽으나, 닮은 만큼 같은 곳에서 넘어진다.' };
  const t = tenGod(a, STEM_EL[b], STEM_YIN[b]);
  return { label: '일간 ' + t, score: TEN[t][0], note: TEN[t][1] };
}

function branchRel(a, b) {
  const s = a + b, d = Math.abs(a - b);
  if (s === 1 || s === 13) return { label: '일지 육합', score: 20, note: '태어난 날의 지지가 서로를 감싼다. 살을 붙이고 사는 연에 유리하다.' };
  if (d === 4 || d === 8) return { label: '일지 삼합', score: 17, note: '같은 국을 이루는 지지다. 목표가 같을 때 놀랄 만큼 잘 굴러간다.' };
  if (d === 6) return { label: '일지 충', score: 7, clash: true, note: '일지가 정면으로 충한다. 가까이 살면 자주 흔들리니, 각자의 방을 두어라.' };
  if (d === 0) return { label: '같은 일지', score: 14, note: '같은 자리에 앉은 두 사람. 생활의 결이 비슷해 편하나 자극이 적다.' };
  if (d === 3 || d === 9) return { label: '일지 형', score: 10, note: '서로를 다듬느라 아프게 하는 결이다. 말의 온도를 낮추어야 오래 간다.' };
  return { label: '일지 무관', score: 12, note: '얽히지도 부딪히지도 않는 자리다. 연은 노력으로 만들어야 한다.' };
}

function elementPart(ea, eb) {
  const combined = ELS.map((_, i) => ea[i] + eb[i]);
  const dev = combined.reduce((t, c) => t + Math.abs(c - 3.2), 0);
  const score = Math.max(0, Math.min(25, Math.round(25 * (1 - dev / 12.8))));
  const gives = [], gets = [];
  ELS.forEach((name, i) => {
    if (ea[i] >= 3 && eb[i] <= 1) gives.push(name);
    if (eb[i] >= 3 && ea[i] <= 1) gets.push(name);
  });
  let note;
  if (gives.length && gets.length) note = '그대가 ' + gives.join('·') + ' 기운을 내어주고, 상대가 ' + gets.join('·') + ' 기운을 채운다. 서로의 빈 자리를 정확히 메우는 배치다.';
  else if (gives.length) note = '상대에게 없는 ' + gives.join('·') + ' 기운을 그대가 쥐고 있다. 기울지 않게 쓰는 것이 그대의 몫이다.';
  else if (gets.length) note = '그대에게 없는 ' + gets.join('·') + ' 기운을 상대가 쥐고 있다. 기대되, 의존이 되지 않게 하라.';
  else note = '두 원국의 오행이 비슷한 방향으로 쏠려 있다. 편안하나, 부족한 기운은 둘 다 부족하다.';
  return { label: '오행 상보', score, note, combined };
}

const SIGN_SCORE = { 0: 5, 4: 5, 8: 5, 2: 4, 10: 4, 6: 3, 3: 2, 9: 2 };
function signPair(a, b) {
  const d = Math.abs(a - b);
  return SIGN_SCORE[d] !== undefined ? SIGN_SCORE[d] : 3;
}

function celestialPart(na, nb) {
  const sun = signPair(na[0].signIndex, nb[0].signIndex);
  const moon = signPair(na[1].signIndex, nb[1].signIndex);
  const venus = signPair(na[3].signIndex, nb[3].signIndex);
  const score = sun + moon + venus;
  const best = venus >= moon && venus >= sun ? '금성' : moon >= sun ? '달' : '태양';
  const note = '태양 ' + na[0].sign + '↔' + nb[0].sign + ' · 달 ' + na[1].sign + '↔' + nb[1].sign + ' · 금성 ' + na[3].sign + '↔' + nb[3].sign + '. ' +
    (score >= 12 ? best + '의 자리가 특히 순하게 맞물린다.' : score >= 8 ? '큰 무리는 없으나 ' + best + '만이 뚜렷하게 돕는다.' : '세 별이 모두 어긋난 각을 이루니, 감정의 속도가 서로 다르다.');
  return { label: '천체 각', score, note };
}

// 조사 선택: 마지막 음절에 종성이 없으면 와/는, 있으면 과/은
function hasFinal(word) {
  const c = word.charCodeAt(word.length - 1) - 0xAC00;
  if (c < 0 || c > 11171) return false;
  return c % 28 !== 0;
}
const wa = (w) => w + (hasFinal(w) ? '과' : '와');
const neun = (w) => w + (hasFinal(w) ? '은' : '는');

function guardianPart(ga, gb) {
  const pair = PAIRS[ga.god];
  if (pair && pair[0] === gb.god) return { label: '수호신 정합', score: 15, note: wa(ga.god) + ' ' + neun(gb.god) + ' 신화에서 짝을 이룬 두 신이다. ' + pair[1] + '으로 맺어진 자리다.' };
  if (ga.god === gb.god) return { label: '같은 수호신', score: 11, note: '두 사람 모두 ' + ga.god + '의 아래에 있다. 같은 신을 섬기니 뜻은 같고, 자리를 두고 겨룬다.' };
  const ia = ROSTER.findIndex((r) => r.god === ga.god);
  const ib = ROSTER.findIndex((r) => r.god === gb.god);
  const d = Math.abs(ia - ib);
  const score = d === 4 || d === 8 ? 12 : d === 6 ? 9 : d === 3 || d === 9 ? 7 : 9;
  return { label: '수호신 배치', score, note: wa(ga.god) + ' ' + gb.god + ' 사이에 정해진 신화적 짝은 없다. 연은 두 사람이 직접 세워야 한다.' };
}

const BANDS = [
  [84, '천생의 연', '올림포스가 따로 손을 쓸 것이 없는 자리다. 원국이 서로를 채우고 별이 어긋나지 않으니, 함께 있는 것 자체가 이미 신탁이니라.'],
  [70, '순한 연', '큰 물살 없이 흐르는 연이다. 부딪히는 자리가 없지 않으나, 서로가 물러서는 법을 이미 알고 있다.'],
  [56, '무른 연', '되기도 하고 안 되기도 하는 자리다. 이 연의 무게는 팔자보다 두 사람의 노력에 더 실려 있느니라.'],
  [42, '시험받는 연', '맞물리지 않는 자리가 뚜렷하다. 끌리는 힘이 강할수록 부딪히는 힘도 강하니, 규칙을 먼저 세우라.'],
  [0, '거스르는 연', '원국이 서로를 밀어낸다. 그래도 가겠다면, 신들은 막지 않되 편도 들지 않으리라.']
];

const PRESIDER = {
  '아프로디테': '#D98CA0', '헤라': '#9C7BC4', '아레스': '#C2334D', '크로노스': '#8A7F6A'
};

export function compare(A, B, tone) {
  const sa = A.saju, sb = B.saju;
  const parts = [
    stemRel(sa.dayStem, sb.dayStem),
    branchRel(sa.pillars[2].branch, sb.pillars[2].branch),
    elementPart(sa.elements, sb.elements),
    guardianPart(A.guardian, B.guardian),
    celestialPart(A.natal, B.natal)
  ];
  const maxes = [25, 20, 25, 15, 15];
  parts.forEach((p, i) => { p.max = maxes[i]; });
  const score = parts.reduce((t, p) => t + p.score, 0);
  const band = BANDS.find((b) => score >= b[0]) || BANDS[BANDS.length - 1];

  const clash = !!(parts[0].clash || parts[1].clash);
  const god = clash ? '아레스' : score >= 82 ? '아프로디테' : score >= 62 ? '헤라' : '크로노스';
  const godNote = {
    '아프로디테': '이 연은 내가 직접 주관하리라. 서로를 아름답게 만드는 자리이니라.',
    '헤라': '이 연은 내 소관이다. 맹세를 지키는 자에게만 오래 허락하리라.',
    '아레스': '충이 걸린 자리는 내가 본다. 싸울 일이 반드시 오니, 무엇으로 싸울지 미리 정하라.',
    '크로노스': '이 연은 시간이 판정한다. 서두르는 쪽이 먼저 무너지리라.'
  }[god];

  const combined = parts[2].combined;
  const strongest = combined.indexOf(Math.max(...combined));
  const weakest = combined.indexOf(Math.min(...combined));

  return {
    score,
    bandTitle: band[1],
    bandText: tone === 'refined' ? band[2].replace(/니라$/, '습니다').replace(/이니라/g, '입니다') : band[2],
    parts: parts.map((p) => ({
      label: p.label, note: p.note, score: p.score, max: p.max,
      pct: Math.round((p.score / p.max) * 100) + '%'
    })),
    god, godColor: PRESIDER[god] || '#C9A227', godNote,
    combined: ELS.map((name, i) => ({
      name, hanja: EL_HANJA[i], count: combined[i],
      width: Math.round((combined[i] / 16) * 100) + '%'
    })),
    strongestLabel: ELS[strongest],
    weakestLabel: ELS[weakest]
  };
}
