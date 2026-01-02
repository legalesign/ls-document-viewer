# ls-helper-bar



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type      | Default |
| --------------- | ---------------- | ----------- | --------- | ------- |
| `expanded`      | `expanded`       |             | `boolean` | `false` |
| `showShortcuts` | `show-shortcuts` |             | `boolean` | `false` |


## Dependencies

### Used by

 - [ls-statusbar](../ls-statusbar)

### Depends on

- [ls-keyboard-shortcuts](../ls-keyboard-shortcuts)
- [ls-icon](../ls-icon)
- [ls-tooltip](../ls-tooltip)

### Graph
```mermaid
graph TD;
  ls-helper-bar --> ls-keyboard-shortcuts
  ls-helper-bar --> ls-icon
  ls-helper-bar --> ls-tooltip
  ls-statusbar --> ls-helper-bar
  style ls-helper-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
