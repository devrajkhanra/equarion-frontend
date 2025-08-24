import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

const link = new HttpLink({
  uri: "http://localhost:4000/", // Your backend GraphQL endpoint
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
