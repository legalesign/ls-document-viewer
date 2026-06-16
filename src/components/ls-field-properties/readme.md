# ls-field-properties



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type             | Default     |
| ---------- | ---------- | ----------- | ---------------- | ----------- |
| `dataItem` | --         |             | `LSApiElement[]` | `undefined` |
| `readonly` | `readonly` |             | `boolean`        | `false`     |
| `template` | `template` |             | `any`            | `undefined` |


## Dependencies

### Used by

 - [ls-left-bar](../ls-left-bar)

### Depends on

- [ls-field-properties-signature](../ls-field-properties-signature)
- [ls-field-properties-date](../ls-field-properties-date)
- [ls-field-properties-text](../ls-field-properties-text)
- [ls-field-properties-number](../ls-field-properties-number)
- [ls-field-properties-autosign](../ls-field-properties-autosign)
- [ls-field-properties-email](../ls-field-properties-email)
- [ls-field-properties-image](../ls-field-properties-image)
- [ls-field-properties-file](../ls-field-properties-file)
- [ls-field-properties-checkbox](../ls-field-properties-checkbox)
- [ls-field-properties-general](../ls-field-properties-general)
- [ls-field-properties-multiple](../ls-field-properties-multiple)

### Graph
```mermaid
graph TD;
  ls-field-properties --> ls-field-properties-signature
  ls-field-properties --> ls-field-properties-date
  ls-field-properties --> ls-field-properties-text
  ls-field-properties --> ls-field-properties-number
  ls-field-properties --> ls-field-properties-autosign
  ls-field-properties --> ls-field-properties-email
  ls-field-properties --> ls-field-properties-image
  ls-field-properties --> ls-field-properties-file
  ls-field-properties --> ls-field-properties-checkbox
  ls-field-properties --> ls-field-properties-general
  ls-field-properties --> ls-field-properties-multiple
  ls-field-properties-signature --> ls-field-properties-container
  ls-field-properties-signature --> ls-field-content
  ls-field-properties-signature --> ls-field-properties-advanced
  ls-field-properties-signature --> ls-field-dimensions
  ls-field-properties-signature --> ls-field-placement
  ls-field-properties-signature --> ls-field-footer
  ls-field-content --> ls-props-section
  ls-field-content --> ls-assignee-select
  ls-field-content --> ls-field-type-display
  ls-field-content --> ls-toggle
  ls-field-content --> ls-icon
  ls-field-content --> ls-formfield
  ls-field-content --> ls-input-wrapper
  ls-field-content --> ls-editor-field
  ls-assignee-select --> ls-icon
  ls-assignee-select --> ls-tooltip
  ls-field-type-display --> ls-icon
  ls-formfield --> ls-icon
  ls-formfield --> ls-label
  ls-formfield --> ls-text-input
  ls-formfield --> ls-select-input
  ls-formfield --> ls-radio-input
  ls-formfield --> ls-textarea-input
  ls-formfield --> ls-checkbox-input
  ls-formfield --> ls-number-input
  ls-formfield --> ls-tooltip
  ls-label --> ls-icon
  ls-text-input --> ls-icon
  ls-text-input --> ls-icon-button
  ls-icon-button --> ls-icon
  ls-select-input --> ls-icon
  ls-radio-input --> ls-icon
  ls-textarea-input --> ls-icon
  ls-number-input --> ls-icon
  ls-input-wrapper --> ls-icon
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
  ls-field-properties-checkbox --> ls-field-properties-container
  ls-field-properties-checkbox --> ls-field-content
  ls-field-properties-checkbox --> ls-field-properties-advanced
  ls-field-properties-checkbox --> ls-field-dimensions
  ls-field-properties-checkbox --> ls-field-placement
  ls-field-properties-checkbox --> ls-field-footer
  ls-field-properties-general --> ls-field-properties-container
  ls-field-properties-general --> ls-field-content
  ls-field-properties-general --> ls-field-properties-advanced
  ls-field-properties-general --> ls-field-dimensions
  ls-field-properties-general --> ls-field-placement
  ls-field-properties-general --> ls-field-footer
  ls-field-properties-multiple --> ls-field-properties-container
  ls-field-properties-multiple --> ls-assignee-select
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
  ls-left-bar --> ls-field-properties
  style ls-field-properties fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
