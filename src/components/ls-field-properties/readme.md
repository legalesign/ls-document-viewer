# ls-field-properties



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type             | Default     |
| ---------- | ----------- | ----------- | ---------------- | ----------- |
| `dataItem` | `data-item` |             | `LSApiElement[]` | `undefined` |


## Dependencies

### Depends on

- [ls-field-properties-signature](../ls-field-properties-signature)
- [ls-field-properties-date](../ls-field-properties-date)
- [ls-field-properties-text](../ls-field-properties-text)
- [ls-field-properties-number](../ls-field-properties-number)
- [ls-field-properties-general](../ls-field-properties-general)
- [ls-field-properties-multiple](../ls-field-properties-multiple)

### Graph
```mermaid
graph TD;
  ls-field-properties --> ls-field-properties-signature
  ls-field-properties --> ls-field-properties-date
  ls-field-properties --> ls-field-properties-text
  ls-field-properties --> ls-field-properties-number
  ls-field-properties --> ls-field-properties-general
  ls-field-properties --> ls-field-properties-multiple
  ls-field-properties-signature --> ls-field-dimensions
  ls-field-properties-signature --> ls-field-format
  ls-field-properties-date --> ls-field-dimensions
  ls-field-properties-text --> ls-field-dimensions
  ls-field-properties-text --> ls-field-format
  ls-field-properties-number --> ls-field-dimensions
  ls-field-properties-general --> ls-field-dimensions
  ls-field-properties-multiple --> ls-field-dimensions
  ls-field-properties-multiple --> ls-field-alignment
  ls-field-properties-multiple --> ls-field-distribute
  ls-field-properties-multiple --> ls-field-size
  style ls-field-properties fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
