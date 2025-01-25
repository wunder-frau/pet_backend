const notFoundErrorRouter = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");

notFoundErrorRouter.all("*", () => {
  throw new NotFoundError("Not Found");
});

module.exports = notFoundErrorRouter;
