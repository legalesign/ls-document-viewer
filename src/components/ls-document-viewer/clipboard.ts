import { LSApiElement } from '../../types/LSApiElement';

const PASTE_OFFSET = 10; // px offset for pasted fields

let clipboard: LSApiElement[] = [];

export function getClipboard(): LSApiElement[] {
  return clipboard;
}

export function copySelected() {
  if (!this.selected || this.selected.length === 0) return;
  clipboard = this.selected.map(field => ({ ...field.dataItem }));
}

export function cutSelected() {
  if (!this.selected || this.selected.length === 0) return;
  copySelected.bind(this)();

  const arr = Array.from(this.selected) as HTMLLsEditorFieldElement[];
  this.mutate.emit(
    arr.map(s => ({ action: 'delete', data: s.dataItem })),
  );
}

export function pasteClipboard() {
  if (clipboard.length === 0) return;

  const createdItems = clipboard.map(item => {
    const newItem = { ...item, id: btoa('ele' + crypto.randomUUID()) };
    // Offset position so pasted fields don't overlap originals
    const newTop = item.top + PASTE_OFFSET;
    const newLeft = item.left + PASTE_OFFSET;

    // Clamp to page bounds
    if (newTop + item.height <= item.pageDimensions.height) {
      newItem.top = newTop;
    }
    if (newLeft + item.width <= item.pageDimensions.width) {
      newItem.left = newLeft;
    }

    // Place on current page
    newItem.page = this.pageNum;
    newItem.pageDimensions = this.pageDimensions[this.pageNum - 1];

    return newItem;
  });

  this.mutate.emit(createdItems.map(data => ({ action: 'create', data })));

  // Update clipboard to the new items so subsequent pastes keep offsetting
  clipboard = createdItems;
}
