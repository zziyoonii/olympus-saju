/* 신들의 신탁 — 신탁 문구 생성 (계산 결과를 근거로 조합) */
const EL = ['목', '화', '토', '금', '수'];

function jong(w) {
  if (!w) return false;
  const c = String(w).trim().slice(-1).charCodeAt(0);
  if (c < 0xAC00 || c > 0xD7A3) return false;
  return (c - 0xAC00) % 28 !== 0;
}
const iga = (w) => w + (jong(w) ? '이' : '가');
const eun = (w) => w + (jong(w) ? '은' : '는');
const eul = (w) => w + (jong(w) ? '을' : '를');

const ELEMENT_NOTE = {
  '목': ['뻗어나가려는 나무의 기운', '자라기를 멈추지 못하는 성정'],
  '화': ['타오르는 불의 기운', '드러내지 않고는 못 견디는 성정'],
  '토': ['두터이 쌓인 흙의 기운', '쉬이 움직이지 않는 성정'],
  '금': ['벼려진 쇠의 기운', '끊어야 할 것을 끊는 성정'],
  '수': ['흘러 스미는 물의 기운', '형체를 정하지 않는 성정']
};
const LACK_NOTE = {
  '목': '뻗어나갈 방향', '화': '드러낼 불씨', '토': '발 디딜 땅',
  '금': '베어낼 결단', '수': '흘려보낼 여유'
};
const EXCESS_RISK = {
  '목': '가지를 너무 벌려 뿌리가 얕아지는 것',
  '화': '한 번에 다 태워버리는 것',
  '토': '움직여야 할 때 버티고 앉아 있는 것',
  '금': '끊지 않아도 될 것까지 끊는 것',
  '수': '어디에도 형체를 두지 않는 것'
};

// 십신별 해석 조각
const TEN_LOVE = {
  '정재': ['사랑을 약속과 신의로 재는 자리', '한 사람을 오래 지키는 쪽으로 복이 붙는다'],
  '편재': ['사랑을 기회와 흐름으로 읽는 자리', '넓게 만나되 깊이 정하는 것이 늦다'],
  '정관': ['사랑을 질서와 명분으로 삼는 자리', '어울리는 자리를 먼저 보고 마음을 나중에 본다'],
  '편관': ['사랑을 긴장과 시험으로 겪는 자리', '편안한 관계보다 자극이 강한 관계에 끌린다'],
  '식신': ['사랑을 나눔과 돌봄으로 표현하는 자리', '주는 쪽이 늘 앞선다'],
  '상관': ['사랑을 말과 표현으로 쏟는 자리', '솔직함이 무기이자 상처다'],
  '정인': ['사랑을 보호와 이해로 받는 자리', '기대는 쪽을 스스로 부끄러워한다'],
  '편인': ['사랑을 관찰하고 뒤로 물러서는 자리', '마음을 준 뒤에도 한 발을 남긴다'],
  '비견': ['사랑을 대등한 동행으로 보는 자리', '지지 않으려다 사이가 멀어진다'],
  '겁재': ['사랑을 경쟁 속에서 확인하는 자리', '뺏기고 나서야 소중함을 안다']
};
const TEN_WEALTH = {
  '정재': ['쌓아 지키는 재물', '한 곳에 오래 두어야 불어나는 구조'],
  '편재': ['굴려서 버는 재물', '움직일수록 커지고 멈추면 새는 구조'],
  '식신': ['만들어 파는 재물', '네가 낳은 것에서 값이 생긴다'],
  '상관': ['말과 재주로 버는 재물', '남과 다르게 해야 값이 붙는다'],
  '비견': ['함께 벌어 나누는 재물', '동업의 득실이 인생을 가른다'],
  '겁재': ['빠르게 들고 빠르게 나가는 재물', '남의 판에 올라타는 순간이 승부다'],
  '정관': ['자리와 직에서 나오는 재물', '이름값이 곧 통장이다'],
  '편관': ['위험을 감수해 얻는 재물', '큰 판에서만 값이 선다'],
  '정인': ['배움과 자격에서 나오는 재물', '느리지만 끊기지 않는다'],
  '편인': ['틈새와 전문성에서 나오는 재물', '남들이 안 하는 자리에 값이 있다']
};

