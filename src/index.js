import express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import models from "./models";
import typeDefs from "./schemas";
import resolvers from "./resolvers";
import {
  sendRefreshTokenAsCookie,
  createTokens,
  verifyRefreshToken,
  isAuthenticated,
} from "./utils/auth";

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

(async () => {
  await models.sequelize.sync({});

  const app = express();
  const httpServer = http.createServer(app);
  app.use(cors(corsOptions));
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
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_, ws) => {
        console.log("client conncted!");
      },
      onDisconnect: () => console.log("client Disconnected!"),
    },
  });
  // await server.start();
  server.applyMiddleware({ app, cors: false });
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: 4000 }, () => {
    console.log("Now browse to http://localhost:4000" + server.graphqlPath);
    console.log(
      "Now browse to http://localhost:4000" + server.subscriptionsPath
    );
  });
})();
