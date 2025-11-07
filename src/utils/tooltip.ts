export function attachTooltip(referenceEl: HTMLElement, tooltipText: string, tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right') {
  const tooltip = document.createElement('ls-tooltip');
  tooltip.textContent = tooltipText;
  tooltip.referenceElement = referenceEl;
  tooltip.placement = tooltipPlacement || 'top';
  document.body.appendChild(tooltip);
}

export function attachAllTooltips(root: ShadowRoot | HTMLElement) {
  const tooltipTargets = root.querySelectorAll('[data-tooltip]');
  tooltipTargets.forEach(tt => {
    const text = tt.getAttribute('data-tooltip');
    const placement = tt.getAttribute('data-tooltip-placement') as 'top' | 'bottom' | 'left' | 'right';
    attachTooltip(tt as HTMLElement, text, placement);
  });
}
