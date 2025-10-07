import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { validationTypes } from '../ls-document-viewer/editorUtils';

@Component({
  tag: 'ls-field-content',
  styleUrl: 'ls-field-content.css',
  shadow: true,
})
export class LsFieldContent {
  @Prop({ mutable: true }) dataItem: LSApiElement;
  @Prop() showValidationTypes: boolean = true;

  render() {
    return (
      <Host>
        <ls-props-section sectionTitle="Field Type" sectionDescription="The Field you currently have selected">
          <ls-field-type-display fieldType={this.dataItem?.elementType} assignee={this.dataItem?.signer} />
        </ls-props-section>
        <ls-props-section sectionTitle="Required Field" row={true}>
          <ls-toggle />
        </ls-props-section>
        <ls-props-section sectionTitle="Field Label" sectionDescription="Add a label to clarify the information required from the Recipient.">
          <input value={this.dataItem?.label} placeholder="eg. Sign Here" />
        </ls-props-section>
        {this.showValidationTypes && (
          <ls-props-section sectionTitle="Content Format" sectionDescription="Select the specific format you want the Recipient to enter.">
            <ls-input-wrapper select>
              <select>
                {validationTypes
                  .filter(type => type.formType === this.dataItem?.elementType)
                  .map(type => (
                    <option selected={this.dataItem?.validation === type.id} value={type.value}>
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
