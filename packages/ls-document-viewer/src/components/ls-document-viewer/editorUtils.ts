/**
 * These utils are used to make document-viewer more readable
 * but they must be called using the bind() function so that
 * all code is executed within the correct 'this' scope.
 *
 * Avoid using arrow functions here as they reassign "thiss"
 */

import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { ValidationType } from '../../types/ValidationType';

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

export const validationTypes: any = [
  { id: 0, description: 'general purpose', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 30, description: 'yyyy/mm/dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 31, description: 'yy/mm/dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 32, description: 'dd/mm/yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 33, description: 'dd/mm/yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 34, description: 'mm/dd/yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 35, description: 'mm/dd/yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 36, description: 'yyyy.mm.dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 37, description: 'yy.mm.dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 38, description: 'dd.mm.yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 39, description: 'dd.mm.yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 40, description: 'mm.dd.yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 41, description: 'mm.dd.yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 42, description: 'yyyy-mm-dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 43, description: 'yy-mm-dd (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 44, description: 'dd-mm-yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 45, description: 'dd-mm-yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 46, description: 'mm-dd-yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 47, description: 'mm-dd-yy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 48, description: 'd mmmm yyyy (auto sign day)', formType: 'signing date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 73, description: 'Secret Code', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 77, description: 'Title caps (force text to title caps)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 78, description: 'Uppercase  (force text to uppercase)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 79, description: 'Lowercase (force text to lowercase)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 65, description: '1 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 66, description: '2 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 67, description: '3 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 68, description: '4 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 69, description: '5 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 70, description: '6 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 71, description: '7 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 72, description: '8 character (any text)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 1000, description: 'First name field (special use)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 1001, description: 'Last name field (special use)', formType: 'text', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 1, description: 'Email', formType: 'email', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 1002, description: 'Email field (special use)', formType: 'email', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 50, description: 'Whole number', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'number' },
  { id: 51, description: 'Number', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 52, description: 'Currency', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 53, description: '1 number', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 54, description: '2 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 55, description: '3 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 56, description: '4 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 57, description: '5 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 58, description: '6 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 59, description: '7 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 60, description: '8 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 61, description: '9 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 62, description: '10 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 63, description: '11 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 64, description: '12 numbers', formType: 'number', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'number' },
  { id: 2, description: 'yyyy/mm/dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'date' },
  { id: 3, description: 'yy/mm/dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 4, description: 'dd/mm/yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'date' },
  { id: 5, description: 'dd/mm/yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 6, description: 'mm/dd/yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 7, description: 'mm/dd/yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 80, description: 'mm/yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 81, description: 'mm/yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 8, description: 'yyyy.mm.dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 9, description: 'yy.mm.dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 10, description: 'dd.mm.yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 11, description: 'dd.mm.yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 12, description: 'mm.dd.yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 13, description: 'mm.dd.yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 82, description: 'mm.yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 83, description: 'mm.yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 14, description: 'yyyy-mm-dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 15, description: 'yy-mm-dd', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 16, description: 'dd-mm-yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 17, description: 'dd-mm-yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 18, description: 'mm-dd-yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 19, description: 'mm-dd-yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 84, description: 'mm-yy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 85, description: 'mm-yyyy', formType: 'date', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'date' },
  { id: 20, description: 'Dropdown List', formType: 'dropdown', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 91, description: 'Countries', formType: 'dropdown', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 92, description: 'Name prefix titles', formType: 'dropdown', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 24, description: '✔/✗', formType: 'checkbox', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 25, description: '✔/empty', formType: 'checkbox', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 26, description: '✗/empty', formType: 'checkbox', defaultHeight: 16, defaultWidth: 16, typeDefault: false, inputType: 'text' },
  { id: 74, description: 'File: attach to confirmatory email to sender', formType: 'file', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 75, description: 'File: append to PDF, PDF files only', formType: 'file', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 76, description: 'File: zip with PDF (for internal view, signed PDF for signer)', formType: 'file', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 90, description: 'Drawn field.', formType: 'drawn field', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 2000, description: 'Initials', formType: 'initials', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 93, description: 'Regular Expression field', formType: 'regular expression', defaultHeight: 16, defaultWidth: 200, typeDefault: false, inputType: 'text' },
  { id: 3000, description: 'Auto Sign', formType: 'auto sign', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'text' },
  { id: 4000, description: 'Text Area', formType: 'textarea', defaultHeight: 16, defaultWidth: 200, typeDefault: true, inputType: 'readonly' },
];
// See validtion setup in Database - these have to be hard coded for our HTML control
export function getInputType(validation: number): ValidationType {
  console.log(validation, 'validation')
  if (validation === null) return validationTypes[0]
  
  const inputType: ValidationType = validationTypes.find(v => v.id === validation);

  return inputType === null ? validationTypes[0] : inputType
}
