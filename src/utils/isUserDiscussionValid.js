// checks whether it is a valid discussion and the user is the actual editor of the discussion
export default (user, discussion) => {
  if (!discussion) {
    return [
      false,
      {
        ok: false,
        errors: [
          {
            path: "unknown",
            message: `No discussion exists`,
          },
        ],
      },
    ];
  }
  if (user.id !== discussion.userId) {
    return [
      false,
      {
        ok: false,
        errors: [
          {
            path: "unknown",
            message: `Un Authorized`,
          },
        ],
      },
    ];
  }
  return [true, null];
};
