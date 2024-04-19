const Organization = require('./../models/organizationModel');
const jwt = require('jsonwebtoken');
const emailSender = require('./../utils/email');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const createSendToken = (organization, statusCode, res) => {
  const token = signToken(organization._id);
  organization.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      organization,
    },
  });
};
exports.signUp = catchAsyncError(async (req, res, next) => {
  const organization = await Organization.create({
    organizationName: req.body.organizationName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(organization, 201, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('please enter email and password', 400));
  }
  const currentOrganization = await Organization.findOne({ email }).select(
    '+password'
  );
  if (
    !currentOrganization ||
    !(await currentOrganization.compareBcryptHashedCodes(
      password,
      currentOrganization.password
    ))
  ) {
    next(new AppError('invalid email or password', 400));
  }
  if (!currentOrganization.verified) {
    next(new AppError('please verify your email', 400));
  }
  createSendToken(currentOrganization, 200, res);
});
exports.protectRoutes = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('your are not logged in! please login '), 401);
  }
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const currentOrganization = await Organization.findById(decodedData.id);
  if (!currentOrganization) {
    return next(new AppError('organization not exist please try again ', 404));
  }
  req.organization = currentOrganization;
  next();
});
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const organization = await Organization.findOne({ email: req.body.email });
  if (!organization) {
    next(new AppError('no organization found invalid mail', 404));
  }
  if (!organization.verified) {
    next(new AppError('please verify your email', 400));
  }
  const resetToken = organization.createPasswordResetToken();
  await organization.save({ validateBeforeSave: false });
  console.log(organization.passwordResetToken);
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/organizations/editPassword/${resetToken}`;
  const html = `click <a href=${url}>here</a> to reset your password.`;
  await emailSender.sendMail(organization.email, html, 'reset password');
  res.status(200).json({
    status: 'success',
    message: 'we send mail for you to verify you mail',
  });
});

// edit this for all organization and user
exports.editPassword = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const organization = await Organization.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!organization) {
    res.status(404).render('404');
  }
  organization.password = req.body.password;
  organization.passwordConfirm = req.body.passwordConfirm;
  organization.passwordResetToken = undefined;
  organization.passwordResetExpires = undefined;
  await organization.save();
  res.status(200).json({
    status: 'success',
  });
});
