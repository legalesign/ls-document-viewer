export const findIn = (fields: NodeListOf<HTMLLsEditorFieldElement>, selector: HTMLElement, restyle: boolean = false): HTMLLsEditorFieldElement[] => {
  const selected: HTMLLsEditorFieldElement[] = new Array();
  const { top, left, bottom, right } = selector.getBoundingClientRect();

  fields.forEach(f => {
    if (f.getBoundingClientRect().bottom <= bottom && f.getBoundingClientRect().top >= top && f.getBoundingClientRect().left >= left && f.getBoundingClientRect().right <= right) {
      if (restyle) f.selected = true;
      selected.push(f);
    } else {
      if (restyle)  f.selected = false;
    }
  });
  console.log(selected);
  return selected;
};