const SIGN_TRAIT = {
  '양자리': '먼저 부딪히고 나중에 생각하는', '황소자리': '한번 쥔 것을 놓지 않는',
  '쌍둥이자리': '한 자리에 오래 머물지 못하는', '게자리': '안쪽으로 품고 바깥으로 단단한',
  '사자자리': '보여야 살아나는', '처녀자리': '어긋난 것을 못 견디는',
  '천칭자리': '기울어진 것을 바로잡으려는', '전갈자리': '끝까지 파고드는',
  '사수자리': '멀리 보고 크게 거는', '염소자리': '오래 걸려도 끝을 보는',
  '물병자리': '남과 같아지기를 거부하는', '물고기자리': '경계를 흐리게 두는'
};

export const SECTIONS = [
  { key: 'total', label: '총운', sub: '타고난 팔자의 큰 줄기', god: '제우스', symbol: '번개', color: '#C9A227', free: true },
  { key: 'love', label: '애정운', sub: '연(緣)의 결', god: '아프로디테', symbol: '조개', color: '#D98CA0' },
  { key: 'bond', label: '인연·관계의 팔자', sub: '사람이 오고 가는 자리', god: '헤라', symbol: '왕관', color: '#9C7BC4' },
  { key: 'wealth', label: '재물·성공운', sub: '재(財)가 머무는 자리', god: '헤르메스', symbol: '카두케우스', color: '#7FC6C0' },
  { key: 'warn', label: '신의 경고', sub: '피해야 할 것', god: '아레스', symbol: '검', color: '#D9575F' }
];

/* 문장 골격 변주: 같은 데이터라도 원국 해시로 다른 골격을 고른다 */
const OPEN_TOTAL = {
  g: [
    (v) => `${v.who}, 네 일간은 ${v.dayGanji}(${v.dayKr})이니라. 하늘이 너를 내릴 적에 ${eul(v.elNote[0])} 여덟 글자 중 ${v.maxCount}자에 심었노라.`,
    (v) => `여덟 글자를 세워 보니 ${v.dayGanji} 일간이로다. ${v.monthTerm} 절기의 기운을 받고 ${eul(v.elNote[0])} 안고 태어났느니라.`,
    (v) => `${v.who}의 기둥은 ${v.yearGanji}·${v.monthGanji}·${v.dayGanji}·${v.hourGanji}. 그 가운데 ${iga(v.maxEl)} ${v.maxCount}자로 가장 성하도다.`,
    (v) => `${v.who}, 네 사주는 ${v.strengthWord} 격이니라. 일간 ${v.dayGanji}${v.iRul} ${v.strengthNote}`
  ],
  r: [
    (v) => `${v.who}의 일간은 ${v.dayGanji}. ${v.elNote[1]}이 여덟 글자 가운데 ${v.maxCount}자를 차지한다.`,
    (v) => `${v.dayGanji} 일간, ${v.monthTerm} 절기. 판을 읽는 방식이 ${v.elNote[1]}에서 나온다.`,
    (v) => `기둥은 ${v.yearGanji}·${v.monthGanji}·${v.dayGanji}·${v.hourGanji}. ${iga(v.maxEl)} ${v.maxCount}자, ${iga(v.minEl)} ${v.minCount}자다.`,
    (v) => `${v.who}, 네 원국은 ${v.strengthWord}에 가깝다. ${v.strengthNote}`
  ]
};

const MID_TOTAL = {
  g: [
    (v) => `${iga(v.maxEl)} 성한 팔자는 스스로를 밀어붙여 길을 낸다. 다만 ${iga(v.minEl)} ${v.minCount}자에 그치니, ${iga(v.lackNote)} 늘 모자랄 것이다.`,
    (v) => `${v.tenTop}${v.tenTopCount}자가 네 성정의 뼈대로다. ${v.tenTopNote}`,
    (v) => `${eun(v.minEl)} ${v.minCount}자뿐이니 ${eul(v.lackNote)} 밖에서 구해야 하느니라. 사람을 통해 채우는 것이 네 길이다.`
  ],
  r: [
    (v) => `${iga(v.maxEl)} 많은 사람은 판을 스스로 만든다. 대신 ${iga(v.minEl)} ${v.minCount}자뿐이니 ${eun(v.lackNote)} 늘 밖에서 구해야 한다.`,
    (v) => `십신을 세면 ${v.tenTop}${v.tenTopCount}자. ${v.tenTopNote}`,
    (v) => `${eun(v.minEl)} ${v.minCount}자. 없는 것을 채우려 애쓰기보다, 그 자리를 사람으로 메우는 편이 빠르다.`
  ]
};

