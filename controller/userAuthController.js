const User = require('../models/userModel');
const authBuilder = require('./builders/authBuilderController');
const jwt = require('jsonwebtoken');
const emailSender = require('../utils/email');
const { createMailData } = require('../utils/createMailData');
const catchAsyncError = require('../utils/catchAsyncErrors');
const AppError = require('../utils/appError');

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

const prepareAndSendVerificationEmailUser = catchAsyncError(
  async (user, req) => {
    const verificationToken = user.generateVerificationToken();

    const url = `${req.protocol}://${req.get(
      'host'
    )}/api/users/verify/${verificationToken}`;
    const mailHtml = `Click <a href="${url}">here</a> to confirm your email.`;

    const mailData = createMailData(
      process.env.TaawunMail,
      user.email,
      'Please verify your email address',
      mailHtml,
      'Verify Your Email'
    );

    await emailSender.sendMail(mailData);
  }
);

const organizationPrepareAndSendVerificationEmail = catchAsyncError(
  async (user, req) => {
    const verificationToken = user.generateVerificationToken();

    const url = `${req.protocol}://${req.get(
      'host'
    )}/api/users/verify/${verificationToken}`;
    const mailHtml = `Click <a href="${url}">here</a> to confirm your email.`;

    const mailData = createMailData(
      user.email,
      process.env.TaawunMail,
      'Please verify our organization email address',
      mailHtml,
      'Verify An Organization'
    );

    await emailSender.sendMail(mailData);
  }
);

exports.signUp = catchAsyncError(async (req, res, next) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    city: req.body.city,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    userType: req.body.userType,
  });
  if (user.userType === 'user') {
    await prepareAndSendVerificationEmailUser(user, req);
  } else {
    await organizationPrepareAndSendVerificationEmail(user, req);
  }
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
exports.updateUserPassword = authBuilder.updatePassword(User);
