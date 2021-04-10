import { gql } from "apollo-server-express";

export default gql`
  type Discussion {
    id: Int!
    title: String!
    text: String!
    user: User!
  }
`;
