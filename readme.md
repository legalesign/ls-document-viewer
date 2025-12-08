# Integrate Legalesign Document Viewer into Your Website

The Legalesign Document Viewer is a platform-agnostic web component that allows you to edit, preview, and customize templates for document signing. Built with StencilJS, it works seamlessly with vanilla JavaScript, React, Vue, Angular, or any web framework.

This plug and play component is designed so that you can integrate key parts of document creation into your internal systems, such as a CRM or line of business application. As long as your system can render and support HTML components, you can use the Document Viewer. If you need additional help integrating the Document Viewer into your technical stack please get in touch with our support desk. You can use these larger widgets with REST/GraphQL API integrations to provide seamless document signing processes for your staff and customers.

## Installation

### NPM Installation

```bash
npm install legalesign-document-viewer
```

### For React Projects

```bash
npm install legalesign-document-viewer-react
```

## Basic Integration

### Vanilla HTML/JavaScript

Add the component scripts to your HTML:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="node_modules/legalesign-document-viewer/dist/ls-document-viewer/ls-document-viewer.css" />
    <script type="module" src="node_modules/legalesign-document-viewer/dist/ls-document-viewer/ls-document-viewer.esm.js"></script>
    <script nomodule src="node_modules/legalesign-document-viewer/dist/ls-document-viewer/ls-document-viewer.js"></script>
  </head>
  <body>
    <ls-document-viewer
      id="my-editor"
      templateid="YOUR_TEMPLATE_ID"
      token="YOUR_AUTH_TOKEN"
      endpoint="YOUR_GRAPHQL_ENDPOINT"
    ></ls-document-viewer>
  </body>
</html>
```

### React Integration

```jsx
import { LsDocumentViewer } from 'legalesign-document-viewer-react';

function App() {
  return (
    <LsDocumentViewer
      templateid="YOUR_TEMPLATE_ID"
      token="YOUR_AUTH_TOKEN"
      endpoint="YOUR_GRAPHQL_ENDPOINT"
      mode="compose"
    />
  );
}
```

## Required Attributes

### token
Your security token for authentication. This verifies your identity and access to the template. See more
documentation about how to securely get a token without exposing your credentials, see the examples
here [https://apidocs.legalesign.com/docs/graphql/oauth2/setup/]

```html
token="eyJraWQiOiJBTkJIeT..."
```

### templateid
The API ID of the template you want to present to users. You can easy find this by looking in the url
when you are editing the template in the Console application.

```html
templateid="dHBsYjQ5YTg5NWQtYWRhMy0xMWYwLWIxZGMtMDY5NzZlZmU0MzIx"
```

## Widget Modes

### Editor Mode
Full-featured template creation and editing with all available tools. This is intended for work flows where a
highly reusable template with roles is helpful. If your intention is to only use your document once (perhaps your
document generation system has already filled in all the client information) then you may want to consider
*compose* mode instead.

```html
<ls-document-viewer mode="editor" ...></ls-document-viewer>
```

### Compose Mode
Streamlined mode to quickly adding signature boxes to pre-generated templates. Ideal for integrated clients where recipients are already defined.

For more information on recipients see [Recipients](#recipients).

```html
<ls-document-viewer 
    mode="compose" 
    recipients='[
        {"email": "user@example.com", "firstname": "John", "lastname": "Doe", "signerIndex": 1},
        {"email": "user2@example.com", "firstname": "Jane", "lastname": "Smith", "signerIndex": 2}
    ]'
    ...></ls-document-viewer>
```

Compose mode automatically:
- Detects pre-generated recipients
- Hides the sender from dropdown
- Hides document options
- Shows required fields by default
- Removes sender and sender fields from the editor
- Promotes quick selection of the required fields for each recipient

### Preview Mode
A helpful document preview that shows the document with all the current fields and lets the user browse though pages.

```html
<ls-document-viewer mode="preview" ...></ls-document-viewer>
```

Compose mode automatically:
- Hides the toolbar
- Hides document options
- Hides toolbox
- Makes participants and fields read-only

## Advanced Configuration

### Filter Toolbox
Restrict available field types using pipe-delimited values. If no value is provided then
it is assumed the toolbox will be unfiltered and all options are available.

```html
<ls-document-viewer
  filtertoolbox="signature|initials|date|text"
  ...
