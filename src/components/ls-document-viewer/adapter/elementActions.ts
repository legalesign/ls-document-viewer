// Construct all mutations for a template element.
const createElement = element => {
  return `
  mutation AddField {
    createTemplateElement(input: {
      templateId: "${element.templateId}", 
      ax: ${element.ax}, 
      ay: ${element.ay}, 
      bx: ${element.bx}, 
      by: ${element.by}, 
      elementType: ${JSON.stringify(element.elementType)}, 
      role: "1",
      label: ${JSON.stringify(element.label)}, 
      page: ${element.page}, 
      fieldOrder: ${element.fieldOrder}, 
      fontName: ${JSON.stringify(element.fontName)}, 
      fontSize: ${element.fontSize}, 
      helpText: ${JSON.stringify(element.helpText)}, 
      hideBorder: ${element.hideBorder}, 
      logicGroup: ${JSON.stringify(element.logicGroup)}, 
      mapTo: ${JSON.stringify(element.mapTo)}, 
      optional: ${element.optional}, 
      options: ${JSON.stringify(element.options)}, 
      substantive: ${element.substantive}, 
      validation: ${element.validation}, 
      value: ${JSON.stringify(element.value)}, 
      align: ${JSON.stringify(element.align)}, 
      signer: ${element.signer}, 
      logicAction: ${element.logicAction}, 
      labelExtra: ${JSON.stringify(element.labelExtra)}})
  }`;
};

// Save any changes to an element
const updateElement = element => {
  return `mutation ChangeField {
  updateTemplateElement(input: {
    templateElementId: "${element.id}", 
    ax: ${element.ax}, 
    ay: ${element.ay}, 
    bx: ${element.bx}, 
    by: ${element.by}, 
    elementType: ${JSON.stringify(element.elementType)}, 
    label: ${JSON.stringify(element.label)}, 
    page: ${element.page}, 
    fieldOrder: ${element.fieldOrder ? element.fieldOrder : null}, 
    fontName: ${JSON.stringify(element.fontName)}, 
    fontSize: ${element.fontSize}, 
    helpText: "${element.helpText}", 
    hideBorder: ${element.hideBorder}, 
    logicGroup: ${JSON.stringify(element.logicGroup)}, 
    mapTo: "${element.mapTo}", 
    optional: ${element.optional}, 
    options: ${JSON.stringify(element.options)}, 
    role: "1", 
    substantive: ${element.substantive}, 
    validation: ${element.validation === '0' ? 'null' : element.validation}, 
    value: "${element.value}", 
    align: "${element.align}", 
    signer: ${element.signer}, 
    logicAction: ${element.logicAction}, 
    labelExtra: "${element.labelExtra}"})
}`;
};

// Save any changes to an element
const deleteElement = obj => {
  return `mutation DeleteField {
  deleteTemplateElement(input: {
    templateElementId: "${obj.id}"})
  }`;
};

export { createElement, updateElement, deleteElement };
