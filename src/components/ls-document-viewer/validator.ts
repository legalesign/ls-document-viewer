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
            signerIndex: tr.signerIndex,
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
      if (t.elementConnection.templateElements.filter(e => e.formElementType === 'signature' && e.signer === tr.signerIndex).length === 0) {
        if (tr?.roleType !== 'APPROVER') {
          errors.push({
            id: tr.id,
            signerIndex: tr.signerIndex,
            title: 'Missing signature.',
            description: `${tr.name} is missing a signature.`,
            role: tr,
          });
        }
      }
    });
  }

  // Check for missing multi-select options
  t.elementConnection.templateElements.forEach(element => {
    if (element.validation === 20 && (!element.options || element.options.length === 0)) {
      const roles = this._recipients || t.roles;
      const role = roles?.find(r => r.signerIndex === element.signer);
      errors.push({
        id: element.id,
        signerIndex: element.signer,
        title: element.label || 'Dropdown',
        description: role?.firstName ? `${role.firstName} ${role.lastName}` : role?.name || `Signer ${(element.signer || 0) + 1}`,
        element: element,
        role: role,
      });
    }
  });
  return errors;
}
