
// Save any changes to an element
const createElement = async (templateId, element) => {
  const client = generateClient();

  const result = await (client.graphql({ query: `
  mutation AddField {
    createTemplateElement(input: {
      templateId: "${templateId}", 
      ax: ${element.ax}, 
      ay: ${element.ay}, 
      bx: ${element.bx}, 
      by: ${element.by}, 
      elementType: ${JSON.stringify(element.elementType)}, 
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
      role: ${JSON.stringify(element.role)}, 
      substantive: ${element.substantive}, 
      validation: ${element.validation}, 
      value: ${JSON.stringify(element.value)}, 
      align: ${JSON.stringify(element.align)}, 
      signer: ${element.signer}, 
      logicAction: ${element.logicAction}, 
      labelExtra: ${JSON.stringify(element.labelExtra)}})
  }`}));

  return result.data.createTemplateElement;
};



// Save any changes to an element
const updateElement = async (element) => {
  const client = generateClient();

  const query = `mutation ChangeField {
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
    role: ${JSON.stringify(element.role)}, 
    substantive: ${element.substantive}, 
    validation: ${element.validation === '0' ? 'null' : element.validation}, 
    value: "${element.value}", 
    align: "${element.align}", 
    signer: ${element.signer}, 
    logicAction: ${element.logicAction}, 
    labelExtra: "${element.labelExtra}"})
}`;

  const result = await (client.graphql({ query }));

  return result.data.updateTemplateElement;
};

// Save any changes to an element
const deleteElement = async (id) => {
  const client = generateClient();
  const query = `mutation DeleteField {
  deleteTemplateElement(input: {
    templateElementId: "${id}"})
}`;

  const result = await (client.graphql({ query }));

  return result.data.deleteTemplateElement;
};

export { createElement, updateElement, deleteElement };
