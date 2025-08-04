import { LsEditorField } from '../ls-editor-field/ls-editor-field';
import { alter, oob } from './editorUtils';

export function keyDown(ev: KeyboardEvent) {
  if (this.selected && this.selected?.length > 0) {
    // utils need binding to the context
    const altbound = alter.bind(this);

    if (ev.key === 'ArrowDown') {
      console.log('down arrow pressed');
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
      console.log('up arrow pressed');
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
      console.log('right arrow pressed');
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
      console.log('left arrow pressed');
      altbound(original => {
        const alterElement = {
          ...original,
          left: original.left - 1,
          ax: original.ax - 1,
          bx: original.bx - 1,
        };
        return oob(alterElement) ? original : alterElement;
      });
    } else if (ev.key === 'Delete') {
      const arr = Array.from(this.selected) as LsEditorField[];
      this.update.emit(
        arr.map(s => {
          return { action: 'delete', data: s.dataItem };
        }),
      );
    }
  }
}
