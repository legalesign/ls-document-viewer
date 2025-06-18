# ls-document-viewer

Here is the data that should be passed into your component.

```graphql
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
            roles{
              id
              signerIndex
            }
            elementConnection {
              templateElements {
                align
                ax
                ay
                bx
                by
                elementType
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
          }
        }
 ```

