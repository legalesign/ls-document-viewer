# ls-field-properties-multiple



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type             | Default     |
| ---------- | ----------- | ----------- | ---------------- | ----------- |
| `dataItem` | `data-item` |             | `LSApiElement[]` | `undefined` |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |
| `update` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-field-properties](../ls-field-properties)

### Depends on

- [ls-field-properties-container](../ls-field-properties-container)
- [ls-icon](../ls-icon)
- [ls-toggle](../ls-toggle)
- [ls-field-dimensions](../ls-field-dimensions)
- [ls-field-size](../ls-field-size)
- [ls-field-alignment](../ls-field-alignment)
- [ls-field-placement](../ls-field-placement)
- [ls-field-distribute](../ls-field-distribute)
- [ls-field-footer](../ls-field-footer)

### Graph
```mermaid
graph TD;
  ls-field-properties-multiple --> ls-field-properties-container
  ls-field-properties-multiple --> ls-icon
  ls-field-properties-multiple --> ls-toggle
  ls-field-properties-multiple --> ls-field-dimensions
  ls-field-properties-multiple --> ls-field-size
  ls-field-properties-multiple --> ls-field-alignment
  ls-field-properties-multiple --> ls-field-placement
  ls-field-properties-multiple --> ls-field-distribute
  ls-field-properties-multiple --> ls-field-footer
  ls-field-dimensions --> ls-icon
  ls-field-dimensions --> ls-tooltip
  ls-field-size --> ls-icon
  ls-field-size --> ls-tooltip
  ls-field-alignment --> ls-icon
  ls-field-alignment --> ls-tooltip
  ls-field-placement --> ls-icon
  ls-field-placement --> ls-tooltip
  ls-field-distribute --> ls-icon
  ls-field-distribute --> ls-tooltip
  ls-field-distribute --> ls-editor-field
  ls-editor-field --> ls-icon
  ls-editor-field --> ls-editor-field
  ls-field-footer --> ls-icon
  ls-field-properties --> ls-field-properties-multiple
  style ls-field-properties-multiple fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
