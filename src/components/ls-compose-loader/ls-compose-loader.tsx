import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-compose-loader',
  styleUrl: 'ls-compose-loader.scss',
  shadow: true,
})
export class LsComposeLoader {
  render() {
    return (
      <Host>
        <div class="ls-dv-compose-loader">
          <div class="ls-dv-compose-loader__header">
            <div class="ls-dv-compose-loader__header-skeleton"></div>
          </div>

          <div class="ls-dv-compose-loader__main">
            <div class="ls-dv-compose-loader__sidebar">
              <div class="ls-dv-compose-loader__card">
                <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-title"></div>
                <div class="ls-dv-compose-loader__skeleton-group">
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-line"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-short"></div>
                </div>
                <div class="ls-dv-compose-loader__section ls-dv-compose-loader__section--gray">
                  <div class="ls-dv-compose-loader__skeleton-box--gray"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-line--gray"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-short--gray"></div>
                </div>
                <div class="ls-dv-compose-loader__section ls-dv-compose-loader__section--blue">
                  <div class="ls-dv-compose-loader__skeleton-box--blue"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-line--blue"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-short--blue"></div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--blue">
                      <div class="ls-dv-compose-loader__icon--blue"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--blue">
                      <div class="ls-dv-compose-loader__icon--blue"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--blue">
                      <div class="ls-dv-compose-loader__icon--blue"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                </div>
                <div class="ls-dv-compose-loader__section ls-dv-compose-loader__section--green">
                  <div class="ls-dv-compose-loader__skeleton-box--green"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-line--green"></div>
                  <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-short--green"></div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--green">
                      <div class="ls-dv-compose-loader__icon--green"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--green">
                      <div class="ls-dv-compose-loader__icon--green"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="ls-dv-compose-loader__row">
                    <div class="ls-dv-compose-loader__icon-skeleton--green">
                      <div class="ls-dv-compose-loader__icon--green"></div>
                    </div>
                    <div class="ls-dv-compose-loader__row-content">
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-medium"></div>
                      <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-icon"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ls-dv-compose-loader__preview">
              <div class="ls-dv-compose-loader__preview-box"></div>
            </div>
            <div class="ls-dv-compose-loader__button">
              <button class="ls-dv-compose-loader__action-btn" aria-hidden="true" tabindex={-1}>
                <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-btn"></div>
                <div class="ls-dv-compose-loader__skeleton ls-dv-skeleton-btn-icon"></div>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
