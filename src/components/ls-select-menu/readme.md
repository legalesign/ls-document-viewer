# ls-select-menu



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type     | Default     |
| ---------- | ---------- | ----------- | -------- | ----------- |
| `editor`   | `editor`   |             | `any`    | `undefined` |
| `pageNum`  | `page-num` |             | `number` | `undefined` |
| `selected` | --         |             | `any[]`  | `[]`        |


## Events

| Event          | Description | Type                 |
| -------------- | ----------- | -------------------- |
| `selectFields` |             | `CustomEvent<any[]>` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- ls-icon
- ls-tooltip

### Graph
```mermaid
graph TD;
  ls-select-menu --> ls-icon
  ls-select-menu --> ls-tooltip
  ls-document-viewer --> ls-select-menu
  style ls-select-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
