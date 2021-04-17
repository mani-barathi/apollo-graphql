import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";

export default {
  Query: {},

  Mutation: {
    createComment: async (parent, args, { req, models }) => {
      const user = isAuthenticated(req);
      if (!args.text)
        return {
          ok: false,
          errors: [{ path: "unknown", message: "comment cannot be empty" }],
        };

      try {
        const comment = await models.Comment.create({
          ...args,
          userId: user.id,
        });
        return { ok: true, comment };
      } catch (e) {
        console.log("createComment: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    },
  },
};
