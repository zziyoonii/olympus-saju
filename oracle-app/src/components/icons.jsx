const ICONS = {
  '제우스': 'M14.5 2 L6.5 13.5 H11 L9.5 22 L18 10 H13.2 Z',
  '헤라': 'M4 19 H20 M4 19 L6 7.5 L9.6 12.5 L12 4.5 L14.4 12.5 L18 7.5 L20 19',
  '아프로디테': 'M3.2 18.5 a8.8 8.8 0 0 1 17.6 0 Z M12 18.5 V6.2 M7.6 18.5 L9.6 7.4 M16.4 18.5 L14.4 7.4',
  '아레스': 'M12 2.2 L14.2 6 V15 H9.8 V6 Z M8 15 H16 M12 15 V21.5 M10.2 18.4 H13.8',
  '헤르메스': 'M12 2.5 V21.5 M8 6.4 c2.6 2.4 5.4 2.4 8 0 M8 11.2 c2.6 2.4 5.4 2.4 8 0 M8 16 c2.6 2.4 5.4 2.4 8 0 M9.4 3.6 L12 2.5 L14.6 3.6',
  '아폴론': 'M12 6.6 a5.4 5.4 0 1 0 0 10.8 a5.4 5.4 0 0 0 0-10.8 M12 1.5 V4 M12 20 V22.5 M1.5 12 H4 M20 12 H22.5 M4.6 4.6 L6.4 6.4 M17.6 17.6 L19.4 19.4 M19.4 4.6 L17.6 6.4 M6.4 17.6 L4.6 19.4',
  '아르테미스': 'M15.8 2.6 a9.6 9.6 0 1 0 0 18.8 a7.4 7.4 0 1 1 0-18.8 M4.5 19.5 L19.5 4.5 M19.5 4.5 H15.2 M19.5 4.5 V8.8',
  '아테나': 'M8.6 10.4 a2.5 2.5 0 1 0 0 .1 M15.4 10.4 a2.5 2.5 0 1 0 0 .1 M4.6 8.4 L3 4.6 L6.6 6.2 M19.4 8.4 L21 4.6 L17.4 6.2 M12 12.6 V15 M5 9 c0 7 3.2 11 7 11 s7-4 7-11',
  '포세이돈': 'M12 21.8 V8 M5.6 8 V3.2 M18.4 8 V3.2 M12 8 V2.6 M5.6 8 H18.4 M9 21.8 H15',
  '데메테르': 'M12 21.5 V7 M12 7 c-2.6-1.4-3.6-3.4-3.4-5 2.2.2 3.4 2 3.4 5 M12 7 c2.6-1.4 3.6-3.4 3.4-5-2.2.2-3.4 2-3.4 5 M12 12 c-2.4-1.2-3.4-3-3.2-4.6 2 .2 3.2 1.8 3.2 4.6 M12 12 c2.4-1.2 3.4-3 3.2-4.6-2 .2-3.2 1.8-3.2 4.6 M12 17 c-2.2-1-3.2-2.8-3-4.2 1.8.2 3 1.6 3 4.2 M12 17 c2.2-1 3.2-2.8 3-4.2-1.8.2-3 1.6-3 4.2',
  '헤파이스토스': 'M4.5 6 H14.5 V11 H4.5 Z M14.5 8.5 H19.5 M11 11 L9.4 21.5 M7.6 21.5 H11.6',
  '디오니소스': 'M12 2.5 V6.5 M12 6.5 c2.4-1.6 4.4-1.8 5.6-1.2 M9.2 9 a2.1 2.1 0 1 0 0 .1 M14.8 9 a2.1 2.1 0 1 0 0 .1 M12 12.6 a2.1 2.1 0 1 0 0 .1 M7.4 13.4 a2.1 2.1 0 1 0 0 .1 M16.6 13.4 a2.1 2.1 0 1 0 0 .1 M9.6 17.2 a2.1 2.1 0 1 0 0 .1 M14.4 17.2 a2.1 2.1 0 1 0 0 .1 M12 20.8 a1.8 1.8 0 1 0 0 .1',
  '크로노스': 'M5.5 2.5 H18.5 M5.5 21.5 H18.5 M6.4 2.5 C6.4 8 12 10.6 12 12 C12 13.4 6.4 16 6.4 21.5 M17.6 2.5 C17.6 8 12 10.6 12 12 C12 13.4 17.6 16 17.6 21.5'
};

export function Icon({ god, size = 24, color = '#C9A227', stroke = 1.1 }) {
  const d = ICONS[god] || ICONS['제우스'];
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ display: 'block', filter: `drop-shadow(0 0 12px ${color}55)` }}
    >
      <path d={d} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TempleArt() {
  const cols = [20, 40, 60, 80, 100, 120, 140];
  return (
    <svg width={168} height={76} viewBox="0 0 168 76" fill="none">
      <path d="M8 30 L84 4 L160 30" stroke="#C9A227" strokeWidth={1} strokeOpacity={.75} strokeLinejoin="round" />
      <path d="M14 30 L84 12 L154 30 Z" stroke="#C9A227" strokeWidth={.6} strokeOpacity={.3} />
      <path d="M4 30 H164 M6 36 H162" stroke="#C9A227" strokeWidth={1} strokeOpacity={.55} />
      <path d="M0 70 H168 M8 64 H160" stroke="#C9A227" strokeWidth={1} strokeOpacity={.45} />
      {cols.map((x) => (
        <path key={x} d={`M${x} 36 V64 M${x + 8} 36 V64`} stroke="#C9A227" strokeWidth={.8} strokeOpacity={.32} />
      ))}
    </svg>
  );
}

export function FlameArt() {
  return (
    <svg width={34} height={48} viewBox="0 0 34 48" fill="none">
      <path d="M17 2 C24 13 29 19 29 27 C29 36 23.5 44 17 44 C10.5 44 5 36 5 27 C5 19 10 13 17 2 Z" stroke="#C9A227" strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M17 15 C21 22 23 25 23 30 C23 35.5 20.4 40 17 40 C13.6 40 11 35.5 11 30 C11 25 13 22 17 15 Z" fill="#C9A227" fillOpacity={.32} />
    </svg>
  );
}
