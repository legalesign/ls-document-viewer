import { LSApiElement } from '../../types/LSApiElement';

export const findIn = (fields: NodeListOf<HTMLLsEditorFieldElement>, selector: HTMLElement, restyle: boolean = false, additive: boolean = false): HTMLLsEditorFieldElement[] => {
  const selected: HTMLLsEditorFieldElement[] = new Array();
  const { top, left, bottom, right } = selector.getBoundingClientRect();

  fields.forEach(f => {
    if (f.getBoundingClientRect().bottom <= bottom && f.getBoundingClientRect().top >= top && f.getBoundingClientRect().left >= left && f.getBoundingClientRect().right <= right) {
      if (restyle) f.selected = true;
      selected.push(f);
    } else {
      if (restyle && !additive) f.selected = false;
    }
  });
  return selected;
};


// Used to append new fields (dropped or loaded from template data)
export function addField(frame: HTMLElement, data): HTMLLsEditorFieldElement {
  const fields = this._template.elementConnection.templateElements;
  this._template = {...this._template, elementConnection: { ...this._template.elementConnection, templateElements: [...fields, data]} };
  const assignee = this._template.roles.find(r => r.signerIndex === data.signer);
  
  const node = document.createElement('ls-editor-field');
  node.setAttribute('type', data.formElementType);
  node.setAttribute('id', 'ls-field-' + data.id);
  node.setAttribute('assignee', assignee?.name || `Participant ${data.signer}`);
  // node.setAttribute('selected', 'selected');
  node.style.zIndex = '100';
  node.style.position = 'absolute';

  node.style.top = Math.floor(data.top * this.zoom)  +'px';
  node.style.left = Math.floor(data.left * this.zoom) + 'px';
  node.style.height = Math.floor(data.height * this.zoom) + 'px';
  node.style.width = Math.floor(data.width * this.zoom) + 'px';
  node.style.fontSize = Math.floor(data.fontSize * this.zoom) + 'pt';
  node.style.alignContent = data.align;
  node.style.fontFamily = data.fontName;
  node.dataItem = data;
  
  frame.appendChild(node);

  return node as any as HTMLLsEditorFieldElement;
};

export function moveField(item: HTMLLsEditorFieldElement, data){
  item.style.top = Math.floor(data.top * this.zoom) + 'px';
  item.style.left = Math.floor(data.left * this.zoom) + 'px';
  item.style.height = Math.floor(data.height * this.zoom) + 'px';
  item.style.width = Math.floor(data.width * this.zoom) + 'px';
  item.style.fontSize = Math.floor(data.fontSize * this.zoom) + 'pt';
  item.style.fontFamily = data.fontName;
  item.style.textAlign = data.align;
  item.dataItem = recalculateCoordinates(data);
};

// calculates html compatible coords at current zoom level
export const transformCoordinates = (
  sourceField: LSApiElement,
  inputFieldWidth: number,
  inputFieldHeight: number,
  viewerWidth: number,
  viewerHeight: number,
  left: number,
  top: number,
  fontName: string,
  fontSize: number,
  zoom: number,
): LSApiElement => {
  // Returns X, Y coordinates
  const ax = left > 0 ? left / viewerWidth : 0;
  const ay = top > 0 ? top / viewerHeight : 0;
  const bx = (left + inputFieldWidth) / viewerWidth;
  const by = (top + inputFieldHeight) / viewerHeight;

  // Return with calculated styles that try to place it as it would appear on legacy signing page
  return {
    ...sourceField,
    ax,
    ay,
    bx,
    by,
    cstyle: {
      margin: 0,
      verticalAlign: 'top',
      boxSizing: 'content-box',
      fontSize: viewerWidth < 640 ? `${(fontSize / 24) * zoom}rem` : `${fontSize * zoom}px`,
      fontFamily: fontName || 'arial',
      width: `${(inputFieldWidth * bx - inputFieldWidth * ax) * zoom}px`, // app1 input has padding-x 3px
      height: `${inputFieldHeight * (by - ay) * zoom}px`, // app1 input has padding-y 2px
      // minHeight: `${inputFieldHeight * (BY - AY) * zoom - 2}px`,
      lineHeight: 'inherit',
    },
    divStyle: {
      position: 'absolute',
      top: `${inputFieldHeight * ay * zoom}px`,
      left: `${inputFieldWidth * ax * zoom}px`,
      width: `${(inputFieldWidth * bx - inputFieldWidth * ax) * zoom}px`,
      height: `${inputFieldHeight * (by - ay) * zoom}px`,
      zIndex: 1000,
      fontSize: viewerWidth < 640 ? `${(fontSize / 24) * zoom}rem` : `${fontSize * zoom}px`,
    },
    objectHeight: `${inputFieldHeight * (by - ay) * zoom}px`,
  };
};

// from a field element get all dimension data including LEGACY dimensions
export const findDimensions = (
  frameContainer: HTMLDivElement,
  sourceField: HTMLLsEditorFieldElement,
  pageHeight: number,
  pageWidth: number,
  zoom: number
): { top: number; left: number; height: number; width: number; ax: number; ay: number; bx: number; by: number } => {

  // Position of widget frame
  const frmDims = frameContainer.getBoundingClientRect();
  // dimensions relative to viewport
  const { height, width } = sourceField.getBoundingClientRect();
  const top = Math.floor((sourceField.getBoundingClientRect().top - frmDims.top) / zoom);
  const left = Math.floor((sourceField.getBoundingClientRect().left - frmDims.left) / zoom);
 
  // Returns X, Y coordinates
  const ax = left > 0 ? left / pageWidth : 0;
  const ay = top > 0 ? top / pageHeight : 0;
  const bx = (left + (width / zoom)) / pageWidth;
  const by = (top + (height / zoom)) / pageHeight;


  // Return with calculated styles that try to place it as it would appear on legacy signing page
  return {
    top,
    left,
    height: Math.round(height / zoom),
    width: Math.round(width / zoom),
    ax,
    ay,
    bx,
    by,
  };
};


// from a field element get all dimension data including LEGACY dimensions
export const recalculateCoordinates = (
  d: LSApiElement
): LSApiElement => {

  // Returns X, Y coordinates
  const ax = d.left / d.pageDimensions.width;
  const ay = d.top / d.pageDimensions.height;
  const bx = (d.left + d.width) / d.pageDimensions.width;
  const by = (d.top + d.height) / d.pageDimensions.height;

  // Return with calculated styles that try to place it as it would appear on legacy signing page
  return {
    ...d,
    ax,
    ay,
    bx,
    by,
  };
};

// from a field determinse if out of bounds
export const oob = (
  d: LSApiElement
): boolean => {

  return (d.left < 0 || d.top < 0 || (d.left + d.width) > d.pageDimensions.width || (d.top + d.height) > d.pageDimensions.height);
};


