import { LSApiElement } from './LSApiElement';
import { LSApiRole } from './LSApiRole';

export type LSMutateEvent = {
  action: 'update' | 'create' | 'delete' | 'swap';
  data: (LSApiElement | LSApiRole);
  data2?: (LSApiElement | LSApiRole);
};
