/* 신들의 신탁 — 인물 판정 엔진
   축을 하나씩 읽지 않고, 축이 부딪히는 자리를 찾아 그 사람을 한 문장으로 만든다. */
import { SECTIONS } from './oracleCopy.js';

const EL = ['목', '화', '토', '금', '수'];
const GROUP = {
  '비견': '비겁', '겁재': '비겁', '식신': '식상', '상관': '식상',
  '편재': '재성', '정재': '재성', '편관': '관성', '정관': '관성',
  '편인': '인성', '정인': '인성'
};
const GROUPS = ['비겁', '식상', '재성', '관성', '인성'];

/* ---------- 원국 구조 판정 ---------- */
function structure(saju) {
  const counts = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  saju.pillars.forEach((p, i) => {
    if (i !== 2) counts[GROUP[p.stemTen]]++;
    counts[GROUP[p.branchTen]]++;
  });
  // 일간을 돕는 힘(비겁·인성)과 덜어내는 힘(식상·재성·관성)
  const support = counts['비겁'] + counts['인성'];
  const drain = counts['식상'] + counts['재성'] + counts['관성'];
  // 월지가 일간과 같은 오행이면 계절이 돕는다 — 한 표 더 준다
  const monthEl = saju.pillars[1].branchEl;
  const seasonal = monthEl === saju.dayEl ? 1 : 0;
  const score = support + seasonal;
  const strength = score >= 4 ? 'strong' : score <= 2 ? 'weak' : 'mid';
  const heavy = GROUPS.filter((g) => counts[g] >= 3);
  const empty = GROUPS.filter((g) => counts[g] === 0);
  const top = GROUPS.slice().sort((a, b) => counts[b] - counts[a])[0];
  const zeroEls = saju.elements.filter((n) => n === 0).length;
  return { counts, support, drain, seasonal, score, strength, heavy, empty, top, zeroEls };
}

/* ---------- 부딪히는 자리 ----------
   각 항목: 조건, 무게(클수록 먼저 말한다), 한 문장, 근거, 붙을 신탁 */
