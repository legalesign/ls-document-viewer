# ls-recipient-card



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                                                                            | Type                                                                                                                                                           | Default     |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `recipient` | `recipient` | The initial template data, including the link for background PDF. See README and example for correct GraphQL query and data structure. {LSApiTemplate} | `{ name: string; email: string; firstname: string; lastname: string; signerIndex?: number; roleType?: "SIGNER" \| "APPROVER" \| "WITNESS" \| "FORM_FILLER"; }` | `undefined` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-icon](../ls-icon)
- [ls-tooltip](../ls-tooltip)

### Graph
```mermaid
graph TD;
  ls-recipient-card --> ls-icon
  ls-recipient-card --> ls-tooltip
  ls-document-viewer --> ls-recipient-card
  style ls-recipient-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
