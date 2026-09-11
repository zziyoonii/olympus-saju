// Parses a CSS declaration string ("color:#fff; font-size:12px") into a React
// inline-style object. Lets screen components keep the exact declarations from
// the design spec instead of hand-retyping each one into camelCase JS.
export function sx(str) {
  const obj = {};
  if (!str) return obj;
  String(str)
    .split(';')
    .forEach((decl) => {
      const idx = decl.indexOf(':');
      if (idx === -1) return;
      let prop = decl.slice(0, idx).trim();
      const val = decl.slice(idx + 1).trim();
      if (!prop || !val) return;
      prop = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      obj[prop] = val;
    });
  return obj;
}
