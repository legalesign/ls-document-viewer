import { Component, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSApiTemplate, LsDocumentViewer, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-toolbar',
  styleUrl: 'ls-toolbar.css',
  shadow: true,
})
export class LsToolbar {
  @Element() component: HTMLElement;

  /**
   * The selected items information (as JSON).
   * {LSApiElement[]}
   */
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

  /**
   * The group and experience information.
   * {object}
   */
  @Prop() groupInfo: object;

  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  /**
   * The main editor.
   * {LSDocumentViewer}
   */
  @Prop({
    mutable: true,
  })
  editor: LsDocumentViewer;

  @Prop() mode: string;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  mutate: EventEmitter<LSMutateEvent[]>;

  @Event({
    bubbles: true,
    cancelable: true,
    composed: true,
  })
  update: EventEmitter<LSMutateEvent[]>;

  // @Element() component: HTMLElement;

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  alter(diff: object) {
    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
  }

  componentDidLoad() {
    ['mousedown', 'mouseup', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'click', 'dblclick', 'contextmenu'].forEach(eventType => {
      this.component.addEventListener(eventType, e => {
        e.stopPropagation();
      });
    });
  }

  render() {
    return (
      <div class={this.mode !== 'compose' || (this.mode === 'compose' && this.dataItem && this.dataItem.length > 0) ? 'ls-toolbar' : ''}>
        {this.dataItem && this.dataItem.length > 1 ? (
          <div class={'rowbox'}>
            <ls-field-format dataItem={this?.dataItem} />
          </div>
        ) : (
          <div class={'rowbox'}>
            <ls-field-format dataItem={this?.dataItem} />
            <ls-participant-select
              id="ls-participant-select"
              roles={this.template?.roles}
              style={{ display: (this.dataItem && this.dataItem.length === 1) || this.mode === 'compose' ? 'none' : 'block' }}
            />
          </div>
        )}
        <ls-tooltip id="ls-tooltip-master" />
        <slot></slot>
      </div>
    );
  }
}
