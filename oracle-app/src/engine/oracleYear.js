/* 신들의 신탁 — 세운·대운·트랜짓 엔진 + 제우스의 연말/신년 신탁 */
import * as OracleEngine from './oracleEngine.js';

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const STEM_EL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
const STEM_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
const BRANCH_EL = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
const EL = ['목', '화', '토', '금', '수'];
const EL_HANJA = ['木', '火', '土', '金', '水'];
const TERMS = [[1, 6], [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7]];
const mod = (n, m) => ((n % m) + m) % m;

// 조사 선택: 마지막 음절의 종성 여부로 갈린다
function hasFinal(word) {
  const c = word.charCodeAt(word.length - 1) - 0xAC00;
  if (c < 0 || c > 11171) return false;
  return c % 28 !== 0;
}
const iga = (w) => (hasFinal(w) ? '이' : '가');
const ro = (w) => w + (hasFinal(w) ? '으로' : '로');

function tenGod(dayStem, el, yin) {
  const dEl = STEM_EL[dayStem], dYin = STEM_YIN[dayStem];
  const same = dYin === yin;
  if (el === dEl) return same ? '비견' : '겁재';
  if ((dEl + 1) % 5 === el) return same ? '식신' : '상관';
  if ((dEl + 2) % 5 === el) return same ? '편재' : '정재';
  if ((dEl + 3) % 5 === el) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}

const GROUP = {
  '비견': '비겁', '겁재': '비겁', '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성', '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성'
};

function yearPillar(y) {
  const s = mod(y - 4, 10), b = mod(y - 4, 12);
  return {
    year: y, stem: s, branch: b,
    ganji: STEMS[s] + BRANCHES[b], kr: STEMS_KR[s] + BRANCHES_KR[b],
    stemEl: STEM_EL[s], branchEl: BRANCH_EL[b],
    stemElName: EL[STEM_EL[s]], branchElName: EL[BRANCH_EL[b]]
  };
}

function stemRel(a, b) {
  if (Math.abs(a - b) === 5) return { key: '합', label: '천간합' };
  if (Math.abs(a - b) === 6) return { key: '충', label: '천간충' };
  if (a === b) return { key: '동', label: '천간 중복' };
  return { key: '무', label: '무관' };
}

function branchRel(a, b) {
  const s = a + b, d = Math.abs(a - b);
  if (s === 1 || s === 13) return { key: '합', label: '육합' };
  if (d === 4 || d === 8) return { key: '삼합', label: '삼합' };
  if (d === 6) return { key: '충', label: '충' };
  if (d === 0) return { key: '동', label: '중복' };
  if (d === 3 || d === 9) return { key: '형', label: '형' };
  return { key: '무', label: '무관' };
}

/* ---------- 대운 ---------- */
export function daeun(birth, saju, gender) {
  if (gender !== 'm' && gender !== 'f') return null;
  const yStemYin = STEM_YIN[saju.pillars[0].stem];
  const forward = (yStemYin === 0) === (gender === 'm');
  const bd = Date.UTC(birth.y, birth.m - 1, birth.d);
  const bounds = [];
  for (let yy = birth.y - 1; yy <= birth.y + 1; yy++) {
    TERMS.forEach((t) => bounds.push(Date.UTC(yy, t[0] - 1, t[1])));
  }
  bounds.sort((a, b) => a - b);
  let days;
  if (forward) {
    const nx = bounds.find((t) => t > bd);
    days = Math.round((nx - bd) / 86400000);
  } else {
    const pv = bounds.filter((t) => t <= bd).pop();
    days = Math.round((bd - pv) / 86400000);
  }
  const startAge = days / 3;
  const now = new Date();
  const ageDec = (now.getTime() - new Date(birth.y, birth.m - 1, birth.d).getTime()) / (365.2425 * 86400000);
  const n = Math.floor((ageDec - startAge) / 10);
  const step = Math.max(n + 1, 1);
  const dir = forward ? 1 : -1;
  const stem = mod(saju.pillars[1].stem + dir * step, 10);
  const branch = mod(saju.pillars[1].branch + dir * step, 12);
  const fromAge = Math.floor(startAge + Math.max(n, 0) * 10);
  return {
    forward, startAge: Math.round(startAge * 10) / 10,
    index: Math.max(n, 0) + 1, pending: n < 0,
    ganji: STEMS[stem] + BRANCHES[branch], kr: STEMS_KR[stem] + BRANCHES_KR[branch],
    elName: EL[STEM_EL[stem]], ten: tenGod(saju.dayStem, STEM_EL[stem], STEM_YIN[stem]),
    fromAge, toAge: fromAge + 10, age: Math.floor(ageDec)
  };
}