const CLOSE_TOTAL = {
  g: [
    (v) => `${v.monthTerm} 뒤에 태어난 자의 운은 늦게 열리고 오래 간다. 서두르지 말라, 네 때는 정해져 있느니라.`,
    (v) => `태양이 ${v.sunSign}에 든 날에 났으니 ${v.sunTrait} 기질을 타고났도다. 그것이 복이 될지 화가 될지는 네 손에 있다.`,
    (v) => `${v.animal}띠 해의 기운을 안고 났으니, 남이 정한 속도로 살면 반드시 탈이 나느니라.`
  ],
  r: [
    (v) => `${v.monthTerm} 절기의 기운을 받았으니 운은 천천히 문을 여는 쪽이다. 조급함만 버리면 된다.`,
    (v) => `태양 ${v.sunSign}. ${v.sunTrait} 기질이 네 판단 속도를 정한다.`,
    (v) => `${v.animal}띠 해에 났다. 남의 속도로 사는 순간부터 어긋나는 구조야.`
  ]
};

const LOVE = {
  g: [
    (v) => [`네 원국에 ${iga(v.loveTen)} 서 있구나. ${v.loveNote[0]}니, 사랑은 네게 기쁨보다 먼저 시험으로 오리라.`,
      `금성이 ${v.venusSign}에 놓였으니 ${v.venusTrait} 방식으로 마음을 내주는도다. ${v.loveNote[1]}.`,
      `한 사람을 오래 견디는 자에게만 내가 문을 열어주노라.`],
    (v) => [`${v.who}, 사랑에서 네 문제는 마음이 없는 것이 아니라 ${v.loveNote[1]}는 데 있느니라.`,
      `금성 ${v.venusSign}, ${v.loveTen}. ${v.venusTrait} 성정이니 상대는 늘 네 속도를 뒤늦게 안다.`,
      `${v.loveAdvice}`],
    (v) => [`연은 ${v.monthGanji} 월주에서 시작되느니라. ${iga(v.loveTen)} 그 자리를 지키고 있도다.`,
      `${v.loveNote[0]}. 금성이 ${v.venusSign}에 들었으니 ${v.venusTrait} 마음이 앞선다.`,
      `${v.loveAdvice}`]
  ],
  r: [
    (v) => [`원국에 ${iga(v.loveTen)} 있다. ${v.loveNote[0]}이라, 사랑을 감정보다 구조로 이해하는 사람이야.`,
      `금성이 ${v.venusSign}에 있으니 ${v.venusTrait} 쪽이다. ${v.loveNote[1]}.`,
      `${v.loveAdvice}`],
    (v) => [`${v.loveTen} 하나로 네 연애사가 거의 설명된다. ${v.loveNote[1]}.`,
      `금성 ${v.venusSign} — ${v.venusTrait} 성향. 여는 속도를 늦추고 닫는 속도를 더 늦춰라.`,
      `오래 남는 인연은 언제나 두 번째 계절에 정해진다.`],
    (v) => [`월주 ${v.monthGanji}, ${v.loveTen}. ${v.loveNote[0]}인 사람의 전형이다.`,
      `금성이 ${v.venusSign}이니 ${v.venusTrait} 방식으로 사람을 고른다.`,
      `${v.loveAdvice}`]
  ]
};

