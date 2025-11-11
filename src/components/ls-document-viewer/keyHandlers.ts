import { LsEditorField } from '../ls-editor-field/ls-editor-field';
import { alter, oob } from './editorUtils';

export function keyDown(ev: KeyboardEvent) {
  if (this.selected && this.selected?.length > 0) {
    // utils need binding to the context
    const altbound = alter.bind(this);

    if (ev.key === 'ArrowDown') {
      altbound(original => {
        const alterElement = {
          ...original,
          top: original.top + 1,
          ay: original.ay + 1,
          by: original.by + 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowUp') {
      altbound(original => {
        const alterElement = {
          ...original,
          top: original.top - 1,
          ay: original.ay - 1,
          by: original.top - 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowRight') {
      altbound(original => {
        const alterElement = {
          ...original,
          left: original.left + 1,
          ax: original.ax + 1,
          bx: original.bx + 1,
        };

        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'ArrowLeft') {
      altbound(original => {
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

      this.update.emit(
        arr.map(s => {
          return { action: 'delete', data: s.dataItem };
        }),
      );
    } else if (ev.key === 'd' || ev.key === 'D' || ev.key === 'keyD') {
      const arr = Array.from(this.selected) as LsEditorField[];
      const createdItems = arr.map(s => {
        const newItem = { ...s.dataItem, id: btoa('ele' + crypto.randomUUID()) };
        const newTop = s.dataItem.top + s.dataItem.height;
        if (newTop + s.dataItem.height < s.dataItem.pageDimensions.height) {
          newItem.top = newTop;
        }
        return { action: 'create', data: newItem, select: 'clear' };
      });
      this.update.emit(createdItems);
      this.mutate.emit(createdItems.map(item => ({ action: 'create', data: item.data })));
    }
  }
}
