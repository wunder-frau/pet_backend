const cardsRouter = require('express').Router();
const { cardIdValid, cardLinkValid } = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', cardLinkValid, createCard);
cardsRouter.delete('/cards/:cardId', cardIdValid, deleteCard);
cardsRouter.put('/cards/:cardId/likes', cardIdValid, putLike);
cardsRouter.delete('/cards/:cardId/likes', cardIdValid, removeLike);

module.exports = cardsRouter;
