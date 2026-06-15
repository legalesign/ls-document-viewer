# ls-field-properties-number



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Default     |
| ---------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem` | --         |             | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "signing date" \| "autosign" \| "initials" \| "email" \| "checkbox" \| "image" \| "dropdown" \| "drawn field"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |
| `readonly` | `readonly` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `false`     |
| `roles`    | --         |             | `LSApiRole[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `[]`        |


## Dependencies

### Used by

 - [ls-field-properties](../ls-field-properties)

### Depends on

- [ls-field-properties-container](../ls-field-properties-container)
- [ls-field-content](../ls-field-content)
- [ls-field-properties-advanced](../ls-field-properties-advanced)
- [ls-field-dimensions](../ls-field-dimensions)
- [ls-field-placement](../ls-field-placement)
- [ls-field-footer](../ls-field-footer)

### Graph
```mermaid
graph TD;
  ls-field-properties-number --> ls-field-properties-container
  ls-field-properties-number --> ls-field-content
  ls-field-properties-number --> ls-field-properties-advanced
  ls-field-properties-number --> ls-field-dimensions
  ls-field-properties-number --> ls-field-placement
  ls-field-properties-number --> ls-field-footer
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
  ls-field-properties --> ls-field-properties-number
  style ls-field-properties-number fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
