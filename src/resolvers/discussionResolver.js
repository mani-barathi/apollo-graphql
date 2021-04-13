import { isAuthenticated } from "../utils/auth";

export default {
  Query: {},

  Mutation: {
    createDiscussion: async (parent, args, { models, req }) => {
      const user = isAuthenticated(req);
      console.log(user);
      try {
        await models.Discussion.create({ ...args, userId: user.id });
        return true;
      } catch (e) {
        return false;
      }
    },
  },
};
