# ls-field-properties-signature



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default     |
| ---------- | ----------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem` | `data-item` | The selected items information (as JSON). {LSApiElement[]} | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "image" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "autodate" \| "autosign" \| "initials" \| "email" \| "checkbox"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |
| `fieldSet` | `field-set` |                                                            | `"content" \| "dimensions" \| "placement"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `'content'` |


## Dependencies

### Used by

 - [ls-field-properties](../ls-field-properties)

### Depends on

- [ls-field-placement](../ls-field-placement)
- [ls-field-dimensions](../ls-field-dimensions)
- [ls-field-properties-advanced](../ls-field-properties-advanced)
- [ls-icon](../ls-icon)
- [ls-toggle](../ls-toggle)
- [ls-field-footer](../ls-field-footer)

### Graph
```mermaid
graph TD;
  ls-field-properties-signature --> ls-field-placement
  ls-field-properties-signature --> ls-field-dimensions
  ls-field-properties-signature --> ls-field-properties-advanced
  ls-field-properties-signature --> ls-icon
  ls-field-properties-signature --> ls-toggle
  ls-field-properties-signature --> ls-field-footer
  ls-field-placement --> ls-icon
  ls-field-dimensions --> ls-icon
  ls-field-footer --> ls-icon
  ls-field-properties --> ls-field-properties-signature
  style ls-field-properties-signature fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
