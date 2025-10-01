// Add a role
const updateTemplate = template => {
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
  `;
};

const getTemplate = (id: string) => {
  return `
        query GetTemplate {
          template(id: "${id}") {
            id
            title
            fileName
            pageDimensions
            pageCount
            modified
            link
            valid
            locked
            autoArchive
            archived
            tags
            created
            createdBy
            lastSent
            fixSignatureScale
            groupId
            roles{
              id
              name
              roleType
              signerIndex
              ordinal
              signerParent
              experience
            }
            elementConnection {
              templateElements {
                align
                ax
                ay
                bx
                by
                elementType
                formElementType
                fieldOrder
                fontName
                fontSize
                helpText
                hideBorder
                id
                label
                labelExtra
                logicAction
                logicGroup
                mapTo
                options
                optional
                page
                role
                signer
                substantive
                validation
                value
              }
              totalCount
            }
            userSignatureConnection {
              userSignatureElements {
                id
                userId
                ax
                ay
                bx
                by
                page
                link
              }
            }
          }
        }
      `;
};

export { updateTemplate, getTemplate };
