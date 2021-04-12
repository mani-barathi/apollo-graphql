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
      return res.send({ ok: false, message: "no token provided" });
    }

    const data = verifyRefreshToken(token);
    if (!data) {
      return res.send({ ok: false, message: "invalid or expired token" });
    }
    const user = await models.User.findOne({
      where: { id: data.id },
      raw: true,
    });
    if (!user) {
      return res.send({ ok: false, message: "no User exists with that token" });
    }
    if (data.tokenVersion !== user.tokenVersion) {
      return res.send({ ok: false, message: "invalid or expired token" });
    }

    const { accessToken, refreshToken } = createTokens(user);
    sendRefreshTokenAsCookie(res, refreshToken);

    return res.send({
      ok: true,
      accessToken,
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
