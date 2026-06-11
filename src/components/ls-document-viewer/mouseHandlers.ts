import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { findDimensions, findIn, recalculateCoordinates } from './editorCalculator';
import { IToolboxField } from '../interfaces/IToolboxField';
import { FIELD_DEFAULTS, DEFAULT_FONT_SIZE, DEFAULT_FONT_NAME } from '../../constants/fieldDefaults';
import { calculateSnap } from './snapHelper';
import { defaultRolePalette } from './defaultPalette';

export function updateSelectionBox() {
  var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
  if (!this.selected || this.selected.length < 2) {
    box.style.visibility = 'hidden';
    return;
  }

  let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity;

  this.selected.forEach(f => {
    const left = f.offsetLeft;
    const top = f.offsetTop;
    const right = left + f.offsetWidth;
    const bottom = top + f.offsetHeight;
    if (left < minLeft) minLeft = left;
    if (top < minTop) minTop = top;
    if (right > maxRight) maxRight = right;
    if (bottom > maxBottom) maxBottom = bottom;
  });

  box.style.left = minLeft + 'px';
  box.style.top = minTop + 'px';
  box.style.width = (maxRight - minLeft) + 'px';
  box.style.height = (maxBottom - minTop) + 'px';
  box.style.visibility = 'visible';
}

let mousetimer = null;

export function debounce(data, delay) {
  if (mousetimer) clearTimeout(mousetimer);

  mousetimer = setTimeout(() => {
    this.mutate.emit([data]);
  }, delay);
}

export function mouseDown(e) {
  if (e.offsetX < 0 || e.offsetY < 0) return;
  if (this._isToolboxDragging) return;
  // Disable mouse interactions in preview mode or when template is locked
  if (this.mode === 'preview' || this._template?.locked) {
    return;
  }
  // Ignore events originating from outside the document frame
  const frame = this.component.shadowRoot.getElementById('ls-document-frame');
  if (!frame || !e.composedPath().includes(frame)) return;
  // console.log('mousedown', e);

  // Find if this was
  // - a hit on a field edge RESIZE
  // - a hit on the middle of a field MOVE
  // - a hit on the background document SELECTMULTIPLE with a box
  this.hitField = null;
  const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');

  fields.forEach(f => {
    const { left, top, height, width, bottom, right } = f.getBoundingClientRect();
    const fdims = { left: f.offsetLeft, top: f.offsetTop, height, width, x: e.screenX, y: e.screenY };
    this.startMouse = fdims;
    // Scale edge threshold for small fields
    const edgeX = Math.min(8, width * 0.25);
    const edgeY = Math.min(8, height * 0.25);
    // corners (check before edges)
    if (Math.abs(e.clientX - right) < edgeX && Math.abs(e.clientY - bottom) < edgeY) {
      this.edgeSide = 'se';
      this.hitField = f;
    } else if (Math.abs(e.clientX - left) < edgeX && Math.abs(e.clientY - top) < edgeY) {
      this.edgeSide = 'nw';
      this.hitField = f;
    } else if (Math.abs(e.clientX - right) < edgeX && Math.abs(e.clientY - top) < edgeY) {
      this.edgeSide = 'ne';
      this.hitField = f;
    } else if (Math.abs(e.clientX - left) < edgeX && Math.abs(e.clientY - bottom) < edgeY) {
      this.edgeSide = 'sw';
      this.hitField = f;
      // west edge
    } else if (Math.abs(e.clientX - left) < edgeX && e.clientY >= top && e.clientY <= bottom) {
      this.edgeSide = 'w';
      this.hitField = f;
      // right / east edge
    } else if (Math.abs(e.clientX - right) < edgeX && e.clientY >= top && e.clientY <= bottom) {
      this.edgeSide = 'e';
      this.hitField = f;
      // north edge
    } else if (Math.abs(e.clientY - top) < edgeY && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = 'n';
      this.hitField = f;
      // south edge
    } else if (Math.abs(e.clientY - bottom) < edgeY && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = 's';
      this.hitField = f;
    } else if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = null;
      this.hitField = f;
    }
  });

  if (this.hitField && e.shiftKey === false) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

    // mouse down on a field, select it and note the start location
    if (this.hitField.selected === false) {
      // unselect all other fields
      fields.forEach(fu => {
        fu.selected = false;
      });
      this.selected = [this.hitField];
      this.selectFields.emit([this.hitField.dataItem]);
    }

    const { height, width } = this.hitField.getBoundingClientRect();
    const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY };
    this.startMouse = fdims;

    this.startLocations = this.selected.map(f => {
      const { height, width } = f.getBoundingClientRect();
      const beHtml = f as HTMLElement;
      return { top: beHtml.offsetTop, left: beHtml.offsetLeft, height, width };
    });
    this.selectionBox = null;
  } else if (this.hitField && e.shiftKey === true) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

    // mouse down on a field, select it and note the start location
    if (this.hitField.selected === false) {
      // unselect all other fields
      fields.forEach(fu => {
        fu.selected = false;
      });
      this.selected = [...this.selected, this.hitField];
      this.selectFields.emit([...this.selected.map(si => si.dataItem), this.hitField.dataItem]);
    }

    const { height, width } = this.hitField.getBoundingClientRect();
    const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY };
    this.startMouse = fdims;

    this.startLocations = this.selected.map(f => {
      const { height, width } = f.getBoundingClientRect();
      const beHtml = f as HTMLElement;
      return { top: beHtml.offsetTop, left: beHtml.offsetLeft, height, width };
    });
    this.selectionBox = null;
  } else {
    // move down on empty space, start a selection box
    this.startLocations = null;
    this.startMouse = null;
    this.selectionBox = { x: e.clientX, y: e.clientY };
    // console.log('empty space reset selected', this.selectionBox);
    this.unselect();

    this.selectFields.emit([]);
    this.selected = [];
    this.component.style.cursor = 'crosshair';
    updateSelectionBox.bind(this)();
  }
}

