import bcrypt from "bcrypt";
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
        if ((args.password.length < 6) | (args.password.length > 32)) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message: "password needs to be between 6 and 32 character",
              },
            ],
          };
        }
        const password = await bcrypt.hash(args.password, 10);
        const user = await models.User.create({ ...args, password });
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