/* ---------- 트랜짓 ---------- */
// 연말 신탁의 트랜짓 기준일: 그 해 12월 31일 정오로 고정한다.
// 사용자가 언제 열어도 연말 신탁 안의 하늘은 같은 문장을 말한다.
export function transit(natal, refYear) {
  const y = refYear || new Date().getFullYear();
  const cur = OracleEngine.natal(y, 12, 31, 12, 0);
  const at = (nm, arr) => arr.find((b) => b.name === nm) || {};
  const sun = at('태양', natal), sat = at('토성', cur), jup = at('목성', cur);
  const rel = (a, b) => {
    const c = Math.min(Math.abs(a - b), 12 - Math.abs(a - b));
    return c === 0 ? '합' : c === 6 ? '대립' : c === 3 ? '긴장' : c === 4 ? '조화' : c === 2 ? '우호' : '무관';
  };
  return {
    refLabel: y + '.12.31 기준',
    sunSign: sun.sign, saturnSign: sat.sign, jupiterSign: jup.sign,
    saturnRel: rel(sat.signIndex, sun.signIndex),
    jupiterRel: rel(jup.signIndex, sun.signIndex)
  };
}

/* ---------- 제우스의 카피 뱅크 ---------- */
// 두 카드의 화자. 연말은 시간을 닫는 크로노스가 결산하고,
// 신년은 그 해 세운이 일간에 오는 십신에 따라 다른 신이 문을 연다.
const CLOSER = { god: '크로노스', color: '#8A7F6A', role: '시간을 거두는 신', tag: '결산' };
const OPENER = {
  '재성': { god: '헤르메스', color: '#7FA8C4', role: '거래와 길의 신', tag: '흥정' },
  '관성': { god: '헤라', color: '#9C7BC4', role: '질서와 맹세의 신', tag: '서약' },
  '식상': { god: '디오니소스', color: '#A2609C', role: '도취와 말의 신', tag: '방류' },
  '인성': { god: '아테나', color: '#B8BFC6', role: '지혜와 전략의 신', tag: '기획' },
  '비겁': { god: '아레스', color: '#C2334D', role: '경쟁과 전장의 신', tag: '각축' }
};
const CLOSING = {
  '헤르메스': {
    g: '나 헤르메스가 두 해의 경계에 길을 내어두었노라. 문은 열려 있으니, 값을 흥정할 자만 들어오라.',
    r: '두 해의 경계에 길이 나 있다. 문은 열려 있으니, 값을 흥정할 사람만 들어오면 된다.'
  },
  '헤라': {
    g: '나 헤라가 두 해의 경계에 서약을 세워두었노라. 지킬 수 없는 것을 약속하는 자는 이 문을 넘지 못하리라.',
    r: '두 해의 경계에 서약이 서 있다. 지킬 수 없는 것을 약속하는 사람은 이 문을 넘지 못한다.'
  },
  '디오니소스': {
    g: '나 디오니소스가 두 해의 경계에 잔을 놓아두었노라. 넘치도록 따르는 자와 잔을 엎는 자는 이 겨울에 갈리느니라.',
    r: '두 해의 경계에 잔이 놓여 있다. 넘치도록 따르는 사람과 잔을 엎는 사람은 이 겨울에 갈린다.'
  },
  '아테나': {
    g: '나 아테나가 두 해의 경계에 판을 그려두었노라. 계획 없이 넘어오는 자에게는 내가 아무것도 주지 않으리라.',
    r: '두 해의 경계에 판이 그려져 있다. 계획 없이 넘어오는 사람에게는 아무것도 주어지지 않는다.'
  },
  '아레스': {
    g: '나 아레스가 두 해의 경계에 창을 꽂아두었노라. 싸울 일이 반드시 오니, 무엇으로 싸울지 미리 정하라.',
    r: '두 해의 경계에 창이 꽂혀 있다. 싸울 일이 반드시 오니, 무엇으로 싸울지 미리 정해라.'
  }
};

