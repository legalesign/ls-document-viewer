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
            header?
            <div class="compose-loader__header-bar">
              <span class="compose-loader__header-title">Quick Send / Preparation</span>
              <span class="compose-loader__header-docname"></span>
            </div>
          </div>
          <div class="compose-loader__main">
            <div class="compose-loader__sidebar">
              <div class="compose-loader__card">
                <div class="compose-loader__skeleton skeleton-title"></div>
                <div class="compose-loader__skeleton-group">
                  <div class="compose-loader__skeleton skeleton-line"></div>
                  <div class="compose-loader__skeleton skeleton-short"></div>
                </div>
                <div class="compose-loader__section">
                  <div class="compose-loader__skeleton-box"></div>
                  <div class="compose-loader__skeleton skeleton-line"></div>
                  <div class="compose-loader__skeleton skeleton-short"></div>
                </div>
                <div class="compose-loader__section compose-loader__section--blue">
                  <div class="compose-loader__skeleton-box"></div>
                  <div class="compose-loader__skeleton skeleton-line"></div>
                  <div class="compose-loader__skeleton skeleton-short"></div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                </div>
                <div class="compose-loader__section compose-loader__section--green">
                  <div class="compose-loader__skeleton-box"></div>
                  <div class="compose-loader__skeleton skeleton-line"></div>
                  <div class="compose-loader__skeleton skeleton-short"></div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
                    <div class="compose-loader__row-content">
                      <div class="compose-loader__skeleton skeleton-medium"></div>
                      <div class="compose-loader__skeleton skeleton-icon"></div>
                    </div>
                  </div>
                  <div class="compose-loader__row">
                    <div class="compose-loader__icon-skeleton"></div>
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
              <button class="compose-loader__action-btn" disabled>
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
