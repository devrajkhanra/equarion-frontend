import { useQuery } from "@apollo/client";
import { GET_INDICE_DATA } from "../graphql/queries";

export const useIndiceData = (dates: string[], indexNames: string[]) => {
  return useQuery(GET_INDICE_DATA, {
    variables: { dates, indexNames },
    fetchPolicy: "cache-first",
  });
};
