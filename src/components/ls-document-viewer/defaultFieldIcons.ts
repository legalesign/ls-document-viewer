import { Icon } from "../../types/Icon";

export const defaultFieldIcons: { [key: string]: Icon } = {
  'signature': 'signature-icon',
  'auto sign': 'auto-sign-icon',
  'text': 'text-icon',
  'signing date': 'auto-date-icon',
  'date': 'calender-icon',
  'initials': 'initials-icon',
  'checkbox': 'check-icon',
  'email': 'at-symbol-icon',
  'number': 'hashtag-icon',
  'dropdown': 'document-text-icon',
  'file': 'upload-icon',
  'drawn field': 'pencil-icon',
  'regular expression': 'code-icon',
};

export function getFieldIcon(key: string): Icon | undefined {
  return defaultFieldIcons[key] || 'view-grid-icon';
}

