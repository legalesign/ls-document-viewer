import { LSApiRole } from "./LSApiRole";

export type ValidationError = {
  id: string;
  title: string;
  description: string;
  role?: LSApiRole;
};