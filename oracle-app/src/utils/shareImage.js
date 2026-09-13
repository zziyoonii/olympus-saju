import { toBlob, getFontEmbedCSS } from 'html-to-image';

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

// Embedding the card's web fonts (Cinzel/Noto) into the exported image means
// fetching the actual font files — on Korean subsets that's a real amount of
// data, and doing that fetch only after the user taps "공유하기" is what made
// the button sit on "카드를 만드는 중…" for several seconds. Instead, start
// that fetch the moment the card is on screen (while the user is still
// looking at it, before they've decided to share) so it's usually already
// done by the time they tap the button.
let fontEmbedCSSPromise = null;
export function prewarmFontEmbed(node) {
  if (!node || fontEmbedCSSPromise) return;
  fontEmbedCSSPromise = getFontEmbedCSS(node).catch(() => '');
}
export function resetFontEmbedPrewarm() {
  fontEmbedCSSPromise = null;
}

// Renders a DOM node (one of the share cards) to a PNG File so it can be
// handed to the OS share sheet or downloaded directly. Never waits long on
// the network: it uses the prewarmed font CSS if it's ready, gives it a
// short grace period if not, and otherwise renders immediately without
// embedded fonts (correct layout/colors/data, system fallback typeface)
// rather than leaving the user staring at a spinner.
export async function nodeToImageFile(node, filename) {
  if (!node) return null;
  let fontEmbedCSS = '';
  if (fontEmbedCSSPromise) {
    try { fontEmbedCSS = (await withTimeout(fontEmbedCSSPromise, 800)) || ''; }
    catch (e) { fontEmbedCSS = ''; }
  }
  const opts = fontEmbedCSS
    ? { pixelRatio: 2, cacheBust: true, fontEmbedCSS }
    : { pixelRatio: 2, cacheBust: true, skipFonts: true };
  const blob = await toBlob(node, opts);
  if (!blob) return null;
  return new File([blob], filename, { type: 'image/png' });
}

export function canShareFiles(file) {
  return !!(navigator.canShare && navigator.canShare({ files: [file] }));
}

// Native share sheet when the platform supports sharing files (iOS Safari 15+,
// Android Chrome). Returns 'shared' | 'cancelled' | 'unsupported'.
export async function shareFile(file, { title, text } = {}) {
  if (!navigator.share || !canShareFiles(file)) return 'unsupported';
  try {
    await navigator.share({ files: [file], title, text });
    return 'shared';
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled';
    return 'unsupported';
  }
}

// Fallback for browsers without Web Share (mostly desktop): trigger a normal
// file download so the user can attach it manually.
export function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