const TEN_YEAR = {
  '재성': {
    g: '재성의 해로 오느니라. 손에 잡히는 것이 늘어나는 자리이니, 늘어난 만큼 새는 곳도 함께 열리는도다.',
    r: '재성의 해다. 실물이 늘어나는 자리이나, 늘어난 만큼 빠져나가는 구멍도 같이 열린다.'
  },
  '관성': {
    g: '관성의 해로 오느니라. 네 위에 자리와 책임이 얹히리니, 피하면 도리어 무겁게 눌리리라.',
    r: '관성의 해다. 자리와 책임이 얹히는 구간이니, 피하는 쪽이 오히려 더 무겁게 눌린다.'
  },
  '식상': {
    g: '식상의 해로 오느니라. 네 입과 재주가 앞서는 자리이니, 말로 얻고 말로 잃으리라.',
    r: '식상의 해다. 표현과 재주가 앞서는 구간이니, 말로 얻은 것을 말로 잃기 쉽다.'
  },
  '인성': {
    g: '인성의 해로 오느니라. 배우고 물러나 정비하는 자리이니, 나아가려 애쓰면 헛발을 딛느니라.',
    r: '인성의 해다. 배우고 정비하는 구간이니, 억지로 밀어붙이면 헛발을 딛는다.'
  },
  '비겁': {
    g: '비겁의 해로 오느니라. 어깨를 나란히 할 자도, 네 것을 나눠 가질 자도 함께 오는도다.',
    r: '비겁의 해다. 함께 갈 사람과 내 것을 나눠 가질 사람이 같이 들어온다.'
  }
};
const TEN_YEAR_2 = {
  '재성': {
    g: '다시 재성이 드느니라. 같은 자리가 두 번 열리는 것은 기회가 아니라 시험이니, 첫 해에 새던 곳을 막지 않았다면 둘째 해에는 더 크게 새리라.',
    r: '재성이 다시 든다. 같은 자리가 두 번 열리는 것은 기회보다 시험에 가깝다. 첫 해에 막지 못한 구멍은 둘째 해에 더 커진다.'
  },
  '관성': {
    g: '다시 관성이 드느니라. 지난 해에 얹힌 것을 내려놓지 못했다면, 이 해에는 그 무게로 네 자리가 정해지리라.',
    r: '관성이 다시 든다. 지난 해에 얹힌 것을 내려놓지 못했다면, 이 해에는 그 무게가 네 자리를 정한다.'
  },
  '식상': {
    g: '다시 식상이 드느니라. 두 해를 잇는 말은 힘을 얻으나, 두 해를 잇는 실언은 흉으로 굳느니라.',
    r: '식상이 다시 든다. 두 해를 잇는 말은 힘을 얻지만, 두 해를 잇는 실언은 평판으로 굳는다.'
  },
  '인성': {
    g: '다시 인성이 드느니라. 두 해를 물러나 있으면 남들은 네가 멈춘 줄 알겠으나, 그 사이 쌓인 것으로 셋째 해를 여느니라.',
    r: '인성이 다시 든다. 두 해를 물러나 있으면 남들은 멈춘 줄 알겠지만, 그 사이 쌓인 것이 셋째 해를 연다.'
  },
  '비겁': {
    g: '다시 비겁이 드느니라. 두 해에 걸쳐 사람이 몰리니, 이제는 누구를 남길지 네가 정해야 하리라.',
    r: '비겁이 다시 든다. 두 해에 걸쳐 사람이 몰리니, 이제는 누구를 남길지 직접 정해야 한다.'
  }
};

const REL_TEXT = {
  '합': { g: '세운의 천간이 네 일간과 합하니, 이 해는 네게 문을 열어주는 편이니라.', r: '세운 천간이 일간과 합한다. 이 해는 열리는 쪽이다.' },
  '충': { g: '세운의 천간이 네 일간을 정면으로 치느니라. 무리하게 밀면 반드시 부러지리라.', r: '세운 천간이 일간을 충한다. 무리하게 밀면 부러지는 자리다.' },
  '동': { g: '세운의 천간이 네 일간과 같으니, 네 성정이 두 배로 드러나는 해로다.', r: '세운 천간이 일간과 같다. 원래 성향이 두 배로 드러난다.' },
  '무': { g: '세운의 천간은 네 일간과 얽히지 않느니라. 이 해의 결과는 팔자보다 네 선택이 정하리라.', r: '세운 천간은 일간과 얽히지 않는다. 결과는 팔자보다 선택이 정한다.' }
};

