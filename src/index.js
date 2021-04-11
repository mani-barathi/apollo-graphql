import express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import cookieParser from "cookie-parser";

import models from "./models";
import typeDefs from "./schemas";
import resolvers from "./resolvers";
import {
  sendRefreshTokenAsCookie,
  createTokens,
  verifyRefreshToken,
} from "./utils/auth";

(async () => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  await models.sequelize.sync({});

  const app = express();
  app.use(cookieParser());

  app.post("/refresh-token", async (req, res) => {
    const token = req.cookies.qwe;
    if (!token) {
      return res.send({ ok: false });
    }

    const data = verifyRefreshToken(token);
    if (!data) {
      return res.send({ ok: false });
    }
    const user = await models.User.findOne({
      where: { id: data.id },
      raw: true,
    });
    if (!user) {
      return res.send({ ok: false });
    }

    const { accessToken, refreshToken } = createTokens(user);
    sendRefreshTokenAsCookie(res, refreshToken);

    return res.send({
      ok: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      return { req, res, models };
    },
  });
  // await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log("Now browse to http://localhost:4000" + server.graphqlPath)
  );
})();
