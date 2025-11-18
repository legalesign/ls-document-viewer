# ls-feature-column



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                               | Type                                                                      | Default     |
| --------- | --------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------- |
| `manager` | `manager` | Determines / sets which of the far left 'managers' is active. {'document' \| 'toolbox' \| 'participant' } | `"document" \| "participant" \| "recipient" \| "toolbox" \| "validation"` | `'toolbox'` |
| `mode`    | `mode`    | The mode that document viewer is being used in. {'preview' \| 'editor' \| 'custom'}                       | `"compose" \| "editor" \| "preview"`                                      | `'editor'`  |


## Events

| Event    | Description | Type                                                                                   |
| -------- | ----------- | -------------------------------------------------------------------------------------- |
| `manage` |             | `CustomEvent<"document" \| "participant" \| "recipient" \| "toolbox" \| "validation">` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-icon](../ls-icon)
- [ls-tooltip](../ls-tooltip)

### Graph
```mermaid
graph TD;
  ls-feature-column --> ls-icon
  ls-feature-column --> ls-tooltip
  ls-document-viewer --> ls-feature-column
  style ls-feature-column fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
