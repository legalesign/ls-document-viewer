// import axios from "axios";
// import { getAccessToken } from "./Tokenizer";
// import {
//   Selector,
// } from "./extensions";

// // Basic information loaded immediately after the Graph QL is set up.
// type UserInformation = { id: string; email: string };

// import { JWT } from "aws-amplify/auth";

// /**
//  * Use `Legalesign(organisationId, options?)` to create an instance of the `Legalesign` object.
//  * The Legalesign object is your entrypoint to the rest of the Legalesign.js SDK.
//  *
//  * When you’re ready to send documents, replace the test key with your live key in production.
//  */
// export interface LegalesignConstructor {
//   /**
//    * Specifying a connected organisation ID (e.g., `24BFMpJ1svR5A89k`) allows you to send documents on behalf of that account,
//    * if you don't know this [check your account page] (https://console.legalesign.com). This is only used if the user is 
//    * multi-organisation.
//    */
//   organisationId?: string;

//   /**
//    * Initialization options.
//    */
//   options: LegalesignConstructorOptions;
// }

// export interface LegalesignConstructorOptions {
//   /**
//    * An access token for system that have already handled the security login.
//    */
//   accessToken?: JWT;

//   /**
//    * The username for the account you use to run API requests.
//    */
//   apiUser?: string;

//   /**
//    * The password for the account you use to run API requests.
//    */
//   apiPassword?: string;

//   /**
//    * Optionally provide a different graphQL end point.
//    */
//   graphQLEndPoint?: string;

//   /**
//    * Optionally provide a custom user pool (used to closed architecture clients).
//    */
//   userPoolId?: string;

//   /**
//    * Optionally provide a custom user pool (used to closed architecture clients).
//    */
//   clientId?: string;

//   /**
//    * Optionally override your account's upload bucket (Platform Customers only).
//    */
//   clearingBucket?: string;

//   /**
//    * Optionally override your account's upload bucket (Platform Customers only).
//    */
//   wssHost?: string;

//   /**
//    * Optionally override your account's upload bucket (Platform Customers only).
//    */
//   wssRealTime?: string;

//   /**
//    * Optionally override your account's [API version](https://console.legalesign.com).
//    */
//   apiVersion?: string | null;
// }

// export type LegalesignErrorType =
//   /**
//    * Failure to connect to Legalesign's API.
//    */
//   | "api_connection_error"

//   /**
//    * API errors cover any other type of problem (e.g., a temporary problem with Legalesign's servers), and are extremely uncommon.
//    */
//   | "api_error"

//   /**
//    * Failure to properly authenticate yourself in the request.
//    */
//   | "authentication_error"

//   /**
//    * Idempotency errors occur when an `Idempotency-Key` is re-used on a request that does not match the first request's API endpoint and parameters.
//    */
//   | "idempotency_error"

//   /**
//    * Invalid request errors arise when your request has invalid parameters.
//    */
//   | "invalid_request_error"

//   /**
//    * Too many requests hit the API too quickly.
//    */
//   | "rate_limit_error"

//   /**
//    * Errors triggered by our client-side libraries when failing to validate fields (e.g., when a card number or expiration date is invalid or incomplete).
//    */
//   | "validation_error";

// export interface LegalesignError {
//   /**
//    * The type of error.
//    */
//   type: LegalesignErrorType;

//   /**
//    * For send errors, the ID of the failed task
//    */
//   task?: string;

//   /**
//    * For some errors that could be handled programmatically, a short string indicating the [error code] reported.
//    */
//   code?: string;

//   /**
//    * A human-readable message providing more details about the error. For card errors, these messages can be shown to your users.
//    */
//   message?: string;

//   /**
//    * If the error is parameter-specific, the parameter related to the error.
//    * For example, you can use this to display a message near the correct form field.
//    */
//   param?: string;

//   /**
//    * The `Source` object for errors returned on a request involving a `Source`.
//    */
//   source?: string;
// }

// ///////////////////////////////////////////////////////////////
// /// The start point for all actions on the Legalesign SDK
// ///////////////////////////////////////////////////////////////
// class Legalesign {
//   public options: LegalesignConstructorOptions;
//   public accessToken: undefined | string;
//   public organisationId: undefined | string;
//   public userInformation: UserInformation | undefined;


//   public constructor(legalesignConstructor: LegalesignConstructor) {
//     this.options = legalesignConstructor.options;
//     this.organisationId = legalesignConstructor?.organisationId;
//   }

//   /**
//    * Ensures that the api controller is connected and we know the
//    * current users credentials.
//    *
//    */
//   public async setup(): Promise<void> {
//     if (this.options.apiUser && this.options.apiPassword) {
//       try {

//         if(this.options.userPoolId && this.options.clientId) {
//           this.accessToken = await getAccessToken(
//             this.options.apiUser || '',
//             this.options.apiPassword || '',
//             this.options.userPoolId,
//             this.options.clientId
//           );  
  
//         } else {
//           this.accessToken = await getAccessToken(
//             this.options.apiUser || '',
//             this.options.apiPassword || ''
//           );  
  
//         }
//       } catch (e) {
//           console.log("User credentials incorrect or invalid.")
//           return;
//       }
//     } 
    
//     axios.defaults.headers.common["Authorization"] = this.accessToken;
//   }

//   /**
//    * Return true if the security connection for this object is valid.
//    *
//    */
//   isConnected(): boolean {
//     if (this.organisationId) return true;

//     return false;
//   }
// }

// export { Legalesign };
// export default Legalesign;
