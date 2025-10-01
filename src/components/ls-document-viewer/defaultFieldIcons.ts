import { Icon } from "../../components";

export const defaultFieldIcons: { [key: string]: Icon } = {
  'signature': 'signature',
  'text': 'text',
  'signing date': 'auto-date',
  'date': 'calender',
  'initials': 'initials',
  'checkbox': 'check',
  'email': 'at-symbol',
  'number': 'hashtag',
  'image': 'photograph',
  'dropdown': 'document-text',
  'file': 'upload',
  'drawn field': 'pencil',
  'regular expression': 'code',
};

export function getFieldIcon(key: string): Icon | undefined {
  return defaultFieldIcons[key] || 'view-grid';
}

