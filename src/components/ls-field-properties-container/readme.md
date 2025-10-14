# ls-field-properties-container



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Default     |
| ------------- | -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dataItem`    | `data-item`    |             | `{ id: string; align: string; ax?: number; ay?: number; bx?: number; by?: number; left?: number; top?: number; height?: number; width?: number; elementType: string; fieldOrder?: number; fontName: string; fontSize: number; hideBorder?: boolean; label?: string; labelExtra?: string; helpText?: string; optional?: boolean; options?: string; page?: number; role?: LSApiRole; substantive?: boolean; validation?: number; value?: string; logicGroup?: string; logicAction?: number; mapTo?: string; signer: number; link?: string; formElementType?: "number" \| "image" \| "text" \| "signature" \| "date" \| "regex" \| "file" \| "autodate" \| "autosign" \| "initials" \| "email" \| "checkbox" \| "dropdown"; roleObject?: LSApiRole; cstyle?: any; divStyle?: any; objectHeight?: string; pageDimensions?: { height: number; width: number; }; templateId?: string; }` | `undefined` |
| `selectedTab` | `selected-tab` |             | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined` |
| `tabs`        | `tabs`         |             | `string[]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `[]`        |


## Dependencies

### Used by

 - [ls-field-properties-date](../ls-field-properties-date)
 - [ls-field-properties-dropdown](../ls-field-properties-dropdown)
 - [ls-field-properties-email](../ls-field-properties-email)
 - [ls-field-properties-file](../ls-field-properties-file)
 - [ls-field-properties-general](../ls-field-properties-general)
 - [ls-field-properties-image](../ls-field-properties-image)
 - [ls-field-properties-multiple](../ls-field-properties-multiple)
 - [ls-field-properties-number](../ls-field-properties-number)
 - [ls-field-properties-signature](../ls-field-properties-signature)
 - [ls-field-properties-text](../ls-field-properties-text)

### Graph
```mermaid
graph TD;
  ls-field-properties-date --> ls-field-properties-container
  ls-field-properties-dropdown --> ls-field-properties-container
  ls-field-properties-email --> ls-field-properties-container
  ls-field-properties-file --> ls-field-properties-container
  ls-field-properties-general --> ls-field-properties-container
  ls-field-properties-image --> ls-field-properties-container
  ls-field-properties-multiple --> ls-field-properties-container
  ls-field-properties-number --> ls-field-properties-container
  ls-field-properties-signature --> ls-field-properties-container
  ls-field-properties-text --> ls-field-properties-container
  style ls-field-properties-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
