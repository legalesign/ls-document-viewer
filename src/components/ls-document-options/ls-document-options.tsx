import { Component, Host, h, Prop, Watch, Event, EventEmitter, Element, State } from '@stencil/core';
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
  @Prop({ mutable: true, reflect: true}) template: LSApiTemplate;

  @State() editTitle: boolean = false;

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


  // Send one or more mutations up the chain
  // The source of the chain fires the mutation
  // NOTE this alter is debounced to account for typing
  alter(diff: object) {
    this.debounce(diff, 500);
  }

  private titletimer;

  debounce(diff, delay) {
    if (this.titletimer) clearTimeout(this.titletimer);

    this.titletimer = setTimeout(() => {
      this.template = { ...this.template, ...diff }
      const diffs: LSMutateEvent[] = [{ action: 'update', data: this.template }];
      this.update.emit(diffs);
      this.mutate.emit(diffs);      
    }, delay);
  }

  render() {
    function formatDate(isoString) {
      const date = new Date(isoString);

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    }
    return (
      <Host>
        <div class="ls-editor-infobox">
          <h2 class="toolbox-section-title">Template Details</h2>
          <p class="toolbox-section-description">Details and insights about the Template.</p>
        </div>
        <div class={'template-details'}>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Name</p>
            <div
              class="editButton"
              onClick={() => {
                this.editTitle = !this.editTitle;
              }}
            >
              <ls-icon name={this.editTitle ? 'check' : 'pencil-alt'} size="18" />
            </div>
            {this.editTitle ? (
              <input
                value={this.template?.title}
                style={{ width: '100%' }}
                onInput={e => {
                  e.preventDefault();
                  this.alter({ title: (e.target as HTMLInputElement).value })
                }}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.keyCode === 13) this.editTitle = false;
                }}
              />
            ) : (
              <p>{this.template?.title}</p>
            )}
          </div>
          <div class={'template-detail-section'}>
            <div>
              <p class="template-detail-section-title">Auto Archive</p>
              <p class={'template-detail-section-info'}>After Sending the Template will be automatically archived.</p>
            </div>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle
              checked={this.template?.autoArchive}
              onValueChange={e => {
                this.alter({ autoArchive: e.detail });
              }}
            ></ls-toggle>
          </div>
          <div class={'template-detail-section'}>
            <div>
              <p class="template-detail-section-title">Lock Template</p>
              <p class={'template-detail-section-info'}>Lock Template to avoid changes being made</p>
            </div>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle
              checked={this.template?.locked}
              onValueChange={e => {
                this.alter({ locked: e.detail });
              }}
            ></ls-toggle>
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Pages</p>
            <p>{this.template?.pageCount}</p>
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Date Created</p> <p>{formatDate(this.template?.created)}</p>
          </div>
          <div class={'template-detail-section column'}>
            <p class="template-detail-section-title">Created By</p> <p>{this.template?.createdBy}</p>
          </div>
        </div>
        <slot></slot>
      </Host>
    );
  }
}