const BRANCH_TEXT = {
  '합': { g: '세운의 지지가 네 일지를 감싸니, 몸과 자리가 편안해지는 해니라.', r: '세운 지지가 일지를 감싼다. 생활과 자리가 안정되는 쪽이다.' },
  '삼합': { g: '세운의 지지가 네 일지와 국을 이루니, 뜻을 함께할 사람이 붙는 해로다.', r: '세운 지지가 일지와 국을 이룬다. 함께할 사람이 붙는다.' },
  '충': { g: '세운의 지지가 네 일지를 충하느니라. 자리를 옮기거나 몸이 흔들리는 해이니 무리한 이동을 삼가라.', r: '세운 지지가 일지를 충한다. 이동과 몸의 변화가 잦은 구간이다.' },
  '동': { g: '세운의 지지가 네 일지와 겹치니, 익숙한 자리에서 같은 일이 되풀이되리라.', r: '세운 지지가 일지와 겹친다. 익숙한 자리에서 같은 일이 반복된다.' },
  '형': { g: '세운의 지지가 네 일지를 형하느니라. 말과 문서로 다툴 일이 생기니 계약을 두 번 읽으라.', r: '세운 지지가 일지를 형한다. 말과 문서로 다툴 일이 생기니 계약을 두 번 읽어라.' },
  '무': { g: '세운의 지지는 네 일지를 건드리지 않느니라. 큰 파랑은 없을 것이다.', r: '세운 지지는 일지를 건드리지 않는다. 큰 파랑은 없다.' }
};

function elementText(yearEl, saju, t, v) {
  const weak = EL[saju.minEl], strong = EL[saju.maxEl];
  const name = EL[yearEl];
  if (name === weak) {
    if (v === 1) {
      return t === 'g'
        ? `${name}의 기운이 다시 네 빈 자리로 흘러드느니라. 이 기운을 쥔 사람 곁에 서는 것만으로도 네 몸이 펴이리라.`
        : `${name}의 기운이 다시 빈 자리로 흘러들어온다. 이 기운을 쥔 사람 곁에 서는 것만으로도 달라진다.`;
    }
    return t === 'g'
      ? `세운의 기운은 ${name}이니, 네 원국에서 가장 비어 있던 자리를 채우는도다. 이 해에 시작한 것은 뿌리를 얻으리라.`
      : `세운의 기운은 ${name}. 원국에서 가장 비어 있던 자리를 채운다. 이 해에 시작한 것은 뿌리를 얻는 쪽이다.`;
  }
  if (name === strong) {
    if (v === 1) {
      return t === 'g'
        ? `${name}${iga(name)} 다시 겹치니, 같은 자리가 두 해 연이어 과해지느니라. 둘째 해에는 더하는 것이 아니라 덜어내는 것이 공이 되리라.`
        : `${name}${iga(name)} 다시 겹친다. 같은 자리가 두 해 연속 과해지니, 둘째 해에는 더하는 일보다 덜어내는 일이 생산이다.`;
    }
    return t === 'g'
      ? `세운의 기운도 ${name}이라, 이미 과한 자리에 다시 불을 얹느니라. 넘치는 쪽을 덜어내는 것이 이 해의 과업이로다.`
      : `세운의 기운도 ${name}. 이미 과한 자리에 더 얹는다. 덜어내는 것이 이 해의 과업이다.`;
  }
  if (v === 1) {
    return t === 'g'
      ? `${name}의 기운은 두 해에 걸쳐 고르게 흐르니 네 원국을 상하지 않느니라. 판을 바꾸려 하지 말고, 곁에 둘 사람을 바꾸라.`
      : `${name}의 기운은 두 해에 걸쳐 고르게 흐르고 원국을 상하게 하지 않는다. 판을 바꿀 생각보다 곁에 둔 사람을 바꾸는 쪽이 낫다.`;
  }
  return t === 'g'
    ? `세운의 기운은 ${name}이니, 네 원국을 크게 흔들지는 않느니라. 흐름을 타되 판을 새로 짜지는 말라.`
    : `세운의 기운은 ${name}. 원국을 크게 흔들지 않는다. 흐름은 타되 판을 새로 짜지는 마라.`;
}