export function outOfBounds(futureField) {
  return (
    futureField.height <= 5 ||
    futureField.left < 0 ||
    futureField.top < 0 ||
    futureField.left + futureField.width >= futureField.pageDimensions.width ||
    futureField.top + futureField.height >= futureField.pageDimensions.height
  );
}
export function mouseMove(event) {
  event.preventDefault();
  if (this._isToolboxDragging) return;
  // Disable mouse move interactions in preview mode or when template is locked
  if (this.mode === 'preview' || this._template?.locked) {
    return;
  }

  // We have the mouse held down on a field edge to resize it.
  if (this.hitField && this.edgeSide && this.startMouse && event.buttons === 1) {
    const movedX = event.screenX - this.startMouse.x;
    const movedY = event.screenY - this.startMouse.y;
    var width = this.hitField.dataItem.width;
    var height = this.hitField.dataItem.height;
    var scale = this.hitField.dataItem.formElementType === 'signature' && this._template.fixSignatureScale;

    switch (this.edgeSide) {
      case 'n':
        if (outOfBounds({ ...this.hitField.dataItem, top: (this.startMouse.top + movedY) / this.zoom, height: (this.startMouse.height - movedY) / this.zoom })) break;
        this.hitField.style.top = this.startMouse.top + movedY + 'px';
        this.hitField.style.height = this.startMouse.height - movedY + 'px';

        if (scale) {
          width = (this.startMouse.height - movedY) * 3.8;
          this.hitField.style.width = width + 'px';
        }
        this.hitField.dataItem = { ...this.hitField.dataItem, top: (this.startMouse.top + movedY) / this.zoom, height: (this.startMouse.height - movedY) / this.zoom, width };
        break;
      case 's':
        if (outOfBounds({ ...this.hitField.dataItem, height: (this.startMouse.height + movedY) / this.zoom })) break;

        this.hitField.style.height = this.startMouse.height + movedY + 'px';
        if (scale) {
          width = (this.startMouse.height + movedY) * 3.8;
          this.hitField.style.width = width + 'px';
        }

        this.hitField.dataItem = { ...this.hitField.dataItem, height: (this.startMouse.height + movedY) / this.zoom, width };
        break;
      case 'e':
        if (outOfBounds({ ...this.hitField.dataItem, width: (this.startMouse.width + movedX) / this.zoom })) break;

        this.hitField.style.width = this.startMouse.width + movedX + 'px';
        if (scale) {
          height = Math.round((this.startMouse.width + movedX) / 3.8);
          this.hitField.style.height = height + 'px';
        }
        this.hitField.dataItem = { ...this.hitField.dataItem, width: (this.startMouse.width + movedX) / this.zoom, height };

        break;
      case 'w':
        if (outOfBounds({ ...this.hitField.dataItem, left: (this.startMouse.left + movedX) / this.zoom, width: (this.startMouse.width - movedX) / this.zoom })) break;
        this.hitField.style.left = this.startMouse.left + movedX + 'px';
        this.hitField.style.width = this.startMouse.width - movedX + 'px';

        if (scale) {
          height = Math.round((this.startMouse.width - movedX) / 3.8);
          this.hitField.style.height = height + 'px';
        }
        this.hitField.dataItem = { ...this.hitField.dataItem, left: (this.startMouse.left + movedX) / this.zoom, width: (this.startMouse.width - movedX) / this.zoom, height };
        break;
      case 'se': {
        const newWidth = (this.startMouse.width + movedX) / this.zoom;
        const newHeight = (this.startMouse.height + movedY) / this.zoom;
        if (outOfBounds({ ...this.hitField.dataItem, width: newWidth, height: newHeight })) break;
        this.hitField.style.width = this.startMouse.width + movedX + 'px';
        this.hitField.style.height = this.startMouse.height + movedY + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, width: newWidth, height: newHeight };
        break;
      }
      case 'nw': {
        const newLeft = (this.startMouse.left + movedX) / this.zoom;
        const newTop = (this.startMouse.top + movedY) / this.zoom;
        const newWidth = (this.startMouse.width - movedX) / this.zoom;
        const newHeight = (this.startMouse.height - movedY) / this.zoom;
        if (outOfBounds({ ...this.hitField.dataItem, left: newLeft, top: newTop, width: newWidth, height: newHeight })) break;
        this.hitField.style.left = this.startMouse.left + movedX + 'px';
        this.hitField.style.top = this.startMouse.top + movedY + 'px';
        this.hitField.style.width = this.startMouse.width - movedX + 'px';
        this.hitField.style.height = this.startMouse.height - movedY + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, left: newLeft, top: newTop, width: newWidth, height: newHeight };
        break;
      }
      case 'ne': {
        const newWidth = (this.startMouse.width + movedX) / this.zoom;
        const newTop = (this.startMouse.top + movedY) / this.zoom;
        const newHeight = (this.startMouse.height - movedY) / this.zoom;
        if (outOfBounds({ ...this.hitField.dataItem, top: newTop, width: newWidth, height: newHeight })) break;
        this.hitField.style.width = this.startMouse.width + movedX + 'px';
        this.hitField.style.top = this.startMouse.top + movedY + 'px';
        this.hitField.style.height = this.startMouse.height - movedY + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, top: newTop, width: newWidth, height: newHeight };
        break;
      }
      case 'sw': {
        const newLeft = (this.startMouse.left + movedX) / this.zoom;
        const newWidth = (this.startMouse.width - movedX) / this.zoom;
        const newHeight = (this.startMouse.height + movedY) / this.zoom;
        if (outOfBounds({ ...this.hitField.dataItem, left: newLeft, width: newWidth, height: newHeight })) break;
        this.hitField.style.left = this.startMouse.left + movedX + 'px';
        this.hitField.style.width = this.startMouse.width - movedX + 'px';
        this.hitField.style.height = this.startMouse.height + movedY + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, left: newLeft, width: newWidth, height: newHeight };
        break;
      }
    }

    debounce.bind(this)({ action: 'update', data: recalculateCoordinates(this.hitField.dataItem) }, 700);
  } else if (this.selectionBox && event.buttons === 1) {
    this.isBoxing = true;
    // draw the multiple selection box
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
    var leftOffset = frame.getBoundingClientRect().left;
    var topOffset = frame.getBoundingClientRect().top;

    const movedX = event.clientX - this.selectionBox.x;
    const movedY = event.clientY - this.selectionBox.y;

    // allow for the frame to be scrolled
    box.style.visibility = 'visible';
    box.style.left = (this.selectionBox.x > event.clientX ? event.clientX : this.selectionBox.x) - leftOffset + frame.scrollLeft + 'px';
    box.style.top = (this.selectionBox.y > event.clientY ? event.clientY : this.selectionBox.y) - topOffset + frame.scrollTop + 'px';
    box.style.width = Math.abs(movedX) + 'px';
    box.style.height = Math.abs(movedY) + 'px';

    // Move one or more selected items
  } else if (this.startLocations && !this.edgeSide && this.startMouse && event.buttons === 1) {
    this.isMoving = true;
    document.body.style.userSelect = 'none';
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

    // Dismiss any open date picker when moving fields
    if (this.selected?.length) {
      this.selected.forEach(f => {
        const input = f.shadowRoot?.getElementById('editing-input') as HTMLInputElement;
        if (input) input.blur();
      });
    }

    // Move one or more selected items
    const movedX = event.screenX - this.startMouse.x;
    const movedY = event.screenY - this.startMouse.y;
    if (this.selected?.length) {
      // Calculate snap based on the primary (first) selected field
      const primaryLeft = this.startLocations[0].left + movedX;
      const primaryTop = this.startLocations[0].top + movedY;
      const primaryWidth = this.startLocations[0].width;
      const primaryHeight = this.startLocations[0].height;

      const allFields = Array.from(this.component.shadowRoot.querySelectorAll('ls-editor-field')) as HTMLLsEditorFieldElement[];
      const excludeIds = this.selected.map(s => s.dataItem.id);
      const snap = calculateSnap(primaryLeft, primaryTop, primaryWidth, primaryHeight, allFields, this.pageNum, excludeIds);

      // Apply snap offset to all selected fields
      const snapOffsetX = snap.x !== null ? snap.x - primaryLeft : 0;
      const snapOffsetY = snap.y !== null ? snap.y - primaryTop : 0;

      for (let i = 0; i < this.selected.length; i++) {
        const newLeft = this.startLocations[i].left + movedX + snapOffsetX;
        const newTop = this.startLocations[i].top + movedY + snapOffsetY;
        if (
          newLeft >= 0 &&
          newTop >= 0 &&
          newLeft <= (this.pageDimensions[this.pageNum - 1].width - this.selected[i].dataItem.width) * this.zoom &&
          newTop <= (this.pageDimensions[this.pageNum - 1].height - this.selected[i].dataItem.height) * this.zoom
        ) {
          this.selected[i].style.left = Math.round(newLeft) + 'px';
          this.selected[i].style.top = Math.round(newTop) + 'px';
        }
      }

      showSnapGuides.bind(this)(snap.guides);
      updateSelectionBox.bind(this)();
    }
  }
}

