import Sequelize, { DataTypes } from "sequelize";

const sequelize = new Sequelize("discussion_forum", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});

import User from "./User";
import Discussion from "./Discussion";
import Comment from "./Comment";

const models = {
  User: User(sequelize, DataTypes),
  Discussion: Discussion(sequelize, DataTypes),
  Comment: Comment(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
