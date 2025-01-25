const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new Error("notValidId");
    })
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error("notValidId");
    })
    .then((_id) => res.send({ data: _id }))
    .catch(() => {
      throw new NotFoundError("User with the specified _id was not found.");
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Invalid data provided."));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, email, avatar, password } = req.body;

  User.findOne({ email })
    .then((data) => {
      if (data) {
        throw new ConflictError("Email already exists");
      }
      bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            name,
            about,
            email,
            avatar,
            password: hash,
          })
        )
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() =>
      next(new NotFoundError("User with the specified _id was not found."))
    )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for profile update."));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() =>
      next(new NotFoundError("User with the specified _id was not found."))
    )
    .then((image) => res.send({ data: image }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided for avatar update."));
      } else {
        next(error);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: "Authorization was successful", token });
    })
    .catch((error) => {
      if (error.message === "Incorrect email or password") {
        next(new UnauthorizedError("Invalid Email or password provided."));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUsers,
  getUserId,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
