import { gql } from "apollo-server-express";
import userSchema from "./User";
import discussionSchema from "./discussion";

const rootSchema = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

export default [rootSchema, userSchema, discussionSchema];
