import { LSApiElement } from '../../types/LSApiElement';

const PASTE_OFFSET = 10; // px offset when pasting without a click target

let clipboard: LSApiElement[] = [];
let lastClickPosition: { x: number; y: number } | null = null;

export function getClipboard(): LSApiElement[] {
  return clipboard;
}

export function setLastClickPosition(x: number, y: number) {
  lastClickPosition = { x, y };
}

export function clearLastClickPosition() {
  lastClickPosition = null;
}

export function copySelected() {
  if (!this.selected || this.selected.length === 0) return;
  clipboard = this.selected.map(field => ({ ...field.dataItem }));
  lastClickPosition = null;
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

  // Calculate bounding box of clipboard items to use as offset anchor
  const minTop = Math.min(...clipboard.map(item => item.top));
  const minLeft = Math.min(...clipboard.map(item => item.left));

  const createdItems = clipboard.map(item => {
    const newItem = { ...item, id: btoa('ele' + crypto.randomUUID()) };

    if (lastClickPosition) {
      // Paste relative to click position, maintaining relative layout of multiple fields
      const frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
      const rect = frame.getBoundingClientRect();
      const clickX = Math.round((lastClickPosition.x - rect.left) / this.zoom);
      const clickY = Math.round((lastClickPosition.y - rect.top) / this.zoom);

      newItem.top = clickY + (item.top - minTop);
      newItem.left = clickX + (item.left - minLeft);
    } else {
      // No click target — offset from original position
      newItem.top = item.top + PASTE_OFFSET;
      newItem.left = item.left + PASTE_OFFSET;
    }

    // Clamp to page bounds
    const pageDims = this.pageDimensions[this.pageNum - 1];
    if (newItem.top + item.height > pageDims.height) {
      newItem.top = pageDims.height - item.height;
    }
    if (newItem.left + item.width > pageDims.width) {
      newItem.left = pageDims.width - item.width;
    }
    if (newItem.top < 0) newItem.top = 0;
    if (newItem.left < 0) newItem.left = 0;

    newItem.page = this.pageNum;
    newItem.pageDimensions = pageDims;

    return newItem;
  });

  this.mutate.emit(createdItems.map(data => ({ action: 'create', data })));

  // Update clipboard to new items so subsequent pastes keep offsetting
  clipboard = createdItems;
  lastClickPosition = null;
}
