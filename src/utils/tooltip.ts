export function showTooltip(event) {
  const rootNode = this.getRootNode();
  const tooltip = rootNode.getElementById('ls-tooltip-master') as HTMLLsDvTooltipElement;
  tooltip.referenceElement = event.currentTarget as HTMLElement;
}

export function hideTooltip(_event) {
 const rootNode = this.getRootNode();
  const tooltip = rootNode.getElementById('ls-tooltip-master') as HTMLLsDvTooltipElement;
  // if (this.tooltipLocked) return;
  tooltip.hide();
}

export function attachAllTooltips(root: ShadowRoot | Document) {
  const tooltipTargets = root.querySelectorAll('[data-tooltip]');
  tooltipTargets.forEach(tt => {
   
      tt.addEventListener('mouseenter', showTooltip);
      tt.addEventListener('mouseleave', hideTooltip);
      tt.addEventListener('focus', showTooltip);
      tt.addEventListener('blur', hideTooltip);
    // tt.addEventListener('click', (e) => {
    //   hideTooltip(e);
    //   this.tooltipLocked = true;
    //   setTimeout(() => {
    //     this.tooltipLocked = false;
    //   }, 500);
    // });
  });
}

