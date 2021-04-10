export default {
  Query: {
    getUser: async (parent, args, { models }) => {
      return await models.User.findOne({ where: { username: args.username } });
    },
  },

  Mutation: {
    createUser: async (parent, args, { models }) => {
      const user = await models.User.create(args);
      console.log(`created User: ${user}`);
      return args.username;
    },
  },
};
