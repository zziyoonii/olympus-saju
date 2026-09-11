import React, { useState, useEffect, useRef, useMemo } from "react";
import { Flame, Sparkles, RotateCcw, Copy, Check, Lock } from "lucide-react";

const GODS = {
  apollo:      { key: "apollo", name: "아폴론", latin: "APOLLO", epithet: "빛과 예언의 신", accent: "#C9A227",
       personality: "태양처럼 빛나고 진실을 꿰뚫어 보는, 예술과 예언을 관장하는 신. 우아하고 확신에 차 있으나 때로 냉정하다." },
  artemis:     { key: "artemis", name: "아르테미스", latin: "ARTEMIS", epithet: "사냥과 달의 여신", accent: "#7C93A6",
       personality: "홀로 숲을 누비는 냉철하고 독립적인 여신. 군더더기 없이 정확하며, 나약함을 경계한다." },
  aphrodite:   { key: "aphrodite", name: "아프로디테", latin: "APHRODITE", epithet: "사랑과 미의 여신", accent: "#B85C6B",
       personality: "바다 거품에서 태어난 매혹적인 사랑의 여신. 낭만적이고 관능적이며 인간의 마음을 꿰뚫어 본다." },
  hermes:      { key: "hermes", name: "헤르메스", latin: "HERMES", epithet: "전령과 여행의 신", accent: "#5C7C6F",
       personality: "날개 달린 신발을 신은 재치 있고 기민한 전령의 신. 장난스럽지만 핵심을 정확히 찌르며, 기회와 거래를 관장한다." },
  demeter:     { key: "demeter", name: "데메테르", latin: "DEMETER", epithet: "대지와 풍요의 여신", accent: "#A88B3F",
       personality: "곡식을 자라게 하는 대지의 어머니. 자애롭고 인내심 깊으나, 소중한 것을 잃으면 세상을 얼어붙게 한다." },
  hera:        { key: "hera", name: "헤라", latin: "HERA", epithet: "결혼과 가정의 여신", accent: "#5A4770",
       personality: "올림포스의 여왕이자 결속과 맹세를 관장하는 여신. 위엄 있고 단호하며, 관계의 충실함과 책임을 준엄하게 묻는다." },
  zeus:        { key: "zeus", name: "제우스", latin: "ZEUS", epithet: "신들의 왕, 하늘과 번개의 신", accent: "#C9A227",
       personality: "올림포스를 다스리는 신들의 왕. 근엄하고 압도적인 권위를 지녔으나, 마음에 든 인간에게는 파격적인 축복을 내린다." },
  hephaestus:  { key: "hephaestus", name: "헤파이스토스", latin: "HEPHAESTUS", epithet: "불과 대장간의 신", accent: "#8C4A2F",
       personality: "묵묵히 망치를 두드리는 장인의 신. 화려한 말보다 결과로 증명하며, 우직하고 근면하다." },
  athena:      { key: "athena", name: "아테나", latin: "ATHENA", epithet: "지혜와 전략의 여신", accent: "#6E7B6B",
       personality: "제우스의 머리에서 태어난 전략과 지혜의 여신. 냉철하고 논리적이며, 감정보다 판단을 앞세운다." },
  dionysus:    { key: "dionysus", name: "디오니소스", latin: "DIONYSUS", epithet: "포도주와 축제의 신", accent: "#6B1F2A",
       personality: "광기와 도취, 해방을 다스리는 신. 자유분방하고 즉흥적이며, 규칙을 비웃는다." },
  ares:        { key: "ares", name: "아레스", latin: "ARES", epithet: "전쟁의 신", accent: "#8C2F2F",
       personality: "피와 함성 속에서 살아 숨쉬는 전쟁의 신. 격렬하고 대담하며, 망설임과 나약함을 가장 경멸한다." },
  poseidon:    { key: "poseidon", name: "포세이돈", latin: "POSEIDON", epithet: "바다와 폭풍의 신", accent: "#1F4B5C",
       personality: "삼지창으로 파도를 부리는 바다의 지배자. 변덕스럽고 강력하며, 깊은 곳의 비밀을 안다." },
  cronus:      { key: "cronus", name: "크로노스", latin: "CRONUS", epithet: "시간과 농경의 티탄", accent: "#4A4136",
       personality: "낫으로 시간을 거두는 태초의 티탄. 무겁고 냉엄하며, 한계와 인내를 관장한다." },
};

// 신화적 관계·상반 기질에 근거한 궁합 매칭 (6쌍, 상호 대칭)
const COMPATIBILITY_MAP = {
  zeus: "hera", hera: "zeus",
  poseidon: "demeter", demeter: "poseidon",
  aphrodite: "ares", ares: "aphrodite",
  apollo: "athena", athena: "apollo",
  artemis: "hermes", hermes: "artemis",
  hephaestus: "dionysus", dionysus: "hephaestus",
};
const COMPATIBILITY_REASON = {
  zeus: "하늘의 권위와 가정의 결속이 만나 왕국을 완성하는 조합",
  hera: "하늘의 권위와 가정의 결속이 만나 왕국을 완성하는 조합",
  poseidon: "바다의 변화와 대지의 풍요가 만나 생명을 키우는 조합",
  demeter: "바다의 변화와 대지의 풍요가 만나 생명을 키우는 조합",
  aphrodite: "신화 속 가장 유명한 연인 — 사랑과 열정이 서로를 끌어당기는 조합",
  ares: "신화 속 가장 유명한 연인 — 사랑과 열정이 서로를 끌어당기는 조합",
  apollo: "이성의 빛과 냉철한 통찰이 만나 서로를 더 선명하게 하는 조합",
  athena: "이성의 빛과 냉철한 통찰이 만나 서로를 더 선명하게 하는 조합",
  artemis: "매이지 않는 두 자유로운 영혼이 서로의 속도를 존중하는 조합",
  hermes: "매이지 않는 두 자유로운 영혼이 서로의 속도를 존중하는 조합",
  hephaestus: "우직한 장인과 자유분방한 축제의 신 — 정반대라서 완성되는 조합",
  dionysus: "우직한 장인과 자유분방한 축제의 신 — 정반대라서 완성되는 조합",
};

const ZODIAC = [
  { name: "양자리",   from: [3, 21], to: [4, 19],  god: GODS.ares },
  { name: "황소자리", from: [4, 20], to: [5, 20],  god: GODS.aphrodite },
  { name: "쌍둥이자리", from: [5, 21], to: [6, 20], god: GODS.hermes },
  { name: "게자리",   from: [6, 21], to: [7, 22],  god: GODS.artemis },
  { name: "사자자리", from: [7, 23], to: [8, 22],  god: GODS.apollo },
  { name: "처녀자리", from: [8, 23], to: [9, 22],  god: GODS.demeter },
  { name: "천칭자리", from: [9, 23], to: [10, 22], god: GODS.hera },
  { name: "전갈자리", from: [10, 23], to: [11, 21], god: GODS.hephaestus },
  { name: "사수자리", from: [11, 22], to: [12, 21], god: GODS.zeus },
  { name: "염소자리", from: [12, 22], to: [1, 19],  god: GODS.poseidon },
  { name: "물병자리", from: [1, 20], to: [2, 18],  god: GODS.athena },
  { name: "물고기자리", from: [2, 19], to: [3, 20], god: GODS.dionysus },
];

