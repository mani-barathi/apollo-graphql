import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";
import isUserDiscussionValid from "../utils/isUserDiscussionValid";

const LIMIT = 4;
const discussionAttributes = [
  "id",
  "userId",
  "title",
  // "description",
  "createdAt",
  "updatedAt",
];

export default {
  Query: {
    getSingleDiscussion: async (parent, args, { models, req }) => {
      isAuthenticated(req);
      try {
        const discussion = await models.Discussion.findByPk(args.id);
        if (!discussion)
          return {
            ok: false,
            errors: [{ path: "unknown", message: `No discussion exists` }],
          };

        return { ok: true, discussion };
      } catch (e) {
        console.log("getSingleDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of getSingleDiscussion

    getDiscussions: async (parent, args, { models, req }) => {
      isAuthenticated(req);
      try {
        const options = {
          where: {},
          include: {
            model: models.User,
            attributes: [],
          },
          attributes: [
            ...discussionAttributes,
            [models.sequelize.literal('"user"."username"'), "username"],
          ],
          order: [["createdAt", "DESC"]],
          limit: LIMIT,
          raw: true,
        };

        if (args.cursor) {
          options.where.createdAt = {
            [models.Sequelize.Op.lt]: new Date(parseInt(args.cursor)),
          };
        }
        const discussions = await models.Discussion.findAll(options);

        if (!discussions.length)
          return {
            ok: false,
            hasMore: false,
            errors: [{ path: "unknown", message: `No Discussions exists` }],
          };

        if (discussions.length < LIMIT)
          return { ok: true, discussions, hasMore: false };

        return { ok: true, discussions, hasMore: true };
      } catch (e) {
        console.log("getDiscussions: ", e);
        return { ok: false, hasMore: false, errors: formatErrors(e, models) };
      }
    }, // end of getDiscussions

    getDiscussionsOfUser: async (parent, args, { models, req }) => {
      isAuthenticated(req);
      try {
        const options = {
          where: {},
          include: {
            model: models.User,
            where: {
              username: args.username,
            },
            attributes: [],
          },
          attributes: [
            ...discussionAttributes,
            [models.sequelize.literal('"user"."username"'), "username"],
          ],
          order: [["createdAt", "DESC"]],
          limit: LIMIT,
          raw: true,
        };

        if (args.cursor) {
          options.where.createdAt = {
            [models.Sequelize.Op.lt]: new Date(parseInt(args.cursor)),
          };
        }

        const discussions = await models.Discussion.findAll(options);

        if (!discussions.length)
          return {
            ok: false,
            hasMore: false,
            errors: [{ path: "unknown", message: `No Discussions exists` }],
          };

        if (discussions.length < LIMIT)
          return { ok: true, discussions, hasMore: false };

        return { ok: true, discussions, hasMore: true };
      } catch (e) {
        console.log("getDiscussionsOfUser: ", e);
        return { ok: false, hasMore: false, errors: formatErrors(e, models) };
      }
    }, // end of getDiscussionsOfUser
  }, // end of Query

  Mutation: {
    createDiscussion: async (parent, args, { models, req }) => {
      const user = isAuthenticated(req);
      if (args.title.length < 5 || args.description.length < 10)
        return {
          ok: false,
          errors: [
            {
              path: "unknown",
              message:
                "title and description should atleast be 5 and 10 characters",
            },
          ],
        };

      try {
        const newDiscussion = await models.Discussion.create({
          ...args,
          userId: user.id,
        });
        return { ok: true, discussion: newDiscussion };
      } catch (e) {
        console.log("createDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of createDiscussion

    deleteDiscussion: async (parent, args, { models, req }) => {
      const user = isAuthenticated(req);

      try {
        const discussion = await models.Discussion.findByPk(args.id);

        const [isValid, responseMessage] = isUserDiscussionValid(
          user,
          discussion
        );
        if (!isValid) return responseMessage;

        await discussion.destroy();
        return { ok: true, discussion };
      } catch (e) {
        console.log("deleteDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of deleteDiscussion

    updateDiscussion: async (parent, args, { models, req }) => {
      const user = isAuthenticated(req);
      try {
        const discussion = await models.Discussion.findByPk(args.id);
        const [isValid, responseMessage] = isUserDiscussionValid(
          user,
          discussion
        );
        if (!isValid) return responseMessage;

        if (args.title) discussion.title = args.title;

        if (args.description) discussion.description = args.description;

        discussion.save();
        return { ok: true, discussion };
      } catch (e) {
        console.log("updateDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of updateDiscussion
  }, // end of Mutation

  Discussion: {
    author: async (parent, args, { models }) => {
      try {
        return await models.User.findByPk(parent.userId);
      } catch (e) {
        console.log("User:", e);
        return null;
      }
    },
  },
};
