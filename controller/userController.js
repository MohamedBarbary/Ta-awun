const multer = require('multer');
const { storage } = require('../utils/imagesHandler');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const Factory = require('./handleFactory');
const User = require('./../models/userModel');

exports.uploadphoto = () => {
  return (req, res, next) => {
    const fileName = `user-${req.user.id}-${Date.now()}`;
    const multerStorage = storage(fileName, 'usersPhotos');
    const upload = multer({ storage: multerStorage }).single('photo');
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload photo.' });
      }
      next();
    });
  };
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
  if (req.file) filteredBody.photo = req.file.filename;
  console.log(filteredBody);
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
exports.getAllUsers = Factory.getAll(User);
exports.getUser = Factory.getOne(User);
exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);
