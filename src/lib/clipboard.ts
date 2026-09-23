/**
 * Safe and universal clipboard copy utility.
 * Handles iframe constraints, document focus states, and mobile fallbacks.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try focusing window first if allowed
  try {
    if (typeof window !== 'undefined' && typeof window.focus === 'function') {
      window.focus();
    }
  } catch {
    // Ignore any focus errors inside cross-origin sandboxes
  }

  // 1. Try modern navigator.clipboard only if document has focus
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      // If document.hasFocus is available, ensure we have focus
      const hasFocus = typeof document !== 'undefined' && typeof document.hasFocus === 'function'
        ? document.hasFocus()
        : true;

      if (hasFocus) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Failed (e.g. document not focused or permission denied) - proceed to execCommand fallback
    }
  }

  // 2. Reliable fallback: document.execCommand('copy') with hidden textarea
  try {
    if (typeof document !== 'undefined' && document.body) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Prevent mobile auto-zooming and layout shift
      textarea.style.fontSize = '12pt';
      textarea.style.border = '0';
      textarea.style.padding = '0';
      textarea.style.margin = '0';
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = `${window.pageYOffset || document.documentElement.scrollTop || 0}px`;
      textarea.setAttribute('readonly', '');

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        return true;
      }
    }
  } catch {
    // execCommand failed
  }

  // 3. Final attempt with navigator.clipboard without throwing unhandled error
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Graceful degradation - do not log console error to prevent app crashes
      return false;
    }
  }

  return false;
}
