export function format(first?: string, middle?: string, last?: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

/**
 * Force close a native date picker on Safari by toggling display.
 * No-op on other browsers where the picker closes automatically.
 */
export const forceCloseDatePicker = (input: HTMLInputElement) => {
  if (!isSafari) return;
  setTimeout(() => {
    input.style.display = 'none';
    requestAnimationFrame(() => { input.style.display = ''; });
  }, 0);
};

