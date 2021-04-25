import { PubSub, withFilter } from "apollo-server-express";
import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";

const LIMIT = 2;
const commentAttributes = ["id", "text", "createdAt", "discussionId"];
const NEW_COMMENT = "NEW_COMMENT";
const pubsub = new PubSub();
export default {
  Subscription: {
    newComment: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_COMMENT),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct discussion for this operation
          return payload.newComment.discussionId === variables.discussionId;
        }
      ),
    },
  },

  Query: {
    getComments: async (parent, args, { req, models }) => {
      isAuthenticated(req);
      const { discussionId, cursor } = args;
      const limitPlusOne = LIMIT + 1;
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
          order: [["createdAt", "DESC"]],
          limit: limitPlusOne,
          raw: true,
        };

        if (cursor) {
          options.where.createdAt = {
            [models.Sequelize.Op.lt]: new Date(parseInt(cursor)),
          };
        }
        const comments = await models.Comment.findAll(options);

        return {
          ok: true,
          hasMore: comments.length === limitPlusOne,
          comments: comments.slice(0, LIMIT),
          discussionId,
        };
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
        pubsub.publish(NEW_COMMENT, {
          newComment: {
            id: comment.id,
            text: comment.text,
            discussionId: comment.discussionId,
            username: user.username,
            createdAt: comment.createdAt,
            userId: comment.userId,
          },
        });
        return { ok: true, comment };
      } catch (e) {
        console.log("createComment: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    },
  },
};
