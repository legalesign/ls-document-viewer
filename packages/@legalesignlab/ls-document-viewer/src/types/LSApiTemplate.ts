import { LSApiElement } from "./LSApiElement";
import { LSApiRole } from "./LSApiRole";

export type LSApiTemplate = {
  id: string;
  title: string;
  pageCount: number;
  fileName: string;
  link: string;
  autoArchive: boolean;
  valid: boolean;
  locked: boolean;
  tags: string[];
  groupId: string;
  roles: LSApiRole[];
  canOpenSign: boolean;
  directLinks: [];
  elementConnection: { templateElements: LSApiElement[]; totalCount: number };
  elements: LSApiElement[];
  createdBy: string;
  created: Date;
  modified: Date;
  lastSent: Date;
  pageDimensionArray: [number, number][];
  pageDimensions: string;
  fixSignatureScale?: boolean;
};