export default {
  Query: {},

  Mutation: {
    createDiscussion: async (parent, args, { models, user }) => {
      console.log(args);
      try {
        await models.Discussion.create({ ...args, userId: user.id });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
