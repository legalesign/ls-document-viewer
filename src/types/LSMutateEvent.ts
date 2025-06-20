import { LSApiElement } from './LSApiElement';

export type LSMutateEvent = {
  action: 'update' | 'create' | 'delete';
  data: LSApiElement;
};
