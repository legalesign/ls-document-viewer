/**
 * Returns the default validation ID for a given formElementType.
 */
export const getDefaultValidationForType = (fieldType: string): number => {
  switch (fieldType) {
    case 'signature': return 0;
    case 'auto sign': return 3000;
    case 'initials': return 2000;
    case 'signing date': return 32;
    case 'date': return 4;
    case 'email': return 1;
    case 'number': return 50;
    case 'dropdown': return 20;
    case 'checkbox': return 25;
    case 'file': return 74;
    case 'drawn field': return 90;
    case 'regular expression': return 93;
    case 'text':
    default: return 0;
  }
};
