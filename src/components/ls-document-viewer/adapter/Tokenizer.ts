// import {
//   AuthenticationDetails,
//   CognitoUser,
//   CognitoUserPool,
// } from "amazon-cognito-identity-js";

// export const getAccessToken = (
//   username: string,
//   password: string,
//   userPoolId?: string,
//   clientId?: string
// ): Promise<string> => {
//   const authenticationData = {
//     Username: username,
//     Password: password,
//   };

//   const authenticationDetails = new AuthenticationDetails(authenticationData);

//   const poolData = {
//     UserPoolId: userPoolId ?  userPoolId : "eu-west-2_NUPAjABy7",
//     ClientId: clientId ? clientId : "38kn0eb9mf2409t6mci98eqdvt",
//   };

//   const userPool = new CognitoUserPool(poolData);

//   const userData = {
//     Username: username,
//     Pool: userPool,
//   };
//   const cognitoUser = new CognitoUser(userData);

//   return new Promise<string>((resolve, reject) =>
//     cognitoUser.authenticateUser(authenticationDetails, {
//       onSuccess: result => resolve(result.getAccessToken().getJwtToken()),
//       onFailure: err => reject(err),
//     })
//   );
// };
