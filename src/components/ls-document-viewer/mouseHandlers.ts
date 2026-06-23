import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { findDimensions, findIn, recalculateCoordinates } from './editorCalculator';
import { IToolboxField } from '../interfaces/IToolboxField';
import { FIELD_DEFAULTS, DEFAULT_FONT_SIZE, DEFAULT_FONT_NAME } from '../../constants/fieldDefaults';
import { setLastClickPosition, clearLastClickPosition } from './clipboard';
import { snapshotField } from './history';
import { calculateSnap, calculateResizeSnap } from './snapHelper';
import { defaultRolePalette } from './defaultPalette';
import { dvI18n } from '../../i18n/i18n';

const preventSelect = (e: Event) => e.preventDefault();

function showMoveBlockedTooltip(event: MouseEvent) {
  let tooltip = this.component.shadowRoot.getElementById('ls-move-blocked-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'ls-move-blocked-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.padding = '0.375rem 0.75rem';
    tooltip.style.borderRadius = '0.5rem';
    tooltip.style.background = 'var(--gray-100, #45484d)';
    tooltip.style.color = 'white';
    tooltip.style.fontSize = '0.75rem';
    tooltip.style.fontFamily = 'var(--font-family, IBM Plex Sans, sans-serif)';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '10000';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.textContent = dvI18n.t('fieldproperties.cannotmovemultipage');
    this.component.shadowRoot.appendChild(tooltip);
  }
  tooltip.style.left = (event.clientX + 12) + 'px';
  tooltip.style.top = (event.clientY + 12) + 'px';
}

function hideMoveBlockedTooltip() {
  const tooltip = this.component.shadowRoot?.getElementById('ls-move-blocked-tooltip');
  if (tooltip) tooltip.remove();
}

function disableSelection() {
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.addEventListener('selectstart', preventSelect);
}

function enableSelection() {
  document.body.style.userSelect = '';
  document.body.style.webkitUserSelect = '';
  document.removeEventListener('selectstart', preventSelect);
}