export function mouseUp(event) {
  this.edgeSide = null;
  this.startMouse = null;
  this.component.style.cursor = 'auto';
  document.body.style.userSelect = '';
  clearSnapGuides.bind(this)();

  // find what was inside the selection box emit the select event and change their style
  if (this.selectionBox && this.isBoxing) {
    this.isBoxing = false;
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    box.style.visibility = 'hidden';
    this.selectionBox = null;
    const found = findIn(fields, box, true, event.shiftKey);
    this.selected = Array.from(found);
    this.selectFields.emit(found.map(fx => fx.dataItem));
    updateSelectionBox.bind(this)();
  }
}

export function mouseClick(e) {
  // Disable click interactions in preview mode or when template is locked
  if (this.mode === 'preview' || this._template?.locked) {
    return;
  }
  
  // check we're not moving fields
  if (this.isMoving) {
    // End dragging fields
    this.isMoving = false;
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];
    const divFrame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLDivElement;
    const selected = Array.from(fields).filter(fx => fx.selected);

    this.mutate.emit(
      Array.from(fields)
        .filter(fx => fx.selected)
        .map(fx => {
          // Calculate new positions and update the dataItem on the control
          const delta = {
            ...fx.dataItem,
            ...findDimensions(divFrame, fx, fx.dataItem.pageDimensions.height, fx.dataItem.pageDimensions.width, this.zoom),
          };
          // TODO:: out of bounds handler (UNDO)
          // update the data in the html element
          fx.dataItem = delta;
          // send an update event to be processed
          return { action: 'update', data: delta };
        }),
    );
    this.selectFields.emit(selected.map(fx => fx.dataItem));
    updateSelectionBox.bind(this)();
  } else {
    // reset the selection box location
    this.selectionBox = { x: e.clientX, y: e.clientY };

    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];
    fields.forEach(f => {
      const { left, top, bottom, right } = f.getBoundingClientRect();
      if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
        this.edgeSide = null;
        this.hitField = f;
        // check if this is a shift click to add to the current selection
        if (!e.shiftKey) fields.forEach(ft => (ft.selected = false));
        f.selected = true;
      }
    });

    this.selected = Array.from(fields).filter(fx => fx.selected);
    this.selectFields.emit(this.selected.map(fx => fx.dataItem));
    updateSelectionBox.bind(this)();
  }
}

