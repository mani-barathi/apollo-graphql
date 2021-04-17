import userResolver from "./userResolver";
import discussionResolver from "./discussionResolver";
import commentResolver from "./commentResolver";

// export default {
//   Query: {
//     ...userResolver.Query,
//     ...discussionResolver.Query,
//   },
//   Mutation: {
//     ...userResolver.Mutation,
//     ...discussionResolver.Mutation,
//   },
// };

export default [userResolver, discussionResolver, commentResolver];
