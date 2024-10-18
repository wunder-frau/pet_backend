const notFoundErrorRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

notFoundErrorRouter.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = notFoundErrorRouter;
