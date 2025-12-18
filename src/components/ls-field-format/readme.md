# ls-field-format



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description | Type             | Default     |
| ---------- | --------- | ----------- | ---------------- | ----------- |
| `dataItem` | --        |             | `LSApiElement[]` | `undefined` |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |
| `update` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-toolbar](../ls-toolbar)

### Depends on

- [ls-icon](../ls-icon)
- [ls-tooltip](../ls-tooltip)

### Graph
```mermaid
graph TD;
  ls-field-format --> ls-icon
  ls-field-format --> ls-tooltip
  ls-toolbar --> ls-field-format
  style ls-field-format fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
