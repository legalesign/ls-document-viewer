import { LSApiElement } from './LSApiElement';
import { LSApiRole } from './LSApiRole';
import { LSApiTemplate } from './LSApiTemplate';

export type LSMutateEvent = {
  action: 'update' | 'create' | 'delete' | 'swap';
  data: (LSApiElement | LSApiRole | LSApiTemplate);
  data2?: (LSApiElement | LSApiRole | LSApiTemplate);
  select?: 'select' | 'deselect' | 'clear';
};
