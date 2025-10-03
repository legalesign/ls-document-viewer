import { Component, Host, Prop, h } from '@stencil/core';
import { LSApiElement } from '../../components';
import { validationTypes } from '../ls-document-viewer/editorUtils';

@Component({
  tag: 'ls-field-properties-date',
  styleUrl: 'ls-field-properties-date.css',
  shadow: true,
})
export class LsFieldPropertiesDate {
  @Prop() dataItem: LSApiElement;
  @Prop() fieldSet: 'content' | 'placement' | 'dimensions' = 'content';

  render() {
    return (
      <Host>
        <div class={'tabs-container'}>
          <button class={this.fieldSet === 'content' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'content')}>
            Content
          </button>
          <button class={this.fieldSet === 'placement' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'placement')}>
            Placement
          </button>
          <button class={this.fieldSet === 'dimensions' ? 'ls-tab active' : 'ls-tab'} onClick={() => (this.fieldSet = 'dimensions')}>
            Dimensions
          </button>
        </div>
        <div class={'scrolling-container'}>
          {this.fieldSet === 'placement' ? (
            <ls-field-placement dataItem={this.dataItem} />
          ) : this.fieldSet === 'dimensions' ? (
            <div class={'field-set'}>
              <ls-field-dimensions dataItem={this.dataItem} />
              <ls-field-properties-advanced dataItem={this.dataItem} />
            </div>
          ) : (
            <div class={'field-set'}>
              <ls-props-section sectionTitle="Field Type" sectionDescription="The Field you currently have selected">
                <ls-field-type-display fieldType={this.dataItem?.elementType} assignee={this.dataItem?.signer} />
              </ls-props-section>
              <ls-props-section sectionTitle="Required Field" row={true}>
                <ls-toggle />
              </ls-props-section>
              <ls-props-section sectionTitle="Field Label" sectionDescription="Add a label to clarify the information required from the Recipient.">
                <input value={this.dataItem?.label} placeholder="eg. Sign Here" />
              </ls-props-section>
              <ls-props-section sectionTitle="Content Format" sectionDescription="Select the specific format you want the Recipient to enter.">
                <div class={'input-wrapper'}>
                  <ls-icon id="selectorIcon" name="selector"></ls-icon>
                  <select>
                    {validationTypes
                      .filter(type => type.formType === this.dataItem?.elementType)
                      .map(type => (
                        <option selected={this.dataItem?.validation === type.id} value={type.value}>
                          {type.description}
                        </option>
                      ))}
                  </select>
                </div>
              </ls-props-section>
            </div>
          )}
        </div>
        <ls-field-footer dataItem={this.dataItem} />
        <slot></slot>
      </Host>
    );
  }
}