export function showSnapGuides(guides: { orientation: 'h' | 'v'; position: number }[]) {
  const frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
  let container = this.component.shadowRoot.getElementById('ls-snap-guides');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ls-snap-guides';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    frame.appendChild(container);
  }

  container.innerHTML = '';
  for (const guide of guides) {
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.backgroundColor = 'transparent';
    if (guide.orientation === 'v') {
      line.style.left = guide.position + 'px';
      line.style.top = '0';
      line.style.width = '0';
      line.style.height = '100%';
      line.style.borderLeft = '1px dashed var(--gray-50, #c8c9cc)';
    } else {
      line.style.top = guide.position + 'px';
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '0';
      line.style.borderTop = '1px dashed var(--gray-50, #c8c9cc)';
    }
    container.appendChild(line);
  }
}

export function clearSnapGuides() {
  const container = this.component.shadowRoot.getElementById('ls-snap-guides');
  if (container) container.innerHTML = '';
}

export function toolboxDragStart(fieldData: IToolboxField) {
  // Disable toolbox dragging when template is locked
  if (this._template?.locked) {
    return;
  }
  // Cancel any existing toolbox drag
  if (this._cancelToolboxDrag) {
    this._cancelToolboxDrag();
  }

  const frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
  const zoom = this.zoom;
  this._isToolboxDragging = true;
  let hasMoved = false;

  // Prevent text selection during drag
  document.body.style.userSelect = 'none';

  // Add dragging class to toolbox fields (shadow DOM cursor override)
  this.component.shadowRoot.querySelectorAll('ls-left-bar, ls-compose-loader').forEach(bar => {
    bar.shadowRoot?.querySelectorAll('ls-toolbox-field').forEach(el => el.classList.add('ls-dv-dragging'));
  });

  // Create ghost preview element matching the original drag image style
  const ghost = document.createElement('div');
  ghost.id = 'ls-toolbox-ghost';
  ghost.style.position = 'fixed';
  ghost.style.width = fieldData.defaultWidth * zoom + 'px';
  ghost.style.height = fieldData.defaultHeight * zoom + 'px';
  ghost.style.border = `2px dashed ${defaultRolePalette[this.signer % 100].s60}`;
  const s20 = defaultRolePalette[this.signer % 100].s20.replace('#', '');
  const r = parseInt(s20.substring(0, 2), 16);
  const g = parseInt(s20.substring(2, 4), 16);
  const b = parseInt(s20.substring(4, 6), 16);
  ghost.style.background = `rgba(${r},${g},${b},0.5)`;
  ghost.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '10000';
  ghost.style.visibility = 'hidden';
  ghost.style.boxSizing = 'border-box';
  ghost.style.fontFamily = 'var(--font-family, IBM Plex Sans, sans-serif)';
  ghost.style.fontSize = Math.round(DEFAULT_FONT_SIZE * zoom) + 'px';
  ghost.style.color = defaultRolePalette[this.signer % 100].s100;
  ghost.style.overflow = 'hidden';
  ghost.style.whiteSpace = 'nowrap';
  ghost.style.display = 'flex';
  ghost.style.alignItems = 'center';
  ghost.style.textTransform = 'capitalize';
  ghost.innerHTML = fieldData.formElementType;
  this.component.shadowRoot.appendChild(ghost);

  // Info chip at bottom of screen
  const chip = document.createElement('div');
  chip.id = 'ls-esc-chip';
  chip.style.position = 'fixed';
  chip.style.bottom = '1.5rem';
  chip.style.left = '50%';
  chip.style.transform = 'translateX(-50%)';
  chip.style.padding = '0.375rem 0.75rem';
  chip.style.borderRadius = '0.625rem';
  chip.style.background = 'var(--gray-100, #1f2937)';
  chip.style.color = 'white';
  chip.style.fontSize = '0.75rem';
  chip.style.fontFamily = 'var(--font-family, IBM Plex Sans, sans-serif)';
  chip.style.pointerEvents = 'none';
  chip.style.zIndex = '10000';
  chip.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  chip.textContent = 'Press Esc to cancel field placement';
  this.component.shadowRoot.appendChild(chip);

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    hasMoved = true;
    const dragWidth = fieldData.defaultWidth * zoom;
    const dragHeight = fieldData.defaultHeight * zoom;

    const frameRect = frame.getBoundingClientRect();
    const isOverFrame = e.clientX >= frameRect.left && e.clientX <= frameRect.right &&
        e.clientY >= frameRect.top && e.clientY <= frameRect.bottom;
    const isDragging = e.buttons === 1;

    // Only show grabbing cursor when ghost is visible
    let cursorStyle = document.getElementById('ls-drag-cursor') as HTMLStyleElement;
    if ((isOverFrame || isDragging) && !cursorStyle) {
      cursorStyle = document.createElement('style');
      cursorStyle.id = 'ls-drag-cursor';
      cursorStyle.textContent = '* { cursor: grabbing !important; }';
      document.head.appendChild(cursorStyle);
    } else if (!isOverFrame && !isDragging && cursorStyle) {
      cursorStyle.remove();
    }

    // When dragging (mouse held): show ghost over wrapper area
    // When click-to-place (mouse not held): only show over document frame
    if (isOverFrame) {
      ghost.style.visibility = 'visible';
      ghost.style.opacity = '1';
      const x = e.clientX - frameRect.left + frame.scrollLeft;
      const y = e.clientY - frameRect.top + frame.scrollTop;
      let left = x - dragWidth / 2;
      let top = y - dragHeight / 2;

      const fields = Array.from(this.component.shadowRoot.querySelectorAll('ls-editor-field')) as HTMLLsEditorFieldElement[];
      const snap = calculateSnap(left, top, dragWidth, dragHeight, fields, this.pageNum);
      ghost.style.left = (snap.x !== null ? snap.x + frameRect.left - frame.scrollLeft : e.clientX - dragWidth / 2) + 'px';
      ghost.style.top = (snap.y !== null ? snap.y + frameRect.top - frame.scrollTop : e.clientY - dragHeight / 2) + 'px';

      showSnapGuides.bind(this)(snap.guides);
    } else if (isDragging) {
      ghost.style.visibility = 'visible';
      ghost.style.opacity = '0.5';
      ghost.style.left = (e.clientX - dragWidth / 2) + 'px';
      ghost.style.top = (e.clientY - dragHeight / 2) + 'px';
      clearSnapGuides.bind(this)();
    } else {
      ghost.style.visibility = 'hidden';
      clearSnapGuides.bind(this)();
    }
  };

  const cleanup = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('keydown', onKeyDown);
    ghost.remove();
    chip.remove();
    clearSnapGuides.bind(this)();
    document.body.style.userSelect = '';
    const cursorStyle = document.getElementById('ls-drag-cursor');
    if (cursorStyle) cursorStyle.remove();
    this.component.shadowRoot.querySelectorAll('ls-left-bar, ls-compose-loader').forEach(bar => {
      bar.shadowRoot?.querySelectorAll('ls-toolbox-field').forEach(el => el.classList.remove('ls-dv-dragging'));
    });
    this._isToolboxDragging = false;
    this._cancelToolboxDrag = null;
  };

  const onMouseUp = (e: MouseEvent) => {
    // Ignore mouseup if it's from the same click that started the drag (no movement yet)
    if (!hasMoved) return;

    const frameRect = frame.getBoundingClientRect();
    const shouldPlace = e.clientX >= frameRect.left && e.clientX <= frameRect.right &&
        e.clientY >= frameRect.top && e.clientY <= frameRect.bottom;

    cleanup();

    if (shouldPlace) {

      const dragWidth = fieldData.defaultWidth * zoom;
      const dragHeight = fieldData.defaultHeight * zoom;
      const x = e.clientX - frameRect.left + frame.scrollLeft;
      const y = e.clientY - frameRect.top + frame.scrollTop;
      let left = x - dragWidth / 2;
      let top = y - dragHeight / 2;

      const fields = Array.from(this.component.shadowRoot.querySelectorAll('ls-editor-field')) as HTMLLsEditorFieldElement[];
      const snap = calculateSnap(left, top, dragWidth, dragHeight, fields, this.pageNum);
      if (snap.x !== null) left = snap.x;
      if (snap.y !== null) top = snap.y;

      const finalTop = top / zoom;
      const finalLeft = left / zoom;

      // Check if field fits on page - constrain to page boundaries
      const pageWidth = this.pageDimensions[this.pageNum - 1].width;
      const pageHeight = this.pageDimensions[this.pageNum - 1].height;
      const constrainedLeft = Math.max(0, Math.min(finalLeft, pageWidth - fieldData.defaultWidth));
      const constrainedTop = Math.max(0, Math.min(finalTop, pageHeight - fieldData.defaultHeight));

      this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(f => (f.selected = false));

      const id = btoa('ele' + crypto.randomUUID());
      const newData: LSMutateEvent = {
        action: 'create',
        data: {
          id,
          value: '',
          formElementType: fieldData.formElementType,
          elementType: fieldData.elementType,
          validation: fieldData.validation,
          substantive: false,
          top: constrainedTop,
          left: constrainedLeft,
          hideBorder: false,
          height: fieldData.defaultHeight,
          width: fieldData.defaultWidth,
          pageDimensions: this.pageDimensions[this.pageNum - 1],
          fontName: this.fontFamily,
          fontSize: this.fontSize,
          align: 'left',
          signer: this.signer,
          page: this.pageNum,
          mapTo: null,
          label: '',
          helpText: null,
          logicGroup: null,
          optional: false,
          options: null,
          logicAction: null,
          labelExtra: null,
          fieldOrder: null,
          ax: constrainedLeft > 0 ? constrainedLeft / this.pageDimensions[this.pageNum - 1].width : 0,
          ay: constrainedTop > 0 ? constrainedTop / this.pageDimensions[this.pageNum - 1].height : 0,
          bx: (constrainedLeft + fieldData.defaultWidth) / this.pageDimensions[this.pageNum - 1].width,
          by: (constrainedTop + fieldData.defaultHeight) / this.pageDimensions[this.pageNum - 1].height,
          templateId: this._template.id,
        } as LSApiElement,
      };

      this.mutate.emit([newData]);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      cleanup();
    }
  };

  this._cancelToolboxDrag = cleanup;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);
}

