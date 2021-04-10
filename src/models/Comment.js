export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      text: DataTypes.TEXT,
    },
    { underscored: true }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
    Comment.belongsTo(models.Discussion, {
      foreignKey: {
        name: "discussionId",
        field: "discussion_id",
      },
    });
  };

  return Comment;
};
