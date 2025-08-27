import { findDimensions, findIn } from './editorCalculator';

export function mouseDown(e) {
  if (e.offsetX < 0 || e.offsetY < 0) return;

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
    // west edge
    if (Math.abs(e.clientX - left) < 5 && e.clientY >= top && e.clientY <= bottom) {
      this.edgeSide = 'w';
      this.hitField = f;
      // right / east edge
    } else if (Math.abs(e.clientX - right) < 5 && e.clientY >= top && e.clientY <= bottom) {
      this.edgeSide = 'e';
      this.hitField = f;
      // north edge
    } else if (Math.abs(e.clientY - top) < 5 && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = 'n';
      this.hitField = f;
      // south edge
    } else if (Math.abs(e.clientY - bottom) < 5 && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = 's';
      this.hitField = f;
    } else if (e.clientY <= bottom && e.clientY >= top && e.clientX >= left && e.clientX <= right) {
      this.edgeSide = null;
      this.hitField = f;
    }
  });

  if (this.hitField) {
    const { height, width } = this.hitField.getBoundingClientRect();
    const fdims = { left: this.hitField.offsetLeft, top: this.hitField.offsetTop, height, width, x: e.screenX, y: e.screenY };
    this.startMouse = fdims;
    const target = this.selected ? this.selected : [this.hitField];
    this.startLocations = target.map(f => {
      const { height, width } = f.getBoundingClientRect();
      const beHtml = f as HTMLElement;
      return { top: beHtml.offsetTop, left: beHtml.offsetLeft, height, width };
    });
    this.selectionBox = null;
  } else {
    this.startLocations = null;
    this.startMouse = null;
    this.selectionBox = { x: e.clientX, y: e.clientY };
    this.component.style.cursor = 'crosshair';
  }
}

export function mouseMove(event) {
  event.preventDefault();

  // We have the mouse held down on a field edge to resize it.
  if (this.hitField && this.edgeSide && this.startMouse && event.buttons === 1) {
    const movedX = event.screenX - this.startMouse.x;
    const movedY = event.screenY - this.startMouse.y;

    switch (this.edgeSide) {
      case 'n':
        this.hitField.style.top = this.startMouse.top + movedY + 'px';
        this.hitField.style.height = this.startMouse.height - movedY + 'px';
        break;
      case 's':
        this.hitField.style.height = this.startMouse.height + movedY + 'px';
        break;
      case 'e':
        this.hitField.style.width = this.startMouse.width + movedX + 'px';
        break;
      case 'w':
        this.hitField.style.left = this.startMouse.left + movedX + 'px';
        this.hitField.style.width = this.startMouse.width - movedX + 'px';
        break;
    }
  } else if (this.selectionBox && event.buttons === 1) {
    // draw the multiple selection box
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    var frame = this.component.shadowRoot.getElementById('ls-document-frame') as HTMLElement;
    var leftOffset = frame.getBoundingClientRect().left;
    var topOffset = frame.getBoundingClientRect().top;
    
    const movedX = event.clientX - this.selectionBox.x;
    const movedY = event.clientY - this.selectionBox.y;

    // allow for the frame to be scrolled    
    box.style.visibility = 'visible';
    box.style.left = (this.selectionBox.x > event.clientX ? event.clientX : this.selectionBox.x) - leftOffset  + frame.scrollLeft + 'px';
    box.style.top = (this.selectionBox.y > event.clientY ? event.clientY : this.selectionBox.y) - topOffset  + frame.scrollTop + 'px';
    box.style.width = Math.abs(movedX) + 'px';
    box.style.height = Math.abs(movedY) + 'px';
  } else if (this.startLocations && !this.edgeSide && this.startMouse && event.buttons === 1) {
    this.isMoving = true;
    // Move one or more selected items
    const movedX = event.screenX - this.startMouse.x;
    const movedY = event.screenY - this.startMouse.y;
    if (this.selected?.length) {
      for (let i = 0; i < this.selected.length; i++) {
        this.selected[i].style.left = this.startLocations[i].left + movedX + 'px';
        this.selected[i].style.top = this.startLocations[i].top + movedY + 'px';
      }
    }
  }
}

export function mouseUp(event) {
  this.edgeSide = null;
  this.startMouse = null;
  this.component.style.cursor = 'auto';

  // find what was inside the selection box emit the select event and change their style
  if (this.selectionBox) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    box.style.visibility = 'hidden';

    findIn(fields, box, true, event.shiftKey);

    var updatedFields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];

    this.selectFields.emit(
      Array.from(updatedFields)
        .filter(fx => fx.selected)
        .map(fx => fx.dataItem),
    );
    this.selectionBox = null;
    this.selected = Array.from(updatedFields).filter(fx => fx.selected);
  }
}

export function mouseClick(e) {
  // check we're not moving fields
  if (this.isMoving) {
    // End dragging fields
    this.isMoving = false;
    const fields = this.component.shadowRoot.querySelectorAll('ls-editor-field') as HTMLLsEditorFieldElement[];
    const selected = Array.from(fields).filter(fx => fx.selected);

    this.selectFields.emit(selected.map(fx => fx.dataItem));
    this.mutate.emit(
      Array.from(fields)
        .filter(fx => fx.selected)
        .map(fx => {
          // Calculate new positions and update the dataItem on the control
          const delta = {
            ...fx.dataItem,
            ...findDimensions(fx, this.pageDimensions[this.pageNum - 1].height, this.pageDimensions[this.pageNum - 1].width),
          };
          console.log(delta)
          fx.dataItem = delta;
          return { action: 'update', data: delta };
        }),
    );
  } else {
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
  }
}