const BOND = {
  g: [
    (v) => [`${v.who}, 사람을 고르는 눈이 네 팔자의 절반이니라.`,
      `달이 ${v.moonSign}에 들었으니 ${v.moonTrait} 마음으로 정을 붙이는도다. 그 경계를 남에게 맡기지 말라.`,
      `네게 오는 인연 중 절반은 빚이요 절반은 그릇이다. 어느 쪽인지 삼 년 안에 판별할 수 있을지니.`],
    (v) => [`네 원국의 ${v.bondTen}${v.bondTenCount}자가 사람 문제를 만드느니라.`,
      `달이 ${v.moonSign}에 들었으니 ${v.moonTrait} 성정이라. 가까울수록 상처가 깊게 남는 자리다.`,
      `${v.bondAdvice}`],
    (v) => [`${v.yearGanji} 년주는 조상과 윗사람의 자리요, ${v.hourGanji} 시주는 아랫사람과 말년의 자리니라.`,
      `달 ${v.moonSign}, ${v.moonTrait} 마음이 그 사이를 오간다.`,
      `${v.bondAdvice}`]
  ],
  r: [
    (v) => [`${v.who}, 관계에서 네 문제는 사람을 못 만나는 게 아니라 정리하지 못하는 쪽이다.`,
      `달이 ${v.moonSign}에 있으니 애착의 결이 ${v.moonTrait} 쪽으로 뚜렷하다. 뚜렷한 사람일수록 아닌 관계를 오래 붙든다.`,
      `삼 년을 기준 삼아라. 삼 년 뒤에도 남아 있는 사람만 네 사람이다.`],
    (v) => [`${v.bondTen}${v.bondTenCount}자. 사람이 모이는 방식도, 흩어지는 방식도 여기서 나온다.`,
      `달 ${v.moonSign} — ${v.moonTrait} 애착. 거리를 재는 감각이 남들과 어긋난다.`,
      `${v.bondAdvice}`],
    (v) => [`년주 ${v.yearGanji}는 윗사람, 시주 ${v.hourGanji}는 아랫사람의 자리다. 네 관계 피로는 대개 한쪽에 몰려 있다.`,
      `달이 ${v.moonSign}이니 ${v.moonTrait} 방식으로 반응한다.`,
      `${v.bondAdvice}`]
  ]
};

const WEALTH = {
  g: [
    (v) => [`재물은 발보다 빠른 자에게 붙는 법이지. ${v.who}의 원국에는 ${iga(v.wealthTen)} 있으니 ${v.wealthNote[0]}이로다.`,
      `수성이 ${v.mercurySign}에, 목성이 ${v.jupiterSign}에 있으니 말과 판단으로 문을 여는 팔자다. ${v.wealthNote[1]}.`,
      `한 번의 큰 판보다 세 번의 작은 판이 네게 이롭도다. 나는 늘 그 편에 서 있느니라.`],
    (v) => [`${v.wealthTen}${v.wealthTenCount}자니라. ${v.wealthNote[1]}.`,
      `목성이 ${v.jupiterSign}에 들었으니 네 그릇이 커지는 자리는 ${v.jupiterTrait} 판이로다.`,
      `${v.wealthAdvice}`],
    (v) => [`${v.who}, 재물의 자리는 ${v.wealthNote[0]}이니라.`,
      `수성 ${v.mercurySign}. ${v.mercuryTrait} 머리로 값을 만들지니, 손보다 입과 눈이 먼저 벌어들이리라.`,
      `${v.wealthAdvice}`]
  ],
  r: [
    (v) => [`${v.who}의 원국에 ${v.wealthTen}. ${v.wealthNote[0]} 구조다.`,
      `수성 ${v.mercurySign}, 목성 ${v.jupiterSign}. 정보와 타이밍이 자산이니 자리를 옮기는 것을 손해로 여기지 마라.`,
      `크게 한 번보다 작게 세 번. 나는 늘 빠른 쪽에 붙는다.`],
    (v) => [`${v.wealthTen}${v.wealthTenCount}자. ${v.wealthNote[1]}.`,
      `목성 ${v.jupiterSign} — 그릇이 커지는 자리는 ${v.jupiterTrait} 판이다.`,
      `${v.wealthAdvice}`],
    (v) => [`돈의 성격은 ${v.wealthNote[0]}. 모으는 방식보다 옮기는 방식이 수익을 정한다.`,
      `수성 ${v.mercurySign}, ${v.mercuryTrait} 판단. 속도가 곧 마진이다.`,
      `${v.wealthAdvice}`]
  ]
};

