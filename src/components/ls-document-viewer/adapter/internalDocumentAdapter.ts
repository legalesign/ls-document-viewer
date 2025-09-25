import axios, { AxiosResponse } from 'axios';
import { LSMutateEvent } from '../../../types/LSMutateEvent';
import { LSApiRole } from '../../../types/LSApiRole';
import { LSApiElement } from '../../../types/LSApiElement';
import { Parameters } from './parameters';
import { createElement, deleteElement, updateElement } from './elementActions';
import { createRole, deleteRole, updateRole } from './roleActions';
import { updateTemplate } from './templateActions';

export class LsDocumentAdapter {
  handleEvent = (event: LSMutateEvent, accessToken: string) => {
    axios.defaults.headers.common['Authorization'] = accessToken;

    // Determine the object type being processed
    const obj: LSApiElement | LSApiRole = event.data;
    if (!obj?.id) return 'invalid';

    const apiId = atob(obj.id);
    if (apiId.length < 3) return 'invalid';

    const prefix = atob(obj.id).substring(0, 3);

    switch (prefix) {
      case 'ele':
        switch (event.action) {
          case 'create':
            return this.execute(accessToken, createElement(obj));
          case 'update':
            return this.execute(accessToken, updateElement(obj));
          case 'delete':
            return this.execute(accessToken, deleteElement(obj));
        }
        return 'unknown';
      case 'rol':
        switch (event.action) {
          case 'create':
            return this.execute(accessToken, createRole(obj));
          case 'update':
            return this.execute(accessToken, updateRole(obj));
          case 'delete':
            return this.execute(accessToken, deleteRole(obj));
        }
        return 'unknown';
      case 'tpl':
        switch (event.action) {
          case 'update':
           return this.execute(accessToken, updateTemplate(obj));
        }
        return 'unknown';
      default:
        return 'unknown';
    }
  };

  /**
   * Run a general query or mutation against the GraphQL API.
   *
   *  @returns a promise of a graphQL request
   */
  public async execute(accessToken: string, graphQLQuery: string, _graphQLVariables?: object): Promise<object> {
    if (accessToken) {
      const { data } = await axios.post<AxiosResponse>(
        Parameters.endpoints.graphQL,
        {
          query: graphQLQuery,
          variables: _graphQLVariables ? _graphQLVariables : {},
        },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      return data.data;
    } else {
      console.warn('UNASSIGNED ACCESS TOKEN');
    }

    return Promise.reject();
  }
}
