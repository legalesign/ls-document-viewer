import { Component, Host, h, Prop, Event, EventEmitter, Element, State } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-document-options',
  styleUrl: 'ls-document-options.scss',
  shadow: true,
})
export class LsDocumentOptions {
  @Element() component: HTMLElement;
  /**
   * The base template information (as JSON).
   * {LSApiTemplate}
   */
  @Prop({ mutable: true, reflect: true }) template: LSApiTemplate;

  @State() editTitle: boolean = false;



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
      this.template = { ...this.template, ...diff };
      const diffs: LSMutateEvent[] = [{ action: 'update', data: this.template }];
      this.mutate.emit(diffs);
    }, delay);
  }

  componentDidLoad() {
  }

  render() {
    function formatDate(isoString) {
      if (!isoString) return '-';
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '-';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    }
    return (
      <Host>
        <div class="ls-dv-editor-infobox">
          <h2 class="ls-dv-toolbox-section-title">{dvI18n.t('documentoptions.title')}</h2>
          <p class="ls-dv-toolbox-section-description">{dvI18n.t('documentoptions.description')}</p>
        </div>
        <div class={'ls-dv-template-details'}>
          <div class={'ls-dv-template-detail-section ls-dv-column'}>
            <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.name')}</p>
            <div
              class="ls-dv-edit-button"
              onClick={() => {
                this.editTitle = !this.editTitle;
              }}
            >
              <ls-icon
                name={this.editTitle ? 'check-icon' : 'pencil-alt-icon'}
                size={20}
                id="edit-name-btn"
                data-tooltip-id="ls-dv-tooltip" data-tooltip-content={this.editTitle ? dvI18n.t('common.save') : dvI18n.t('documentoptions.editname')}
              />
            </div>
            {this.editTitle ? (
              <input
                value={this.template?.title}
                style={{ width: '100%' }}
                onInput={e => {
                  e.preventDefault();
                  this.alter({ title: (e.target as HTMLInputElement).value });
                }}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.keyCode === 13) this.editTitle = false;
                }}
              />
            ) : (
              <div
                class="ls-dv-template-title"
                onClick={() => {
                  this.editTitle = !this.editTitle;
                }}
              >
                <p>{this.template?.title}</p>
              </div>
            )}
          </div>
          <div class={'ls-dv-template-detail-section'}>
            <div>
              <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.autoarchive')}</p>
              <p class={'ls-dv-template-detail-section-info'}>{dvI18n.t('documentoptions.autoarchivedescription')}</p>
            </div>
            {/* <ls-formfield as="radio" value={'false'} /> */}
            <ls-toggle
              checked={this.template?.autoArchive}
              onValueChange={e => {
                this.alter({ autoArchive: e.detail });
              }}
            ></ls-toggle>
          </div>
          <div class={'ls-dv-template-detail-section'}>
            <div>
              <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.locktemplate')}</p>
              <p class={'ls-dv-template-detail-section-info'}>{dvI18n.t('documentoptions.locktemplatedescription')}</p>
            </div>
            <ls-toggle
              checked={this.template?.locked}
              onValueChange={e => {
                this.alter({ locked: e.detail });
              }}
            ></ls-toggle>
          </div>
          <div class={'ls-dv-template-detail-section'}>
            <div>
              <p class="ls-dv-template-detail-section-title" tooltip-data="Fixes the aspect ratio of all signatures on the document. This allows Participants to re-use the same signature throughout the signing process. If this setting is turned on after several signature fields have been placed, fields will automatically re-size to match the aspect ratio of the first signature on the Template.">{dvI18n.t('documentoptions.fixedsignatureaspect')}</p>
              <p class={'ls-dv-template-detail-section-info'}>{dvI18n.t('documentoptions.fixedsignatureaspectdescription')}</p>
            </div>

            <ls-toggle
              checked={this.template?.fixSignatureScale}
              onValueChange={e => {
                this.alter({ fixSignatureScale: e.detail });
              }}
            ></ls-toggle>
          </div>
          <div class={'ls-dv-template-detail-section ls-dv-column'}>
            <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.documentretention')}</p>
            <p>
              <input
                type='number'
                min='0'
                value={this.template?.documentRetentionDays}
                style={{ width: '100%' }}
                onInput={e => {
                  e.preventDefault();
                  this.alter({ documentRetentionDays: (e.target as HTMLInputElement).value });
                }}
              />
              </p>
          </div>
          <div class={'ls-dv-template-detail-section ls-dv-column'}>
            <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.pages')}</p>
            <p>{this.template?.pageCount}</p>
          </div>
          <div class={'ls-dv-template-detail-section ls-dv-column'}>
            <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.datecreated')}</p> <p>{formatDate(this.template?.created)}</p>
          </div>
          <div class={'ls-dv-template-detail-section ls-dv-column'}>
            <p class="ls-dv-template-detail-section-title">{dvI18n.t('documentoptions.createdby')}</p> <p>{this.template?.createdBy}</p>
          </div>
        </div>
        <slot></slot>
        <ls-tooltip tooltipId="ls-dv-tooltip" />
      </Host>
    );
  }
}
