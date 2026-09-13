import { toBlob } from 'html-to-image';

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

// Renders a DOM node (one of the share cards) to a PNG File so it can be
// handed to the OS share sheet or downloaded directly. Embedding the web
// fonts (Cinzel/Noto) needs a network fetch of each font file — on a slow or
// blocked connection that fetch can hang well past any reasonable wait, so
// this tries the full-fidelity render first and falls back to skipping font
// embedding (near-instant, no network) rather than leaving the caller stuck.
export async function nodeToImageFile(node, filename) {
  if (!node) return null;
  const opts = { pixelRatio: 2, cacheBust: true };
  let blob;
  try {
    blob = await withTimeout(toBlob(node, opts), 6000);
  } catch (e) {
    blob = await toBlob(node, { ...opts, skipFonts: true });
  }
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
