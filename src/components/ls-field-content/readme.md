# ls-field-content



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Default     |
| --------------------- | ----------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem`            | `data-item`             |             | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "image" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "autodate" \| "autosign" \| "initials" \| "email" \| "checkbox"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |
| `showValidationTypes` | `show-validation-types` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `true`      |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |
| `update` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-field-properties-date](../ls-field-properties-date)
 - [ls-field-properties-email](../ls-field-properties-email)
 - [ls-field-properties-file](../ls-field-properties-file)
 - [ls-field-properties-general](../ls-field-properties-general)
 - [ls-field-properties-image](../ls-field-properties-image)
 - [ls-field-properties-number](../ls-field-properties-number)
 - [ls-field-properties-signature](../ls-field-properties-signature)
 - [ls-field-properties-text](../ls-field-properties-text)

### Depends on

- [ls-props-section](../ls-props-section)
- [ls-field-type-display](../ls-field-type-display)
- [ls-toggle](../ls-toggle)
- [ls-input-wrapper](../ls-input-wrapper)

### Graph
```mermaid
graph TD;
  ls-field-content --> ls-props-section
  ls-field-content --> ls-field-type-display
  ls-field-content --> ls-toggle
  ls-field-content --> ls-input-wrapper
  ls-field-type-display --> ls-icon
  ls-input-wrapper --> ls-icon
  ls-field-properties-date --> ls-field-content
  ls-field-properties-email --> ls-field-content
  ls-field-properties-file --> ls-field-content
  ls-field-properties-general --> ls-field-content
  ls-field-properties-image --> ls-field-content
  ls-field-properties-number --> ls-field-content
  ls-field-properties-signature --> ls-field-content
  ls-field-properties-text --> ls-field-content
  style ls-field-content fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
