# ls-feature-column



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                               | Type                                       | Default     |
| --------- | --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------- |
| `manager` | `manager` | Determines / sets which of the far left 'managers' is active. {'document' \| 'toolbox' \| 'participant' } | `"document" \| "participant" \| "toolbox"` | `'toolbox'` |


## Events

| Event    | Description | Type                                                    |
| -------- | ----------- | ------------------------------------------------------- |
| `manage` |             | `CustomEvent<"document" \| "participant" \| "toolbox">` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-icon](../ls-icon)

### Graph
```mermaid
graph TD;
  ls-feature-column --> ls-icon
  ls-document-viewer --> ls-feature-column
  style ls-feature-column fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
