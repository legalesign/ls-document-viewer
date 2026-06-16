import { IToolboxField } from '../components/interfaces/IToolboxField';

export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_NAME = 'arial';

export const FIELD_DEFAULTS: Record<string, Pick<IToolboxField, 'defaultWidth' | 'defaultHeight'>> = {
  signature: { defaultWidth: 97, defaultHeight: 25 },
  'auto sign': { defaultWidth: 97, defaultHeight: 25 },
  text: { defaultWidth: 150, defaultHeight: 16 },
  'signing date': { defaultWidth: 100, defaultHeight: 16 },
  date: { defaultWidth: 100, defaultHeight: 16 },
  email: { defaultWidth: 150, defaultHeight: 16 },
  initials: { defaultWidth: 70, defaultHeight: 25 },
  number: { defaultWidth: 100, defaultHeight: 16 },
  dropdown: { defaultWidth: 100, defaultHeight: 16 },
  checkbox: { defaultWidth: 16, defaultHeight: 16 },
  regex: { defaultWidth: 150, defaultHeight: 16 },
  file: { defaultWidth: 100, defaultHeight: 16 },
  'drawn field': { defaultWidth: 120, defaultHeight: 120 },
};