function assignPatron(month, day) {
  for (const z of ZODIAC) {
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    if (fm <= tm) {
      if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) {
        return { ...z.god, zodiac: z.name };
      }
    } else {
      if ((month === fm && day >= fd) || (month === tm && day <= td)) {
        return { ...z.god, zodiac: z.name };
      }
    }
  }
  return { ...GODS.zeus, zodiac: "" };
}

const CATEGORY_GODS = [
  { key: "overall", label: "인생 총운", god: GODS.zeus, free: true },
  { key: "love",    label: "평생 애정운", god: GODS.aphrodite, free: true },
  { key: "bond",    label: "인연·관계의 팔자", god: GODS.hera, free: true },
  { key: "fortune", label: "평생 재물·성공운", god: GODS.hermes, free: true },
  { key: "warning", label: "신의 경고", god: GODS.ares, free: true },
];

const LOADING_LINES = [
  "올림포스에 전갈이 도착했습니다…",
  "다섯 신이 그대의 운명을 두고 회의합니다…",
  "델포이의 무녀가 숨을 고릅니다…",
  "신탁의 연기가 피어오르고 있습니다…",
];

function GodIcon({ godKey, size = 22, color = "currentColor" }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (godKey) {
    case "zeus":
      return <svg {...common}><path d="M13 2 4 14h6l-1 8 9-13h-6l1-7z" /></svg>;
    case "hera":
      return <svg {...common}><path d="M4 18h16M5 18l1-8 3 4 3-6 3 6 3-4 1 8" /></svg>;
    case "aphrodite":
      return <svg {...common}><path d="M12 3c4 2 7 6 7 11a7 7 0 0 1-14 0c0-5 3-9 7-11z" /><path d="M12 4v14M8.5 8c1 4 1 8 3.5 10M15.5 8c-1 4-1 8-3.5 10" /></svg>;
    case "hermes":
      return <svg {...common}><path d="M12 4v16" /><path d="M12 8c-2-2-5-1-5 1s3 2 5 1c2 1 5 0 5-1s-3-3-5-1z" /><path d="M4 6c1.5 1 2.5 1 4 0M20 6c-1.5 1-2.5 1-4 0" /></svg>;
    case "ares":
      return <svg {...common}><path d="M12 2v14" /><path d="M8 6h8" /><path d="M9 16h6l-1.5 5h-3z" /></svg>;
    case "apollo":
      return <svg {...common}><circle cx="12" cy="12" r="4.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></svg>;
    case "artemis":
      return <svg {...common}><path d="M15 4a8 8 0 1 0 0 16 6.5 6.5 0 0 1 0-16z" /><path d="M17 15l4-4M18 8.5 21 8M15.5 5l.5-3" /></svg>;
    case "demeter":
      return <svg {...common}><path d="M12 21V7" /><path d="M12 7c-2-1-3-3-2-5 2 0 3 2 2 5zM12 7c2-1 3-3 2-5-2 0-3 2-2 5z" /><path d="M12 12c-2-1-3-3-2-5 2 0 3 2 2 5zM12 12c2-1 3-3 2-5-2 0-3 2-2 5z" /></svg>;
    case "hephaestus":
      return <svg {...common}><path d="M14 3l7 7-3 3-7-7z" /><path d="M13 9 4 18l2 2 9-9" /></svg>;
    case "athena":
      return <svg {...common}><circle cx="9" cy="11" r="2" /><circle cx="15" cy="11" r="2" /><path d="M12 3c-4 0-7 3-7 7 0 5 3 9 7 11 4-2 7-6 7-11 0-4-3-7-7-7z" /></svg>;
    case "dionysus":
      return <svg {...common}><path d="M12 3v3" /><circle cx="10" cy="9" r="2" /><circle cx="14" cy="9" r="2" /><circle cx="8" cy="13" r="2" /><circle cx="12" cy="13" r="2" /><circle cx="16" cy="13" r="2" /><circle cx="10" cy="17" r="2" /><circle cx="14" cy="17" r="2" /></svg>;
    case "poseidon":
      return <svg {...common}><path d="M12 4v17" /><path d="M12 4V2M8 2v6M16 2v6M8 4c0 3 1.5 4 4 4s4-1 4-4" /></svg>;
    case "cronus": // 모래시계
      return <svg {...common}><path d="M6 3h12M6 21h12" /><path d="M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 90 }, (_, i) => CURRENT_YEAR - 14 - i);

// ============================================================
// 명리학(사주) 계산 엔진
// - 60갑자, 절기 기준 월주, 오행 분포까지 실제 공식으로 계산
// - 절기 날짜는 매년 조금씩 달라지는데(±1일), 여기서는 통상적인
//   고정 근사일을 사용합니다. 완전히 정밀하려면 태양황경 기반
//   천문 계산이 필요해 다음 단계 과제로 남겨둡니다.
// ============================================================
const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEM_ELEMENT = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const BRANCH_ELEMENT = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];
const ELEMENT_COLOR = { 목: "#5C7C6F", 화: "#8C2F2F", 토: "#A88B3F", 금: "#7C93A6", 수: "#1F4B5C" };

// 십신(十神) 계산용: 천간·지지의 음양 (양지: 자인진오신술 / 음지: 축묘사미유해)
const STEM_YINYANG = ["양", "음", "양", "음", "양", "음", "양", "음", "양", "음"]; // 갑을병정무기경신임계
const BRANCH_YINYANG = ["양", "음", "양", "음", "양", "음", "양", "음", "양", "음", "양", "음"]; // 자축인묘진사오미신유술해
const GENERATES = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" }; // A가 생하는 오행
const CONTROLS = { 목: "토", 화: "금", 토: "수", 금: "목", 수: "화" }; // A가 극하는 오행

function getTenGod(dayElement, dayYinYang, targetElement, targetYinYang) {
  const same = dayYinYang === targetYinYang;
  if (targetElement === dayElement) return same ? "비견" : "겁재";
  if (GENERATES[targetElement] === dayElement) return same ? "편인" : "정인"; // 목생일간=인성
  if (GENERATES[dayElement] === targetElement) return same ? "식신" : "상관"; // 일간생목=식상
  if (CONTROLS[dayElement] === targetElement) return same ? "편재" : "정재"; // 일간극목=재성
  if (CONTROLS[targetElement] === dayElement) return same ? "편관" : "정관"; // 목극일간=관성
  return null;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

// 일주: 1900-01-31 = 갑자일(index 0) 기준으로 경과일 계산
function dayPillarIndex(year, month, day) {
  const ref = Date.UTC(1900, 0, 31);
  const target = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((target - ref) / 86400000);
  return mod(diffDays, 60);
}

// 절기 기준 월주 경계 (근사 고정일)
const SOLAR_TERMS = [
  { m: 2, d: 4, idx: 1 },
  { m: 3, d: 6, idx: 2 },
  { m: 4, d: 5, idx: 3 },
  { m: 5, d: 6, idx: 4 },
  { m: 6, d: 6, idx: 5 },
  { m: 7, d: 7, idx: 6 },
  { m: 8, d: 8, idx: 7 },
  { m: 9, d: 8, idx: 8 },
  { m: 10, d: 8, idx: 9 },
  { m: 11, d: 7, idx: 10 },
  { m: 12, d: 7, idx: 11 },
];
// monthIndex(1~12: 인월~축월) -> 지지 인덱스(0~11)
const MONTH_IDX_TO_BRANCH = [null, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function getSajuYearAndMonthIndex(year, month, day) {
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const cur = SOLAR_TERMS[i];
    const next = SOLAR_TERMS[i + 1];
    const afterCur = month > cur.m || (month === cur.m && day >= cur.d);
    if (!afterCur) continue;
    if (next) {
      const beforeNext = month < next.m || (month === next.m && day < next.d);
      if (beforeNext) return { sajuYear: year, monthIndex: cur.idx };
    } else {
      return { sajuYear: year, monthIndex: 11 };
    }
  }
  if (month === 1 && day < 6) return { sajuYear: year - 1, monthIndex: 11 };
  return { sajuYear: year - 1, monthIndex: 12 };
}

// 오호둔: 년간에 따른 인월(1월) 천간 기준
const MONTH_STEM_BASE = [2, 4, 6, 8, 0]; // 년간idx%5 -> base
// 오서둔: 일간에 따른 자시 천간 기준
const HOUR_STEM_BASE = [0, 2, 4, 6, 8]; // 일간idx%5 -> base

function hourBranchIndex(hourDecimal) {
  // hourDecimal(0~24, 분 단위 소수 포함)을 정밀하게 12지지로 매핑
  const totalMin = (((hourDecimal % 24) + 24) % 24) * 60;
  if (totalMin >= 23 * 60 || totalMin < 1 * 60) return 0; // 자시 23:00~00:59
  return Math.floor((totalMin - 60) / 120) % 12 + 1;
}

// 진태양시(眞太陽時) 보정: 표준시 자오선(한국 135°E)과 실제 경도 차이 + 균시차(equation of time)
const STANDARD_MERIDIAN = 135; // 한국 표준시 기준 경도
const DEFAULT_LONGITUDE = 127.0; // 서울 기준 경도(도시 입력을 받지 않는 기본값)

function equationOfTimeMinutes(dayOfYear) {
  const B = ((360 / 365) * (dayOfYear - 81)) * DEG;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

function dayOfYear(year, month, day) {
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000) + 1;
}

function trueSolarTimeCorrectionMinutes(year, month, day, longitude = DEFAULT_LONGITUDE) {
  const longitudeCorrection = 4 * (longitude - STANDARD_MERIDIAN); // 서울(127)이면 약 -32분
  const eot = equationOfTimeMinutes(dayOfYear(year, month, day));
  return longitudeCorrection + eot;
}

// KST(UTC+9) 시각을 UTC로 정확히 환산 (날짜 넘어감까지 처리) — 네이털 차트 계산에 사용
function kstToUTC(year, month, day, hourDecimal) {
  const totalMinutes = Math.round(hourDecimal * 60);
  const d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) + totalMinutes * 60000 - 9 * 3600000);
  return {
    year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(),
    hourDecimal: d.getUTCHours() + d.getUTCMinutes() / 60,
  };
}

