import { gql } from "apollo-server-express";

export default gql`
  type Discussion {
    id: Int!
    title: String!
    description: String!
    user: User!
  }

  type CreateDiscussionResponse {
    id: Int
    ok: Boolean!
    errors: [Error]
  }

  extend type Mutation {
    createDiscussion(
      title: String!
      description: String!
    ): CreateDiscussionResponse
  }
`;
