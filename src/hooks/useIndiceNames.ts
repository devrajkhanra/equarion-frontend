// src/hooks/useIndiceNames.ts

import { useQuery, gql } from "@apollo/client";
import React from "react";

const GET_DISTINCT_INDICES = gql`
  query GetDistinctIndices {
    indiceData {
      IndexName
    }
  }
`;

export const useIndiceNames = () => {
  const { data, loading, error } = useQuery(GET_DISTINCT_INDICES);

  const indices = React.useMemo(() => {
    if (!data || !data.indiceData) return [];
    return Array.from(new Set(data.indiceData.map((i: any) => i.IndexName)));
  }, [data]);

  return { indices, loading, error };
};