const WARN = {
  g: [
    (v) => [`들으라. 네 팔자에서 부러질 곳은 ${iga(v.maxEl)} 과한 자리니라. ${eun(v.excessRisk)} 네 오랜 버릇이로다.`,
      `${v.marsSign}에 든 화성이 네 성질을 재촉하리라. 스스로 옳다 확신하는 순간이 곧 네가 가장 위험한 순간이로다.`,
      `이길 수 없는 싸움은 네 스스로 알아볼 것이다. 나는 거기까지 봐주지 않느니라.`],
    (v) => [`${v.warnTen}${v.warnTenCount}자가 네 발목을 잡느니라.`,
      `화성 ${v.marsSign}, ${v.marsTrait} 성질. ${eun(v.excessRisk)} 반드시 값을 치르게 되리라.`,
      `${v.warnAdvice}`],
    (v) => [`네 약점은 없는 데 있지 않다. ${iga(v.maxEl)} ${v.maxCount}자로 넘치는 자리에서 무너지느니라.`,
      `화성이 ${v.marsSign}에 들었으니 ${v.marsTrait} 방식으로 부딪히는도다.`,
      `${v.warnAdvice}`]
  ],
  r: [
    (v) => [`네 약점은 부족한 데 있지 않다. ${iga(v.maxEl)} 과한 자리에서 부러진다 — ${eun(v.excessRisk)} 오래된 습관이다.`,
      `화성이 ${v.marsSign}. 확신이 서는 순간이 네가 가장 틀리기 쉬운 순간이야.`,
      `이길 수 없는 싸움을 알아보는 것도 실력이다. 나는 그것까지 봐주지 않는다.`],
    (v) => [`${v.warnTen}${v.warnTenCount}자. 네 문제는 대부분 여기서 시작된다.`,
      `화성 ${v.marsSign} — ${v.marsTrait} 방식으로 부딪힌다. ${eun(v.excessRisk)} 값을 치를 거다.`,
      `${v.warnAdvice}`],
    (v) => [`${iga(v.maxEl)} ${v.maxCount}자. 넘치는 쪽이 늘 먼저 무너진다.`,
      `화성 ${v.marsSign}, ${v.marsTrait} 성질. 확신과 고집을 구분하지 못하면 같은 자리에서 두 번 넘어진다.`,
      `${v.warnAdvice}`]
  ]
};

const LOVE_ADVICE = [
  '한 계절을 넘긴 마음만 진심으로 세어라.',
  '먼저 말하지 않으면 아무도 네 속도를 모른다.',
  '네가 참는 것과 상대가 모르는 것은 다른 일이다.',
  '오래 남는 인연은 언제나 두 번째 계절에 정해진다.'
];
const BOND_ADVICE = [
  '삼 년 뒤에도 남아 있는 사람만 네 사람이다.',
  '거절을 배우기 전까지 네 인간관계는 늘 무겁다.',
  '먼저 떠난 사람을 붙잡지 말라. 자리는 반드시 다시 찬다.',
  '네 곁의 사람 수를 줄이면 운이 도리어 열린다.'
];
const WEALTH_ADVICE = [
  '큰 한 번보다 작은 세 번. 그것이 네 그릇의 모양이다.',
  '남의 판에 올라탈 때는 내릴 시점을 먼저 정하라.',
  '벌기 전에 새는 곳부터 막아라. 그것만으로 절반이다.',
  '네 이름값이 오르면 돈은 늦게라도 따라온다.'
];
const WARN_ADVICE = [
  '가장 자신 있는 분야에서 크게 잃는다. 거기서만 조심하라.',
  '급히 정한 것은 급히 무너진다. 하루만 미뤄라.',
  '네 편이라 믿은 자리에서 한 번 크게 흔들릴 것이다.',
  '말로 이긴 싸움이 가장 비싼 값을 남긴다.'
];

const GREETING = {
  g: (v) => `${v.who}, ${iga(v.guardian)} 너를 맡았노라. ${v.sign}의 자리에서 태어난 자여, 여기 여덟 글자와 일곱 별의 자리를 근거로 신탁을 내리노라.`,
  r: (v) => `${v.who}, 너의 수호신은 ${v.guardian}. ${v.sign}에서 태어났으니 여덟 글자와 일곱 별의 위치가 곧 네 신탁의 근거가 된다.`
};

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

