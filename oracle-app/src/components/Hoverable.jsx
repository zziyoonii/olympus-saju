import { useState } from 'react';

// Mirrors the prototype's `style-hover` attribute: applies an extra style
// object while the pointer is over the element.
export default function Hoverable({ as: Tag = 'div', style, hoverStyle, ...rest }) {
  const [hover, setHover] = useState(false);
  return (
    <Tag
      {...rest}
      style={hover && hoverStyle ? { ...style, ...hoverStyle } : style}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e); }}
    />
  );
}