></ls-document-viewer>
```

### endpoint
Your GraphQL API endpoint, if you've been given a client specific endpoint.

```html
endpoint="https://your-api.appsync-api.region.amazonaws.com/graphql"
```

### Recipients
Define document recipients in JSON format. Note that the required elements for
a recipient are firstname, lastname, email and signerIndex; optionally you can
also pass the role and phonenumber for each recipient. Omitting a role means
that the recipient will be treated as a distinct signer, to change this you can pass
role: "WITNESS" and include a special signer index to show which is their parent, so 
for instance if you wanted to include a witness for signer 2, that witness would have 
a signerIndex of 102.

```html
<ls-document-viewer
  recipients='[
    {"email": "user@example.com", "firstname": "John", "lastname": "Doe", "signerIndex": 1},
    {"email": "user2@example.com", "firstname": "Jane", "lastname": "Smith", "signerIndex": 2}
    {"email": "user3@example.com", "firstname": "Joan", "lastname": "Mitchell", "signerIndex": 102, roleType: "WITNESS"}
  ]'
  ...
></ls-document-viewer>
```

### Custom Buttons with Slots
Add custom buttons to the toolbar using slots:

```html
<ls-document-viewer ...>
  <style>
    .custom-button {
      padding: 2px 12px;
      border-radius: 1rem;
      background-color: #9df5d4;
      color: #125241;
      font-weight: 500;
    }
  </style>
  <span slot="left-button">
    <button class="custom-button">Cancel</button>
  </span>
  <span slot="right-button">
    <button class="custom-button">Send Document</button>
  </span>
</ls-document-viewer>
```

## Event Handling

Listen to component events to track changes:

```javascript
const editor = document.querySelector('ls-document-viewer');

editor.addEventListener('mutate', (event) => {
  console.log('Template changed:', event.detail);
});
```

### React Event Handling

```jsx
<LsDocumentViewer
  onMutate={(event) => {
    console.log('Template changed:', event.detail);
  }}
  ...
/>
```

#### `mutate` event
Fired when the document template is changed, such as adding or removing fields.

#### `selectFields` event
Fired when a field is selected in the editor.

#### `addParticipant` event
Fired when a participant role is added to the template.

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document Editor</title>
    <link rel="stylesheet" href="/build/ls-document-viewer.css" />
    <script type="module" src="/build/ls-document-viewer.esm.js"></script>
  </head>
  <body style="padding: 0; margin: 0">
    <ls-document-viewer
      id="my-editor"
      templateid="dHBsYjQ5YTg5NWQtYWRhMy0xMWYwLWIxZGMtMDY5NzZlZmU0MzIx"
      token="YOUR_TOKEN_HERE"
      endpoint="https://your-endpoint.amazonaws.com/graphql"
      mode="compose"
      recipients='[
        {"email": "signer@example.com", "firstname": "John", "lastname": "Doe", "signerIndex": 1}
      ]'
      filtertoolbox="signature|initials|date"
    >
      <span slot="left-button">
        <button onclick="handleCancel()">Cancel</button>
      </span>
      <span slot="right-button">
        <button onclick="handleSend()">Send</button>
      </span>
    </ls-document-viewer>

    <script>
      const editor = document.querySelector('ls-document-viewer');
      
      editor.addEventListener('mutate', (event) => {
        console.log('Document updated:', event.detail);
      });

      function handleCancel() {
        window.location.href = '/dashboard';
      }

      function handleSend() {
        // Implement send logic
        console.log('Sending document...');
      }
    </script>
  </body>
</html>
```

## Browser Support

The component uses modern web standards and supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [API Documentation](https://apidocs.legalesign.com)
- [NPM Package](https://www.npmjs.com/package/legalesign-document-viewer)
- [React Package](https://www.npmjs.com/package/legalesign-document-viewer-react)
- [Support](https://www.legalesign.com/support)

## Getting Help

For technical support or questions about integration, contact the Legalesign support team or visit the API documentation at [https://apidocs.legalesign.com](https://apidocs.legalesign.com).
