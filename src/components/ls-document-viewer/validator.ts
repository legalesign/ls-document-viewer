/**
 * This module contains all the rules required to mark a template
 * as valid.
 *
 */

import { LSApiTemplate } from "../../types/LSApiTemplate";
import { ValidationError } from "../../types/ValidationError";

export function validate(t: LSApiTemplate): ValidationError[] {
  var errors = []
  
  // Check for missing signatures
  t.roles.forEach(tr => {
    if(t.elements.find(e => e.formElementType === 'signature' && e.roleObject.id===tr.id)) errors.push({ id: tr.id, title: 'Missing signature.', description: `{tr.name} is missing a signature.`})
  })

  return errors;
}