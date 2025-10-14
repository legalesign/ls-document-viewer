import { LSApiElement } from "./LSApiElement";
import { LSApiRole } from "./LSApiRole";

export type ValidationError = {
  id: string;
  title: string;
  description: string;
  role?: LSApiRole;
  element?: LSApiElement
};