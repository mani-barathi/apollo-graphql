export default (sequelize, DataTypes) => {
  const Discussion = sequelize.define(
    "discussion",
    {
      title: DataTypes.TEXT,
      description: DataTypes.TEXT,
    },
    { underscored: true }
  );

  Discussion.associate = (models) => {
    Discussion.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return Discussion;
};
