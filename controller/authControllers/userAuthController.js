const User = require('../../models/userModel');
const authBuilder = require('../builders/authBuilderController');
const jwt = require('jsonwebtoken');
const emailSender = require('../../utils/email');
const catchAsyncError = require('../../utils/catchAsyncErrors');
const AppError = require('../../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsyncError(async (req, res, next) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const verificationToken = user.generateVerificationToken();
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/verify/${verificationToken}`;
  const html = `click <a href=${url}>here</a> to confirm your email.`;
  await emailSender.sendMail(user.email, html, 'verify mail');
  createSendToken(user, 201, res);
});

exports.verify = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).send({
      message: 'Missing Token',
    });
  }
  let payload = null;
  payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  if (!payload) {
    next(new AppError('link is not valid', 400));
  }
  const user = await User.findOne({ _id: payload.ID });

  if (!user) {
    next(new AppError('user not found', 404));
  }
  user.verified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).render('verify');
});
exports.login = authBuilder.login(User);
exports.protectRoutes = authBuilder.protectRoutes(User);
exports.forgotPassword = authBuilder.forgotPassword(User);
exports.editPassword = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
exports.resetPassword = authBuilder.resetPassword(User);
