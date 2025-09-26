# ls-participant-select



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                             | Type             | Default     |
| ---------- | ----------- | --------------------------------------- | ---------------- | ----------- |
| `dataItem` | `data-item` |                                         | `LSApiElement[]` | `undefined` |
| `roles`    | `roles`     | The current template roles. {LSApiRole} | `LSApiRole[]`    | `[]`        |


## Events

| Event         | Description | Type                           |
| ------------- | ----------- | ------------------------------ |
| `mutate`      |             | `CustomEvent<LSMutateEvent[]>` |
| `roleChanged` |             | `CustomEvent<number>`          |
| `update`      |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-toolbar](../ls-toolbar)

### Depends on

- [ls-icon](../ls-icon)

### Graph
```mermaid
graph TD;
  ls-participant-select --> ls-icon
  ls-toolbar --> ls-participant-select
  style ls-participant-select fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
