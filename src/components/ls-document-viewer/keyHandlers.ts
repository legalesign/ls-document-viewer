import { LsEditorField } from '../ls-editor-field/ls-editor-field';
import { oob } from './editorUtils';
import { moveField } from './editorCalculator';
import { updateSelectionBox } from './mouseHandlers';
import { copySelected, cutSelected, pasteClipboard } from './clipboard';

// Buffer for batching rapid key presses
let mutationBuffer = null;
let mutationTimer = null;
const BUFFER_DELAY = 300; // milliseconds

export function keyDown(ev: KeyboardEvent) {
  // Disable keyboard controls in preview mode or when template is locked
  if (this.mode === 'preview' || this._template?.locked) {
    return;
  }

  const isMod = ev.ctrlKey || ev.metaKey;

  // Modifier shortcuts (Ctrl/Cmd + key)
  if (isMod) {
    if (ev.key === 'a' || ev.key === 'A') {
      ev.preventDefault();
      selectAll.bind(this)();
      return;
    }
    if (ev.key === 'c' || ev.key === 'C') {
      ev.preventDefault();
      copySelected.bind(this)();
      return;
    }
    if (ev.key === 'x' || ev.key === 'X') {
      ev.preventDefault();
      cutSelected.bind(this)();
      return;
    }
    if (ev.key === 'v' || ev.key === 'V') {
      ev.preventDefault();
      pasteClipboard.bind(this)();
      return;
    }
  }

  if (this.selected && this.selected?.length > 0) {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      bufferedAlter.bind(this)(() => original => {
        const alterElement = {
          ...original,
          top: original.top + 1,
          ay: original.ay + 1,
          by: original.by + 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      bufferedAlter.bind(this)(() => original => {
        const alterElement = {
          ...original,
          top: original.top - 1,
          ay: original.ay - 1,
          by: original.top - 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      bufferedAlter.bind(this)(() => original => {
        const alterElement = {
          ...original,
          left: original.left + 1,
          ax: original.ax + 1,
          bx: original.bx + 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      bufferedAlter.bind(this)(() => original => {
        const alterElement = {
          ...original,
          left: original.left - 1,
          ax: original.ax - 1,
          bx: original.bx - 1,
        };
        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'Delete' || ev.key === 'Backspace') {
      const arr = Array.from(this.selected) as LsEditorField[];
      this.mutate.emit(
        arr.map(s => {
          return { action: 'delete', data: s.dataItem };
        }),
      );
    } else if (!isMod && (ev.key === 'd' || ev.key === 'D' || ev.key === 'keyD')) {
      const arr = Array.from(this.selected) as LsEditorField[];
      const createdItems = arr.map(s => {
        const newItem = { ...s.dataItem, id: btoa('ele' + crypto.randomUUID()) };
        const newTop = s.dataItem.top + s.dataItem.height;
        // check its in bounds
        if (newTop + s.dataItem.height < s.dataItem.pageDimensions.height) {
          newItem.top = newTop;
        }
        return { action: 'create', data: newItem, select: 'clear' };
      });
      this.mutate.emit(createdItems.map(item => ({ action: 'create', data: item.data })));
    } else if (ev.key === 'Escape') {
      console.log('Clearing selection');
      this.selected = [];
      this.selectFields.emit([]);
    }
  }
}

function selectAll() {
  const fields = Array.from(
    this.component.shadowRoot.querySelectorAll('ls-editor-field'),
  ) as HTMLLsEditorFieldElement[];

  if (fields.length === 0) return;

  fields.forEach(f => {
    f.selected = true;
    f.multiSelected = fields.length > 1;
  });

  this.selected = fields;
  this.selectFields.emit(fields.map(f => f.dataItem));
  updateSelectionBox.bind(this)();
}

// Buffered version of alter that batches rapid key presses
function bufferedAlter(diffFnFactory) {
  // Clear existing timer
  if (mutationTimer) {
    clearTimeout(mutationTimer);
  }

  // Apply the transformation immediately to the UI
  const diffFn = diffFnFactory();
  this.selected.forEach(field => {
    const updatedItem = diffFn(field.dataItem);
    // Update the dataItem in place
    Object.assign(field.dataItem, updatedItem);
    // Update the visual position using moveField
    moveField.bind(this)(field, updatedItem);
  });

  // Update the selection box to match the new field positions
  updateSelectionBox.bind(this)();

  // Store the latest state for batched mutation
  mutationBuffer = this.selected.map(c => c.dataItem);

  // Set timer to emit mutation after delay
  mutationTimer = setTimeout(() => {
    if (mutationBuffer) {
      const diffs = mutationBuffer.map(item => ({
        action: 'update',
        data: item,
      }));
      this.mutate.emit(diffs);
      mutationBuffer = null;
    }
    mutationTimer = null;
  }, BUFFER_DELAY);
}
