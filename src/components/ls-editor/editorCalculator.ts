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
export const addField = (frame: HTMLElement, data): HTMLLsEditorFieldElement => {
  const node = document.createElement('ls-editor-field');
  node.setAttribute('type', data.formElementType);
  node.setAttribute('id', 'ls-field-' + data.id);
  node.setAttribute('selected', 'selected');
  node.style.zIndex = '100';
  node.style.position = 'absolute';

  node.style.top = data.top + 'px';
  node.style.left = data.left + 'px';
  node.style.height = data.height + 'px';
  node.style.width = data.width + 'px';
  node.dataItem = data;
  frame.appendChild(node);

  return node as any as HTMLLsEditorFieldElement;
};

export const moveField = (item: HTMLLsEditorFieldElement, data) => {
  item.style.top = data.top + 'px';
  item.style.left = data.left + 'px';
  item.style.height = data.height + 'px';
  item.style.width = data.width + 'px';
  item.dataItem = data;
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
  sourceField: HTMLLsEditorFieldElement,
  pageHeight: number,
  pageWidth: number
): { top: number; left: number; height: number; width: number; ax: number; ay: number; bx: number; by: number } => {
  const { top, left, height, width } = sourceField.getBoundingClientRect();
  // Returns X, Y coordinates
  const ax = left > 0 ? left / pageWidth : 0;
  const ay = top > 0 ? top / pageHeight : 0;
  const bx = (left + width) / pageWidth;
  const by = (top + height) / pageHeight;

  // Return with calculated styles that try to place it as it would appear on legacy signing page
  return {
    top,
    left,
    height,
    width,
    ax,
    ay,
    bx,
    by,
  };
};
