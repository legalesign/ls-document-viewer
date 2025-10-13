import { Component, Host, Prop, h, Event, EventEmitter, Element, Watch } from '@stencil/core';
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
  }) editor: LsDocumentViewer;

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
    console.log(diff);

    const diffs: LSMutateEvent[] = this.dataItem.map(c => {
      return { action: 'update', data: { ...c, ...diff } as LSApiElement };
    });

    this.dataItem = diffs.map(d => d.data as LSApiElement);
    this.mutate.emit(diffs);
    this.update.emit(diffs);
  }

  @Watch('editor')
  editorhandler() {
    console.log(this.editor.groupInfo)
    var sel = this.component.shadowRoot.getElementById('ls-participant-select') as HTMLLsParticipantSelectElement;
    sel.editor = this.editor;
    console.log(sel)
  }

  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 ? (
          <div class={'rowbox'}>
            <ls-field-format dataItem={this?.dataItem} />
          </div>
        ) : (
          <div class={'rowbox'}>
            {this.dataItem && this.dataItem.length === 1 ? (
              <ls-field-format dataItem={this?.dataItem} />
            ) : (
              <ls-participant-select id="ls-participant-select" roles={this.template?.roles} dataItem={this?.dataItem} editor={this.editor} template={this.template} groupInfo={this.groupInfo} />
            )}
          </div>
        )}
        <slot></slot>
      </Host>
    );
  }
}
