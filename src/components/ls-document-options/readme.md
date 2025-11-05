# ls-document-options



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                              | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Default     |
| ---------- | ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `template` | `template` | The base template information (as JSON). {LSApiTemplate} | `{ id: string; title: string; pageCount: number; fileName: string; link: string; autoArchive: boolean; valid: boolean; locked: boolean; tags: string[]; groupId: string; roles: LSApiRole[]; canOpenSign: boolean; directLinks: []; elementConnection: { templateElements: LSApiElement[]; totalCount: number; }; elements: LSApiElement[]; createdBy: string; created: Date; modified: Date; lastSent: Date; pageDimensionArray: [number, number][]; pageDimensions: string; fixSignatureScale?: boolean; }` | `undefined` |


## Events

| Event    | Description | Type                           |
| -------- | ----------- | ------------------------------ |
| `mutate` |             | `CustomEvent<LSMutateEvent[]>` |
| `update` |             | `CustomEvent<LSMutateEvent[]>` |


## Dependencies

### Used by

 - [ls-document-viewer](../ls-document-viewer)

### Depends on

- [ls-icon](../ls-icon)
- [ls-tooltip](../ls-tooltip)
- [ls-toggle](../ls-toggle)

### Graph
```mermaid
graph TD;
  ls-document-options --> ls-icon
  ls-document-options --> ls-tooltip
  ls-document-options --> ls-toggle
  ls-document-viewer --> ls-document-options
  style ls-document-options fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
