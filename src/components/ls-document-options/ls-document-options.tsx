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
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Name</p>
            <ls-formfield as="text" value={this.template?.title} style={{ width: '100%'}} />
          </div>
          <div class={'template-detail-section'}>
            <p class="template-detail-section-title">Auto Archive</p>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle></ls-toggle>
          </div>
           <div class={'template-detail-section'}>
            <p class="template-detail-section-title">Lock</p>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle></ls-toggle>
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Pages</p>
            <ls-label text={this.template?.pageDimensionArray?.length} />
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Date Created</p> {this.template?.created}
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Created By</p> {this.template?.createdBy}
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
