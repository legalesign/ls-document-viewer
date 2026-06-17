import { Component, h } from '@stencil/core';
import { dvI18n } from '../../i18n/i18n';

@Component({
  tag: 'ls-keyboard-shortcuts',
  styleUrl: 'ls-keyboard-shortcuts.scss',
  shadow: true,
})
export class LsKeyboardShortcuts {

  private isMac = navigator.platform?.toLowerCase().includes('mac') || navigator.userAgent?.toLowerCase().includes('mac');

  private get mod() {
    return this.isMac ? '⌘' : 'Ctrl';
  }

  render() {
    const shortcuts = [
      { keys: `${this.mod} + C`, label: dvI18n.t('shortcuts.copy') },
      { keys: `${this.mod} + V`, label: dvI18n.t('shortcuts.paste') },
      { keys: `${this.mod} + X`, label: dvI18n.t('shortcuts.cut') },
      { keys: `${this.mod} + A`, label: dvI18n.t('shortcuts.selectall') },
      { keys: `${this.mod} + Z`, label: dvI18n.t('shortcuts.undo') },
      { keys: this.isMac ? '⌘ + ⇧ + Z' : 'Ctrl + Y', label: dvI18n.t('shortcuts.redo') },
      { keys: 'D', label: dvI18n.t('shortcuts.duplicate') },
      { keys: '⌫', label: dvI18n.t('shortcuts.delete') },
      { keys: '↑ ↓ ← →', label: dvI18n.t('shortcuts.move') },
      { keys: `${this.mod} + Scroll`, label: dvI18n.t('shortcuts.zoom') },
      { keys: 'Esc', label: dvI18n.t('shortcuts.deselect') },
    ];

    return (
      <div class={'ls-dv-keyboard-shortcuts-tooltip'}>
        <div id="arrow"></div>
        <p class="ls-dv-tooltip-title">{dvI18n.t('shortcuts.title')}</p>
        <table class="ls-dv-shortcuts-table">
          {shortcuts.map(s => (
            <tr>
              <td class="ls-dv-shortcut-keys">{s.keys}</td>
              <td class="ls-dv-shortcut-label">{s.label}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
