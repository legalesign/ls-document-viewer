# ls-field-properties-general



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Default     |
| ---------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem` | `data-item` |             | `{ id: string; align: string; ax: number; ay: number; bx: number; by: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder: number; fontName: string; fontSize: number; hideBorder: boolean; label: string; labelExtra: string; helpText: string; optional: boolean; options: string; page: number; role: LSApiRole; substantive: boolean; validation: number; value: string; logicGroup: string; logicAction: number; mapTo: string; signer: number; link?: string; formElementType?: "number" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "autodate"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; }` | `undefined` |


## Dependencies

### Used by

 - [ls-field-properties](../ls-field-properties)

### Depends on

- [ls-field-dimensions](../ls-field-dimensions)

### Graph
```mermaid
graph TD;
  ls-field-properties-general --> ls-field-dimensions
  ls-field-properties --> ls-field-properties-general
  style ls-field-properties-general fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
