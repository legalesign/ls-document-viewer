# ls-document-viewer
This component allows you to edit, preview or customize a Legalesign template in order to
send a document for signing. It is purely HTML and javascript and platform agnostic.

## Linking the Viewer to Data 
In order to use it you'll need to provide three functions:

load(): this gets the template information from your backend or a call to the Legalesign GraphQL API 
(see the recommended data below).

mutate(): you'll need to provide a function that saves alterations to the template or fields. Again
this can be calls to the GraphQL API on your platform.

## Add Custom Panels

TODO

## Recommended data

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
          }
        }
 ```