function calculateSaju(year, month, day, hourDecimal) {
  // 일주
  const dayIdx = dayPillarIndex(year, month, day);
  const dayStemIdx = mod(dayIdx, 10);
  const dayBranchIdx = mod(dayIdx, 12);

  // 년주 (사주 연도는 입춘 기준으로 보정된 값 사용)
  const { sajuYear, monthIndex } = getSajuYearAndMonthIndex(year, month, day);
  const yearStemIdx = mod(sajuYear - 4, 10);
  const yearBranchIdx = mod(sajuYear - 4, 12);

  // 월주
  const monthStemBase = MONTH_STEM_BASE[yearStemIdx % 5];
  const monthStemIdx = mod(monthStemBase + (monthIndex - 1), 10);
  const monthBranchIdx = MONTH_IDX_TO_BRANCH[monthIndex];

  // 시주 (선택 입력)
  let hourPillar = null;
  if (hourDecimal !== null && hourDecimal !== undefined && hourDecimal !== "") {
    const hBranchIdx = hourBranchIndex(Number(hourDecimal));
    const hStemBase = HOUR_STEM_BASE[dayStemIdx % 5];
    const hStemIdx = mod(hStemBase + hBranchIdx, 10);
    hourPillar = {
      stem: STEMS[hStemIdx], branch: BRANCHES[hBranchIdx],
      stemElement: STEM_ELEMENT[hStemIdx], branchElement: BRANCH_ELEMENT[hBranchIdx],
    };
  }

  const pillars = {
    year: { stem: STEMS[yearStemIdx], branch: BRANCHES[yearBranchIdx], stemElement: STEM_ELEMENT[yearStemIdx], branchElement: BRANCH_ELEMENT[yearBranchIdx] },
    month: { stem: STEMS[monthStemIdx], branch: BRANCHES[monthBranchIdx], stemElement: STEM_ELEMENT[monthStemIdx], branchElement: BRANCH_ELEMENT[monthBranchIdx] },
    day: { stem: STEMS[dayStemIdx], branch: BRANCHES[dayBranchIdx], stemElement: STEM_ELEMENT[dayStemIdx], branchElement: BRANCH_ELEMENT[dayBranchIdx] },
    hour: hourPillar,
  };

  // 십신(十神): 일간(日干)을 기준으로 나머지 7글자와의 관계를 판정
  // (지지는 지장간 대신 지지 자체의 오행·음양을 사용하는 간이 방식)
  const dayElement = STEM_ELEMENT[dayStemIdx];
  const dayYinYang = STEM_YINYANG[dayStemIdx];
  const tenGod = (element, yinYang) => getTenGod(dayElement, dayYinYang, element, yinYang);

  const tenGods = {
    year: {
      stem: tenGod(STEM_ELEMENT[yearStemIdx], STEM_YINYANG[yearStemIdx]),
      branch: tenGod(BRANCH_ELEMENT[yearBranchIdx], BRANCH_YINYANG[yearBranchIdx]),
    },
    month: {
      stem: tenGod(STEM_ELEMENT[monthStemIdx], STEM_YINYANG[monthStemIdx]),
      branch: tenGod(BRANCH_ELEMENT[monthBranchIdx], BRANCH_YINYANG[monthBranchIdx]),
    },
    day: {
      stem: "일원(日元)",
      branch: tenGod(BRANCH_ELEMENT[dayBranchIdx], BRANCH_YINYANG[dayBranchIdx]),
    },
    hour: hourPillar
      ? {
          stem: tenGod(hourPillar.stemElement, STEM_YINYANG[STEMS.indexOf(hourPillar.stem)]),
          branch: tenGod(hourPillar.branchElement, BRANCH_YINYANG[BRANCHES.indexOf(hourPillar.branch)]),
        }
      : null,
  };

  // 오행 분포 집계
  const elementCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  [pillars.year, pillars.month, pillars.day, pillars.hour].forEach((p) => {
    if (!p) return;
    elementCount[p.stemElement]++;
    elementCount[p.branchElement]++;
  });

  return { pillars, tenGods, elementCount, sajuYear };
}

