const Query = {
  hi: () => "hello Query",
};

const Mutation = {
  getHi: (_, args) => `hello ${args.name}`,
};

export default {
  Query,
  Mutation,
};
