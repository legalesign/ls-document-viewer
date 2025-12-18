# ls-field-properties-dropdown



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Default     |
| ---------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem` | --        |             | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "autodate" \| "autosign" \| "initials" \| "email" \| "checkbox" \| "image" \| "dropdown"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |


## Dependencies

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
  ls-field-properties-dropdown --> ls-field-properties-container
  ls-field-properties-dropdown --> ls-field-content
  ls-field-properties-dropdown --> ls-field-properties-advanced
  ls-field-properties-dropdown --> ls-field-dimensions
  ls-field-properties-dropdown --> ls-field-placement
  ls-field-properties-dropdown --> ls-field-footer
  ls-field-content --> ls-props-section
  ls-field-content --> ls-field-type-display
  ls-field-content --> ls-toggle
  ls-field-content --> ls-input-wrapper
  ls-field-content --> ls-editor-field
  ls-field-type-display --> ls-icon
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
  style ls-field-properties-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
