import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Component, Element, Method, Prop, Watch, h } from '@stencil/core';

@Component({
  tag: 'ls-tooltip',
  styleUrl: 'ls-tooltip.css',
  shadow: true,
})
export class LsTooltip {
  @Element() el: HTMLElement;
  @Prop() referenceElement: HTMLElement;
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Prop() tooltipText: string;
  @Prop() tooltipLocked = false;

  @Watch('referenceElement')
  updateReferenceHandler(newReference: HTMLElement) {
    this.tooltipText = newReference.getAttribute("data-tooltip");
    this.placement = newReference.getAttribute('data-tooltip-placement') as 'top' | 'bottom' | 'left' | 'right' || 'top'; 

    const arrowElement = this.el.shadowRoot.querySelector('#arrow'); // use shadowRoot for internal elements
    const innerTooltip = this.el.shadowRoot.getElementById('ls-tooltop-inner') as HTMLElement;
    
    // if (!this.tooltipEl || !this.referenceElement) return;

    computePosition(this.referenceElement, innerTooltip, {
      placement: this.placement,
      middleware: [offset(0), flip(), shift({ padding: 0 }), arrow({ element: arrowElement })],
    }).then(({ x, y, placement, middlewareData }) => {

      Object.assign(innerTooltip.style, {
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
    }).then(() => {
            innerTooltip.classList.remove('hidden');
      innerTooltip.classList.add('visible');
    });
   
  };

  @Method()
  async hide() {
    const innerTooltip = this.el.shadowRoot.getElementById('ls-tooltop-inner') as HTMLElement;
    innerTooltip.classList.remove('visible');
    innerTooltip.classList.add('hidden');
  }

  render() {
    return (
      <div id="ls-tooltop-inner" class="tooltip hidden" role="tooltip">
        <div id="arrow"></div>
        {this.tooltipText}
        <slot />
      </div>
    );
  }
}
