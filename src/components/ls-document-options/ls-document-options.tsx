import { Component, Host, h, Prop, Watch, Event, EventEmitter, Element } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LSMutateEvent } from '../../types/LSMutateEvent';

@Component({
  tag: 'ls-document-options',
  styleUrl: 'ls-document-options.css',
  shadow: true,
})
export class LsDocumentOptions {
  @Element() component: HTMLElement;
  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop() template: LSApiTemplate;

  @Watch('template')
  selectedHandler(newSelected, _oldSelected) {
    console.log(newSelected, 'document manager');
  }

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

  alter(changedDetails: object) {
    this.update.emit([{ action: 'update', data: { ...this.template, ...changedDetails } }]);
    this.mutate.emit([{ action: 'update', data: { ...this.template, ...changedDetails } }]);
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
            <ls-formfield as="text" value={this.template?.title} style={{ width: '100%' }} onValueChange={(e) => { this.alter({ title: e.detail }) }} />
          </div>
          <div class={'template-detail-section'}>
            <p class="template-detail-section-title">Auto Archive</p>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle checked={this.template?.autoArchive} onValueChange={(e) => { this.alter({ autoArchive: e.detail }) }}></ls-toggle>
          </div>
          <div class={'template-detail-section'}>
            <p class="template-detail-section-title">Lock</p>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle  checked={this.template?.locked} onValueChange={(e) => { this.alter({ locked: e.detail }) }}></ls-toggle>
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Pages</p>
            <ls-label text={this.template?.pageCount} />
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
