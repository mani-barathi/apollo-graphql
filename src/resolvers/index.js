import userResolver from "./userResolver";
import discussionResolver from "./discussionResolver";

export default {
  Query: {
    ...userResolver.Query,
    ...discussionResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...discussionResolver.Mutation,
  },
};
