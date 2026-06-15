/**
 * This module contains all the rules required to mark a template
 * as valid.
 *
 */

import { LSApiTemplate } from '../../types/LSApiTemplate';
import { ValidationError } from '../../types/ValidationError';
import { validateFieldValue } from '../../utils/fieldValueValidator';
import { dvI18n } from '../../i18n/i18n';

export function validate(t: LSApiTemplate): ValidationError[] {
  var errors = [];

  if (this._recipients) {
    this._recipients.forEach(tr => {
      if (t.elementConnection.templateElements.filter(e => e.formElementType === 'signature' && e.signer === tr.signerIndex).length === 0) {
        if (tr?.roleType !== 'APPROVER') {
          errors.push({
            id: tr.id,
            signerIndex: tr.signerIndex,
            title: dvI18n.t('validation.missingsignature'),
            description: dvI18n.t('validation.recipientmissingsignature', { name: tr.name }),
            role: tr,
            type: 'signature',
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
            title: dvI18n.t('validation.missingsignature'),
            description: dvI18n.t('validation.recipientmissingsignature', { name: tr.name }),
            role: tr,
            type: 'signature',
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
        title: element.label || dvI18n.t('toolbox.dropdown'),
        description: role?.firstName ? `${role.firstName} ${role.lastName}` : role?.name || dvI18n.t('participants.participant', { index: (element.signer || 0) + 1 }),
        element: element,
        role: role,
        type: 'options',
      });
    }
  });

  // Check for invalid pre-filled values
  t.elementConnection.templateElements.forEach(element => {
    if (element.value) {
      const error = validateFieldValue(element.formElementType, element.validation, element.value, element.options);
      if (error) {
        const roles = this._recipients || t.roles;
        const role = roles?.find(r => r.signerIndex === element.signer);
        errors.push({
          id: element.id,
          signerIndex: element.signer,
          title: element.label || element.formElementType,
          description: error,
          element: element,
          role: role,
          type: 'value',
        });
      }
    }
  });

  return errors;
}
