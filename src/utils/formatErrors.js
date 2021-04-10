import _ from "lodash";

// docs -> https://github.com/benawad/graphql-express-template/blob/31_graphql_errors/resolvers.js#L13
export default function formatErrors(e, models) {
  if (e instanceof models.Sequelize.ValidationError) {
    //  _.pick({a: 1, b: 2}, 'a') => {a: 1}
    return e.errors.map((x) => _.pick(x, ["path", "message"]));
  }
  return [{ path: "unknown", message: "something went wrong" }];
}
