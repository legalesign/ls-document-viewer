# ls-tooltip



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description | Type                                     | Default     |
| ------------------ | ------------------- | ----------- | ---------------------------------------- | ----------- |
| `placement`        | `placement`         |             | `"bottom" \| "left" \| "right" \| "top"` | `'top'`     |
| `referenceElement` | `reference-element` |             | `HTMLElement`                            | `undefined` |
| `tooltipLocked`    | `tooltip-locked`    |             | `boolean`                                | `false`     |
| `tooltipText`      | `tooltip-text`      |             | `string`                                 | `undefined` |


## Methods

### `hide() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)
 - [ls-field-format](../ls-field-format)
 - [ls-statusbar](../ls-statusbar)
 - [ls-toolbar](../ls-toolbar)

### Graph
```mermaid
graph TD;
  ls-document-viewer --> ls-tooltip
  ls-field-format --> ls-tooltip
  ls-statusbar --> ls-tooltip
  ls-toolbar --> ls-tooltip
  style ls-tooltip fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
