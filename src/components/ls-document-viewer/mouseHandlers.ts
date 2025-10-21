import { LSApiElement } from '../../types/LSApiElement';
import { LSMutateEvent } from '../../types/LSMutateEvent';
import { findDimensions, findIn, recalculateCoordinates } from './editorCalculator';

let mousetimer = null;

export function debounce(data, delay) {
  if (mousetimer) clearTimeout(mousetimer);

  mousetimer = setTimeout(() => {
    this.mutate.emit([data]);
  }, delay);
}

export function mouseDown(e) {
  if (e.offsetX < 0 || e.offsetY < 0) return;
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
    // console.log('start mouse down reset');
    this.startLocations = null;
    this.startMouse = null;
    this.selectionBox = { x: e.clientX, y: e.clientY };
    // console.log('empty space reset selected', this.selectionBox);
    this.selectFields.emit([]);
    this.selected = [];
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

        this.hitField.dataItem = { ...this.hitField.dataItem, top: this.startMouse.top + movedY, height: this.startMouse.height - movedY };
        break;
      case 's':
        this.hitField.style.height = this.startMouse.height + movedY + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, height: this.startMouse.height + movedY };
        break;
      case 'e':
        this.hitField.style.width = this.startMouse.width + movedX + 'px';
        this.hitField.dataItem = { ...this.hitField.dataItem, width: this.startMouse.width + movedX };

        break;
      case 'w':
        this.hitField.style.left = this.startMouse.left + movedX + 'px';
        this.hitField.style.width = this.startMouse.width - movedX + 'px';

        this.hitField.dataItem = { ...this.hitField.dataItem, left: this.startMouse.left + movedX, width: this.startMouse.width - movedX };
        break;
    }

    debounce.bind(this)({ action: 'update', data: recalculateCoordinates(this.hitField.dataItem) }, 700);
  } else if (this.selectionBox && event.buttons === 1) {
    console.log('drawing box');
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
  } else if (this.startLocations && !this.edgeSide && this.startMouse && event.buttons === 1) {
    this.isMoving = true;
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    box.style.visibility = 'hidden';

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

  // console.log('mouse up');
  // find what was inside the selection box emit the select event and change their style
  if (this.selectionBox) {
    var box = this.component.shadowRoot.getElementById('ls-box-selector') as HTMLElement;
    var fields = this.component.shadowRoot.querySelectorAll('ls-editor-field');
    box.style.visibility = 'hidden';
    this.selectionBox = null;
    const found = findIn(fields, box, true, event.shiftKey);
    this.selected = Array.from(found);
    this.selectFields.emit(found.map(fx => fx.dataItem));
  }
}

export function mouseClick(e) {
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
            ...findDimensions(divFrame, fx, this.pageDimensions[this.pageNum - 1].height, this.pageDimensions[this.pageNum - 1].width, this.zoom),
          };
          // TODO:: out of bounds handler (UNDO)
          // update the data in the html element
          fx.dataItem = delta;
          // send an update event to be processed
          return { action: 'update', data: delta };
        }),
    );
    this.selectFields.emit(selected.map(fx => fx.dataItem));
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
  }
}

export function mouseDrop(event) {
  event.preventDefault();
  try {
    const data: IToolboxField = JSON.parse(event.dataTransfer.getData('application/json')) as any as IToolboxField;
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
        fontName: 'arial',
        fontSize: 10,
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
    this.update.emit([newData]);
  } catch (e) {
    console.error(e);
  }
}
