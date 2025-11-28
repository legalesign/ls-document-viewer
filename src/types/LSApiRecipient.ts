export type LSApiRecipient = {
  name: string;
  email: string;
  firstname: string;
  lastname: string;
  signerIndex?: number;
  roleType?: 'SIGNER' | 'WITNESS' | 'APPROVER' | 'FORM_FILLER';
};