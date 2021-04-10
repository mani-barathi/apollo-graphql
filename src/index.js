import express from "express";
import { ApolloServer } from "apollo-server-express";

import models from "./models";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";

(async () => {
  await models.sequelize.sync({});

  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log("Now browse to http://localhost:4000" + server.graphqlPath)
  );
})();
