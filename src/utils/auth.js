import jwt from "jsonwebtoken";
import models from "../models";

// move these to enviorment variables
const SECRET1 = "klasdfo7afdq235ua";
const SECRET2 = "mkavbod9asdf23r7a";
const COOKIE_NAME = "qwe";

export const sendRefreshTokenAsCookie = (res, refreshToken) => {
  res.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    // path: "/refresh_token",            // not working
  });
};

export const createTokens = (user) => {
  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, SECRET1, {
    expiresIn: "20m",
  });

  payload.tokenVersion = user.tokenVersion;
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
    const data = jwt.decode(refreshToken, SECRET2);
    return data;
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

// If the user has changed or forgotten the password
// this will increment the tokenVersion making the previous tokens invalid
export const revokeRefreshToken = async (user) => {
  try {
    user.tokenVersion = user.tokenVersion + 1;
    await user.save();
    return true;
  } catch (error) {
    return false;
  }
};
