/**
 * This module contains all the rules required to mark a template
 * as valid.
 *
 */

import { LSApiTemplate } from "../../types/LSApiTemplate";
import { ValidationError } from "../../types/ValidationError";

export function validate(t: LSApiTemplate): ValidationError[] {
  var errors = []
  
  console.log(t)
  // Check for missing signatures
  t.roles.forEach(tr => {
    if(t.elementConnection.templateElements.filter(e => e.formElementType === 'signature' && e.signer===tr.signerIndex).length === 0) {
      errors.push({ 
        id: tr.id, 
        title: 'Missing signature.', 
        description: `{tr.name} is missing a signature.`,
        role: tr
      })
    }
  })

  return errors;
}