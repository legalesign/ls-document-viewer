/**
 * This module contains all the rules required to mark a template
 * as valid.
 *
 */

import { LSApiTemplate } from '../../types/LSApiTemplate';
import { ValidationError } from '../../types/ValidationError';

export function validate(t: LSApiTemplate): ValidationError[] {
  var errors = [];

  if (this._recipients) {
    this._recipients.forEach(tr => {
      if (t.elementConnection.templateElements.filter(e => e.formElementType === 'signature' && e.signer === tr.signerIndex).length === 0) {
        if (tr?.roleType !== 'APPROVER') {
          errors.push({
            id: tr.id,
            title: 'Missing signature.',
            description: `${tr.name} is missing a signature.`,
            role: tr,
          });
        }
      }
    });
  } else {
    // Check for missing signatures
    t.roles.forEach(tr => {
      if (t.elementConnection.templateElements.filter(e => e.formElementType === 'signature' && e.signer === tr.signerIndex && tr.roleType !== 'APPROVER').length === 0) {
        errors.push({
          id: tr.id,
          title: 'Missing signature.',
          description: `${tr.name} is missing a signature.`,
          role: tr,
        });
      }
    });
  }

  // Check for missing multi-select options
  t.elementConnection.templateElements.forEach(element => {
    if (element.validation === 20 && (!element.options || element.options.length === 0)) {
      errors.push({
        id: element.id,
        title: 'Missing options',
        description: `Drop down field "${element.label}" is missing options.`,
        element: element,
      });
    }
  });
  console.log('validation errors', errors);
  return errors;
}
