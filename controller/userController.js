const catchAsyncError = require('../utils/catchAsyncErrors');
const User = require('./../models/userModel');
const controllersBuilder = require('../controller/controllersBuilder');
const cloudinary = require('cloudinary').v2;

const getImage = (imageName) => {
  const imageUrl = cloudinary.url(imageName, {
    width: 200,
    height: 200,
    crop: 'fill',
  });
  return imageUrl;
};

const filterObj = function (obj, ...allowedFields) {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('you not allowed to change password here', 400));
  }
  const filteredBody = filterObj(req.body, 'userName');
  if (req.file) {
    filteredBody.photo = req.file.filename;
    filteredBody.photoLink = getImage(req.file.filename);
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidator: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
  next();
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'please use sign up to create new user ',
  });
};
exports.uploadMyPhoto = controllersBuilder.uploadPhoto('userPhotos', 'user');
exports.getAllUsers = controllersBuilder.getAll(User);
exports.getUser = controllersBuilder.getOne(User);
exports.updateUser = controllersBuilder.updateOne(User);
exports.deleteUser = controllersBuilder.deleteOne(User);
