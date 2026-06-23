# ls-field-content



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default     |
| --------------------- | ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem`            | --                      |             | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "text" \| "signature" \| "date" \| "regular expression" \| "file" \| "signing date" \| "autosign" \| "initials" \| "email" \| "checkbox" \| "dropdown" \| "drawn field"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |
| `readonly`            | `readonly`              |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `false`     |
| `roles`               | --                      |             | `LSApiRole[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `[]`        |
| `showValidationTypes` | `show-validation-types` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `true`      |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |
| `update` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-field-properties-checkbox](../ls-field-properties-checkbox)
 - [ls-field-properties-date](../ls-field-properties-date)
 - [ls-field-properties-dropdown](../ls-field-properties-dropdown)
 - [ls-field-properties-email](../ls-field-properties-email)
 - [ls-field-properties-file](../ls-field-properties-file)
 - [ls-field-properties-general](../ls-field-properties-general)
 - [ls-field-properties-number](../ls-field-properties-number)
 - [ls-field-properties-signature](../ls-field-properties-signature)
 - [ls-field-properties-text](../ls-field-properties-text)

### Depends on

- [ls-props-section](../ls-props-section)
- [ls-assignee-select](../ls-assignee-select)
- [ls-field-type-select](../ls-field-type-select)
- [ls-toggle](../ls-toggle)
- ls-formfield
- ls-icon
- [ls-input-wrapper](../ls-input-wrapper)
- [ls-editor-field](../ls-editor-field)

### Graph
```mermaid
graph TD;
  ls-field-content --> ls-props-section
  ls-field-content --> ls-assignee-select
  ls-field-content --> ls-field-type-select
  ls-field-content --> ls-toggle
  ls-field-content --> ls-formfield
  ls-field-content --> ls-icon
  ls-field-content --> ls-input-wrapper
  ls-field-content --> ls-editor-field
  ls-assignee-select --> ls-icon
  ls-assignee-select --> ls-tooltip
  ls-field-type-select --> ls-icon
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
  ls-field-properties-checkbox --> ls-field-content
  ls-field-properties-date --> ls-field-content
  ls-field-properties-dropdown --> ls-field-content
  ls-field-properties-email --> ls-field-content
  ls-field-properties-file --> ls-field-content
  ls-field-properties-general --> ls-field-content
  ls-field-properties-number --> ls-field-content
  ls-field-properties-signature --> ls-field-content
  ls-field-properties-text --> ls-field-content
  style ls-field-content fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