const PATTERNS = [
  {
    k: 'gwan-weak', w: 96, sec: 2,
    when: (s) => s.counts['관성'] >= 3 && s.strength === 'weak',
    g: '그대는 남의 몫까지 지고서 제 몫을 챙기지 못하는 사람이니라.',
    r: '남의 몫까지 지면서 정작 제 몫은 챙기지 못하는 사람이다.',
    why: (s) => `관성이 ${s.counts['관성']}자리를 차지했는데 그것을 감당할 일간은 약하다. 짐은 크고 어깨는 좁은 배치다.`,
    more: '거절하지 못해 맡은 일이 대부분이었을 것이다. 성실하다는 말을 들으면서도 정작 네 이름으로 남은 것이 적다. 이 원국에서 유일하게 유효한 처방은 능력을 더 기르는 것이 아니라, 맡지 않는 연습이다.'
  },
  {
    k: 'gwan-strong', w: 82, sec: 2,
    when: (s) => s.counts['관성'] >= 3 && s.strength === 'strong',
    g: '그대는 눌리는 자리에 들어가야 비로소 커지는 사람이니라.',
    r: '눌리는 자리에 들어가야 비로소 커지는 사람이다.',
    why: (s) => `관성이 ${s.counts['관성']}자리로 무거우나 일간이 그것을 받아낸다. 규율이 짐이 아니라 뼈가 되는 배치다.`,
    more: '자유로운 자리에 두면 오히려 흐트러졌을 것이다. 상사가 만만한 조직에서 이 사람은 반드시 지루해한다.'
  },
  {
    k: 'jae-weak', w: 94, sec: 3,
    when: (s) => s.counts['재성'] >= 3 && s.strength === 'weak',
    g: '그대는 벌어들이되 손에 남지 않는 사람이니라.',
    r: '벌어들이되 손에 남지 않는 사람이다.',
    why: (s) => `재성이 ${s.counts['재성']}자리인데 그것을 감당할 일간이 약하다. 재물이 그대를 부리는 배치다.`,
    more: '돈이 없어서가 아니라, 들어온 돈이 늘 다른 사람의 사정으로 나갔을 것이다. 이 원국에서 저축은 의지의 문제가 아니라 구조의 문제이므로, 손에 닿지 않는 곳으로 먼저 옮겨두어야 한다.'
  },
  {
    k: 'jae-strong', w: 76, sec: 3,
    when: (s) => s.counts['재성'] >= 3 && s.strength === 'strong',
    g: '그대는 판을 키우는 손을 타고났느니라.',
    r: '판을 키우는 손을 타고났다.',
    why: (s) => `재성 ${s.counts['재성']}자리를 일간이 감당한다. 벌려도 무너지지 않는 배치다.`,
    more: '남의 돈을 굴리는 자리에서 특히 강하다. 다만 커진 판을 지킬 사람을 따로 두어야 한다.'
  },
  {
    k: 'sik-weak', w: 90, sec: 1,
    when: (s) => s.counts['식상'] >= 3 && s.strength === 'weak',
    g: '그대는 말로써 스스로를 소진하는 사람이니라.',
    r: '말로써 스스로를 소진하는 사람이다.',
    why: (s) => `식상이 ${s.counts['식상']}자리로 쏟아지는데 그것을 밀어낼 일간이 약하다. 표현이 곧 소모가 되는 배치다.`,
    more: '재주가 없어서 지친 것이 아니다. 다 설명하고 다 이해시키려 한 자리에서 힘이 빠졌을 것이다. 말을 줄이면 실력이 준 것처럼 느껴지겠으나, 이 원국에서는 그것이 회복이다.'
  },
  {
    k: 'sik-strong', w: 72, sec: 1,
    when: (s) => s.counts['식상'] >= 3 && s.strength === 'strong',
    g: '그대의 입이 곧 그대의 밥이니라.',
    r: '입이 곧 밥이 되는 사람이다.',
    why: (s) => `식상 ${s.counts['식상']}자리를 일간이 받쳐준다. 말과 손재주가 값으로 바뀌는 배치다.`,
    more: '조용히 일하는 자리에 두면 반드시 시든다.'
  },
  {
    k: 'in-strong', w: 88, sec: 4,
    when: (s) => s.counts['인성'] >= 3 && s.strength !== 'weak',
    g: '그대는 준비를 마치기 전에 때가 지나가는 사람이니라.',
    r: '준비를 마치기 전에 때가 지나가는 사람이다.',
    why: (s) => `인성이 ${s.counts['인성']}자리로 두터운데 일간도 약하지 않다. 배움이 힘이 되다 못해 발을 붙드는 배치다.`,
    more: '자격과 공부가 부족했던 적은 없었을 것이다. 부족했던 것은 덜 준비된 상태로 나선 경험이다.'
  },
  {
    k: 'in-weak', w: 80, sec: 4,
    when: (s) => s.counts['인성'] >= 3 && s.strength === 'weak',
    g: '그대는 누군가 등을 밀어주어야 움직이는 사람이니라.',
    r: '누군가 등을 밀어주어야 움직이는 사람이다.',
    why: (s) => `인성 ${s.counts['인성']}자리가 일간을 감싸지만 일간 자체가 약하다. 보호가 많아 홀로 서본 적이 드문 배치다.`,
    more: '기대는 것이 흠은 아니나, 밀어줄 사람이 사라지는 구간이 반드시 온다.'
  },
  {
    k: 'bi-strong', w: 86, sec: 2,
    when: (s) => s.counts['비겁'] >= 3 && s.strength === 'strong',
    g: '그대는 혼자 다 하려 하다 남에게 뺏기는 사람이니라.',
    r: '혼자 다 하려 하다 남에게 뺏기는 사람이다.',
    why: (s) => `비겁이 ${s.counts['비겁']}자리로 겹쳤고 일간도 강하다. 같은 힘이 여럿이라 나눌 것을 두고 다투는 배치다.`,
    more: '실력으로 진 적은 드물었을 것이다. 대신 몫을 정하지 않고 시작한 자리에서 잃었다.'
  },
  {
    k: 'bi-weak', w: 74, sec: 2,
    when: (s) => s.counts['비겁'] >= 3 && s.strength === 'weak',
    g: '그대는 무리 안에서만 제 힘이 나는 사람이니라.',
    r: '무리 안에서만 제 힘이 나는 사람이다.',
    why: (s) => `비겁 ${s.counts['비겁']}자리가 일간을 대신한다. 혼자 세우기보다 같이 서는 배치다.`,
    more: '독립은 이 원국의 미덕이 아니다. 좋은 편에 서는 것이 실력이다.'
  },
  {
    k: 'sang-gyeon-gwan', w: 98, sec: 2,
    when: (s) => s.counts['식상'] >= 2 && s.counts['관성'] >= 2,
    g: '그대는 규율을 지키면서 동시에 그 규율을 비웃는 사람이니라.',
    r: '규율을 지키면서 동시에 그 규율을 비웃는 사람이다.',
    why: (s) => `식상 ${s.counts['식상']}자리와 관성 ${s.counts['관성']}자리가 한 원국에 함께 섰다. 상관이 관을 보는 배치다.`,
    more: '조직에 남으면서도 그 조직을 못마땅해했을 것이다. 나가면 자유롭지만 초라해지고, 남으면 안전하지만 계속 상한다. 이 원국의 사람은 대개 남는 쪽을 고르고, 대신 말로 대가를 치른다.'
  },
  {
    k: 'jae-in', w: 92, sec: 3,
    when: (s) => s.counts['재성'] >= 2 && s.counts['인성'] >= 2,
    g: '그대는 배우려 하면 돈이 급해지고, 벌려 하면 배움이 아쉬워지는 사람이니라.',
    r: '배우려 하면 돈이 급해지고, 벌려 하면 배움이 아쉬워지는 사람이다.',
    why: (s) => `재성 ${s.counts['재성']}자리와 인성 ${s.counts['인성']}자리가 서로를 깎는다. 재가 인을 부수는 배치다.`,
    more: '학업과 생계를 동시에 붙든 시기가 있었을 것이다. 둘을 한 해에 다 세우려 하면 매번 둘 다 놓친다.'
  },
  {
    k: 'no-gwan-strong', w: 84, sec: 2,
    when: (s) => s.counts['관성'] === 0 && s.strength === 'strong',
    g: '그대는 누구의 아래에서도 오래 버티지 못하는 사람이니라.',
    r: '누구의 아래에서도 오래 버티지 못하는 사람이다.',
    why: () => '원국에 관성이 한 자리도 없고 일간은 강하다. 그대를 누를 것이 팔자 안에 없는 배치다.',
    more: '참을성이 부족한 것이 아니라 눌릴 자리가 애초에 없다. 조직에서는 대개 두 해를 넘기지 못했을 것이다.'
  },
  {
    k: 'no-jae', w: 70, sec: 3,
    when: (s) => s.counts['재성'] === 0,
    g: '그대는 돈에 무심한 것이 아니라, 돈을 아예 보지 않는 사람이니라.',
    r: '돈에 무심한 것이 아니라 돈을 아예 보지 않는 사람이다.',
    why: () => '원국에 재성이 한 자리도 없다. 재물을 잡는 손이 팔자에 그려지지 않은 배치다.',
    more: '가난하다는 뜻이 아니다. 값을 매기는 일을 남에게 맡겨왔다는 뜻이다.'
  },
  {
    k: 'no-sik', w: 68, sec: 1,
    when: (s) => s.counts['식상'] === 0,
    g: '그대는 느끼는 것과 말하는 것 사이가 먼 사람이니라.',
    r: '느끼는 것과 말하는 것 사이가 먼 사람이다.',
    why: () => '원국에 식상이 한 자리도 없다. 안에서 밖으로 내보내는 통로가 좁은 배치다.',
    more: '무정해서가 아니다. 말이 되어 나오기까지 시간이 오래 걸릴 뿐인데, 사람들은 그 사이를 무심으로 읽는다.'
  },
  {
    k: 'no-in', w: 66, sec: 4,
    when: (s) => s.counts['인성'] === 0,
    g: '그대는 배우기 전에 몸으로 부딪혀 아는 사람이니라.',
    r: '배우기 전에 몸으로 부딪혀 아는 사람이다.',
    why: () => '원국에 인성이 한 자리도 없다. 기대고 배울 자리가 팔자에 없는 배치다.',
    more: '남이 십 년에 배운 것을 삼 년에 익혔을 것이다. 대신 다치면서 익혔다.'
  },
  {
    k: 'no-bi', w: 64, sec: 2,
    when: (s) => s.counts['비겁'] === 0,
    g: '그대는 곁에 같은 사람이 없이 살아온 사람이니라.',
    r: '곁에 같은 사람이 없이 살아온 사람이다.',
    why: () => '원국에 비겁이 한 자리도 없다. 어깨를 나란히 할 자가 팔자에 없는 배치다.',
    more: '외로웠다기보다, 의논할 상대를 찾는 습관 자체가 없었을 것이다.'
  },
  {
    k: 'skew', w: 78, sec: 0,
    when: (s) => s.zeroEls >= 2,
    g: '그대의 팔자는 고르지 않고 한쪽으로 쏠렸느니라.',
    r: '팔자가 고르지 않고 한쪽으로 쏠려 있다.',
    why: (s, saju) => `오행 다섯 중 ${s.zeroEls}가지가 한 자리도 없다. ${EL[saju.maxEl]}만 두텁다.`,
    more: '고르지 않은 팔자는 평범하게 살기 어렵고, 대신 한 가지로는 멀리 간다. 빈 기운을 채우려 애쓰기보다 쏠린 쪽을 끝까지 미는 편이 이 원국에는 맞다.'
  },
  {
    k: 'even', w: 60, sec: 0,
    when: (s) => s.zeroEls === 0 && s.heavy.length === 0,
    g: '그대의 팔자는 어느 쪽으로도 기울지 않았느니라.',
    r: '팔자가 어느 쪽으로도 기울지 않았다.',
    why: () => '오행이 모두 자리를 가졌고 어느 십신도 셋을 넘지 않는다. 무너질 자리도 없고 튀어나올 자리도 없는 배치다.',
    more: '재미없는 팔자라 하겠으나, 이 원국은 어느 시대에 놓아도 죽지 않는다. 다만 무엇이 되겠다는 결정을 팔자가 대신 해주지 않으므로, 스스로 정해야 한다.'
  },
  {
    k: 'lean-gwan', w: 54, sec: 2,
    when: (s) => s.top === '관성' && s.counts['관성'] >= 2,
    g: '그대는 정해진 자리가 없으면 오히려 부서지는 사람이니라.',
    r: '정해진 자리가 없으면 오히려 부서지는 사람이다.',
    why: (s) => `여덟 글자 중 관성이 ${s.counts['관성']}자리로 가장 많다. 지킬 것이 먼저 정해지는 배치다.`,
    more: '재량을 주면 처음엔 반가워하다 이내 풀어지는 기질이다. 마감이 없는 일에서 가장 게을러졌을 것이다.'
  },
  {
    k: 'lean-jae', w: 54, sec: 3,
    when: (s) => s.top === '재성' && s.counts['재성'] >= 2,
    g: '그대는 사람을 볼 때도 쓸모를 먼저 보는 사람이니라.',
    r: '사람을 볼 때도 쓸모를 먼저 보는 사람이다.',
    why: (s) => `여덟 글자 중 재성이 ${s.counts['재성']}자리로 가장 많다. 값을 먼저 잡는 배치다.`,
    more: '손해를 보는 일은 드무나, 계산이 보이는 것을 상대도 금방 느낀다.'
  },
  {
    k: 'lean-sik', w: 54, sec: 1,
    when: (s) => s.top === '식상' && s.counts['식상'] >= 2,
    g: '그대는 참았어야 할 말을 결국 하고 마는 사람이니라.',
    r: '참았어야 할 말을 결국 하고 마는 사람이다.',
    why: (s) => `여덟 글자 중 식상이 ${s.counts['식상']}자리로 가장 많다. 안에서 밖으로 미는 힘이 센 배치다.`,
    more: '그 말이 틀렸던 적은 드물다. 다만 그 자리에서 할 말은 아니었을 것이다.'
  },
  {
    k: 'lean-in', w: 54, sec: 4,
    when: (s) => s.top === '인성' && s.counts['인성'] >= 2,
    g: '그대는 다 이해하고서 정작 움직이지 않는 사람이니라.',
    r: '다 이해하고서 정작 움직이지 않는 사람이다.',
    why: (s) => `여덟 글자 중 인성이 ${s.counts['인성']}자리로 가장 많다. 들이기 전에 먼저 알아보는 배치다.`,
    more: '상황을 정확하게 읽었는데도 뒤진 사람이 있었을 것이다. 이해가 행동을 대신하지는 않는다.'
  },
  {
    k: 'lean-bi', w: 54, sec: 2,
    when: (s) => s.top === '비겁' && s.counts['비겁'] >= 2,
    g: '그대는 도움을 받는 일을 지는 일로 여기는 사람이니라.',
    r: '도움을 받는 일을 지는 일로 여기는 사람이다.',
    why: (s) => `여덟 글자 중 비겁이 ${s.counts['비겁']}자리로 가장 많다. 같은 힘이 여럿인 배치다.`,
    more: '혼자 해낼 수 있었기에 혼자 해왔고, 그러면서 자기 몸을 가장 막 썼다.'
  }
];