export function mouseDoubleClick(event) {
  // Disable double-click field creation in preview mode or when template is locked
  if (this.mode === 'preview' || this._template?.locked) {
    return;
  }
  
  console.log('double click', this.fieldTypeSelected, this.signer);
  try {
    let data: IToolboxField = this.fieldTypeSelected as IToolboxField;

    if (this.checkType('APPROVER') && data.elementType === 'signature') {
      data = {
        label: 'Text',
        formElementType: 'text',
        elementType: 'text',
        validation: 0,
        defaultHeight: FIELD_DEFAULTS['text'].defaultHeight,
        defaultWidth: FIELD_DEFAULTS['text'].defaultWidth,
      };
    }
    // Unselect all current selected items
    this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(f => (f.selected = false));
    var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
    // Make a new API compatible id for a template element (prefix 'ele')
    const id = btoa('ele' + crypto.randomUUID());
    const top = event.offsetY / this.zoom + frame.scrollTop;
    const left = event.offsetX / this.zoom + frame.scrollLeft;

    // TODO: Put these defaults somewhere sensible
    const newData: LSMutateEvent = {
      action: 'create',
      data: {
        id,
        value: '',
        formElementType: data.formElementType,
        elementType: data.elementType,
        validation: data.validation,
        substantive: false,
        top,
        left,
        hideBorder: false,
        height: data.defaultHeight,
        width: data.defaultWidth,
        pageDimensions: this.pageDimensions[this.pageNum - 1],
        fontName: DEFAULT_FONT_NAME,
        fontSize: DEFAULT_FONT_SIZE,
        align: 'left',
        signer: this.signer,
        page: this.pageNum,
        mapTo: null,
        label: '',
        helpText: null,
        logicGroup: null,
        optional: false,
        options: null,
        logicAction: null,
        labelExtra: null,
        fieldOrder: null,
        ax: left > 0 ? left / this.pageDimensions[this.pageNum - 1].width : 0,
        ay: top > 0 ? top / this.pageDimensions[this.pageNum - 1].height : 0,
        bx: (left + data.defaultWidth) / this.pageDimensions[this.pageNum - 1].width,
        by: (top + data.defaultHeight) / this.pageDimensions[this.pageNum - 1].height,
        templateId: this._template.id,
      } as LSApiElement,
    };
    this.mutate.emit([newData]);
  } catch (e) {
    console.error(e);
  }
}
