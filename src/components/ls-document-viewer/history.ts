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
 * Called when fields are selected or before an edit begins.
 */
export function snapshotField(field: LSApiElement) {
  if (!fieldSnapshots.has(field.id)) {
    fieldSnapshots.set(field.id, { ...field });
  }
}

/**
 * Record a set of mutations before they are applied.
 * Call this with the mutations and the before-state of affected elements.
 */
export function recordMutations(mutations: LSMutateEvent[], beforeStates: Map<string, LSApiElement>) {
  const inverse: LSMutateEvent[] = mutations.map(m => {
    const data = m.data as LSApiElement;
    switch (m.action) {
      case 'create':
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
  }).filter(Boolean) as LSMutateEvent[];

  undoStack.push({ mutations, inverse });
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  // Clear snapshots for fields that were just recorded
  mutations.forEach(m => {
    const data = m.data as LSApiElement;
    if (data?.id) fieldSnapshots.delete(data.id);
  });

  // New action clears redo
  redoStack = [];

  console.log('[History] Recorded:', mutations.map(m => `${m.action} ${(m.data as any).id}`));
  console.log('[History] Undo stack size:', undoStack.length);
  console.log('[History] Undo stack:', undoStack.map((entry, i) => `${i}: ${entry.mutations.map(m => `${m.action} ${(m.data as any).id?.slice(0,8)}...`).join(', ')}`));
}

export function undo() {
  if (undoStack.length === 0) {
    console.log('[History] Nothing to undo');
    return null;
  }

  const entry = undoStack.pop();
  redoStack.push(entry);
  if (redoStack.length > MAX_HISTORY) {
    redoStack.shift();
  }

  console.log('[History] Undo:', entry.inverse.map(m => `${m.action} ${(m.data as any).id}`));
  return entry.inverse;
}

export function redo() {
  if (redoStack.length === 0) {
    console.log('[History] Nothing to redo');
    return null;
  }

  const entry = redoStack.pop();
  undoStack.push(entry);
  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  console.log('[History] Redo:', entry.mutations.map(m => `${m.action} ${(m.data as any).id}`));
  return entry.mutations;
}

export function clearHistory() {
  undoStack = [];
  redoStack = [];
}

/**
 * After a create mutation, the API returns a server-generated ID.
 * Update the history entries so undo/redo use the real ID.
 */
export function updateCreatedId(clientId: string, serverId: string) {
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

  // Check the most recent undo entry (where the create was just recorded)
  if (undoStack.length > 0) {
    updateEntry(undoStack[undoStack.length - 1]);
  }
}
