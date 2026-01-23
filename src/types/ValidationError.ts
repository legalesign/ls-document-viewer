import { LSApiElement } from "./LSApiElement";

export type ValidationError = {
  id: string;
  title: string;
  description: string;
  role?: any;
  signerIndex?: number;
  element?: LSApiElement
};