// ============================================================
// 네이털 차트(천체 배치) 계산 엔진
// - 태어난 순간 태양·달·수성~토성의 황경(ecliptic longitude)을
//   케플러 방정식 기반 저정밀 궤도 공식으로 계산, 12궁 별자리로 환산
// - 출생 "분" 정보가 없어 시(hour) 단위로만 계산하며, 달은 하루에도
//   약 13°씩 움직이므로 시각 미상일 경우 자정 기준 근사치입니다.
// ============================================================
const SIGN_NAMES = ["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"];

const PLANET_GOD = {
  sun: GODS.apollo, moon: GODS.artemis, mercury: GODS.hermes,
  venus: GODS.aphrodite, mars: GODS.ares, jupiter: GODS.zeus, saturn: GODS.cronus,
};
const PLANET_LABEL = { sun: "태양", moon: "달", mercury: "수성", venus: "금성", mars: "화성", jupiter: "목성", saturn: "토성" };

const DEG = Math.PI / 180;
function normDeg(x) { return ((x % 360) + 360) % 360; }

function toJulianDay(year, month, day, hourDecimal) {
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hourDecimal / 24 + B - 1524.5;
}

// 태양(=지구 기준 겉보기) 황경 + 이심 근점이각 관련 값 (Meeus 저정밀 공식)
function sunLongitudeAndAnomaly(T) {
  const L0 = normDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = M * DEG;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  const trueLong = normDeg(L0 + C);
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
  const v = M + C; // 진근점이각
  return { longitude: trueLong, M, C, e, v };
}

// 달의 황경 (Meeus 저정밀, 주요 항만 사용 — 오차 수 분(度)이내)
function moonLongitude(T) {
  const Lp = normDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D = normDeg(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) * DEG;
  const M = normDeg(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) * DEG;
  const Mp = normDeg(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) * DEG;
  const F = normDeg(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) * DEG;
  const dL =
    6.288774 * Math.sin(Mp) + 1.274027 * Math.sin(2 * D - Mp) + 0.658314 * Math.sin(2 * D)
    + 0.213618 * Math.sin(2 * Mp) - 0.185116 * Math.sin(M) - 0.114332 * Math.sin(2 * F)
    + 0.058793 * Math.sin(2 * D - 2 * Mp) + 0.057066 * Math.sin(2 * D - M - Mp)
    + 0.053322 * Math.sin(2 * D + Mp) + 0.045758 * Math.sin(2 * D - M)
    - 0.040923 * Math.sin(M - Mp) - 0.034720 * Math.sin(D) - 0.030383 * Math.sin(M + Mp);
  return normDeg(Lp + dL);
}

// J2000 기준 행성 평균 궤도요소 + 세기당 변화율 (Standish 1992, 1800-2050 유효)
const PLANET_ELEMENTS = {
  mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], i: [7.00497902, -0.00594749], L: [252.25032350, 149472.67411175], peri: [77.45779628, 0.16047689], node: [48.33076593, -0.12534081] },
  venus:   { a: [0.72333566, 0.00000390], e: [0.00677672, -0.00004107], i: [3.39467605, -0.00078890], L: [181.97909950, 58517.81538729], peri: [131.60246718, 0.00268329], node: [76.67984255, -0.27769418] },
  mars:    { a: [1.52371034, 0.00001847], e: [0.09339410, 0.00007882], i: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], peri: [-23.94362959, 0.44441088], node: [49.55953891, -0.29257343] },
  jupiter: { a: [5.20288700, -0.00011607], e: [0.04838624, -0.00013253], i: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], peri: [14.72847983, 0.21252668], node: [100.47390909, 0.20469106] },
  saturn:  { a: [9.53667594, -0.00125060], e: [0.05386179, -0.00050991], i: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], peri: [92.59887831, -0.41897216], node: [113.66242448, -0.28867794] },
};

