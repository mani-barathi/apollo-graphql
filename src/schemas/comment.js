import { gql } from "apollo-server-express";

export default gql`
  type Comment {
    id: Int!
    text: String!
    createdAt: String!
    userId: Int!
    username: String
  }

  type MultipleCommentResponse {
    comments: [Comment!]
    discussionId: Int
    ok: Boolean!
    hasMore: Boolean
    errors: [Error]
  }

  type CreateCommentResponse {
    comment: Comment
    ok: Boolean!
    errors: [Error]
  }

  extend type Query {
    getComments(discussionId: Int!, cursor: String): MultipleCommentResponse!
  }

  extend type Mutation {
    createComment(discussionId: Int!, text: String!): CreateCommentResponse!
  }

  extend type Subscription {
    newComment(discussionId: Int!): Comment
  }
`;
