import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';

const MAX_HISTORY = 50;

type HistoryEntry = {
  mutations: LSMutateEvent[];
  inverse: LSMutateEvent[];
};

let undoStack: HistoryEntry[] = [];
let redoStack: HistoryEntry[] = [];
let fieldSnapshots: Map<string, LSApiElement> = new Map();

export function canUndo(): boolean {
  return undoStack.length > 0;
}

export function canRedo(): boolean {
  return redoStack.length > 0;
}

/**
 * Snapshot a field's state before any edits occur.
 * Only stores if no snapshot exists yet for this field.
 * Called at mouseDown before resize/move can mutate dataItem.
 */
export function snapshotField(field: LSApiElement) {
  if (field?.id && !fieldSnapshots.has(field.id)) {
    fieldSnapshots.set(field.id, { ...field });
  }
}

/**
 * Record a set of mutations before they are applied.
 * Call this with the mutations and the before-state of affected elements.
 */
export function recordMutations(mutations: LSMutateEvent[], beforeStates: Map<string, LSApiElement>) {
  const inverse: LSMutateEvent[] = mutations
    .map(m => {
      const data = m.data as LSApiElement;
      switch (m.action) {
        case 'create':
          console.log('[History] Create inverse - same ref:', data === m.data, 'id:', data.id);
          return { action: 'delete', data };
        case 'delete':
          return { action: 'create', data: beforeStates.get(data.id) || { ...data } };
        case 'update':
          // Use snapshot (captured at selection time) or beforeState from DOM
          const before = fieldSnapshots.get(data.id) || beforeStates.get(data.id);
          return { action: 'update', data: before ? { ...before } : { ...data } };
        default:
          return null;
      }
    })
    .filter(Boolean) as LSMutateEvent[];

  undoStack.push({ mutations, inverse });
  console.log('[History] After push - mutations[0].data.id:', (undoStack[undoStack.length-1].mutations[0].data as LSApiElement).id, 'inverse[0].data.id:', (undoStack[undoStack.length-1].inverse[0].data as LSApiElement).id, 'same ref:', undoStack[undoStack.length-1].mutations[0].data === undoStack[undoStack.length-1].inverse[0].data);
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  console.log('[History] Recorded:', mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id })));
  console.log('[History] Undo stack:', undoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id, inverse: e.inverse.map(i => ({ action: i.action, id: (i.data as LSApiElement).id })) }))));
  console.log('[History] Redo stack:', redoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id }))));

  // Update snapshots to the new state (so next undo captures from this point)
  mutations.forEach(m => {
    const data = m.data as LSApiElement;
    if (data?.id) {
      if (m.action === 'delete') {
        fieldSnapshots.delete(data.id);
      } else {
        fieldSnapshots.set(data.id, { ...data });
      }
    }
  });

  // New action clears redo
  redoStack = [];
}

export function undo() {
  if (undoStack.length === 0) {
    console.log('[History] Undo - nothing to undo');
    return null;
  }

  const entry = undoStack.pop();
  console.log('[History] Undo - applying:', entry.inverse.map(m => ({ action: m.action, id: (m.data as LSApiElement).id })));
  console.trace('[History] Undo caller');
  console.log('[History] Undo stack:', undoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id, inverse: e.inverse.map(i => ({ action: i.action, id: (i.data as LSApiElement).id })) }))));
  console.log('[History] Redo stack:', redoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id }))));
  redoStack.push(entry);
  if (redoStack.length > MAX_HISTORY) {
    redoStack.shift();
  }

  // Update snapshots to the restored state so the next action records correctly
  entry.inverse.forEach(m => {
    const data = m.data as LSApiElement;
    if (data?.id) {
      if (m.action === 'delete') {
        fieldSnapshots.delete(data.id);
      } else {
        fieldSnapshots.set(data.id, { ...data });
      }
    }
  });

  return entry.inverse;
}

export function redo() {
  if (redoStack.length === 0) {
    console.log('[History] Redo - nothing to redo');
    return null;
  }

  const entry = redoStack.pop();
  console.log('[History] Redo - applying:', entry.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id })));
  console.log('[History] Undo stack:', undoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id, inverse: e.inverse.map(i => ({ action: i.action, id: (i.data as LSApiElement).id })) }))));
  console.log('[History] Redo stack:', redoStack.map(e => e.mutations.map(m => ({ action: m.action, id: (m.data as LSApiElement).id }))));
  undoStack.push(entry);
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  // Update snapshots to the re-applied state so the next action records correctly
  entry.mutations.forEach(m => {
    const data = m.data as LSApiElement;
    if (data?.id) {
      if (m.action === 'delete') {
        fieldSnapshots.delete(data.id);
      } else {
        fieldSnapshots.set(data.id, { ...data });
      }
    }
  });

  return entry.mutations;
}

export function clearHistory() {
  console.log('[History] Clearing history');
  undoStack = [];
  redoStack = [];
  fieldSnapshots = new Map();
}

/**
 * After a create mutation, the API returns a server-generated ID.
 * Update the history entries so undo/redo use the real ID.
 */
export function updateCreatedId(clientId: string, serverId: string) {
  console.log('[History] updateCreatedId:', clientId, '→', serverId);
  const updateEntry = (entry: HistoryEntry) => {
    entry.mutations.forEach(m => {
      if ((m.data as LSApiElement).id === clientId) {
        (m.data as LSApiElement).id = serverId;
      }
    });
    entry.inverse.forEach(m => {
      if ((m.data as LSApiElement).id === clientId) {
        (m.data as LSApiElement).id = serverId;
      }
    });
  };

  // Update all entries in both stacks that reference the old ID
  undoStack.forEach(updateEntry);
  redoStack.forEach(updateEntry);

  // Update snapshot key to use server ID
  if (fieldSnapshots.has(clientId)) {
    const snapshot = fieldSnapshots.get(clientId);
    fieldSnapshots.delete(clientId);
    snapshot.id = serverId;
    fieldSnapshots.set(serverId, snapshot);
  }
}
