# ls-tooltip



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute        | Description | Type                                     | Default     |
| ------------------ | ---------------- | ----------- | ---------------------------------------- | ----------- |
| `placement`        | `placement`      |             | `"bottom" \| "left" \| "right" \| "top"` | `'top'`     |
| `referenceElement` | --               |             | `HTMLElement`                            | `undefined` |
| `tooltipLocked`    | `tooltip-locked` |             | `boolean`                                | `false`     |
| `tooltipText`      | `tooltip-text`   |             | `string`                                 | `undefined` |
| `tooltipTitle`     | `tooltip-title`  |             | `string`                                 | `undefined` |


## Methods

### `hide() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [ls-document-options](../ls-document-options)
 - [ls-document-viewer](../ls-document-viewer)
 - [ls-feature-column](../ls-feature-column)
 - [ls-field-alignment](../ls-field-alignment)
 - [ls-field-dimensions](../ls-field-dimensions)
 - [ls-field-distribute](../ls-field-distribute)
 - [ls-field-format](../ls-field-format)
 - [ls-field-placement](../ls-field-placement)
 - [ls-field-size](../ls-field-size)
 - [ls-helper-bar](../ls-helper-bar)
 - [ls-participant-card](../ls-participant-card)
 - [ls-recipient-card](../ls-recipient-card)
 - [ls-statusbar](../ls-statusbar)
 - [ls-toolbar](../ls-toolbar)
 - [ls-toolbox-field](../ls-toolbox-field)

### Graph
```mermaid
graph TD;
  ls-document-options --> ls-dv-tooltip
  ls-document-viewer --> ls-dv-tooltip
  ls-feature-column --> ls-dv-tooltip
  ls-field-alignment --> ls-dv-tooltip
  ls-field-dimensions --> ls-dv-tooltip
  ls-field-distribute --> ls-dv-tooltip
  ls-field-format --> ls-dv-tooltip
  ls-field-placement --> ls-dv-tooltip
  ls-field-size --> ls-dv-tooltip
  ls-helper-bar --> ls-dv-tooltip
  ls-participant-card --> ls-dv-tooltip
  ls-recipient-card --> ls-dv-tooltip
  ls-statusbar --> ls-dv-tooltip
  ls-toolbar --> ls-dv-tooltip
  ls-toolbox-field --> ls-dv-tooltip
  style ls-dv-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
