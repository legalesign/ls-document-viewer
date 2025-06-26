# ls-toolbar



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type             | Default     |
| ---------- | ----------- | ----------- | ---------------- | ----------- |
| `dataItem` | `data-item` |             | `LSApiElement[]` | `undefined` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-field-alignment](../ls-field-alignment)
- [ls-field-distribute](../ls-field-distribute)
- [ls-field-size](../ls-field-size)

### Graph
```mermaid
graph TD;
  ls-toolbar --> ls-field-alignment
  ls-toolbar --> ls-field-distribute
  ls-toolbar --> ls-field-size
  ls-field-alignment --> ls-icon
  ls-field-distribute --> ls-icon
  ls-document-viewer --> ls-toolbar
  style ls-toolbar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
