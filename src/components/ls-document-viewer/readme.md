# ls-document-viewer



<!-- Auto Generated Below -->


## Overview

The Legalesign page viewer converted to stencil. To use pass the standard
Template information from GraphQL (see Readme).

Alex Weinle

## Properties

| Property          | Attribute         | Description                                                                                                                                                           | Type                                                                      | Default     |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------- |
| `_recipients`     | --                |                                                                                                                                                                       | `any[]`                                                                   | `undefined` |
| `displayTable`    | `display-table`   | Shows the table view of fields rather than the preview. {boolean}                                                                                                     | `boolean`                                                                 | `false`     |
| `endpoint`        | `endpoint`        | This will override the default production graphql endpoint. Almost exclusively used for internal development. {string}                                                | `string`                                                                  | `undefined` |
| `filtertoolbox`   | `filtertoolbox`   | Allows the selection of fields in the toolbox to be limited to a \| (pipe) delimited list. {string}                                                                   | `string`                                                                  | `null`      |
| `groupInfo`       | `group-info`      |                                                                                                                                                                       | `any`                                                                     | `undefined` |
| `manager`         | `manager`         | Determines / sets which of the far left 'managers' is active. {'document' \| 'toolbox' \| 'participant' }                                                             | `"document" \| "participant" \| "recipient" \| "toolbox" \| "validation"` | `'toolbox'` |
| `mode`            | `mode`            | An ease of use property that will arrange document-viewer appropraitely. {'preview' \| 'editor' \| 'custom'}                                                          | `"compose" \| "editor" \| "preview"`                                      | `'editor'`  |
| `pageCount`       | `page-count`      |                                                                                                                                                                       | `number`                                                                  | `1`         |
| `pageNum`         | `page-num`        |                                                                                                                                                                       | `number`                                                                  | `1`         |
| `readonly`        | `readonly`        | Whether the right panel (which can be default field properties or custom panel) is displayed. {boolean}                                                               | `boolean`                                                                 | `false`     |
| `recipients`      | `recipients`      | A JSON string containing the recipient details. Only used in COMPOSE mode. {string}                                                                                   | `string`                                                                  | `undefined` |
| `showpagepreview` | `showpagepreview` | Whether the page previewvertical ribbon will be shown {boolean}                                                                                                       | `boolean`                                                                 | `false`     |
| `showstatusbar`   | `showstatusbar`   | Whether the bottom statusbar is displayed. {boolean}                                                                                                                  | `boolean`                                                                 | `false`     |
| `showtableview`   | `showtableview`   | Whether the table view of the fields on this template is available to the user. {boolean}                                                                             | `boolean`                                                                 | `false`     |
| `signer`          | `signer`          |                                                                                                                                                                       | `number`                                                                  | `0`         |
| `template`        | `template`        | The initial template data, including the link for background PDF. See README and example for correct GraphQL query and data structure. {LSApiTemplate}                | `string`                                                                  | `undefined` |
| `templateid`      | `templateid`      | The id of the template you want to load (if using the internal data adapter). {string}                                                                                | `string`                                                                  | `undefined` |
| `token`           | `token`           | The access token of the account your want the widget to use, you should normally acquire this with a server side call using that accounts login credentials. {string} | `string`                                                                  | `undefined` |
| `toolboxFilter`   | `toolbox-filter`  | If supplied ONLY items in this \| ("or") delimited list will be shown. i.e. "signature\|intials" {boolean}                                                            | `string`                                                                  | `null`      |
| `userpool`        | `userpool`        | This will override the default production user pool. Almost exclusively used for internal development. {string}                                                       | `string`                                                                  | `undefined` |
| `zoom`            | `zoom`            |                                                                                                                                                                       | `number`                                                                  | `1.0`       |


## Events

| Event          | Description | Type                           |
| -------------- | ----------- | ------------------------------ |
| `mutate`       |             | `CustomEvent<LSMutateEvent[]>` |
| `pageChange`   |             | `CustomEvent<number>`          |
| `pageRendered` |             | `CustomEvent<number>`          |
| `selectFields` |             | `CustomEvent<LSApiElement[]>`  |


## Methods

### `pageNext() => Promise<void>`

