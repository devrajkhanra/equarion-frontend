import { useQuery } from "@apollo/client";
import { GET_STOCK_DATA } from "../graphql/queries";

export const useStockData = (dates: string[], symbols: string[]) => {
  return useQuery(GET_STOCK_DATA, {
    variables: { dates, symbols },
    fetchPolicy: "cache-first",
  });
};
