import { Component, Host, Prop, h, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiElement, LSMutateEvent } from '../../components';
import { validationTypes } from '../ls-document-viewer/editorUtils';

@Component({
  tag: 'ls-field-content',
  styleUrl: 'ls-field-content.css',
  shadow: true,
})
export class LsFieldContent {
  @Element() component: HTMLElement;
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() showValidationTypes: boolean = true;

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

  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object) {
    this.dataItem = { ...this.dataItem, ...diff };
    this.debounce(this.dataItem, 500);
  }

  private labeltimer;

  debounce(data, delay) {
    if (this.labeltimer) clearTimeout(this.labeltimer);

    this.labeltimer = setTimeout(() => {
      const diffs: LSMutateEvent[] = [{ action: 'update', data }];
      this.mutate.emit(diffs);
      this.update.emit(diffs);
    }, delay);
  }

  render() {
    return (
      <Host>
        <ls-props-section sectionTitle="Field Type" sectionDescription="The Field you currently have selected">
          <ls-field-type-display fieldType={this.dataItem?.elementType} assignee={this.dataItem?.signer} />
        </ls-props-section>
        <ls-props-section sectionTitle="Required Field" row={true}>
          <ls-toggle id="toggle-required" checked={!this.dataItem?.optional} onValueChange={(ev) => this.alter({ optional: !ev.detail })} />
        </ls-props-section>
        <ls-props-section sectionTitle="Field Label" sectionDescription="Add a label to clarify the information required from the Recipient.">
          <input value={this.dataItem?.label} placeholder="eg. Sign Here" onInput={(e) => this.alter({ label: (e.target as HTMLInputElement).value })} />
        </ls-props-section>
        <ls-props-section sectionTitle="Value" sectionDescription="A prefilled value that can be altered by the signer.">
          <input value={this.dataItem?.value} placeholder="e.g. Gordon Smith" onInput={(e) => this.alter({ value: (e.target as HTMLInputElement).value })} />
        </ls-props-section>
        {this.dataItem.validation === 20 && (
          <ls-props-section sectionTitle="Options" sectionDescription="Define the options available in the dropdown. One option per line.">
            <textarea value={this.dataItem?.options} placeholder="Option 1&#10;Option 2&#10;Option 3" onInput={(e) => this.alter({ options: (e.target as HTMLTextAreaElement).value })} />
          </ls-props-section>
        )}

        {this.showValidationTypes && (
          <ls-props-section sectionTitle="Content Format" sectionDescription="Select the specific format you want the Recipient to enter.">
            <ls-input-wrapper select>
              <select onChange={(ev) => this.alter({ validation: parseInt((ev.target as HTMLSelectElement).value) })} >
                {validationTypes
                  .filter(type => type.formType === this.dataItem?.elementType)
                  .map(type => (
                    <option selected={this.dataItem?.validation === type.id} value={type.id}>
                      {type.description}
                    </option>
                  ))}
              </select>
            </ls-input-wrapper>
          </ls-props-section>
        )}
        <slot></slot>
      </Host>
    );
  }
}