export function build(data, tone) {
  const t = tone === 'refined' ? 'r' : 'g';
  const s = data.saju, n = data.natal, g = data.guardian;
  const find = (nm) => (n.find((b) => b.name === nm) || {}).sign || '—';
  const trait = (nm) => SIGN_TRAIT[find(nm)] || '가늠하기 어려운';

  const all = s.pillars.map((p) => p.stemTen).filter((x) => x !== '일간')
    .concat(s.pillars.map((p) => p.branchTen));
  const tally = {};
  all.forEach((x) => { tally[x] = (tally[x] || 0) + 1; });
  const ranked = Object.keys(tally).sort((a, b) => tally[b] - tally[a]);
  const pick = (cands) => cands.find((c) => tally[c]) || ranked[0];

  // 신강/신약: 비겁 + 인성 vs 나머지
  const support = (tally['비견'] || 0) + (tally['겁재'] || 0) + (tally['정인'] || 0) + (tally['편인'] || 0);
  const strong = support >= 4;
  const balanced = support === 3;

  const loveTen = pick(['정재', '편재', '정관', '편관', '식신', '상관', '정인', '편인']);
  const wealthTen = pick(['편재', '정재', '식신', '상관', '편관', '정관', '비견', '겁재']);
  const bondTen = pick(['비견', '겁재', '정관', '편관', '정인', '편인', '식신']);
  const warnTen = pick(['상관', '겁재', '편관', '편인', '편재', '비견']);

  // 원국 전체를 씨앗으로 삼아 골격을 고른다
  const seed = hash(s.pillars.map((p) => p.ganji).join('') + n.map((b) => b.signIndex).join(''));
  const at = (arr, salt) => arr[(seed + salt) % arr.length];

  const v = {
    who: data.name ? data.name : '이름을 감춘 자',
    dayGanji: s.pillars[2].ganji, dayKr: s.pillars[2].kr,
    yearGanji: s.pillars[0].ganji, monthGanji: s.pillars[1].ganji, hourGanji: s.pillars[3].ganji,
    iRul: jong(s.pillars[2].ganji) ? '이' : '가',
    maxEl: EL[s.maxEl], minEl: EL[s.minEl],
    maxCount: s.elements[s.maxEl], minCount: s.elements[s.minEl],
    elNote: ELEMENT_NOTE[EL[s.maxEl]],
    lackNote: LACK_NOTE[EL[s.minEl]],
    excessRisk: EXCESS_RISK[EL[s.maxEl]],
    monthTerm: s.termName, animal: s.animal,
    guardian: g.god, sign: g.sign,
    strengthWord: strong ? '신강(身强)' : balanced ? '중화(中和)' : '신약(身弱)',
    strengthNote: strong
      ? '뿌리가 굵으니 남의 힘을 빌리지 않고도 서지만, 굽히는 법을 늦게 배운다.'
      : balanced
        ? '치우침이 적으니 어느 판에서도 견디되, 스스로를 밀어붙일 계기가 늘 밖에서 온다.'
        : '뿌리가 얇으니 혼자 버티기보다 사람과 자리를 골라 기대는 편이 이롭다.',
    tenTop: ranked[0], tenTopCount: tally[ranked[0]] || 0,
    tenTopNote: (TEN_LOVE[ranked[0]] || ['', ''])[1] || '이 기운이 네 판단의 첫 자리를 차지한다.',
    loveTen, loveNote: TEN_LOVE[loveTen] || ['사랑을 제 방식으로 재는 자리', '남과 다른 속도로 움직인다'],
    wealthTen, wealthTenCount: tally[wealthTen] || 1,
    wealthNote: TEN_WEALTH[wealthTen] || ['제 재주로 버는 재물', '남과 다르게 해야 값이 붙는다'],
    bondTen, bondTenCount: tally[bondTen] || 1,
    warnTen, warnTenCount: tally[warnTen] || 1,
    sunSign: find('태양'), sunTrait: trait('태양'),
    venusSign: find('금성'), venusTrait: trait('금성'),
    moonSign: find('달'), moonTrait: trait('달'),
    mercurySign: find('수성'), mercuryTrait: trait('수성'),
    jupiterSign: find('목성'), jupiterTrait: trait('목성'),
    marsSign: find('화성'), marsTrait: trait('화성'),
    loveAdvice: at(LOVE_ADVICE, 11),
    bondAdvice: at(BOND_ADVICE, 23),
    wealthAdvice: at(WEALTH_ADVICE, 37),
    warnAdvice: at(WARN_ADVICE, 51)
  };

  const total = [at(OPEN_TOTAL[t], 3)(v), at(MID_TOTAL[t], 7)(v), at(CLOSE_TOTAL[t], 13)(v)];
  const byKey = {
    total: total,
    love: at(LOVE[t], 17)(v),
    bond: at(BOND[t], 29)(v),
    wealth: at(WEALTH[t], 41)(v),
    warn: at(WARN[t], 59)(v)
  };

  return {
    greeting: GREETING[t](v),
    sections: SECTIONS.map((sec) => ({ ...sec, paragraphs: byKey[sec.key] }))
  };
}
