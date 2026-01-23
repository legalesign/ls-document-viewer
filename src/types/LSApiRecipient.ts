export type LSApiRecipient = {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  signerIndex?: number;
  phone?: string;
  previousRecipientDecides?: boolean;
  roleType?: 'SIGNER' | 'WITNESS' | 'APPROVER' | 'FORM_FILLER';
};