import Sequelize, { DataTypes } from "sequelize";

// replace the database details below
const DATABASE_NAME = "discussion_forum";
const DATABASE_USER = "postgres";
const PASSWORD = "1234";

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  define: {
    underscored: true,
  },
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
