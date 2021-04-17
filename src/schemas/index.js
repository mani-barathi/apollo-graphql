import { gql } from "apollo-server-express";
import userSchema from "./User";
import discussionSchema from "./discussion";
import commentSchema from "./comment";

const rootSchema = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Error {
    message: String!
    path: String
  }
`;

export default [rootSchema, userSchema, discussionSchema, commentSchema];
