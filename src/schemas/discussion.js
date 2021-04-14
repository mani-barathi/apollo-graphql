import { gql } from "apollo-server-express";

export default gql`
  type Discussion {
    id: Int!
    title: String!
    description: String!
    author: User
    updatedAt: String!
    createdAt: String!
  }

  type CreateDiscussionResponse {
    id: Int
    ok: Boolean!
    errors: [Error]
  }

  type SingleDiscussionResponse {
    discussion: Discussion
    ok: Boolean!
    errors: [Error!]
  }

  extend type Query {
    getSingleDiscussion(id: Int!): SingleDiscussionResponse!
  }

  extend type Mutation {
    createDiscussion(
      title: String!
      description: String!
    ): CreateDiscussionResponse
  }
`;