Page forward
{MouseEvent} e

#### Returns

Type: `Promise<void>`



### `pagePrev() => Promise<void>`

Page backward
e

#### Returns

Type: `Promise<void>`



### `setZoom(z: number) => Promise<void>`

Page and field resize on zoom change

#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `z`  | `number` |             |

#### Returns

Type: `Promise<void>`



### `unselect() => Promise<void>`

Unselect all fields

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [ls-page-loader](../ls-page-loader)
- [ls-title-input](../ls-title-input)
- [ls-validation-tag](../ls-validation-tag)
- [ls-feature-column](../ls-feature-column)
- [ls-toolbox-field](../ls-toolbox-field)
- [ls-participant-manager](../ls-participant-manager)
- [ls-document-options](../ls-document-options)
- [ls-validation-manager](../ls-validation-manager)
- [ls-recipient-manager](../ls-recipient-manager)
- [ls-recipient-card](../ls-recipient-card)
- [ls-icon](../ls-icon)
- [ls-field-properties](../ls-field-properties)
- [ls-toolbar](../ls-toolbar)
- [ls-editor-table](../ls-editor-table)
- [ls-statusbar](../ls-statusbar)
- [ls-tooltip](../ls-tooltip)
- [ls-editor-field](../ls-editor-field)

### Graph
```mermaid
graph TD;
  ls-document-viewer --> ls-page-loader
  ls-document-viewer --> ls-title-input
  ls-document-viewer --> ls-validation-tag
  ls-document-viewer --> ls-feature-column
  ls-document-viewer --> ls-toolbox-field
  ls-document-viewer --> ls-participant-manager
  ls-document-viewer --> ls-document-options
  ls-document-viewer --> ls-validation-manager
  ls-document-viewer --> ls-recipient-manager
  ls-document-viewer --> ls-recipient-card
  ls-document-viewer --> ls-icon
  ls-document-viewer --> ls-field-properties
  ls-document-viewer --> ls-toolbar
  ls-document-viewer --> ls-editor-table
  ls-document-viewer --> ls-statusbar
  ls-document-viewer --> ls-tooltip
  ls-document-viewer --> ls-editor-field
  ls-title-input --> ls-icon
  ls-validation-tag --> ls-icon
  ls-feature-column --> ls-icon
  ls-feature-column --> ls-tooltip
  ls-toolbox-field --> ls-icon
  ls-toolbox-field --> ls-tooltip
  ls-participant-manager --> ls-participant-card
  ls-participant-manager --> ls-icon
  ls-participant-card --> ls-icon
  ls-participant-card --> ls-input-wrapper
  ls-participant-card --> ls-tooltip
  ls-input-wrapper --> ls-icon
  ls-document-options --> ls-icon
  ls-document-options --> ls-toggle
  ls-document-options --> ls-tooltip
  ls-validation-manager --> ls-toolbox-field
  ls-recipient-card --> ls-icon
  ls-recipient-card --> ls-toolbox-field
  ls-recipient-card --> ls-tooltip
  ls-field-properties --> ls-field-properties-signature
  ls-field-properties --> ls-field-properties-date
  ls-field-properties --> ls-field-properties-text
  ls-field-properties --> ls-field-properties-number
  ls-field-properties --> ls-field-properties-autosign
  ls-field-properties --> ls-field-properties-email
  ls-field-properties --> ls-field-properties-image
  ls-field-properties --> ls-field-properties-file
  ls-field-properties --> ls-field-properties-general
  ls-field-properties --> ls-field-properties-multiple
  ls-field-properties-signature --> ls-field-properties-container
  ls-field-properties-signature --> ls-field-content
  ls-field-properties-signature --> ls-field-properties-advanced
  ls-field-properties-signature --> ls-field-dimensions
  ls-field-properties-signature --> ls-field-placement
  ls-field-properties-signature --> ls-field-footer
  ls-field-content --> ls-props-section
  ls-field-content --> ls-field-type-display
  ls-field-content --> ls-toggle
  ls-field-content --> ls-input-wrapper
  ls-field-content --> ls-editor-field
  ls-field-type-display --> ls-icon
  ls-editor-field --> ls-icon
  ls-editor-field --> ls-editor-field
  ls-field-properties-advanced --> ls-icon
  ls-field-properties-advanced --> ls-props-section
  ls-field-dimensions --> ls-icon
  ls-field-dimensions --> ls-tooltip
  ls-field-placement --> ls-icon
  ls-field-placement --> ls-tooltip
  ls-field-footer --> ls-icon
  ls-field-properties-date --> ls-field-properties-container
  ls-field-properties-date --> ls-field-content
  ls-field-properties-date --> ls-field-properties-advanced
  ls-field-properties-date --> ls-field-dimensions
  ls-field-properties-date --> ls-field-placement
  ls-field-properties-date --> ls-field-footer
  ls-field-properties-text --> ls-field-properties-container
  ls-field-properties-text --> ls-field-content
  ls-field-properties-text --> ls-field-properties-advanced
  ls-field-properties-text --> ls-field-dimensions
  ls-field-properties-text --> ls-field-placement
  ls-field-properties-text --> ls-field-footer
  ls-field-properties-number --> ls-field-properties-container
  ls-field-properties-number --> ls-field-content
  ls-field-properties-number --> ls-field-properties-advanced
  ls-field-properties-number --> ls-field-dimensions
  ls-field-properties-number --> ls-field-placement
  ls-field-properties-number --> ls-field-footer
  ls-field-properties-autosign --> ls-field-dimensions
  ls-field-properties-autosign --> ls-field-properties-advanced
  ls-field-properties-autosign --> ls-field-footer
  ls-field-properties-email --> ls-field-properties-container
  ls-field-properties-email --> ls-field-content
  ls-field-properties-email --> ls-field-properties-advanced
  ls-field-properties-email --> ls-field-dimensions
  ls-field-properties-email --> ls-field-placement
  ls-field-properties-email --> ls-field-footer
  ls-field-properties-image --> ls-field-properties-container
  ls-field-properties-image --> ls-field-content
  ls-field-properties-image --> ls-field-properties-advanced
  ls-field-properties-image --> ls-field-dimensions
  ls-field-properties-image --> ls-field-placement
  ls-field-properties-image --> ls-field-footer
  ls-field-properties-file --> ls-field-properties-container
  ls-field-properties-file --> ls-field-content
  ls-field-properties-file --> ls-field-properties-advanced
  ls-field-properties-file --> ls-field-dimensions
  ls-field-properties-file --> ls-field-placement
  ls-field-properties-file --> ls-field-footer
  ls-field-properties-general --> ls-field-properties-container
  ls-field-properties-general --> ls-field-content
  ls-field-properties-general --> ls-field-properties-advanced
  ls-field-properties-general --> ls-field-dimensions
  ls-field-properties-general --> ls-field-placement
  ls-field-properties-general --> ls-field-footer
  ls-field-properties-multiple --> ls-field-properties-container
  ls-field-properties-multiple --> ls-icon
  ls-field-properties-multiple --> ls-toggle
  ls-field-properties-multiple --> ls-field-dimensions
  ls-field-properties-multiple --> ls-field-size
  ls-field-properties-multiple --> ls-field-alignment
  ls-field-properties-multiple --> ls-field-placement
  ls-field-properties-multiple --> ls-field-distribute
  ls-field-properties-multiple --> ls-field-footer
  ls-field-size --> ls-icon
  ls-field-size --> ls-tooltip
  ls-field-alignment --> ls-icon
  ls-field-alignment --> ls-tooltip
  ls-field-distribute --> ls-icon
  ls-field-distribute --> ls-tooltip
  ls-field-distribute --> ls-editor-field
  ls-toolbar --> ls-field-format
  ls-toolbar --> ls-participant-select
  ls-toolbar --> ls-tooltip
  ls-field-format --> ls-icon
  ls-field-format --> ls-tooltip
  ls-participant-select --> ls-icon
  ls-statusbar --> ls-icon
  ls-statusbar --> ls-helper-bar
  ls-statusbar --> ls-tooltip
  ls-statusbar --> ls-editor-field
  ls-helper-bar --> ls-keyboard-shortcuts
  ls-helper-bar --> ls-icon
  ls-helper-bar --> ls-tooltip
  style ls-document-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
