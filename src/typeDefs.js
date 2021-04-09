import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    hi: String!
  }

  type Mutation {
    getHi(name: String!): String!
  }
`;

export default typeDefs;
