/**
 * These utils are used to make document-viewer more readable
 * but they must be called using the bind() function so that
 * all code is executed within the correct 'this' scope.
 *
 * Avoid using arrow functions here as they reassign "thiss"
 */

import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';

/**
 * Determines if an element will be plotted out of bounds, i.e. off
 * the page.
 */
export function oob(obj: LSApiElement): boolean {
  if (obj.left + obj.width > obj.pageDimensions.width || obj.top < 0 || obj.left < 0 || obj.top + obj.height > obj.pageDimensions.height) return true;
  else return false;
}

export function alter(diffFn) {
  const diffs: LSMutateEvent[] = this.selected.map(c => {
    return { action: 'update', data: diffFn(c.dataItem) as LSApiElement };
  });
  this.mutate.emit(diffs);
  this.update.emit(diffs);
}

export function resetDataItems() {
  const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];
  this.selected = Array.from(fields).filter(fx => fx.selected);
  this.selectFields.emit(this.selected.map(fx => fx.dataItem));
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// Utility function which extracts the type from any API id
export function getApiType(obj: any) {
  if (!obj?.id) return 'invalid';

  const apiId = atob(obj.id);
  if (apiId.length < 3) return 'invalid';

  const prefix = atob(obj.id).substring(0, 3);

  switch (prefix) {
    case 'ele':
      return 'element';
    case 'rol':
      return 'role';
    case 'tpl':
      return 'template';
    case 'doc':
      return 'document';
    default:
      return 'unknown';
  }
}
