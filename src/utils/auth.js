import jwt from "jsonwebtoken";

// move these to enviorment variables
const SECRET1 = "klasdfo7afdq235ua";
const SECRET2 = "mkavbod9asdf23r7a";
const COOKIE_NAME = "qwe";

export const sendRefreshTokenAsCookie = (res, refreshToken) => {
  res.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
  });
};

export const createTokens = (user) => {
  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, SECRET1, {
    expiresIn: "60m",
  });
  const refreshToken = jwt.sign(payload, SECRET2, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyRefreshToken = (refreshToken) => {
  try {
    const user = jwt.decode(refreshToken, SECRET2);
    return user;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (req) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, SECRET1);
    return payload;
  } catch (err) {
    throw new Error("not authenticated");
  }
};
