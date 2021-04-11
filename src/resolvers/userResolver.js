import bcrypt from "bcrypt";
import formatErrors from "../utils/formatErrors";
import { createTokens, sendRefreshTokenAsCookie } from "../utils/auth";

export default {
  Query: {
    getUser: async (parent, args, { models }) => {
      return await models.User.findOne({ where: { username: args.username } });
    },
  },

  Mutation: {
    signupUser: async (parent, args, { models }) => {
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

    loginUser: async (parent, args, { models, res, req }) => {
      const { email, password } = args;
      try {
        const user = await models.User.findOne({ where: { email }, raw: true });
        if (!user) {
          return {
            ok: false,
            errors: [{ path: "unknown", message: "No User Exists" }],
          };
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return {
            ok: false,
            errors: [{ path: "unkown", message: "Invalid Credentials" }],
          };
        }

        const { accessToken, refreshToken } = createTokens(user);

        sendRefreshTokenAsCookie(res, refreshToken);
        return { ok: true, user, accessToken };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    }, // end of loginUser
  },
};
