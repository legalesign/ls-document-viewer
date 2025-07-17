import { LSApiElement } from './LSApiElement';
import { LSApiRole } from './LSApiRole';

export type LSMutateEvent = {
  action: 'update' | 'create' | 'delete';
  data: (LSApiElement | LSApiRole);
};
