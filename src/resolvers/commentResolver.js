import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";

const LIMIT = 2;
const commentAttributes = ["id", "text", "createdAt"];

export default {
  Query: {
    getComments: async (parent, args, { req, models }) => {
      isAuthenticated(req);
      if (!args.discussionId)
        return {
          ok: false,
          errors: [{ path: "unknown", message: "No DiscussionId provided" }],
        };

      try {
        const options = {
          where: { discussionId: args.discussionId },
          include: {
            model: models.User,
            attributes: [],
          },
          attributes: [
            ...commentAttributes,
            [models.sequelize.literal('"user"."username"'), "username"],
          ],
          // order: [["createdAt", "DESC"]],
          limit: LIMIT,
          raw: true,
        };

        if (args.cursor) {
          options.where.createdAt = {
            [models.Sequelize.Op.gt]: new Date(parseInt(args.cursor)),
          };
        }
        const comments = await models.Comment.findAll(options);

        if (!comments.length)
          return {
            ok: false,
            hasMore: false,
            errors: [{ path: "unknown", message: `No comments exists` }],
          };

        return { ok: true, comments, hasMore: true };
      } catch (e) {
        console.log("getCommentsOfDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    },
  }, // end of Query

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
