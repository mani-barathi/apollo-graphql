import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";

const LIMIT = 2;
const commentAttributes = ["id", "text", "createdAt", "discussionId"];

export default {
  Query: {
    getComments: async (parent, args, { req, models }) => {
      isAuthenticated(req);
      const { discussionId, cursor } = args;
      if (!discussionId)
        return {
          ok: false,
          errors: [{ path: "unknown", message: "No DiscussionId provided" }],
        };

      try {
        const options = {
          where: { discussionId },
          include: {
            model: models.User,
            attributes: [],
          },
          attributes: [
            ...commentAttributes,
            [models.sequelize.literal('"user"."username"'), "username"],
          ],
          order: [["createdAt", "ASC"]],
          limit: LIMIT,
          raw: true,
        };

        if (cursor) {
          options.where.createdAt = {
            [models.Sequelize.Op.gt]: new Date(parseInt(cursor)),
          };
        }
        const comments = await models.Comment.findAll(options);

        if (!comments.length)
          return {
            ok: false,
            discussionId,
            hasMore: false,
            errors: [{ path: "unknown", message: `No comments exists` }],
          };

        if (comments.length < LIMIT)
          return { ok: true, comments, discussionId, hasMore: false };

        return { ok: true, comments, discussionId, hasMore: true };
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
