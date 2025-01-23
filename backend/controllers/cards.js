const Card = require("../models/card");

const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      throw new BadRequestError(error.message);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError("Data not found")))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          `You cannot delete a card that was not created by you. ${card.owner.toString()}, ${
            req.user._id
          }`
        );
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((data) => {
            res.status(200).send(data);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it is not already there
    { new: true }
  )
    .orFail(() => {
      throw new Error("notValidId");
    })
    .then((like) => {
      res.send({ data: like });
    })
    .catch(() => {
      throw new NotFoundError("Card with the specified _id was not found.");
    })
    .catch(next);
};

const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      throw new Error("notValidId");
    })
    .then((like) => {
      res.send({ data: like });
    })
    .catch(() => {
      throw new NotFoundError("Card with the specified _id was not found.");
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
};
