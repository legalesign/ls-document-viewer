# ls-field-distribute



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type             | Default     |
| ---------- | --------- | ----------- | ---------------- | ----------- |
| `dataItem` | --        |             | `LSApiElement[]` | `undefined` |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-field-properties-multiple](../ls-field-properties-multiple)

### Depends on

- ls-icon
- [ls-dv-tooltip](../ls-tooltip)
- [ls-editor-field](../ls-editor-field)

### Graph
```mermaid
graph TD;
  ls-field-distribute --> ls-icon
  ls-field-distribute --> ls-dv-tooltip
  ls-field-distribute --> ls-editor-field
  ls-editor-field --> ls-icon
  ls-editor-field --> ls-editor-field
  ls-field-properties-multiple --> ls-field-distribute
  style ls-field-distribute fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
