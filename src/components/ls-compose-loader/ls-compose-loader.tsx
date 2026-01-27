import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ls-compose-loader',
  styleUrl: 'ls-compose-loader.css',
  shadow: true,
})
export class LsComposeLoader {
  render() {
    return (
      <Host>
        <div class="compose-loader">
          <div class="compose-loader__header">
            <div class="compose-loader__header-skeleton"></div>
          </div>

          <div class="compose-loader__main">
            <div class="compose-loader__sidebar">
              <div class="compose-loader__card">
                <div class="compose-loader__skeleton skeleton-title"></div>
                <div class="compose-loader__skeleton-group">
                  <div class="compose-loader__skeleton skeleton-line"></div>
                  <div class="compose-loader__skeleton skeleton-short"></div>
                </div>
                <div class="compose-loader__section compose-loader__section--gray">
                  <div class="compose-loader__skeleton-box--gray"></div>
                  <div class="compose-loader__skeleton skeleton-line--gray"></div>
                  <div class="compose-loader__skeleton skeleton-short--gray"></div>
                </div>
                <div class="compose-loader__section compose-loader__section--blue">
                  <div class="compose-loader__skeleton-box--blue"></div>
                  <div class="compose-loader__skeleton skeleton-line--blue"></div>
                  <div class="compose-loader__skeleton skeleton-short--blue"></div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--blue">
                      <div class="compose-loader__icon--blue"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--blue">
                      <div class="compose-loader__icon--blue"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--blue">
                      <div class="compose-loader__icon--blue"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                </div>
                <div class="compose-loader__section compose-loader__section--green">
                  <div class="compose-loader__skeleton-box--green"></div>
                  <div class="compose-loader__skeleton skeleton-line--green"></div>
                  <div class="compose-loader__skeleton skeleton-short--green"></div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--green">
                      <div class="compose-loader__icon--green"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--green">
                      <div class="compose-loader__icon--green"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton--green">
                      <div class="compose-loader__icon--green"></div>
                    </div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="compose-loader__preview">
              <div class="compose-loader__preview-box"></div>
            </div>
            <div class="compose-loader__button">
              <button class="compose-loader__action-btn">
                <div class="compose-loader__skeleton skeleton-btn"></div>
                <div class="compose-loader__skeleton skeleton-btn-icon"></div>
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