// 신탁 다섯 항목의 이름은 oracle-copy.js의 SECTIONS가 유일한 출처다.
function secName(i) {
  return SECTIONS[i] ? SECTIONS[i].label : '';
}

/* ---------- 지나온 자리 (대운 경계) ---------- */
function pastMarkers(du, birthYear, tone) {
  if (!du || du.pending) return [];
  const out = [];
  for (let i = 1; i <= du.index - 1; i++) {
    const age = Math.floor(du.startAge + (i - 1) * 10);
    if (age < 18) continue;
    out.push({ age, year: birthYear + age });
  }
  return out.slice(-3).map((m) => ({
    age: m.age, year: m.year,
    note: tone === 'refined'
      ? `${m.age}세 무렵, 있던 자리에서 한 번 밀려났거나 스스로 판을 옮겼다.`
      : `${m.age}세 무렵, 있던 자리에서 밀려났거나 스스로 판을 옮겼을 것이니라.`
  }));
}

export function read(saju, natal, daeun, birthYear, tone) {
  const t = tone === 'refined' ? 'r' : 'g';
  const s = structure(saju);
  const hits = PATTERNS
    .filter((p) => { try { return p.when(s, saju); } catch (e) { return false; } })
    .sort((a, b) => b.w - a.w);
  const top = hits[0];
  const rest = hits.slice(1, 3);

  const strengthLabel = s.strength === 'strong' ? '신강' : s.strength === 'weak' ? '신약' : '중화';
  const strengthNote = s.strength === 'strong'
    ? `타고난 기운이 굳세어 홀로 서는 편 · 돕는 자리 ${s.score}, 덜어내는 자리 ${s.drain}`
    : s.strength === 'weak'
      ? `타고난 기운이 약해 사람·환경에 기대는 편 · 돕는 자리 ${s.score}, 덜어내는 자리 ${s.drain}`
      : `어느 쪽으로도 치우치지 않아 두루 견디는 편 · 돕는 자리 ${s.score}, 덜어내는 자리 ${s.drain}`;

  return {
    headline: top ? top[t] : '',
    headlineWhy: top ? top.why(s, saju) : '',
    headlineMore: top ? top.more : '',
    headlineSection: top ? secName(top.sec) : '',
    collisions: rest.map((p) => ({
      line: p[t], why: p.why(s, saju), section: secName(p.sec)
    })),
    strengthLabel, strengthNote,
    groups: GROUPS.map((g) => ({
      name: g, count: s.counts[g],
      width: Math.round((s.counts[g] / 7) * 100) + '%',
      heavy: s.counts[g] >= 3, empty: s.counts[g] === 0
    })),
    past: pastMarkers(daeun, birthYear, tone),
    hitCount: hits.length
  };
}
