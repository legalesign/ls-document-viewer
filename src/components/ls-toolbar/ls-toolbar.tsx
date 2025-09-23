import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
import { LSApiElement, LSApiTemplate, LsDocumentViewer, LSMutateEvent } from '../../components';

@Component({
  tag: 'ls-toolbar',
  styleUrl: 'ls-toolbar.css',
  shadow: true,
})
export class LsToolbar {
  /**
   * The selected items information (as JSON).
   * {LSApiElement[]}
   */
  @Prop({
    mutable: true,
  })
  dataItem: LSApiElement[];

  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  /**
   * The base template information (as JSON).
   * {LSDocumentViewer}
   */
  @Prop() editor: LsDocumentViewer;
  
    @Event({
      bubbles: true,
      cancelable: true,
      composed: true
    }) mutate: EventEmitter<LSMutateEvent[]>;
  
    @Event({
      bubbles: true,
      cancelable: true,
      composed: true
    }) update: EventEmitter<LSMutateEvent[]>;
    // @Element() component: HTMLElement;
  
  
    // Send one or more mutations up the chain
    // The source of the chain fires the mutation
    alter(diff: object) {
      console.log(diff)
  
      const diffs: LSMutateEvent[] = this.dataItem.map(c => {
        return { action: "update", data: { ...c, ...diff } as LSApiElement }
      })
  
      this.dataItem = diffs.map(d => d.data as LSApiElement)
      this.mutate.emit(diffs)
      this.update.emit(diffs)
    }
  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 ?

          <div class={"rowbox"}>
            <select class='ls-participant-select' >
              <option value="0">Sender</option>
              {this.template.roles.map(r => (
                <option value={r.id}>{r.name}</option>
              ))}
            </select>
            <ls-field-format dataItem={this?.dataItem} />
            <ls-field-alignment dataItem={this.dataItem} />
            <ls-field-distribute dataItem={this.dataItem} />
            <ls-field-size dataItem={this.dataItem} />
          </div>
          :
          <div class={"rowbox"}>
            <ls-participant-select roles={this.template.roles} dataItem={this?.dataItem}/>

            <ls-field-format dataItem={this?.dataItem} />
          </div>
        )}
        <slot></slot>
      </Host>
    );
  }
}
