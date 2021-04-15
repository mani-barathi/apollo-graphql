import { isAuthenticated } from "../utils/auth";
import formatErrors from "../utils/formatErrors";

export default {
  Query: {
    getSingleDiscussion: async (parent, args, { models, req }) => {
      isAuthenticated(req);
      try {
        const discussion = await models.Discussion.findByPk(args.id);
        if (!discussion)
          return {
            ok: false,
            errors: [
              {
                path: "unknown",
                message: `No discussion exists`,
              },
            ],
          };

        return { ok: true, discussion };
      } catch (e) {
        console.log("createDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of getSingleDiscussion

    getDiscussionsOfUser: async (parent, args, { models, req }) => {
      isAuthenticated(req);
      try {
        const discussions = await models.Discussion.findAll({
          include: {
            model: models.User,
            where: {
              username: args.username,
            },
            attributes: [],
          },
          attributes: [
            "id",
            "userId",
            "title",
            "description",
            "createdAt",
            "updatedAt",
            [models.sequelize.literal('"user"."username"'), "username"],
          ],
          order: [["createdAt", "DESC"]],

          raw: true,
        });

        if (!discussions.length)
          return {
            ok: false,
            errors: [
              {
                path: "unknown",
                message: `No Discussions exists`,
              },
            ],
          };

        return { ok: true, discussions };
      } catch (e) {
        console.log("createDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of getDiscussionsOfUser
  }, // end of Query

  Mutation: {
    createDiscussion: async (parent, args, { models, req }) => {
      const user = isAuthenticated(req);
      if (args.title.length < 5 || args.description.length < 10) {
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
      }
      try {
        const newDiscussion = await models.Discussion.create({
          ...args,
          userId: user.id,
        });
        return { ok: true, id: newDiscussion.dataValues.id };
      } catch (e) {
        console.log("createDiscussion: ", e);
        return { ok: false, errors: formatErrors(e, models) };
      }
    }, // end of createDiscussion
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
