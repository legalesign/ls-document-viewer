////////////////////////////////////////////////////////////////////////
/// Parameters used by the default platform (valid for UK/EU processing)
/// https://docs.aws.amazon.com/appsync/latest/eventapi/event-api-websocket-protocol.html
////////////////////////////////////////////////////////////////////////
export const Parameters = {
  endpoints: {
    graphQL:
      "https://dypxviim4zgwtpev7valhchaem.appsync-api.eu-west-2.amazonaws.com/graphql",
    wssHost: "dypxviim4zgwtpev7valhchaem.appsync-api.eu-west-2.amazonaws.com",
    wssRealTime: 'wss://dypxviim4zgwtpev7valhchaem.appsync-realtime-api.eu-west-2.amazonaws.com/graphql'
  },
  buckets: {
    region: "eu-west-2",
    clearing: "lon-files-clearing",
  },
};

