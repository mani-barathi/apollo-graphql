export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "Username should only contain letters and numbers",
          },
          len: {
            args: [3, 25],
            msg: "Username needs to be between 6 and 25 character",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid Email",
          },
        },
      },
      password: DataTypes.STRING,
    },
    { underscored: true }
  );

  return User;
};
