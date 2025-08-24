import { useQuery } from "@apollo/client";
import {
  GET_NIFTY_COMPANIES,
  GET_NIFTY_ALL_COMPANIES,
} from "../graphql/queries";

export const useNiftyCompanies = (industry?: string) => {
  if (industry && industry !== "") {
    return useQuery(GET_NIFTY_COMPANIES, {
      variables: { industry },
      fetchPolicy: "cache-first",
    });
  }
  return useQuery(GET_NIFTY_ALL_COMPANIES, {
    fetchPolicy: "cache-first",
  });
};
