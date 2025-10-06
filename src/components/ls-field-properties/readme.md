# ls-field-properties



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type             | Default     |
| ---------- | ----------- | ----------- | ---------------- | ----------- |
| `dataItem` | `data-item` |             | `LSApiElement[]` | `undefined` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-field-properties-signature](../ls-field-properties-signature)
- [ls-field-properties-date](../ls-field-properties-date)
- [ls-field-properties-text](../ls-field-properties-text)
- [ls-field-properties-number](../ls-field-properties-number)
- [ls-field-properties-autosign](../ls-field-properties-autosign)
- [ls-field-properties-email](../ls-field-properties-email)
- [ls-field-properties-image](../ls-field-properties-image)
- [ls-field-properties-file](../ls-field-properties-file)
- [ls-field-properties-general](../ls-field-properties-general)
- [ls-field-properties-multiple](../ls-field-properties-multiple)

### Graph
```mermaid
graph TD;
  ls-field-properties --> ls-field-properties-signature
  ls-field-properties --> ls-field-properties-date
  ls-field-properties --> ls-field-properties-text
  ls-field-properties --> ls-field-properties-number
  ls-field-properties --> ls-field-properties-autosign
  ls-field-properties --> ls-field-properties-email
  ls-field-properties --> ls-field-properties-image
  ls-field-properties --> ls-field-properties-file
  ls-field-properties --> ls-field-properties-general
  ls-field-properties --> ls-field-properties-multiple
  ls-field-properties-signature --> ls-field-placement
  ls-field-properties-signature --> ls-field-dimensions
  ls-field-properties-signature --> ls-field-properties-advanced
  ls-field-properties-signature --> ls-icon
  ls-field-properties-signature --> ls-toggle
  ls-field-properties-signature --> ls-field-footer
  ls-field-placement --> ls-icon
  ls-field-dimensions --> ls-icon
  ls-field-footer --> ls-icon
  ls-field-properties-date --> ls-field-properties-container
  ls-field-properties-date --> ls-field-content
  ls-field-properties-date --> ls-field-dimensions
  ls-field-properties-date --> ls-field-properties-advanced
  ls-field-properties-date --> ls-field-placement
  ls-field-properties-date --> ls-field-footer
  ls-field-content --> ls-props-section
  ls-field-content --> ls-field-type-display
  ls-field-content --> ls-toggle
  ls-field-content --> ls-input-wrapper
  ls-field-type-display --> ls-icon
  ls-input-wrapper --> ls-icon
  ls-field-properties-text --> ls-field-placement
  ls-field-properties-text --> ls-field-dimensions
  ls-field-properties-text --> ls-icon
  ls-field-properties-text --> ls-toggle
  ls-field-properties-number --> ls-field-placement
  ls-field-properties-number --> ls-field-dimensions
  ls-field-properties-number --> ls-field-properties-advanced
  ls-field-properties-number --> ls-icon
  ls-field-properties-number --> ls-toggle
  ls-field-properties-number --> ls-field-footer
  ls-field-properties-autosign --> ls-field-dimensions
  ls-field-properties-autosign --> ls-field-properties-advanced
  ls-field-properties-autosign --> ls-field-footer
  ls-field-properties-email --> ls-field-placement
  ls-field-properties-email --> ls-field-dimensions
  ls-field-properties-email --> ls-field-properties-advanced
  ls-field-properties-email --> ls-icon
  ls-field-properties-email --> ls-toggle
  ls-field-properties-email --> ls-field-footer
  ls-field-properties-image --> ls-field-placement
  ls-field-properties-image --> ls-field-dimensions
  ls-field-properties-image --> ls-field-properties-advanced
  ls-field-properties-image --> ls-icon
  ls-field-properties-image --> ls-toggle
  ls-field-properties-image --> ls-field-footer
  ls-field-properties-file --> ls-field-placement
  ls-field-properties-file --> ls-field-dimensions
  ls-field-properties-file --> ls-field-properties-advanced
  ls-field-properties-file --> ls-icon
  ls-field-properties-file --> ls-toggle
  ls-field-properties-general --> ls-field-placement
  ls-field-properties-general --> ls-field-dimensions
  ls-field-properties-general --> ls-field-properties-advanced
  ls-field-properties-general --> ls-icon
  ls-field-properties-general --> ls-toggle
  ls-field-properties-general --> ls-field-footer
  ls-field-properties-multiple --> ls-field-alignment
  ls-field-properties-multiple --> ls-field-placement
  ls-field-properties-multiple --> ls-field-distribute
  ls-field-properties-multiple --> ls-field-dimensions
  ls-field-properties-multiple --> ls-field-size
  ls-field-properties-multiple --> ls-icon
  ls-field-properties-multiple --> ls-toggle
  ls-field-properties-multiple --> ls-field-footer
  ls-field-alignment --> ls-icon
  ls-field-distribute --> ls-icon
  ls-field-size --> ls-icon
  ls-document-viewer --> ls-field-properties
  style ls-field-properties fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