const HEADLINE = {
  '재성': '거두는 해', '관성': '얹히는 해', '식상': '말이 앞서는 해',
  '인성': '물러나 배우는 해', '비겁': '사람이 몰리는 해'
};
const HEADLINE_SAME = {
  '재성': '두 해 연이어 거두는 흐름',
  '관성': '두 해 연이어 얹히는 흐름',
  '식상': '두 해 연이어 말이 앞서는 흐름',
  '인성': '두 해 연이어 물러나 배우는 흐름',
  '비겁': '두 해 연이어 사람이 몰리는 흐름'
};

export function reading(saju, natal, gender, birth, tone) {
  const t = tone === 'refined' ? 'r' : 'g';
  const now = new Date();
  const curY = now.getFullYear();
  const A = yearPillar(curY), B = yearPillar(curY + 1);
  const monthsLeft = 12 - (now.getMonth() + 1) + 1;

  const dayStem = saju.dayStem, dayBranch = saju.pillars[2].branch;
  const aTen = tenGod(dayStem, A.stemEl, STEM_YIN[A.stem]);
  const bTen = tenGod(dayStem, B.stemEl, STEM_YIN[B.stem]);
  const aStemRel = stemRel(dayStem, A.stem), aBranchRel = branchRel(dayBranch, A.branch);
  const bStemRel = stemRel(dayStem, B.stem), bBranchRel = branchRel(dayBranch, B.branch);
  const du = daeun(birth, saju, gender);
  const tr = transit(natal, curY);

  const opener = OPENER[GROUP[bTen]];
  const closing = CLOSING[opener.god][t];

  const p2026 = [
    (t === 'g'
      ? `나 크로노스가 ${curY}년 ${A.kr}의 남은 ${monthsLeft}달을 셈하노라. `
      : `${curY}년 ${A.kr}의 남은 ${monthsLeft}달을 셈한다. `) + TEN_YEAR[GROUP[aTen]][t],
    REL_TEXT[aStemRel.key][t] + ' ' + BRANCH_TEXT[aBranchRel.key][t],
    elementText(A.stemEl, saju, t, 0)
  ];

  const p2027 = [
    (t === 'g'
      ? `해가 바뀌면 ${B.year}년 ${B.kr}${iga(B.kr)} 들어서느니라. ` + (GROUP[aTen] === GROUP[bTen]
          ? `자리는 여전히 ${GROUP[bTen]}이니, 바뀌는 것은 기운의 이름이 아니라 그 깊이로다. `
          : `${aTen}에서 ${ro(bTen)} 자리가 바뀌니, 같은 방식으로 살면 같은 결과를 얻지 못하리라. `)
      : `해가 바뀌면 ${B.year}년 ${B.kr}${iga(B.kr)} 들어선다. ` + (GROUP[aTen] === GROUP[bTen]
          ? `자리는 여전히 ${GROUP[bTen]}이다. 바뀌는 것은 기운의 종류가 아니라 그 깊이다. `
          : `${aTen}에서 ${ro(bTen)} 바뀌니 같은 방식으로는 같은 결과가 나오지 않는다. `)) + (GROUP[aTen] === GROUP[bTen] ? TEN_YEAR_2[GROUP[bTen]][t] : TEN_YEAR[GROUP[bTen]][t]),
    REL_TEXT[bStemRel.key][t] + ' ' + BRANCH_TEXT[bBranchRel.key][t],
    elementText(B.stemEl, saju, t, 1)
  ];

  if (du && !du.pending) {
    p2027.push(t === 'g'
      ? `너는 지금 ${du.index}번째 대운 ${du.kr} 구간에 서 있으니, ${du.fromAge}세부터 ${du.toAge}세까지 ${du.ten}의 기운이 밑바탕에 깔려 있느니라. 세운은 한 해의 날씨요 대운은 십 년의 기후이니, 날씨를 보고 기후를 잊지 말라.`
      : `지금 ${du.index}번째 대운 ${du.kr} 구간이다. ${du.fromAge}세에서 ${du.toAge}세까지 ${du.ten}의 기운이 밑바탕에 깔린다. 세운은 한 해의 날씨, 대운은 십 년의 기후다.`);
  } else if (du && du.pending) {
    p2027.push(t === 'g'
      ? `네 첫 대운은 ${du.startAge}세에 열리니, 아직 대운의 기후가 아니라 타고난 원국의 기운으로 사는 때이니라.`
      : `첫 대운이 ${du.startAge}세에 열린다. 아직 대운의 기후가 아니라 원국의 기운으로 사는 시기다.`);
  }

  if (tr) {
    const satNote = {
      '합': '토성이 네 태양 자리에 들어와 앉았으니, 미루어 둔 값을 치르게 하는 시기니라',
      '대립': '토성이 네 태양과 마주 서 있으니, 관계와 계약에서 무게를 재는 시기니라',
      '긴장': '토성이 네 태양과 각을 세우니, 하던 방식이 통하지 않게 되는 시기니라',
      '조화': '토성이 네 태양과 순한 각을 이루니, 오래 걸리는 일을 시작해도 좋은 시기니라',
      '우호': '토성이 네 태양 곁을 지나니, 큰 무리 없이 자리를 다질 수 있는 시기니라',
      '무관': '토성은 지금 네 태양과 각을 이루지 않느니라'
    }[tr.saturnRel];
    const jupNote = {
      '합': '목성이 네 태양 자리에 들었으니 판이 커지리라',
      '대립': '목성이 마주 서 있으니 남을 통해 판이 커지리라',
      '긴장': '목성이 각을 세우니 커지는 만큼 새는 것도 있으리라',
      '조화': '목성이 순한 각을 이루니 손을 뻗은 곳이 열리리라',
      '우호': '목성이 곁을 지나니 작은 기회가 이어지리라',
      '무관': '목성은 지금 네 태양을 돕지 않으니 스스로 판을 만들라'
    }[tr.jupiterRel];
    p2027.push((t === 'g'
      ? `하늘의 자리도 보라. 토성은 ${tr.saturnSign}, 목성은 ${tr.jupiterSign}에 있으니 — ${satNote}. ${jupNote}. `
      : `천체의 현재 위치도 보라. 토성 ${tr.saturnSign}, 목성 ${tr.jupiterSign} — ${satNote.replace(/니라$/, '다')}. ${jupNote.replace(/리라$/, '린다')}. `) + closing);
  } else {
    p2027.push(closing);
  }

  const rows = [
    { label: `${curY} 세운`, value: `${A.kr} ${A.ganji}`, note: `${A.stemElName}/${A.branchElName} · 일간 기준 ${aTen}` },
    { label: `${B.year} 세운`, value: `${B.kr} ${B.ganji}`, note: `${B.stemElName}/${B.branchElName} · 일간 기준 ${bTen}` },
    { label: '원국과의 관계', value: `${aStemRel.label} · ${aBranchRel.label}`, note: `${curY} 세운이 일간·일지에 닿는 방식` },
    { label: '오행 판정', value: `${EL_HANJA[A.stemEl]} ${A.stemElName}`, note: A.stemElName === EL[saju.minEl] ? '가장 빈 자리를 채운다' : A.stemElName === EL[saju.maxEl] ? '이미 과한 자리를 더한다' : '원국을 크게 흔들지 않는다' },
    du
      ? { label: '대운', value: `${du.index}대운 ${du.kr} ${du.ganji}`, note: `${du.fromAge}–${du.toAge}세 · ${du.ten} · ${du.forward ? '순행' : '역행'} · 입운 ${du.startAge}세` }
      : { label: '대운', value: '판정 보류', note: '대운 순행·역행은 성별과 년간 음양으로 갈린다' },
    tr
      ? { label: '트랜짓', value: `토성 ${tr.saturnSign} · 목성 ${tr.jupiterSign}`, note: `${tr.refLabel} · 본명 태양 ${tr.sunSign} 대비 토성 ${tr.saturnRel} · 목성 ${tr.jupiterRel}` }
      : { label: '트랜짓', value: '—', note: '' }
  ];

  return {
    curYear: curY, nextYear: B.year, monthsLeft,
    aGanji: A.ganji, aKr: A.kr, bGanji: B.ganji, bKr: B.kr,
    aTen, bTen,
    closer: CLOSER, opener,
    headline: GROUP[aTen] === GROUP[bTen] ? HEADLINE_SAME[GROUP[aTen]] : HEADLINE[GROUP[aTen]] + ' → ' + HEADLINE[GROUP[bTen]],
    paragraphs: { cur: p2026, next: p2027 },
    rows, daeun: du, transit: tr
  };
}
