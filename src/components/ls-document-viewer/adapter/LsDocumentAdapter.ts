import axios, { AxiosResponse } from 'axios';
import { LSMutateEvent } from '../../../types/LSMutateEvent';
import { LSApiRole } from '../../../types/LSApiRole';
import { LSApiElement } from '../../../types/LSApiElement';
import { Parameters } from './parameters';
import { createElement, deleteElement, updateElement } from './elementActions';
import { createRole, deleteRole, swapRoles, updateRole } from './roleActions';
import { updateTemplate } from './templateActions';
import { LSApiTemplate } from '../../../components';

export class LsDocumentAdapter {

  handleEvent = async (event: LSMutateEvent, accessToken: string) => {
    axios.defaults.headers.common['Authorization'] = accessToken;

    // Determine the object type being processed
    const obj: LSApiElement | LSApiRole | LSApiTemplate = event.data;
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
            break;
          case 'update':
            query = updateElement(obj);
            break;
          case 'delete':
            query = deleteElement(obj);
            break;
        }
      break;
      case 'rol':
        switch (event.action) {
          case 'create':
            query = createRole(obj);
            break;
          case 'update':
            query = updateRole(obj);
            break;
          case 'delete':
            query = deleteRole(obj);
            break;
          case 'swap':
            query = swapRoles(obj, event.data2);
            break;
        }
        break;
      case 'tpl':
        switch (event.action) {
          case 'update':
            query = updateTemplate(obj);
            break;
        }
        break;
    }
    const result = await this.execute(accessToken, query);
    console.log(query, result)
    return { result, obj, event };
  };

  /**
   * Run a general query or mutation against the GraphQL API.
   *
   *  @returns a promise of a graphQL request
   */
  public async execute(accessToken: string, graphQLQuery: string, _graphQLVariables?: object): Promise<object> {
    if (accessToken) {
      //console.log(graphQLQuery);
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
      return res.data.data;
    } else {
      console.warn('UNASSIGNED ACCESS TOKEN');
    }

    return Promise.reject();
  }
}
