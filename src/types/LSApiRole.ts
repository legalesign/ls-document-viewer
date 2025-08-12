export type LSApiRoleType = 'SIGNER' | 'APPROVER' | 'WITNESS' | 'SENDER';

export type LSApiRole = {
  children?: LSApiRole[];
  id: string;
  name: string;
  roleType: LSApiRoleType;
  signerIndex: number;
  ordinal: number;
  signerParent?: string;
  experience: string;
};