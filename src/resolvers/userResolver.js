export default {
  Query: {
    getUser: (parent, args, { models }) => {
      return models.User.findOne({ where: { username: args.username } });
    },
  },

  Mutation: {
    createUser: (parent, args, { models }) => {
      const user = models.User.create(args);
      console.log(`created User: ${user}`);
      return args.username;
    },
  },
};