export function updateSelectionBox() {
  var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
  const pageSelected = this.selected?.filter(f => f.dataItem?.page === this.pageNum);
  if (!pageSelected || pageSelected.length < 2) {
    box.style.visibility = 'hidden';
    return;
  }

  let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity;

  pageSelected.forEach(f => {
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
    const cornerX = Math.min(16, width * 0.35);
    const cornerY = Math.min(16, height * 0.35);
    // corners (check before edges)
    if (Math.abs(e.clientX - right) < cornerX && Math.abs(e.clientY - bottom) < cornerY) {
      this.edgeSide = 'se';
      this.hitField = f;
    } else if (Math.abs(e.clientX - left) < cornerX && Math.abs(e.clientY - top) < cornerY) {
      this.edgeSide = 'nw';
      this.hitField = f;
    } else if (Math.abs(e.clientX - right) < cornerX && Math.abs(e.clientY - top) < cornerY) {
      this.edgeSide = 'ne';
      this.hitField = f;
    } else if (Math.abs(e.clientX - left) < cornerX && Math.abs(e.clientY - bottom) < cornerY) {
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

  if (this.hitField && e.shiftKey === false && e.altKey === false) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

    // Snapshot field state before any resize/move begins
    snapshotField(this.hitField.dataItem);
    // Snapshot all currently selected fields (for multi-field move undo)
    this.selected.forEach(f => snapshotField(f.dataItem));

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
  } else if (this.hitField && e.altKey === true) {
    // Alt+click: remove field from selection
    if (this.hitField.selected === true) {
      this.hitField.selected = false;
      this.selected = this.selected.filter(f => f !== this.hitField);
      this.selectFields.emit(this.selected.map(si => si.dataItem));
    }
    this.hitField = null;
    this.startMouse = null;
    this.startLocations = null;
    this.selectionBox = null;
    updateSelectionBox.bind(this)();
  } else if (this.hitField && e.shiftKey === true) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

    if (this.hitField.selected === true) {
      // Toggle off: remove from selection
      this.hitField.selected = false;
      this.selected = this.selected.filter(f => f !== this.hitField);
      this.selectFields.emit(this.selected.map(si => si.dataItem));
      this.hitField = null;
      this.startMouse = null;
      this.startLocations = null;
      this.selectionBox = null;
      updateSelectionBox.bind(this)();
    } else {
      // Add to selection
      this.hitField.selected = true;
      this.selected = [...this.selected, this.hitField];
      this.selectFields.emit(this.selected.map(si => si.dataItem));

      const { height, width } = this.hitField.getBoundingClientRect();
      const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY };
      this.startMouse = fdims;

      this.startLocations = this.selected.map(f => {
        const { height, width } = f.getBoundingClientRect();
        const beHtml = f as HTMLElement;
        return { top: beHtml.offsetTop, left: beHtml.offsetLeft, height, width };
      });
      this.selectionBox = null;
    }
  } else {
    // move down on empty space, start a selection box
    this.startLocations = null;
    this.startMouse = null;
    this.selectionBox = { x: e.clientX, y: e.clientY };

    if (!e.shiftKey && !e.altKey) {
      this.unselect();
      this.selectFields.emit([]);
      this.selected = [];
      updateSelectionBox.bind(this)();
    }

    this.component.style.cursor = 'crosshair';
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
    disableSelection();
    const movedX = event.screenX - this.startMouse.x;
    const movedY = event.screenY - this.startMouse.y;
    var scale = this.hitField.dataItem.formElementType === 'signature' && this._template.fixSignatureScale;

    // Calculate candidate dimensions before snapping
    let candidateLeft = this.startMouse.left;
    let candidateTop = this.startMouse.top;
    let candidateWidth = this.startMouse.width;
    let candidateHeight = this.startMouse.height;

    switch (this.edgeSide) {
      case 'n':
        if (scale) {
          candidateHeight = this.startMouse.height - movedY;
          candidateWidth = candidateHeight * (this.startMouse.width / this.startMouse.height);
        } else {
          candidateTop = this.startMouse.top + movedY;
          candidateHeight = this.startMouse.height - movedY;
        }
        break;
      case 's':
        if (scale) {
          candidateHeight = this.startMouse.height + movedY;
          candidateWidth = candidateHeight * (this.startMouse.width / this.startMouse.height);
        } else {
          candidateHeight = this.startMouse.height + movedY;
        }
        break;
      case 'e':
        if (scale) {
          candidateWidth = this.startMouse.width + movedX;
          candidateHeight = candidateWidth * (this.startMouse.height / this.startMouse.width);
        } else {
          candidateWidth = this.startMouse.width + movedX;
        }
        break;
      case 'w':
        if (scale) {
          candidateWidth = this.startMouse.width - movedX;
          candidateHeight = candidateWidth * (this.startMouse.height / this.startMouse.width);
          candidateLeft = this.startMouse.left + movedX;
        } else {
          candidateLeft = this.startMouse.left + movedX;
          candidateWidth = this.startMouse.width - movedX;
        }
        break;
      case 'se':
        if (scale) {
          candidateWidth = this.startMouse.width + movedX;
          candidateHeight = candidateWidth / (this.startMouse.width / this.startMouse.height);
        } else {
          candidateWidth = this.startMouse.width + movedX;
          candidateHeight = this.startMouse.height + movedY;
        }
        break;
      case 'nw':
        if (scale) {
          candidateWidth = this.startMouse.width - movedX;
          candidateHeight = candidateWidth / (this.startMouse.width / this.startMouse.height);
          candidateLeft = this.startMouse.left + movedX;
          candidateTop = this.startMouse.top + (this.startMouse.height - candidateHeight);
        } else {
          candidateLeft = this.startMouse.left + movedX;
          candidateTop = this.startMouse.top + movedY;
          candidateWidth = this.startMouse.width - movedX;
          candidateHeight = this.startMouse.height - movedY;
        }
        break;
      case 'ne':
        if (scale) {
          candidateWidth = this.startMouse.width + movedX;
          candidateHeight = candidateWidth / (this.startMouse.width / this.startMouse.height);
          candidateTop = this.startMouse.top + (this.startMouse.height - candidateHeight);
        } else {
          candidateWidth = this.startMouse.width + movedX;
          candidateTop = this.startMouse.top + movedY;
          candidateHeight = this.startMouse.height - movedY;
        }
        break;
      case 'sw':
        if (scale) {
          candidateWidth = this.startMouse.width - movedX;
          candidateHeight = candidateWidth / (this.startMouse.width / this.startMouse.height);
          candidateLeft = this.startMouse.left + movedX;
        } else {
          candidateLeft = this.startMouse.left + movedX;
          candidateWidth = this.startMouse.width - movedX;
          candidateHeight = this.startMouse.height + movedY;
        }
        break;
    }

    // Snap active resize edges
    const allFields = Array.from(this.component.shadowRoot.querySelectorAll('ls-editor-field')) as HTMLLsEditorFieldElement[];
    const resizeSnap = calculateResizeSnap(
      candidateLeft, candidateTop, candidateWidth, candidateHeight,
      this.edgeSide, allFields, this.pageNum, [this.hitField.dataItem.id]
    );

    if (scale) {
      const aspect = this.startMouse.width / this.startMouse.height;
      const hasH = resizeSnap.edges.e !== undefined || resizeSnap.edges.w !== undefined;
      const hasV = resizeSnap.edges.n !== undefined || resizeSnap.edges.s !== undefined;

      // When both axes snap on a corner, pick the closer one
      let useH = hasH;
      let useV = hasV;
      if (hasH && hasV && this.edgeSide.length === 2) {
        const hDist = resizeSnap.edges.e !== undefined
          ? Math.abs((candidateLeft + candidateWidth) - resizeSnap.edges.e)
          : Math.abs(candidateLeft - resizeSnap.edges.w);
        const vDist = resizeSnap.edges.s !== undefined
          ? Math.abs((candidateTop + candidateHeight) - resizeSnap.edges.s)
          : Math.abs(candidateTop - resizeSnap.edges.n);
        if (hDist <= vDist) { useV = false; } else { useH = false; }
      }

      if (useV && !useH) {
        if (resizeSnap.edges.n !== undefined) {
          candidateHeight = (candidateTop + candidateHeight) - resizeSnap.edges.n;
          candidateTop = resizeSnap.edges.n;
        }
        if (resizeSnap.edges.s !== undefined) {
          candidateHeight = resizeSnap.edges.s - candidateTop;
        }
        candidateWidth = candidateHeight * aspect;
      } else if (useH) {
        if (resizeSnap.edges.w !== undefined) {
          candidateWidth = (candidateLeft + candidateWidth) - resizeSnap.edges.w;
          candidateLeft = resizeSnap.edges.w;
        }
        if (resizeSnap.edges.e !== undefined) {
          candidateWidth = resizeSnap.edges.e - candidateLeft;
        }
        candidateHeight = candidateWidth / aspect;
      }

      if (this.edgeSide.includes('n')) candidateTop = (this.startMouse.top + this.startMouse.height) - candidateHeight;
      if (this.edgeSide.includes('w')) candidateLeft = (this.startMouse.left + this.startMouse.width) - candidateWidth;

      // Only show guides for the axis we used
      const guides = resizeSnap.guides.filter(g =>
        (useH && g.orientation === 'v') || (useV && g.orientation === 'h')
      );
      showSnapGuides.bind(this)(guides);
    } else {
      if (resizeSnap.edges.n !== undefined) {
        candidateHeight = (candidateTop + candidateHeight) - resizeSnap.edges.n;
        candidateTop = resizeSnap.edges.n;
      }
      if (resizeSnap.edges.s !== undefined) {
        candidateHeight = resizeSnap.edges.s - candidateTop;
      }
      if (resizeSnap.edges.w !== undefined) {
        candidateWidth = (candidateLeft + candidateWidth) - resizeSnap.edges.w;
        candidateLeft = resizeSnap.edges.w;
      }
      if (resizeSnap.edges.e !== undefined) {
        candidateWidth = resizeSnap.edges.e - candidateLeft;
      }
      showSnapGuides.bind(this)(resizeSnap.guides);
    }

    if (!outOfBounds({ ...this.hitField.dataItem, left: candidateLeft / this.zoom, top: candidateTop / this.zoom, width: candidateWidth / this.zoom, height: candidateHeight / this.zoom })) {
      this.hitField.style.left = candidateLeft + 'px';
      this.hitField.style.top = candidateTop + 'px';
      this.hitField.style.width = candidateWidth + 'px';
      this.hitField.style.height = candidateHeight + 'px';
      this.hitField.dataItem = {
        ...this.hitField.dataItem,
        left: candidateLeft / this.zoom,
        top: candidateTop / this.zoom,
        width: candidateWidth / this.zoom,
        height: candidateHeight / this.zoom,
      };
    }

    debounce.bind(this)({ action: 'update', data: recalculateCoordinates(this.hitField.dataItem) }, 700);
  } else if (this.selectionBox && event.buttons === 1) {
    this.isBoxing = true;
    // draw the multiple selection box
    var dragBox = this.component.shadowRoot.getElementById('ls-drag-selector') as HTMLElement;
    var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
    var leftOffset = frame.getBoundingClientRect().left;
    var topOffset = frame.getBoundingClientRect().top;

    const movedX = event.clientX - this.selectionBox.x;
    const movedY = event.clientY - this.selectionBox.y;

    // allow for the frame to be scrolled
    dragBox.style.visibility = 'visible';
    dragBox.style.left = (this.selectionBox.x > event.clientX ? event.clientX : this.selectionBox.x) - leftOffset + frame.scrollLeft + 'px';
    dragBox.style.top = (this.selectionBox.y > event.clientY ? event.clientY : this.selectionBox.y) - topOffset + frame.scrollTop + 'px';
    dragBox.style.width = Math.abs(movedX) + 'px';
    dragBox.style.height = Math.abs(movedY) + 'px';

    // Move one or more selected items
  } else if (this.startLocations && !this.edgeSide && this.startMouse && event.buttons === 1) {
    // Block move if selection spans multiple pages
    const pages = new Set(this.selected?.map(f => f.dataItem?.page));
    if (pages.size > 1) {
      showMoveBlockedTooltip.bind(this)(event);
      return;
    }

    this.isMoving = true;
    disableSelection();
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
  enableSelection();
  clearSnapGuides.bind(this)();
  hideMoveBlockedTooltip.bind(this)();

  // find what was inside the selection box emit the select event and change their style
  if (this.selectionBox && this.isBoxing) {
    this.isBoxing = false;
    var dragBox = this.component.shadowRoot.getElementById('ls-drag-selector') as HTMLElement;
    var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    const isShift = event.shiftKey;
    const isAlt = event.altKey;
    this.selectionBox = null;
    const found = findIn(fields, dragBox, !isAlt, isShift || isAlt);
    dragBox.style.visibility = 'hidden';

    if (isAlt) {
      const removeIds = new Set(found.map(f => f.dataItem?.id));
      found.forEach(f => { f.selected = false; });
      this.selected = this.selected.filter(f => !removeIds.has(f.dataItem?.id));
    } else if (isShift) {
      const existingIds = new Set(this.selected.map(f => f.dataItem?.id));
      const newFields = found.filter(f => !existingIds.has(f.dataItem?.id));
      this.selected = [...this.selected, ...newFields];
    } else {
      this.selected = Array.from(found);
    }

    this.selectFields.emit(this.selected.map(fx => fx.dataItem));
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

    let hitAny = false;
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];
    fields.forEach(f => {
      const { left, top, bottom, right } = f.getBoundingClientRect();
      if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
        this.edgeSide = null;
        this.hitField = f;
        if (!e.shiftKey && !e.altKey) {
          fields.forEach(ft => (ft.selected = false));
          f.selected = true;
        }
        // shift/alt+click: mouseDown already toggled selected state, preserve it
        hitAny = true;
      }
    });

    // Track click position for paste targeting
    if (hitAny) {
      clearLastClickPosition();
    } else {
      setLastClickPosition(e.clientX, e.clientY);
    }

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
  disableSelection();

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
  ghost.style.border = `1px dashed ${defaultRolePalette[this.signer % 100].s60}`;
  const s20 = defaultRolePalette[this.signer % 100].s20.replace('#', '');
  const r = parseInt(s20.substring(0, 2), 16);
  const g = parseInt(s20.substring(2, 4), 16);
  const b = parseInt(s20.substring(4, 6), 16);
  ghost.style.background = `rgba(${r},${g},${b},0.5)`;
  ghost.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '10000';
  ghost.style.visibility = 'hidden';
  ghost.style.boxSizing = 'content-box';
  ghost.style.fontFamily = 'var(--font-family, IBM Plex Sans, sans-serif)';
  ghost.style.fontSize = Math.round(DEFAULT_FONT_SIZE * zoom) + 'px';
  ghost.style.color = defaultRolePalette[this.signer % 100].s100;
  ghost.style.overflow = 'visible';
  ghost.style.whiteSpace = 'nowrap';
  ghost.style.display = 'flex';
  ghost.style.alignItems = 'center';
  ghost.style.textTransform = 'capitalize';
  ghost.innerHTML = fieldData.formElementType;

  // Assignee label below ghost
  const assignee = this.mode === 'compose'
    ? this._recipients?.find(r => r.signerIndex === this.signer)
    : this._template.roles.find(r => r.signerIndex === this.signer);
  const assigneeName = this.mode === 'compose' && assignee?.previousRecipientDecides
    ? 'To Be Decided'
    : this.mode === 'compose'
      ? `${assignee?.firstName} ${assignee?.lastName}`
      : assignee?.name || (this.signer === 0 ? 'Sender' : `Participant ${this.signer}`);
  const assigneeLabel = document.createElement('p');
  assigneeLabel.style.position = 'absolute';
  assigneeLabel.style.color = 'var(--gray-80, #3a3a3a)';
  assigneeLabel.style.bottom = `-${1 * zoom}rem`;
  assigneeLabel.style.left = '0';
  assigneeLabel.style.margin = '0';
  assigneeLabel.style.padding = '0';
  assigneeLabel.style.lineHeight = '1';
  assigneeLabel.style.fontSize = `${0.625 * zoom}rem`;
  assigneeLabel.style.whiteSpace = 'nowrap';
  assigneeLabel.style.fontFamily = 'sans-serif';
  assigneeLabel.style.textTransform = 'none';
  assigneeLabel.style.pointerEvents = 'none';
  assigneeLabel.textContent = `${dvI18n.t('fieldproperties.assignedto')} ${assigneeName}`;
  ghost.appendChild(assigneeLabel);

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
    enableSelection();
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
          value: fieldData.formElementType === 'checkbox' ? 'false' : '',
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
          optional: fieldData.formElementType === 'checkbox',
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

    if (this.signer === 0 && data.elementType === 'signature') {
      data = {
        label: 'Auto Sign',
        formElementType: 'auto sign',
        elementType: 'admin',
        validation: 3000,
        defaultHeight: FIELD_DEFAULTS['auto sign'].defaultHeight,
        defaultWidth: FIELD_DEFAULTS['auto sign'].defaultWidth,
      };
    }
    // Unselect all current selected items
    this.component.shadowRoot.querySelectorAll('ls-editor-field').forEach(f => (f.selected = false));
    var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
    // Make a new API compatible id for a template element (prefix 'ele')
    const id = btoa('ele' + crypto.randomUUID());
    const pageWidth = this.pageDimensions[this.pageNum - 1].width;
    const pageHeight = this.pageDimensions[this.pageNum - 1].height;
    const rawTop = event.offsetY / this.zoom + frame.scrollTop;
    const rawLeft = event.offsetX / this.zoom + frame.scrollLeft;
    const top = Math.max(0, Math.min(rawTop, pageHeight - data.defaultHeight));
    const left = Math.max(0, Math.min(rawLeft, pageWidth - data.defaultWidth));

    // TODO: Put these defaults somewhere sensible
    const newData: LSMutateEvent = {
      action: 'create',
      data: {
        id,
        value: data.formElementType === 'checkbox' ? 'false' : '',
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
        optional: data.formElementType === 'checkbox',
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
