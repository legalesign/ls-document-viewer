import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Component, Element, Prop, h } from '@stencil/core';

@Component({
  tag: 'ls-tooltip',
  styleUrl: 'ls-tooltip.css',
  shadow: true,
})
export class LsTooltip {
  @Element() el: HTMLElement;
  @Prop() referenceElement: HTMLElement;
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipEl: HTMLElement;
  private tooltipLocked = false;

  componentDidLoad() {
    this.tooltipEl = this.el.shadowRoot.querySelector('.tooltip');
    const arrowElement = this.el.shadowRoot.querySelector('#arrow'); // use shadowRoot for internal elements

    if (!this.tooltipEl || !this.referenceElement) return;

    const update = () => {
      computePosition(this.referenceElement, this.tooltipEl, {
        placement: this.placement,
        middleware: [offset(6), flip(), shift({ padding: 5 }), arrow({ element: arrowElement })],
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(this.tooltipEl.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        const { x: arrowX, y: arrowY } = middlewareData.arrow || {};
        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];

        Object.assign((arrowElement as HTMLElement).style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        });
      });
    };

    const showTooltip = () => {
      if (this.tooltipLocked) return;
      this.tooltipEl.style.display = 'block';
      update();
    };

    const hideTooltip = () => {
      if (this.tooltipLocked) return;
      this.tooltipEl.style.display = 'none';
    };

    [
      ['mouseenter', showTooltip],
      ['mouseleave', hideTooltip],
      ['focus', showTooltip],
      ['blur', hideTooltip],
    ].forEach(([event, listener]) => {
      this.referenceElement.addEventListener(event as string, listener as EventListener);
    });
    this.referenceElement.addEventListener('click', () => {
      hideTooltip();
      this.tooltipLocked = true;
      setTimeout(() => {
        this.tooltipLocked = false;
      }, 500);
    });
  }

  render() {
    return (
      <div class="tooltip" role="tooltip">
        <div id="arrow"></div>
        <slot />
      </div>
    );
  }
}
