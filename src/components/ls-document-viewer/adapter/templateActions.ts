 
// Add a role
const updateTemplate = (template) => {  
  return `
    mutation updateTemplate {
      updateTemplate(input: {
        templateId: "${template.id}", 
        title: "${template.title}",
        locked: ${template.locked},
        autoArchive: ${template.autoArchive},
        fixSignatureScale: ${template.fixSignatureScale ? template.fixSignatureScale : false}
      })
    }
  ` 
};

export { updateTemplate };
