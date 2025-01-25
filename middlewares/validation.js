const { celebrate, Joi } = require('celebrate');

const regexp = /^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/;

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    avatar: Joi.string().pattern(regexp),
    password: Joi.string().required().min(8).max(20),
  }),
});

const avatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexp).required(),
  }),
});

const updateUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(20),
  }),
});

const userIdValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

const cardIdValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

const cardLinkValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(regexp).required(),
  }),
});

module.exports = {
  loginValid,
  createUserValid,
  avatarValid,
  updateUserValid,
  userIdValid,
  cardIdValid,
  cardLinkValid,
};
