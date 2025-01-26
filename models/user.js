const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Sugar Kane",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ukulele player",
  },
  avatar: {
    type: String,
    default:
      "https://images.saymedia-content.com/.image/t_share/MTk3OTkzOTE0MDA2MjUxMjkz/best-10-violet-costumes-dresses-in-modern-movies.png",
    validate: {
      validator(avatar) {
        return validator.isURL(avatar);
      },
      message: "Invalid link format",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Invalid mail format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Wrong password or mail"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Wrong password or mail"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
