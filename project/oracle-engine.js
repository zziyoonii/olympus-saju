/* 신들의 신탁 — 계산 엔진
   사주팔자(60갑자·절기·오호둔·오서둔·십신·오행) + 네이털 차트(저정밀 궤도요소)
   window.OracleEngine 로 노출 */
(function () {
  const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const BRANCH_ANIMAL = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

  // 오행: 0목 1화 2토 3금 4수
  const EL = ['목', '화', '토', '금', '수'];
  const EL_HANJA = ['木', '火', '土', '金', '水'];
  const STEM_EL = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
  const STEM_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 0 양 1 음
  const BRANCH_EL = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
  const BRANCH_YIN = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

  // 절기 근사 경계 (월지 전환일). 인월=입춘부터.
  const TERMS = [
    [1, 6], [2, 4], [3, 6], [4, 5], [5, 6], [6, 6],
    [7, 7], [8, 8], [9, 8], [10, 8], [11, 7], [12, 7]
  ];
  const TERM_NAMES = ['소한', '입춘', '경칩', '청명', '입하', '망종', '소서', '입추', '백로', '한로', '입동', '대설'];

  function jdn(y, m, d) {
    const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }
  const rad = Math.PI / 180;
  const rev = (x) => ((x % 360) + 360) % 360;
  const sind = (x) => Math.sin(x * rad), cosd = (x) => Math.cos(x * rad);

  /* ---------- 진태양시 보정 ---------- */
  function equationOfTime(y, m, d) {
    const n = jdn(y, m, d) - jdn(y, 1, 1) + 1;
    const B = 360 * (n - 81) / 364;
    return 9.87 * sind(2 * B) - 7.53 * cosd(B) - 1.5 * sind(B); // minutes
  }
  function trueSolarOffsetMin(y, m, d, lon) {
    return (lon - 135) * 4 + equationOfTime(y, m, d);
  }

  /* ---------- 사주팔자 ---------- */
  function termBoundary(y, idx) { const t = TERMS[idx]; return { m: t[0], d: t[1] }; }

  function saju(y, m, d, hh, mm, opts) {
    opts = opts || {};
    // 진태양시 보정 → 실질 시각
    let minutes = hh * 60 + mm;
    if (opts.trueSolar) minutes += trueSolarOffsetMin(y, m, d, opts.lon || 126.978);
    let dy = y, dm = m, dd = d;
    if (minutes < 0) { minutes += 1440; const t = new Date(Date.UTC(y, m - 1, d - 1)); dy = t.getUTCFullYear(); dm = t.getUTCMonth() + 1; dd = t.getUTCDate(); }
    if (minutes >= 1440) { minutes -= 1440; const t = new Date(Date.UTC(y, m - 1, d + 1)); dy = t.getUTCFullYear(); dm = t.getUTCMonth() + 1; dd = t.getUTCDate(); }
    const H = Math.floor(minutes / 60), MI = Math.round(minutes % 60);

    // 년주: 입춘 기준
    const ipchun = termBoundary(dy, 1);
    let sajuYear = dy;
    if (dm < ipchun.m || (dm === ipchun.m && dd < ipchun.d)) sajuYear = dy - 1;
    const yStem = rev(sajuYear - 4) % 10;
    const yBranch = ((sajuYear - 4) % 12 + 12) % 12;

    // 월지: 절기 경계로 판정 (인월 index 2)
    let mi = 0;
    for (let i = 0; i < 12; i++) {
      const b = TERMS[i];
      const after = dm > b[0] || (dm === b[0] && dd >= b[1]);
      if (after) mi = i;
    }
    // 1월 초(소한 이전)는 전년 대설
    if (dm === 1 && dd < TERMS[0][1]) mi = 11;
    const monthBranchOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // 소한→축, 입춘→인 ...
    const mBranch = monthBranchOrder[mi];
    // 오호둔: 년간 → 인월의 천간
    const inMonthStem = [2, 4, 6, 8, 0][yStem % 5];
    const offsetFromIn = ((mBranch - 2) % 12 + 12) % 12;
    const mStem = (inMonthStem + offsetFromIn) % 10;

    // 일주: JDN 기반
    const J = jdn(dy, dm, dd);
    const dStem = (J + 9) % 10;
    const dBranch = (J + 1) % 12;

    // 시주: 자시 23:00~00:59 (야자시는 일주 미변경 관행 대신 표준 처리)
    const hBranch = Math.floor(((H * 60 + MI + 60) % 1440) / 120);
    const ziStem = [0, 2, 4, 6, 8][dStem % 5]; // 오서둔
    const hStem = (ziStem + hBranch) % 10;

    const pillars = [
      { key: '년주', stem: yStem, branch: yBranch },
      { key: '월주', stem: mStem, branch: mBranch },
      { key: '일주', stem: dStem, branch: dBranch },
      { key: '시주', stem: hStem, branch: hBranch }
    ].map((p) => ({
      ...p,
      ganji: STEMS[p.stem] + BRANCHES[p.branch],
      kr: STEMS_KR[p.stem] + BRANCHES_KR[p.branch],
      stemHanja: STEMS[p.stem], branchHanja: BRANCHES[p.branch],
      stemKr: STEMS_KR[p.stem], branchKr: BRANCHES_KR[p.branch],
      stemEl: STEM_EL[p.stem], branchEl: BRANCH_EL[p.branch]
    }));

    // 오행 분포
    const elements = [0, 0, 0, 0, 0];
    pillars.forEach((p) => { elements[p.stemEl]++; elements[p.branchEl]++; });

    // 십신
    const dayStem = dStem;
    pillars.forEach((p, i) => {
      p.stemTen = i === 2 ? '일간' : tenGod(dayStem, STEM_EL[p.stem], STEM_YIN[p.stem]);
      p.branchTen = tenGod(dayStem, BRANCH_EL[p.branch], BRANCH_YIN[p.branch]);
    });

    const maxEl = elements.indexOf(Math.max(...elements));
    const minEl = elements.indexOf(Math.min(...elements));

    return {
      pillars, elements, maxEl, minEl,
      dayStem, dayStemKr: STEMS_KR[dStem], dayStemHanja: STEMS[dStem],
      dayEl: STEM_EL[dStem], dayYin: STEM_YIN[dStem],
      sajuYear, termName: TERM_NAMES[mi],
      animal: BRANCH_ANIMAL[yBranch],
      hourLabel: pad(H) + ':' + pad(MI),
      correctionMin: opts.trueSolar ? Math.round(trueSolarOffsetMin(y, m, d, opts.lon || 126.978)) : 0
    };
  }

  function tenGod(dayStem, el, yin) {
    const dEl = STEM_EL[dayStem], dYin = STEM_YIN[dayStem];
    const same = dYin === yin;
    if (el === dEl) return same ? '비견' : '겁재';
    if ((dEl + 1) % 5 === el) return same ? '식신' : '상관';       // 내가 생하는 것
    if ((dEl + 2) % 5 === el) return same ? '편재' : '정재';       // 내가 극하는 것
    if ((dEl + 3) % 5 === el) return same ? '편관' : '정관';       // 나를 극하는 것
    return same ? '편인' : '정인';                                  // 나를 생하는 것
  }
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- 네이털 차트 ---------- */
  const SIGNS = ['양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리', '물고기자리'];
  const SIGN_GLYPH = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  const ORB = {
    Mercury: [48.3313, 3.24587e-5, 7.0047, 5.00e-8, 29.1241, 1.01444e-5, 0.387098, 0, 0.205635, 5.59e-10, 168.6562, 4.0923344368],
    Venus: [76.6799, 2.46590e-5, 3.3946, 2.75e-8, 54.8910, 1.38374e-5, 0.723330, 0, 0.006773, -1.302e-9, 48.0052, 1.6021302244],
    Mars: [49.5574, 2.11081e-5, 1.8497, -1.78e-8, 286.5016, 2.92961e-5, 1.523688, 0, 0.093405, 2.516e-9, 18.6021, 0.5240207766],
    Jupiter: [100.4542, 2.76854e-5, 1.3030, -1.557e-7, 273.8777, 1.64505e-5, 5.20256, 0, 0.048498, 4.469e-9, 19.8950, 0.0830853001],
    Saturn: [113.6634, 2.38980e-5, 2.4886, -1.081e-7, 339.3939, 2.97661e-5, 9.55475, 0, 0.055546, -9.499e-9, 316.9670, 0.0334442282]
  };

  function eccAnom(M, e) {
    let E = M + (180 / Math.PI) * e * sind(M) * (1 + e * cosd(M));
    for (let i = 0; i < 6; i++) {
      const dE = (E - (180 / Math.PI) * e * sind(E) - M) / (1 - e * cosd(E));
      E -= dE;
      if (Math.abs(dE) < 1e-8) break;
    }
    return E;
  }

  function sunPos(d) {
    const w = 282.9404 + 4.70935e-5 * d;
    const e = 0.016709 - 1.151e-9 * d;
    const M = rev(356.0470 + 0.9856002585 * d);
    const E = eccAnom(M, e);
    const xv = cosd(E) - e, yv = Math.sqrt(1 - e * e) * sind(E);
    const v = rev(Math.atan2(yv, xv) / rad), r = Math.sqrt(xv * xv + yv * yv);
    return { lon: rev(v + w), r };
  }

  function planetPos(name, d) {
    const o = ORB[name];
    const N = rev(o[0] + o[1] * d), i = o[2] + o[3] * d, w = rev(o[4] + o[5] * d);
    const a = o[6], e = o[8] + o[9] * d, M = rev(o[10] + o[11] * d);
    const E = eccAnom(M, e);
    const xv = a * (cosd(E) - e), yv = a * Math.sqrt(1 - e * e) * sind(E);
    const v = rev(Math.atan2(yv, xv) / rad), r = Math.sqrt(xv * xv + yv * yv);
    const x = r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i));
    const y = r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i));
    const z = r * sind(v + w) * sind(i);
    const s = sunPos(d);
    const xs = s.r * cosd(s.lon), ys = s.r * sind(s.lon);
    return rev(Math.atan2(y + ys, x + xs) / rad);
  }

  function moonPos(d) {
    const N = rev(125.1228 - 0.0529538083 * d), i = 5.1454;
    const w = rev(318.0634 + 0.1643573223 * d), a = 60.2666, e = 0.054900;
    const M = rev(115.3654 + 13.0649929509 * d);
    const E = eccAnom(M, e);
    const xv = a * (cosd(E) - e), yv = a * Math.sqrt(1 - e * e) * sind(E);
    const v = rev(Math.atan2(yv, xv) / rad), r = Math.sqrt(xv * xv + yv * yv);
    let x = r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i));
    let y = r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i));
    let lon = rev(Math.atan2(y, x) / rad);
    // 주요 섭동 보정
    const s = sunPos(d);
    const Ms = rev(356.0470 + 0.9856002585 * d), Ls = rev(s.lon);
    const Lm = rev(N + w + M), D = rev(Lm - Ls), F = rev(Lm - N);
    lon += -1.274 * sind(M - 2 * D) + 0.658 * sind(2 * D) - 0.186 * sind(Ms)
      - 0.059 * sind(2 * M - 2 * D) - 0.057 * sind(M - 2 * D + Ms)
      + 0.053 * sind(M + 2 * D) + 0.046 * sind(2 * D - Ms)
      + 0.041 * sind(M - Ms) - 0.035 * sind(D) - 0.031 * sind(M + Ms)
      - 0.015 * sind(2 * F - 2 * D) + 0.011 * sind(M - 4 * D);
    return rev(lon);
  }

  function natal(y, m, d, hh, mm) {
    const ut = hh + mm / 60 - 9; // KST → UT
    const dd = jdn(y, m, d) - 2451543.5 + ut / 24;
    const bodies = [
      { name: '태양', god: '아폴론', lon: sunPos(dd).lon },
      { name: '달', god: '아르테미스', lon: moonPos(dd) },
      { name: '수성', god: '헤르메스', lon: planetPos('Mercury', dd) },
      { name: '금성', god: '아프로디테', lon: planetPos('Venus', dd) },
      { name: '화성', god: '아레스', lon: planetPos('Mars', dd) },
      { name: '목성', god: '제우스', lon: planetPos('Jupiter', dd) },
      { name: '토성', god: '크로노스', lon: planetPos('Saturn', dd) }
    ];
    return bodies.map((b) => {
      const si = Math.floor(b.lon / 30) % 12;
      const deg = b.lon - si * 30;
      return {
        ...b, sign: SIGNS[si], glyph: SIGN_GLYPH[si], signIndex: si,
        deg: deg.toFixed(1), lonStr: b.lon.toFixed(2)
      };
    });
  }

  /* ---------- 12신 로스터 / 수호신 ---------- */
  const ROSTER = [
    { sign: '양자리', god: '아레스', symbol: '검', color: '#C2334D', from: [3, 21], to: [4, 19] },
    { sign: '황소자리', god: '아프로디테', symbol: '조개', color: '#D98CA0', from: [4, 20], to: [5, 20] },
    { sign: '쌍둥이자리', god: '헤르메스', symbol: '카두케우스', color: '#7FC6C0', from: [5, 21], to: [6, 21] },
    { sign: '게자리', god: '아르테미스', symbol: '초승달과 화살', color: '#9FB6D8', from: [6, 22], to: [7, 22] },
    { sign: '사자자리', god: '아폴론', symbol: '태양', color: '#E0B44A', from: [7, 23], to: [8, 22] },
    { sign: '처녀자리', god: '데메테르', symbol: '밀 이삭', color: '#B9A05A', from: [8, 23], to: [9, 22] },
    { sign: '천칭자리', god: '헤라', symbol: '왕관과 공작', color: '#9C7BC4', from: [9, 23], to: [10, 22] },
    { sign: '전갈자리', god: '헤파이스토스', symbol: '망치', color: '#C8763C', from: [10, 23], to: [11, 22] },
    { sign: '사수자리', god: '제우스', symbol: '번개', color: '#C9A227', from: [11, 23], to: [12, 21] },
    { sign: '염소자리', god: '포세이돈', symbol: '삼지창', color: '#4A79B8', from: [12, 22], to: [1, 19] },
    { sign: '물병자리', god: '아테나', symbol: '부엉이', color: '#8FA8B8', from: [1, 20], to: [2, 18] },
    { sign: '물고기자리', god: '디오니소스', symbol: '포도송이', color: '#8E5C8C', from: [2, 19], to: [3, 20] }
  ];

  const PAIRS = {
    '제우스': ['헤라', '부부의 연', '가장 높은 자리에 함께 앉은 두 신. 다스리는 힘과 지키는 힘이 한 지붕 아래 있다.'],
    '헤라': ['제우스', '부부의 연', '왕좌를 나눈 관계. 서로를 가장 잘 알고, 그래서 서로에게 가장 엄하다.'],
    '아프로디테': ['아레스', '연인의 연', '가장 아름다운 신과 가장 거친 신. 어울리지 않아 보이나 서로만이 서로를 견딘다.'],
    '아레스': ['아프로디테', '연인의 연', '전장의 신이 무장을 내려놓는 단 하나의 자리.'],
    '포세이돈': ['데메테르', '바다와 대지', '물과 흙. 하나가 넘치면 하나가 무너지고, 균형이 맞으면 만물이 자란다.'],
    '데메테르': ['포세이돈', '대지와 바다', '거둠과 밀려옴. 계절을 함께 지배하는 두 힘.'],
    '아폴론': ['아테나', '이성과 통찰', '빛으로 보는 자와 지혜로 아는 자. 논쟁이 곧 우정이 되는 사이.'],
    '아테나': ['아폴론', '통찰과 이성', '창을 든 지혜와 활을 든 빛. 서로의 판단을 신뢰한다.'],
    '아르테미스': ['헤르메스', '자유로운 영혼', '숲을 달리는 자와 경계를 넘는 자. 누구도 서로를 붙잡지 않는다.'],
    '헤르메스': ['아르테미스', '자유로운 영혼', '길의 신과 사냥의 신. 머무르지 않는 것이 둘의 약속이다.'],
    '헤파이스토스': ['디오니소스', '정반대의 보완', '불로 벼르는 손과 취해 노래하는 입. 노동과 도취가 서로를 살린다.'],
    '디오니소스': ['헤파이스토스', '정반대의 보완', '도취와 단련. 한쪽이 없으면 다른 쪽은 곧 부서진다.']
  };

  function guardian(m, d) {
    for (const r of ROSTER) {
      const [fm, fd] = r.from, [tm, td] = r.to;
      if (fm <= tm) { if ((m === fm && d >= fd) || (m === tm && d <= td) || (m > fm && m < tm)) return r; }
      else { if ((m === fm && d >= fd) || (m === tm && d <= td) || m > fm || m < tm) return r; }
    }
    return ROSTER[0];
  }

  window.OracleEngine = {
    STEMS, STEMS_KR, BRANCHES, BRANCHES_KR, EL, EL_HANJA, SIGNS, SIGN_GLYPH,
    ROSTER, PAIRS, saju, natal, guardian, trueSolarOffsetMin
  };
})();
