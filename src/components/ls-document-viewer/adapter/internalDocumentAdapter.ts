import axios, { AxiosResponse } from "axios";
import { LSMutateEvent } from "../../../types/LSMutateEvent";
import { LSApiRole } from "../../../types/LSApiRole";
import { LSApiElement } from "../../../types/LSApiElement";
import { Parameters } from "./parameters";

export class LsDocumentAdapter {

      
  handleEvent = (event: LSMutateEvent, accessToken) => {

    axios.defaults.headers.common["Authorization"] = accessToken;
      
    // Determine the object type being processed
    const obj: LSApiElement | LSApiRole = event.data;
    if (!obj?.id) return 'invalid';

    const apiId = atob(obj.id);
    if (apiId.length < 3) return 'invalid';

    const prefix = atob(obj.id).substring(0, 3);

    switch (prefix) {
      case 'ele':
        switch (event.action) {
          case "create":
            return createTemplateElement()
          case "update":
            return updateTemplateElement()
          case "delete":
            return deleteTemplateElement()
        }
        return 'unknown';
      case 'rol':
        switch (event.action) {
          case "create":
            return createRole()
          case "update":
            return updateRole()
          case "delete":
            return deleteRole()
          case "swap":
            return swapRole()
        }
        return 'unknown';
      case 'tpl':
        switch (event.action) {
          case "update":
            return updateTemplate()
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
  public async execute(
    accessToken: string,
    graphQLQuery: string,
    _graphQLVariables?: object
  ): Promise<object> {
    // TODO check the accessToken is valid

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
        }
      );

      return data.data;
    } else {
      console.warn("UNASSIGNED ACCESS TOKEN");
    }

    return Promise.reject();
  }
}



