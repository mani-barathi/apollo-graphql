import { gql } from "apollo-server-express";

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
  }

  extend type Query {
    getUser(username: String!): User!
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!): String!
  }
`;