function solveKepler(Mrad, e) {
  let E = Mrad;
  for (let i = 0; i < 30; i++) {
    const dE = (Mrad - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

// 행성의 태양중심 황도 직교좌표 (x, y) — 궤도경사·승교점까지 반영
function planetHeliocentricXY(elemKey, T) {
  const el = PLANET_ELEMENTS[elemKey];
  const a = el.a[0] + el.a[1] * T;
  const e = el.e[0] + el.e[1] * T;
  const i = (el.i[0] + el.i[1] * T) * DEG;
  const L = normDeg(el.L[0] + el.L[1] * T);
  const peri = normDeg(el.peri[0] + el.peri[1] * T);
  const node = normDeg(el.node[0] + el.node[1] * T);
  const omega = (peri - node) * DEG; // 근일점 인수
  let M = normDeg(L - peri);
  if (M > 180) M -= 360;
  const Mrad = M * DEG;
  const E = solveKepler(Mrad, e);
  const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const r = a * (1 - e * Math.cos(E));
  const xOrb = r * Math.cos(v), yOrb = r * Math.sin(v);
  const xh1 = xOrb * Math.cos(omega) - yOrb * Math.sin(omega);
  const yh1 = xOrb * Math.sin(omega) + yOrb * Math.cos(omega);
  const nodeRad = node * DEG;
  const xEcl = xh1 * Math.cos(nodeRad) - yh1 * Math.cos(i) * Math.sin(nodeRad);
  const yEcl = xh1 * Math.sin(nodeRad) + yh1 * Math.cos(i) * Math.cos(nodeRad);
  return { x: xEcl, y: yEcl };
}

function calculateNatalChart(year, month, day, hourDecimal) {
  const rawHour = hourDecimal !== null && hourDecimal !== undefined && hourDecimal !== "" ? Number(hourDecimal) : 0;
  // 실제 물리적 출생 순간을 정확히 다루기 위해 KST(UTC+9) 시각을 UTC로 환산 후 율리우스일 계산
  const utc = kstToUTC(year, month, day, rawHour);
  const JD = toJulianDay(utc.year, utc.month, utc.day, utc.hourDecimal);
  const T = (JD - 2451545.0) / 36525;

  const sun = sunLongitudeAndAnomaly(T);
  const sunLongDeg = sun.longitude;

  // 지구의 태양중심 좌표 (태양의 겉보기 지심 위치로부터 역산)
  const rE = (1.000001018 * (1 - sun.e * sun.e)) / (1 + sun.e * Math.cos(sun.v * DEG));
  const earthHelioLong = normDeg(sunLongDeg + 180);
  const xE = rE * Math.cos(earthHelioLong * DEG);
  const yE = rE * Math.sin(earthHelioLong * DEG);

  const moonLongDeg = moonLongitude(T);

  const positions = { sun: sunLongDeg, moon: moonLongDeg };
  ["mercury", "venus", "mars", "jupiter", "saturn"].forEach((key) => {
    const { x, y } = planetHeliocentricXY(key, T);
    const gx = x - xE, gy = y - yE;
    positions[key] = normDeg(Math.atan2(gy, gx) / DEG);
  });

  const chart = {};
  Object.entries(positions).forEach(([key, longDeg]) => {
    const signIdx = Math.floor(normDeg(longDeg) / 30);
    chart[key] = { longitude: longDeg, sign: SIGN_NAMES[signIdx], degreeInSign: (normDeg(longDeg) % 30).toFixed(1) };
  });
  return chart;
}

function GreekOracle() {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [preciseMode, setPreciseMode] = useState(false);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [result, setResult] = useState(null);
  const [patron, setPatron] = useState(null);
  const [match, setMatch] = useState(null);
  const [saju, setSaju] = useState(null);
  const [natal, setNatal] = useState(null);
  const [appliedPrecise, setAppliedPrecise] = useState(null); // { on: bool, minutes: number }
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const loadingIntervalRef = useRef(null);

  const maxDay = useMemo(() => {
    if (!birthYear || !birthMonth) return 31;
    return daysInMonth(Number(birthYear), Number(birthMonth));
  }, [birthYear, birthMonth]);

  useEffect(() => {
    if (birthDay && Number(birthDay) > maxDay) setBirthDay("");
  }, [maxDay]); // eslint-disable-line

  useEffect(() => {
    if (loading) {
      let i = 0;
      loadingIntervalRef.current = setInterval(() => {
        i = (i + 1) % LOADING_LINES.length;
        setLoadingLine(LOADING_LINES[i]);
      }, 1800);
    } else {
      clearInterval(loadingIntervalRef.current);
    }
    return () => clearInterval(loadingIntervalRef.current);
  }, [loading]);

  const isValid = birthYear && birthMonth && birthDay;

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!isValid || loading) return;
    setError(null);
    setResult(null);
    setCopied(false);
    setUnlocked(false);

    const y = Number(birthYear), m = Number(birthMonth), d = Number(birthDay);
    const patronGod = assignPatron(m, d);
    setPatron(patronGod);
    const matchGod = GODS[COMPATIBILITY_MAP[patronGod.key]];
    setMatch(matchGod);

    // 실제 물리적 출생 시각(표준시, 분 단위) — 네이털 차트는 항상 이 값을 사용
    const rawHourDecimal = birthHour !== "" ? Number(birthHour) + (birthMinute !== "" ? Number(birthMinute) : 0) / 60 : "";

    // 사주 시주 판정에 쓸 시각 — 정밀모드면 진태양시 보정을 적용
    let sajuHourDecimal = rawHourDecimal;
    let correctionMinutes = 0;
    if (preciseMode && rawHourDecimal !== "") {
      correctionMinutes = trueSolarTimeCorrectionMinutes(y, m, d);
      sajuHourDecimal = rawHourDecimal + correctionMinutes / 60;
    }

    const sajuData = calculateSaju(y, m, d, sajuHourDecimal);
    setSaju(sajuData);
    setAppliedPrecise(rawHourDecimal !== "" ? { on: preciseMode, minutes: correctionMinutes } : null);

    const natalData = calculateNatalChart(y, m, d, rawHourDecimal);
    setNatal(natalData);

    setLoading(true);

    const dateStr = `${y}년 ${m}월 ${d}일`;

    const godRoster = CATEGORY_GODS.map(
      (c) => `- ${c.key} 항목 (${c.label}) 담당 신: "${c.god.name}"(${c.god.epithet}). 성격: ${c.god.personality}`
    ).join("\n");

    const p = sajuData.pillars;
    const tg = sajuData.tenGods;
    const sajuSummary = `[사주 원국] 년주 ${p.year.stem}${p.year.branch}(${p.year.stemElement}/${p.year.branchElement}) · 월주 ${p.month.stem}${p.month.branch}(${p.month.stemElement}/${p.month.branchElement}) · 일주 ${p.day.stem}${p.day.branch}(${p.day.stemElement}/${p.day.branchElement})` +
      (p.hour ? ` · 시주 ${p.hour.stem}${p.hour.branch}(${p.hour.stemElement}/${p.hour.branchElement})` : " · 시주 미상") +
      `\n[오행 분포] 목${sajuData.elementCount.목} 화${sajuData.elementCount.화} 토${sajuData.elementCount.토} 금${sajuData.elementCount.금} 수${sajuData.elementCount.수}`;

    const tenGodList = [tg.year.stem, tg.year.branch, tg.month.stem, tg.month.branch, tg.day.branch, tg.hour?.stem, tg.hour?.branch].filter(Boolean);
    const tenGodSummary = `[십신] ${tenGodList.join(", ")} — 이 중 가장 자주 나타나는 십신이 이 사람의 핵심 기질입니다 (비견/겁재=주체성과 경쟁심, 식신/상관=표현력과 재능, 편재/정재=재물과 현실감각, 편관/정관=책임감과 통제력, 편인/정인=학습과 직관)`;

    const natalSummary = `[천체 배치 · 네이털 차트] ` + Object.entries(natalData).map(
      ([key, v]) => `${PLANET_LABEL[key]}(${PLANET_GOD[key].name})=${v.sign} ${v.degreeInSign}°`
    ).join(" · ");

    const systemPrompt = `당신은 그리스 신화 속 다섯 신들을 각각 연기하는 신탁 작성자입니다. 이 신탁은 하루의 운세가 아니라, 필멸자가 태어날 때부터 타고난 "인생 사주"를 다섯 신이 각자의 영역에서 풀어주는 것입니다.

아래에 실제로 계산된 이 필멸자의 사주 원국(년주·월주·일주·시주)과 오행 분포, 십신, 그리고 태어난 순간의 천체 배치(태양·달·수성~토성이 어느 별자리에 있었는지)가 주어집니다. 이 데이터를 반드시 근거로 삼아 신탁을 지으십시오 — 임의로 지어내지 말고, 오행 중 강한 기운과 약한 기운을 신들의 성정과 자연스럽게 연결하십시오 (예: 화 기운이 강하면 아레스·헤파이스토스의 격정과 연결, 수 기운이 강하면 포세이돈의 변덕과 연결, 목 기운이 강하면 데메테르의 생명력과 연결, 금 기운이 강하면 아테나의 결단력과 연결, 토 기운이 강하면 헤라의 안정과 연결하는 식으로). 특히 재성(편재/정재)이 두드러지면 헤르메스의 재물·기회운에, 관성(편관/정관)이 두드러지면 제우스의 총운이나 헤라의 관계운에, 식상(식신/상관)이 두드러지면 아프로디테의 애정운이나 표현력에 직접 반영하십시오.

${sajuSummary}
${tenGodSummary}
${natalSummary}

고전 7행성은 각각 그리스 신과 직결됩니다(목성=제우스, 금성=아프로디테, 화성=아레스, 수성=헤르메스, 태양=아폴론, 달=아르테미스, 토성=크로노스). 각 항목을 말하는 신에게 자신과 짝지어진 행성이 있다면(제우스↔목성, 아프로디테↔금성, 아레스↔화성, 헤르메스↔수성), 그 신은 반드시 "그대가 태어날 때 [행성]이 [별자리]에 있었으니…" 식으로 자신의 행성 위치를 신탁 속에 한 번은 직접 언급하십시오. 헤라는 짝지어진 행성이 없으니 달이나 사주 오행을 근거로 삼으십시오.

아래 다섯 항목은 서로 다른 신이 직접 1인칭으로 말하는 신탁입니다. 반드시 각 신의 고유한 성격과 말투를 뚜렷하게 구분하여 쓰십시오. 모든 신은 신비롭고 근엄한 한국어 문어체(예: ~하리라, ~할지니, ~노라, ~도다, ~이니라)를 기본으로 하되, 그 위에 각자의 개성(제우스=위압적, 아프로디테=관능적이고 다정, 헤라=엄격하고 준엄, 헤르메스=재치있고 경쾌, 아레스=거칠고 도발적)을 뚜렷이 얹으십시오. 절대 현대적이거나 캐주얼한 말투를 섞지 마십시오. 각 항목은 "오늘은 ~하리라" 식의 하루 운세가 아니라, "그대는 평생 ~한 팔자를 타고났으니" 식으로 인생 전체를 관통하는 성정과 흐름을 말해야 합니다.

${godRoster}

또한 "${patronGod.name}"(${patronGod.epithet})은(는) 이 필멸자의 생일별자리(${patronGod.zodiac})를 수호하는 신입니다. 이 신의 1인칭으로, 사주 원국의 오행 기운과 천체 배치를 짚어가며 필멸자의 타고난 본질을 알려주는 짧은 인사말(patronGreeting)도 작성하십시오.

그리고 "${matchGod.name}"(${matchGod.epithet})은(는) 수호신 ${patronGod.name}과(와) 신화적으로 가장 궁합이 좋은 신입니다 (이유: ${COMPATIBILITY_REASON[patronGod.key]}). ${matchGod.name}의 1인칭으로, 이 필멸자와 자신이 왜 잘 맞는지, 함께라면 어떤 인연이나 만남을 기대할 수 있는지 짚어주는 궁합 신탁(compat)도 작성하십시오.

오직 아래 형식으로만 응답하고, 그 외의 설명이나 인사말, 코드블록은 절대 포함하지 마십시오. 각 대괄호 태그는 반드시 새 줄에서 시작하고, 태그 안에는 오직 신탁 본문만 쓰십시오 (따옴표나 마크다운 기호 없이 순수 문장으로):
[PATRON]
(수호신이 사주 오행과 천체 배치를 짚어가며 필멸자의 타고난 본질을 알려주는 1~2문장의 인사)
[COMPAT]
(궁합신이 자신과 수호신의 궁합이 왜 좋은지, 이 필멸자에게 어떤 인연을 기대할 수 있는지 짚어주는 2~3문장)
[OVERALL]
(제우스가 사주와 목성 위치에 근거해 말하는 인생 총운 2~3문장)
[LOVE]
(아프로디테가 사주와 금성 위치에 근거해 말하는 평생 애정운 2~3문장)
[BOND]
(헤라가 사주에 근거해 말하는 인연·관계의 팔자 2~3문장)
[FORTUNE]
(헤르메스가 사주와 수성 위치에 근거해 말하는 평생 재물·성공운 2~3문장)
[WARNING]
(아레스가 사주와 화성 위치에 근거해 말하는 인생에서 경계해야 할 것 1~2문장)`;

    const hourStr = rawHourDecimal !== "" ? `${birthHour}시 ${birthMinute || 0}분경` : "정확한 시각 미상";
    const genderStr = gender === "female" ? "여성" : gender === "male" ? "남성" : "성별 미상";

    const userPrompt = `필멸자 "${name || "이름 모를 인간"}"(${genderStr})이(가) ${dateStr} ${hourStr}에 태어났습니다. 그의 별자리를 수호하는 신은 ${patronGod.name}이고, 궁합신은 ${matchGod.name}입니다. 위에 주어진 사주 원국, 오행 분포, 천체 배치에 근거하여, 다섯 신 각자의 항목에서 그의 평생에 걸친 성정과 팔자, 앞으로 살아갈 인생의 큰 흐름을 각자의 목소리로 들려주소서. 궁합신 ${matchGod.name}도 자신의 목소리로 궁합 신탁을 들려주소서.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2700,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Oracle API error", response.status, errText);
        throw new Error(`요청 실패 (status ${response.status})`);
      }

      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      if (!textBlock || !textBlock.text) {
        console.error("No text in response", data);
        throw new Error("응답에 신탁 내용이 없습니다.");
      }

      const raw = textBlock.text;
      const TAGS = ["PATRON", "COMPAT", "OVERALL", "LOVE", "BOND", "FORTUNE", "WARNING"];
      const tagRegex = new RegExp(`\\[(${TAGS.join("|")})\\]`, "g");
      const parts = raw.split(tagRegex);
      const parsed = {};
      for (let i = 1; i < parts.length; i += 2) {
        const tagKey = parts[i].toLowerCase();
        const text = (parts[i + 1] || "").trim();
        parsed[tagKey === "patron" ? "patronGreeting" : tagKey] = text;
      }

      const requiredKeys = ["patronGreeting", "compat", "overall", "love", "bond", "fortune", "warning"];
      const missing = requiredKeys.filter((k) => !parsed[k]);
      if (missing.length > 0) {
        console.error("Missing oracle fields:", missing, "Raw response:", raw);
        throw new Error(`신탁 일부가 누락되었습니다: ${missing.join(", ")}`);
      }

      setResult(parsed);
    } catch (err) {
      console.error("Oracle generation failed:", err);
      setError(`신탁의 안개가 짙어 응답이 닿지 않았습니다. (${err.message || "알 수 없는 오류"}) 다시 청하여 보십시오.`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPatron(null);
    setMatch(null);
    setSaju(null);
    setNatal(null);
    setAppliedPrecise(null);
    setError(null);
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("");
    setBirthMinute("");
    setPreciseMode(false);
    setGender("");
    setName("");
    setUnlocked(false);
  };

  const handleCopy = () => {
    if (!result || !patron || !match) return;
    const lines = [
      `⚡ ${patron.name}이(가) 수호하는 자의 신탁 ⚡`,
      "",
      result.patronGreeting,
      "",
      `[궁합신 · ${match.name}]`,
      result.compat,
      "",
      ...CATEGORY_GODS.filter((c) => c.free || unlocked).map((c) => `[${c.label} · ${c.god.name}]\n${result[c.key]}`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at top, #171B2E 0%, #0B0E1A 60%, #08090F 100%)",
        color: "#EDE6D6",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500&display=swap');
        .go-display { font-family: 'Cinzel', serif; letter-spacing: 0.12em; }
        .go-heading { font-family: 'Noto Serif KR', serif; }
        @keyframes go-flicker {
          0%, 100% { opacity: 1; transform: scale(1) translateY(0); filter: drop-shadow(0 0 8px rgba(201,162,39,0.6)); }
          25% { opacity: 0.85; transform: scale(0.96) translateY(-1px); }
          50% { opacity: 1; transform: scale(1.05) translateY(0.5px); filter: drop-shadow(0 0 14px rgba(201,162,39,0.85)); }
          75% { opacity: 0.9; transform: scale(0.98) translateY(-0.5px); }
        }
        .go-flame { animation: go-flicker 1.6s ease-in-out infinite; }
        @keyframes go-unfurl {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .go-scroll { animation: go-unfurl 0.7s ease-out forwards; }
        @keyframes go-stagger {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .go-stele { animation: go-stagger 0.6s ease-out both; }
        .go-stars {
          background-image:
            radial-gradient(1px 1px at 20px 30px, rgba(237,230,214,0.35), transparent),
            radial-gradient(1px 1px at 90px 80px, rgba(237,230,214,0.25), transparent),
            radial-gradient(1.5px 1.5px at 160px 40px, rgba(201,162,39,0.4), transparent),
            radial-gradient(1px 1px at 210px 120px, rgba(237,230,214,0.3), transparent),
            radial-gradient(1px 1px at 260px 20px, rgba(237,230,214,0.2), transparent);
          background-repeat: repeat;
          background-size: 280px 160px;
        }
        .go-select {
          background: rgba(237,230,214,0.05);
          border: 1px solid rgba(201,162,39,0.35);
          color: #EDE6D6;
        }
        .go-select:focus { outline: none; border-color: #C9A227; background: rgba(201,162,39,0.08); }
        .go-input {
          background: rgba(237,230,214,0.05);
          border: 1px solid rgba(201,162,39,0.35);
          color: #EDE6D6;
        }
        .go-input:focus { outline: none; border-color: #C9A227; background: rgba(201,162,39,0.08); }
        .go-input::placeholder { color: rgba(237,230,214,0.35); }
        .go-btn {
          background: linear-gradient(135deg, #C9A227, #A9821E);
          color: #14100A;
        }
        .go-btn:hover { filter: brightness(1.08); }
        .go-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .go-locked-content { filter: blur(5px); user-select: none; pointer-events: none; }
      `}</style>

      <div className="go-stars w-full max-w-2xl absolute inset-0 pointer-events-none opacity-60" />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <svg viewBox="0 0 320 110" className="w-52 h-auto mx-auto mb-4 opacity-90" fill="none">
            <circle cx="160" cy="24" r="12" stroke="#C9A227" strokeWidth="1" opacity="0.6" />
            <path d="M96 40 L160 14 L224 40 Z" stroke="#C9A227" strokeWidth="1.3" strokeLinejoin="round" opacity="0.85" />
            <rect x="90" y="40" width="140" height="5" stroke="#C9A227" strokeWidth="1" opacity="0.7" />
            {[100, 118, 136, 154, 172, 190, 208, 220].map((x, i) => (
              <line key={i} x1={x} y1="47" x2={x} y2="95" stroke="#C9A227" strokeWidth="1.3" opacity="0.55" />
            ))}
            <rect x="88" y="95" width="144" height="5" stroke="#C9A227" strokeWidth="1" opacity="0.7" />
          </svg>
          <div className="go-display text-xs" style={{ color: "#C9A227" }}>
            G R E E K   O R A C L E
          </div>
          <h1 className="go-heading text-4xl md:text-5xl font-bold mt-3" style={{ color: "#EDE6D6" }}>
            신들의 신탁
          </h1>
          <div className="w-16 h-px mx-auto my-4" style={{ background: "#C9A227", opacity: 0.5 }} />
          <p className="text-sm" style={{ color: "rgba(237,230,214,0.6)" }}>
            그대가 타고난 인생의 팔자를, 제우스·헤라·아프로디테·헤르메스·아레스 다섯 신이 각자의 영역에서 풀어주리라
          </p>
        </div>

        {/* Form */}
        {!result && (
          <div className="space-y-5 max-w-xl mx-auto">
            <div>
              <label className="block text-xs mb-2 tracking-wide" style={{ color: "rgba(237,230,214,0.55)" }}>
                이름 (선택)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="신께 불릴 이름"
                className="go-input w-full rounded px-4 py-3 text-sm"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-xs mb-2 tracking-wide" style={{ color: "rgba(237,230,214,0.55)" }}>
                생년월일
              </label>
              <div className="grid grid-cols-3 gap-3">
                <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="go-select rounded px-3 py-3 text-sm">
                  <option value="" disabled>년</option>
                  {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="go-select rounded px-3 py-3 text-sm">
                  <option value="" disabled>월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((mo) => <option key={mo} value={mo}>{mo}월</option>)}
                </select>
                <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="go-select rounded px-3 py-3 text-sm">
                  <option value="" disabled>일</option>
                  {Array.from({ length: maxDay }, (_, i) => i + 1).map((da) => <option key={da} value={da}>{da}일</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-2 tracking-wide" style={{ color: "rgba(237,230,214,0.55)" }}>
                  출생 시각 (선택, 시주 계산에 필요)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select value={birthHour} onChange={(e) => setBirthHour(e.target.value)} className="go-select w-full rounded px-3 py-3 text-sm">
                    <option value="">모름</option>
                    {Array.from({ length: 24 }, (_, i) => i).map((h) => <option key={h} value={h}>{h}시</option>)}
                  </select>
                  <select value={birthMinute} onChange={(e) => setBirthMinute(e.target.value)} disabled={birthHour === ""} className="go-select w-full rounded px-3 py-3 text-sm disabled:opacity-40">
                    <option value="">0분</option>
                    {Array.from({ length: 59 }, (_, i) => i + 1).map((mi) => <option key={mi} value={mi}>{mi}분</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-2 tracking-wide" style={{ color: "rgba(237,230,214,0.55)" }}>
                  성별 (선택)
                </label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="go-select w-full rounded px-3 py-3 text-sm">
                  <option value="">미상</option>
                  <option value="female">여성</option>
                  <option value="male">남성</option>
                </select>
              </div>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none" style={{ opacity: birthHour === "" ? 0.4 : 1 }}>
              <input
                type="checkbox"
                checked={preciseMode}
                onChange={(e) => setPreciseMode(e.target.checked)}
                disabled={birthHour === ""}
                className="mt-0.5"
              />
              <span className="text-xs leading-relaxed" style={{ color: "rgba(237,230,214,0.6)" }}>
                <span style={{ color: "#C9A227" }}>정밀 모드</span> — 진태양시(眞太陽時) 보정 적용 (서울 기준 경도+균시차, 약 -30분 내외). 시주가 경계에 걸친 경우 결과가 달라질 수 있습니다.
              </span>
            </label>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !isValid}
              className="go-btn w-full rounded py-3.5 font-semibold text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Sparkles size={16} className="animate-spin" />
              ) : (
                <Flame size={16} />
              )}
              {loading ? "인생 신탁을 청하는 중…" : "인생 신탁 청하기"}
            </button>
            {!isValid && (birthYear || birthMonth || birthDay) && (
              <p className="text-xs text-center" style={{ color: "rgba(237,230,214,0.4)" }}>
                년 · 월 · 일을 모두 선택해야 신탁을 청할 수 있습니다
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Flame size={40} className="go-flame" style={{ color: "#C9A227" }} />
            <p className="text-sm go-heading" style={{ color: "rgba(237,230,214,0.7)" }}>
              {loadingLine}
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-8 text-center">
            <p className="text-sm mb-4" style={{ color: "#C97878" }}>{error}</p>
            <button onClick={handleReset} className="go-btn rounded px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
              <RotateCcw size={14} /> 다시 청하기
            </button>
          </div>
        )}

        {/* Result */}
        {result && patron && match && saju && natal && !loading && (
          <div className="go-scroll">
            {/* Patron badge + greeting */}
            <div className="text-center mb-8">
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ border: `1px solid ${patron.accent}77`, boxShadow: `0 0 24px ${patron.accent}33`, color: patron.accent }}
              >
                <GodIcon godKey={patron.key} size={26} />
              </div>
              <div className="go-display text-[10px]" style={{ color: "rgba(237,230,214,0.4)" }}>
                {patron.zodiac?.toUpperCase?.() || ""} · YOUR PATRON
              </div>
              <h2 className="go-heading text-2xl font-bold mt-2" style={{ color: patron.accent }}>
                {patron.name}
              </h2>
              <p className="text-xs mb-4" style={{ color: "rgba(237,230,214,0.5)" }}>
                {patron.epithet} · {patron.zodiac}를 수호하는 신
              </p>
              <p className="go-heading text-base leading-relaxed italic max-w-lg mx-auto" style={{ color: "#EDE6D6" }}>
                “{result.patronGreeting}”
              </p>
            </div>

            {/* 궁합의 신 */}
            <div className="rounded-lg p-5 mb-6 text-center" style={{ background: "rgba(237,230,214,0.03)", border: `1px solid ${match.accent}44` }}>
              <div className="go-display text-[10px] mb-3" style={{ color: "rgba(237,230,214,0.4)" }}>
                궁합의 신 · SOULMATE GOD
              </div>
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1px solid ${patron.accent}66`, color: patron.accent }}>
                    <GodIcon godKey={patron.key} size={18} />
                  </div>
                  <span className="text-[10px]" style={{ color: "rgba(237,230,214,0.5)" }}>{patron.name}</span>
                </div>
                <span className="go-display text-lg" style={{ color: "#C9A227" }}>&times;</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1px solid ${match.accent}66`, color: match.accent }}>
                    <GodIcon godKey={match.key} size={18} />
                  </div>
                  <span className="text-[10px]" style={{ color: "rgba(237,230,214,0.5)" }}>{match.name}</span>
                </div>
              </div>
              <p className="text-xs mb-3" style={{ color: "rgba(237,230,214,0.5)" }}>
                {match.name} · {match.epithet}
              </p>
              <p className="text-sm leading-relaxed italic max-w-lg mx-auto" style={{ color: "rgba(237,230,214,0.85)" }}>
                “{result.compat}”
              </p>
            </div>

            {/* 사주 원국 */}
            <div className="rounded-lg p-5 mb-6" style={{ background: "rgba(237,230,214,0.03)", border: "1px solid rgba(201,162,39,0.25)" }}>
              <div className="go-display text-[10px] text-center mb-4" style={{ color: "rgba(237,230,214,0.4)" }}>
                사주 원국 · SAJU CHART
              </div>
              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                {[
                  { label: "년주", p: saju.pillars.year, tg: saju.tenGods.year },
                  { label: "월주", p: saju.pillars.month, tg: saju.tenGods.month },
                  { label: "일주", p: saju.pillars.day, tg: saju.tenGods.day },
                  { label: "시주", p: saju.pillars.hour, tg: saju.tenGods.hour },
                ].map((col, i) => (
                  <div key={i}>
                    <div className="text-[10px] mb-1" style={{ color: "rgba(237,230,214,0.4)" }}>{col.label}</div>
                    {col.p ? (
                      <>
                        <div className="go-heading text-lg font-bold" style={{ color: "#EDE6D6" }}>
                          {col.p.stem}{col.p.branch}
                        </div>
                        {col.tg && (
                          <div className="text-[9px] mt-1 leading-tight" style={{ color: "rgba(201,162,39,0.65)" }}>
                            {col.tg.stem}<br />{col.tg.branch}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs" style={{ color: "rgba(237,230,214,0.3)" }}>미상</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {Object.entries(saju.elementCount).map(([el, count]) => (
                  <span
                    key={el}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ border: `1px solid ${ELEMENT_COLOR[el]}77`, color: ELEMENT_COLOR[el] }}
                  >
                    {el} {count}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-center mt-3" style={{ color: "rgba(237,230,214,0.3)" }}>
                * 절기는 근사 고정일 기준으로 계산되었습니다
                {appliedPrecise && (
                  <>
                    {" · "}
                    {appliedPrecise.on
                      ? `진태양시 보정 적용됨 (${appliedPrecise.minutes >= 0 ? "+" : ""}${appliedPrecise.minutes.toFixed(1)}분, 서울 기준)`
                      : "표준시 그대로 계산됨 (진태양시 보정 미적용)"}
                  </>
                )}
              </p>
            </div>

            {/* 천체 배치 (네이털 차트) */}
            <div className="rounded-lg p-5 mb-6" style={{ background: "rgba(237,230,214,0.03)", border: "1px solid rgba(201,162,39,0.25)" }}>
              <div className="go-display text-[10px] text-center mb-4" style={{ color: "rgba(237,230,214,0.4)" }}>
                천체 배치 · NATAL CHART
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(natal).map(([key, v]) => {
                  const g = PLANET_GOD[key];
                  return (
                    <div key={key} className="flex items-center gap-2 rounded px-2 py-2" style={{ background: "rgba(237,230,214,0.03)" }}>
                      <span style={{ color: g.accent }}><GodIcon godKey={g.key} size={16} /></span>
                      <div>
                        <div className="text-[10px]" style={{ color: "rgba(237,230,214,0.4)" }}>{PLANET_LABEL[key]}</div>
                        <div className="text-xs go-heading" style={{ color: "#EDE6D6" }}>{v.sign}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-center mt-3" style={{ color: "rgba(237,230,214,0.3)" }}>
                * 저정밀 궤도 공식(±수 분각) 기반 근사치이며, 출생 "분" 정보는 반영되지 않습니다
              </p>
            </div>

            <div className="w-full h-px my-8" style={{ background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.4), transparent)" }} />

            {/* Five gods, five domains */}
            <div className="grid gap-4">
              {CATEGORY_GODS.map((c, idx) => {
                const isLocked = !c.free && !unlocked;
                return (
                  <div
                    key={c.key}
                    className="go-stele rounded-lg p-5 relative"
                    style={{
                      background: "rgba(237,230,214,0.04)",
                      border: `1px solid ${c.god.accent}55`,
                      boxShadow: `0 0 24px ${c.god.accent}18`,
                      animationDelay: `${idx * 0.12}s`,
                    }}
                  >
                    <div className={isLocked ? "go-locked-content" : ""}>
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ color: c.god.accent }}><GodIcon godKey={c.god.key} size={18} /></span>
                          <span className="go-heading text-lg font-bold" style={{ color: c.god.accent }}>
                            {c.god.name}
                          </span>
                          <span className="go-display text-[10px]" style={{ color: "rgba(237,230,214,0.35)" }}>
                            {c.god.latin}
                          </span>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ border: `1px solid ${c.god.accent}66`, color: c.god.accent }}
                        >
                          {c.label}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(237,230,214,0.85)" }}>
                        {result[c.key]}
                      </p>
                    </div>
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Lock size={18} style={{ color: c.god.accent }} />
                        <span className="text-xs go-heading" style={{ color: "rgba(237,230,214,0.7)" }}>
                          {c.god.name}의 신탁은 잠겨 있습니다
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-8 max-w-xl mx-auto">
              <button
                onClick={handleCopy}
                className="flex-1 rounded py-3 text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: "rgba(237,230,214,0.08)", border: "1px solid rgba(201,162,39,0.35)", color: "#EDE6D6" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "복사됨" : "신탁 복사하기"}
              </button>
              <button onClick={handleReset} className="go-btn rounded py-3 px-5 text-sm font-semibold flex items-center justify-center gap-2">
                <RotateCcw size={14} /> 다시 묻기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GreekOracle;
