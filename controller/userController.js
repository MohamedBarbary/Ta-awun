const User = require('../models/userModel');
const controllersBuilder = require('./builders/controllersBuilder');
const clientControllerBuilder = require('./builders/clientControllerBuilder');
exports.getMe = (req, res, next) => {
  req.params.id = req.model.id;
  next();
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'please use sign up to create new user ',
  });
};
exports.updateMe = clientControllerBuilder.updateMe(User);
exports.deleteMe = clientControllerBuilder.deleteMe(User);
exports.uploadMyPhoto = controllersBuilder.uploadPhoto('userPhotos', 'user');
exports.getAllUsers = controllersBuilder.getAll(User);
exports.getUser = controllersBuilder.getOne(User);
exports.updateUser = controllersBuilder.updateOne(User);
exports.deleteUser = controllersBuilder.deleteOne(User);
