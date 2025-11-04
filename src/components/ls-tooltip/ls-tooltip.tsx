import { Component, Element, Prop, State, h } from '@stencil/core';
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom';

@Component({
  tag: 'ls-tooltip',
  styleUrl: 'ls-tooltip.css',
  shadow: false,
})
export class LsTooltip {
  @Element() el: HTMLElement;
  @Prop() reference: HTMLElement; // Direct reference to the element
  @Prop() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @State() visible = false;

  private tooltipEl: HTMLElement;
  private cleanup: () => void;

  componentDidLoad() {
    const reference = this.reference;
    this.tooltipEl = this.el.shadowRoot.querySelector('.tooltip');

    if (reference && this.tooltipEl) {
      this.cleanup = autoUpdate(reference, this.tooltipEl, () => {
        computePosition(reference, this.tooltipEl, {
          placement: this.placement,
          middleware: [offset(8), flip(), shift()],
        }).then(({ x, y }) => {
          Object.assign(this.tooltipEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      });

      reference.addEventListener('mouseenter', () => {
        this.visible = true;
      });
      reference.addEventListener('mouseleave', () => {
        this.visible = false;
      });
    }
  }

  disconnectedCallback() {
    this.cleanup?.();
  }

  render() {
    console.log('rendering tooltip', this.visible);
    return (
      <div class="tooltip" style={{ display: this.visible ? 'block' : 'none' }}>
        <slot />
      </div>
    );
  }
}
