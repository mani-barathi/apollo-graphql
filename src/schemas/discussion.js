import { gql } from "apollo-server-express";

export default gql`
  type Discussion {
    id: Int!
    title: String!
    description: String!
    author: User
    updatedAt: String!
    createdAt: String!
    userId: Int!
    username: String
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

  type ManyDiscussionResponse {
    discussions: [Discussion!]
    ok: Boolean!
    errors: [Error!]
    hasMore: Boolean
  }

  extend type Query {
    getSingleDiscussion(id: Int!): SingleDiscussionResponse!
    getDiscussionsOfUser(
      username: String!
      cursor: String
    ): ManyDiscussionResponse!
    getDiscussions(cursor: String): ManyDiscussionResponse!
  }

  extend type Mutation {
    createDiscussion(
      title: String!
      description: String!
    ): SingleDiscussionResponse

    deleteDiscussion(id: Int!): SingleDiscussionResponse!

    updateDiscussion(
      id: Int!
      title: String
      description: String
    ): SingleDiscussionResponse!
  }
`;
