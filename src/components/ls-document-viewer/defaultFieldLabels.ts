export const defaultFieldLabels: { [key: string]: string } = {
  'signature': 'Signature',
  'auto sign': 'Auto Sign',
  'text': 'Text',
  'signing date': 'Auto Date',
  'date': 'Date',
  'initials': 'Initials',
  'checkbox': 'Checkbox',
  'email': 'Email',
  'number': 'Number',
  'image': 'Image',
  'dropdown': 'Dropdown',
  'file': 'File',
  'drawn field': 'Draw',
  'regular expression': 'RegEx',
};

export function getFieldLabel(key: string): string | undefined {
  return defaultFieldLabels[key] || 'Unknown';
}
