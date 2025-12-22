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

export const defaultFieldTitles: { [key: string]: string } = {
  'signature': 'eg. Sign Here',
  'auto sign': 'eg. Date of Signing',
  'text': 'eg. Full Name, Address, Company Name',
  'signing date': 'eg. Date of Signing',
  'date': 'eg. Date of Birth',
  'initials': 'eg. Initial Here',
  'checkbox': 'eg. Agree to Terms',
  'email': 'eg. Personal Email, Emergency Contact Email',
  'number': 'eg. Phone Number, Account Number',
  'image': 'eg. ID Image, Headshot',
  'dropdown': 'eg. Select an Option',
  'file': 'eg. Upload Document',
  'drawn field': 'eg. Draw Here',
  'regular expression': 'eg. Sort Code',
};

export function getFieldTitleSuggestion(key: string): string | undefined {
  return defaultFieldTitles[key] || 'eg. Sign Here';
}

export const defaultFieldPlaceholders: { [key: string]: string } = {
  'signature': 'Siganture',
  'auto sign': 'Date of Signing',
  'text': 'eg. John Doe, 123 Main St, Acme Corp',
  'signing date': 'Date of Signing',
  'date': 'eg. 19/12/2025',
  'initials': 'Initials',
  'checkbox': 'Checkbox',
  'email': 'eg. john.doe@example.com',
  'number': 'eg. 12345',
  'image': 'Image',
  'dropdown': 'Dropdown',
  'file': 'File',
  'drawn field': 'Draw',
  'regular expression': 'RegEx',
};

export function getFieldPlaceholder(key: string): string | undefined {
  return defaultFieldPlaceholders[key] || 'eg. Full Name, Address, Company Name';
}
