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

editor.addEventListener('update', (event) => {
  console.log('Template changed:', event.detail);
});
```

You can track whether a template have become valid or invalid using
the validate event.

```javascript
const editor = document.querySelector('ls-document-viewer');

editor.addEventListener('validate', (event) => {
  console.log('Template validation changed:', event.detail.valid);
});
```

### React Event Handling Example

Using an event in react prefixes it with the familiar `on<EventName>`.

```jsx
<LsDocumentViewer
  onUpdate={(event) => {
    console.log('Template changed:', event.detail);
  }}
  ...
/>
```

### Event Types

#### `update` event
Fired when the document template is changed, such as adding or removing fields. Provides not only
the event that caused it but also the updated state of the template object as JSON.

#### `validate` event
Fired when the document template is changed, the `valid` property in detail shows if the
template has become valid or invalid.

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
    <link rel="stylesheet" href="https://unpkg.com/legalesign-document-viewer/ls-document-viewer.css" />
    <script type="module" src="https://unpkg.com/legalesign-document-viewer"></script>
  </head>
  <body style="padding: 0; margin: 0">
    <ls-document-viewer
      id="my-editor"
      templateid="dHBsYjQ5YTg5NWQtYWRhMy0xMWYwLWIxZGMtMDY5NzZlZmU0MzIx"
      token="YOUR_TOKEN_HERE"
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
        // Implement the cancel logic, e.g. go to a home page
        window.location.href = '/cancelpage';
      }

      function handleSend() {
        // Implement send logic if required.
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

- [API Documentation](https://apidocs.legalesign.com){:target="_blank"}
- [NPM Package](https://www.npmjs.com/package/legalesign-document-viewer){:target="_blank"}
- [React Package](https://www.npmjs.com/package/legalesign-document-viewer-react){:target="_blank"}
- [Support](https://support.legalesign.com/){:target="_blank"}

## Getting Help

For technical support or questions about integration, contact the Legalesign support team or visit the API documentation at [https://apidocs.legalesign.com](https://apidocs.legalesign.com).

## Release Versioning

```
major.minor.patch
0.9.8
```

Versioning is automated via GitHub Actions when merging to `prod` branch. The version bump type is determined by PR title:

| PR title | Bump | Example |
|---|---|---|
| `fix: ...`, `chore: ...`, anything else | patch | 0.9.8 → 0.9.9 |
| `feat: ...`, `feat(...): ...` | minor | 0.9.8 → 0.10.0 |
| Contains `BREAKING CHANGE` | major | 0.9.8 → 1.0.0 |

The version is read from `package.json` and displayed in the statusbar (bottom-right). Both `legalesign-document-viewer` and `legalesign-document-viewer-react` are published and kept in sync at the same version.

### How It Works

1. PR is merged to `prod`
2. GitHub Actions workflow (`.github/workflows/publish.yml`) runs
3. Version in `package.json` is bumped based on PR title
4. `legalesign-document-viewer` is built and published to npm (OIDC trusted publishing)
5. `legalesign-document-viewer-react` is cloned, regenerated, bumped, built, and published
6. Version bump is committed back to both repos with `[skip ci]` and git tags are pushed

### Secrets

| Secret | What | Used for |
|---|---|---|
| `PAT_TOKEN` | GitHub classic Personal Access Token (`repo` scope) | Pushing version bump commits and tags back to `prod`, cloning/pushing to `ls-document-viewer-react` |

### NPM Trusted Publishing

Publishing uses OIDC — no npm token required. Trusted publishers are configured on npmjs.com for both packages:
- Provider: GitHub Actions
- Repository: `legalesign/ls-document-viewer`
- Workflow: `publish.yml`

### Branch Protection

If `prod` has branch protection enabled, a bypass rule must be configured:

**GitHub → repo Settings → Branches → `prod` rule → "Allow specified actors to bypass required pull requests"**

## Testing App

The [ls-document-viewer-testing](https://github.com/legalesign/ls-document-viewer-testing) repo is a React app that consumes this component for testing. It is deployed to AWS Amplify at [document-viewer.legalesign.io](https://document-viewer.legalesign.io).

### Automation

- **Push to `main`**: `trigger-testing.yml` dispatches an event to the testing repo, which rebuilds with the latest code
- **PR opened**: `pr-preview.yml` creates a `pr-{number}` branch in the testing repo, triggering an Amplify preview deployment
- **PR closed/merged**: The preview branch is deleted and the Amplify deployment is torn down

### PR Preview URLs

When a PR is opened, a comment is posted with the preview URL:
```
https://pr-{number}.d25xecos8zk1f0.amplifyapp.com
```

### Local Development with Testing App

Both repos must be siblings:
```
parent/
├── ls-document-viewer/
├── ls-document-viewer-react/
└── ls-document-viewer-testing/
```

The testing app aliases local source via Vite when started with `pnpm start` (`LOCAL_VIEWER=1`). Since this is a Stencil component, changes require rebuilding:

1. Make changes in `ls-document-viewer`
2. Run `pnpm build` in `ls-document-viewer`
3. Restart the testing app dev server

Alternatively, run `pnpm start` in `ls-document-viewer` (Stencil watch mode) in a separate terminal for automatic rebuilds on file change.
