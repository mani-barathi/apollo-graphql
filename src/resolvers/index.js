import helloResolver from "./helloResolver";

export default {
  Query: {
    ...helloResolver.Query,
  },
  Mutation: {
    ...helloResolver.Mutation,
  },
};
