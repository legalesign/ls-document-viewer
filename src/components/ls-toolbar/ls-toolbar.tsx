import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement, LSApiTemplate, LsDocumentViewer } from '../../components';

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

  render() {
    return (
      <Host>
        {this.dataItem && this.dataItem.length > 1 ? (
          <div class={'rowbox'}>
            <select class="ls-participant-select">
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
        ) : (
          <div class={'rowbox'}>
            <select class="ls-participant-select">
              <option value="0">Sender</option>
              {this.template.roles.map(r => (
                <option value={r.id}>{r.name}</option>
              ))}
            </select>
            {this.dataItem && this.dataItem.length === 1 && <ls-field-format dataItem={this?.dataItem} />}
          </div>
        )}
        <slot></slot>
      </Host>
    );
  }
}
