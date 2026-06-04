# ls-participant-card



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Default     |
| ---------- | ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `active`   | `active`   |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`     |
| `busy`     | `busy`     |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`     |
| `editable` | `editable` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`     |
| `index`    | `index`    |             | `number`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined` |
| `signer`   | --         |             | `{ children?: LSApiRole[]; id?: string; name: string; roleType: LSApiRoleType; signerIndex: number; ordinal: number; signerParent?: string; experience: string; templateId?: string; }`                                                                                                                                                                                                                                                                                                                                                      | `undefined` |
| `template` | --         |             | `{ id: string; title: string; pageCount: number; fileName: string; link: string; autoArchive: boolean; valid: boolean; locked: boolean; tags: string[]; groupId: string; roles: LSApiRole[]; canOpenSign: boolean; directLinks: []; elementConnection: { templateElements: LSApiElement[]; totalCount: number; }; elements: LSApiElement[]; createdBy: string; created: Date; modified: Date; lastSent: Date; pageDimensionArray: [number, number][]; pageDimensions: string; fixSignatureScale?: boolean; documentRetentionDays: number; }` | `undefined` |


## Events

| Event            | Description | Type                                                                                                                                                                                                 |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addParticipant` |             | `CustomEvent<{ type: LSApiRoleType; parent?: string; signerIndex?: number; }>`                                                                                                                       |
| `mutate`         |             | `CustomEvent<LSMutateEvent[]>`                                                                                                                                                                       |
| `opened`         |             | `CustomEvent<{ children?: LSApiRole[]; id?: string; name: string; roleType: LSApiRoleType; signerIndex: number; ordinal: number; signerParent?: string; experience: string; templateId?: string; }>` |
| `roleChange`     |             | `CustomEvent<number>`                                                                                                                                                                                |


## Dependencies

### Used by

 - [ls-participant-manager](../ls-participant-manager)

### Depends on

- ls-icon
- [ls-input-wrapper](../ls-input-wrapper)
- ls-button
- ls-tooltip

### Graph
```mermaid
graph TD;
  ls-participant-card --> ls-icon
  ls-participant-card --> ls-input-wrapper
  ls-participant-card --> ls-button
  ls-participant-card --> ls-tooltip
  ls-input-wrapper --> ls-icon
  ls-button --> ls-icon
  ls-button --> ls-loading
  ls-loading --> ls-loading-icon
  ls-participant-manager --> ls-participant-card
  style ls-participant-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
