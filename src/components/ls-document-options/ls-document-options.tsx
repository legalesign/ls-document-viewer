import { Component, Host, h, Prop, Watch } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';

@Component({
  tag: 'ls-document-options',
  styleUrl: 'ls-document-options.css',
  shadow: true,
})
export class LsDocumentOptions {
  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  @Watch('template')
  selectedHandler(newSelected, _oldSelected) {
    console.log(newSelected, 'document manager');
  }

  render() {
    return (
      <Host>
        <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Template Details</h2>
          <p class="toolbox-section-description">Details and insights about the Template.</p>
        </div>
        <div class={'template-details'}>
          <div class={'template-detail-section'}>
            <ls-formfield label="Name" as="text" value={this.template?.title} />
          </div>
          <div class={'template-detail-section'}>
            <ls-formfield label="Auto Archive" as="radio" value={'false'} />
          </div>
          <div class={'template-detail-section column'}>
            <p>Pages</p> {this.template?.pageDimensionArray?.length}
          </div>
          <div class={'template-detail-section column'}>
            <p>Date Created</p> {this.template?.created}
          </div>
          <div class={'template-detail-section column'}>
            <p>Created By</p> {this.template?.createdBy}
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
