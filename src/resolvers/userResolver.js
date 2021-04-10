import formatErrors from "../utils/formatErrors";

export default {
  Query: {
    getUser: async (parent, args, { models }) => {
      return await models.User.findOne({ where: { username: args.username } });
    },
  },

  Mutation: {
    createUser: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return { ok: true, user };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    }, // end of createUser
  },
};
