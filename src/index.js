import express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";

import models from "./models";
import typeDefs from "./schemas";
import resolvers from "./resolvers";

(async () => {
  await models.sequelize.sync({});

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const context = { models };

  const app = express();
  const server = new ApolloServer({ schema, context });
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log("Now browse to http://localhost:4000" + server.graphqlPath)
  );
})();
