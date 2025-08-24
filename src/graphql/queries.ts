import { gql } from "@apollo/client";

export const GET_STOCK_DATA = gql`
  query GetStockData($dates: [String!], $symbols: [String!]) {
    stockData(dates: $dates, symbols: $symbols) {
      SYMBOL
      DATE1
      SERIES
      OPEN_PRICE
      HIGH_PRICE
      LOW_PRICE
      CLOSE_PRICE
      TTL_TRD_QNTY
      DELIV_QTY
      DELIV_PER
    }
  }
`;

export const GET_INDICE_DATA = gql`
  query GetIndiceData($dates: [String!], $indexNames: [String!]) {
    indiceData(dates: $dates, indexNames: $indexNames) {
      IndexName
      IndexDate
      OpenIndexValue
      HighIndexValue
      LowIndexValue
      ClosingIndexValue
      Volume
    }
  }
`;

export const GET_NIFTY_COMPANIES = gql`
  query GetNiftyCompanies($industry: String) {
    niftyCompanies(industry: $industry) {
      CompanyName
      Symbol
      Industry
    }
  }
`;

export const GET_NIFTY_ALL_COMPANIES = gql`
  query GetNiftyAllCompanies {
    nifty50List {
      CompanyName
      Symbol
      Industry
    }
  }
`;
