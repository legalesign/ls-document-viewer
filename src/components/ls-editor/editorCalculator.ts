export const findIn = (fields: NodeListOf<HTMLLsEditorFieldElement>, selector: HTMLElement, restyle: boolean = false): HTMLLsEditorFieldElement[] => {
  const selected: HTMLLsEditorFieldElement[] = new Array();
  const { top, left, bottom, right } = selector.getBoundingClientRect();

  fields.forEach(f => {
    if (f.getBoundingClientRect().bottom <= bottom && f.getBoundingClientRect().top >= top && f.getBoundingClientRect().left >= left && f.getBoundingClientRect().right <= right) {
      if (restyle) f.style.borderColor = '#ff0000';
      selected.push(f);
    } else {
      if (restyle) f.style.borderColor = '#000000';
    }
  });
  console.log(selected);
  return selected;
};
