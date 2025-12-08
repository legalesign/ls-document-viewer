import { Component, Host, h, Prop, Watch, Event, EventEmitter, Element, State } from '@stencil/core';
import { LSApiTemplate } from '../../types/LSApiTemplate';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { attachAllTooltips } from '../../utils/tooltip';

@Component({
  tag: 'ls-title-input',
  styleUrl: 'ls-title-input.css',
  shadow: true,
})
export class LsTitleInput {
  @Element() component: HTMLElement;
  @Prop({ mutable: true, reflect: true }) template: LSApiTemplate;

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
      this.template = { ...this.template, ...diff };
      const diffs: LSMutateEvent[] = [{ action: 'update', data: this.template }];
      this.update.emit(diffs);
      this.mutate.emit(diffs);
    }, delay);
  }

  componentDidLoad() {
    attachAllTooltips(this.component.shadowRoot);
  }
  render() {
    return (
      <Host>
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
            class="template-title"
            onClick={() => {
              this.editTitle = !this.editTitle;
            }}
          >
            <p>{this.template?.title}</p>
          </div>
        )}
      </Host>
    );
  }
}
