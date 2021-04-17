import { gql } from "apollo-server-express";

export default gql`
  type Comment {
    id: Int!
    text: String!
    createdAt: String!
    userId: Int!
    username: String
  }

  type CreateCommentResponse {
    comment: Comment
    ok: Boolean!
    errors: [Error]
  }

  extend type Mutation {
    createComment(discussionId: Int!, text: String!): CreateCommentResponse!
  }
`;
