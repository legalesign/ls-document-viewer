import axios, { AxiosResponse } from 'axios';
import { LSMutateEvent } from '../../../types/LSMutateEvent';
import { LSApiRole } from '../../../types/LSApiRole';
import { LSApiElement } from '../../../types/LSApiElement';
import { Parameters } from './parameters';
import { createElement, deleteElement, updateElement } from './elementActions';
import { createRole, deleteRole, updateRole } from './roleActions';
import { updateTemplate } from './templateActions';

export class LsDocumentAdapter {
  handleEvent = async (event: LSMutateEvent, accessToken: string) => {
    axios.defaults.headers.common['Authorization'] = accessToken;

    // Determine the object type being processed
    const obj: LSApiElement | LSApiRole = event.data;
    if (!obj?.id) return 'invalid';

    const apiId = atob(obj.id);
    if (apiId.length < 3) return 'invalid';

    const prefix = atob(obj.id).substring(0, 3);
    let query = '';

    switch (prefix) {
      case 'ele':
        switch (event.action) {
          case 'create':
            query = createElement(obj);
          case 'update':
            query = updateElement(obj);
          case 'delete':
            query = deleteElement(obj);
        }
      case 'rol':
        switch (event.action) {
          case 'create':
            query = createRole(obj);
          case 'update':
            query = updateRole(obj);
          case 'delete':
            query = deleteRole(obj);
          case 'swap':
            query = updateRole(obj);
        }
      case 'tpl':
        switch (event.action) {
          case 'update':
            query = updateTemplate(obj);
        }
    }
    const result = await this.execute(accessToken, query);
    return { result, obj };
  };

  /**
   * Run a general query or mutation against the GraphQL API.
   *
   *  @returns a promise of a graphQL request
   */
  public async execute(accessToken: string, graphQLQuery: string, _graphQLVariables?: object): Promise<object> {
    if (accessToken) {
      console.log(graphQLQuery);
      const res = await axios.post<AxiosResponse>(
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
      console.log(res);
      return res.data.data;
    } else {
      console.warn('UNASSIGNED ACCESS TOKEN');
    }

    return Promise.reject();
  }
}
