const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === "production" ? JWT_SECRET : "dev-secret"}`
    );
  } catch (error) {
    next(new UnauthorizedError("Authorization is required"));
  }

  req.user = payload;

  next();
};
