const userRouter = require('express').Router();
const { avatarValid, updateUserValid, userIdValid } = require('../middlewares/validation');
const {
  getUsers,
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getUser);
userRouter.get('/users/:userId', userIdValid, getUserId);
userRouter.patch('/users/me', updateUserValid, updateUser);
userRouter.patch('/users/me/avatar', avatarValid, updateAvatar);

module.exports = userRouter;
