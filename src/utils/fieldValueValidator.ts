/**
 * Validates a field value based on its formElementType and validation ID.
 * Returns null if valid, or a translation key string if invalid.
 * Empty values always return null (required/optional is handled separately).
 */
import { dvI18n } from '../i18n/i18n';

export const validateFieldValue = (
  formElementType: string,
  validation: number,
  value: string,
  options?: string,
): string | null => {
  if (!value || value === '') return null;

  if (formElementType === 'text') {
    return validateText(validation, value);
  }

  if (formElementType === 'number') {
    return validateNumber(validation, value);
  }

  if (formElementType === 'email') {
    return validateEmail(value);
  }

  if (formElementType === 'dropdown' && validation === 20) {
    return validateDropdownValue(value, options);
  }

  if (formElementType === 'regular expression') {
    return validateRegex(value);
  }

  return null;
};

const validateText = (validation: number, value: string): string | null => {
  // Character length validations (65–72 → 1–8 characters)
  if (validation >= 65 && validation <= 72) {
    const requiredLength = validation - 64;
    if (value.length !== requiredLength) {
      return dvI18n.t('fieldvalidation.exactcharacters', { count: requiredLength });
    }
    return null;
  }

  // Title case (77)
  if (validation === 77) {
    const titleCased = value.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    if (value !== titleCased) {
      return dvI18n.t('fieldvalidation.titlecase');
    }
    return null;
  }

  // Uppercase (78)
  if (validation === 78) {
    if (value !== value.toUpperCase()) {
      return dvI18n.t('fieldvalidation.uppercase');
    }
    return null;
  }

  // Lowercase (79)
  if (validation === 79) {
    if (value !== value.toLowerCase()) {
      return dvI18n.t('fieldvalidation.lowercase');
    }
    return null;
  }

  return null;
};

const validateNumber = (validation: number, value: string): string | null => {
  // Whole number (50)
  if (validation === 50) {
    if (!/^\d+$/.test(value)) return dvI18n.t('fieldvalidation.wholenumber');
    return null;
  }

  // Number with optional decimal (51)
  if (validation === 51) {
    if (!/^\d+(\.\d+)?$/.test(value)) return dvI18n.t('fieldvalidation.number');
    return null;
  }

  // Currency (52)
  if (validation === 52) {
    if (!/^\d+\.\d{2}$/.test(value)) return dvI18n.t('fieldvalidation.currency');
    return null;
  }

  // Exact digit count (53–64 → 1–12 digits)
  if (validation >= 53 && validation <= 64) {
    const requiredDigits = validation - 52;
    const pattern = new RegExp(`^\\d{${requiredDigits}}$`);
    if (!pattern.test(value)) {
      return dvI18n.t('fieldvalidation.exactdigits', { count: requiredDigits });
    }
    return null;
  }

  return null;
};

const validateEmail = (value: string): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    return dvI18n.t('fieldvalidation.email');
  }
  return null;
};

const validateDropdownValue = (value: string, options?: string): string | null => {
  if (!options || options.trim() === '') return null;
  const optionList = options.split('\n').map(o => o.trim()).filter(o => o.length > 0);
  if (optionList.length === 0) return null;
  if (!optionList.includes(value)) {
    return dvI18n.t('fieldvalidation.dropdownoption');
  }
  return null;
};

const validateRegex = (value: string): string | null => {
  try {
    new RegExp(value);
    return null;
  } catch {
    return dvI18n.t('fieldvalidation.invalidregex');
  }
};
