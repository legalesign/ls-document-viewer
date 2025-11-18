# ls-validation-manager



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                         | Type                | Default     |
| ------------------ | ------------------- | --------------------------------------------------- | ------------------- | ----------- |
| `validationErrors` | `validation-errors` | The template information (as JSON). {LSApiTemplate} | `ValidationError[]` | `undefined` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-toolbox-field](../ls-toolbox-field)

### Graph
```mermaid
graph TD;
  ls-validation-manager --> ls-toolbox-field
  ls-toolbox-field --> ls-icon
  ls-toolbox-field --> ls-tooltip
  ls-document-viewer --> ls-validation-manager
  style ls-validation-manager fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
