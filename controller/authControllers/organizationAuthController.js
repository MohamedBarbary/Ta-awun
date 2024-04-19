const Organization = require('../../models/organizationModel');
const authBuilder = require('../builders/authBuilderController');
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../../utils/catchAsyncErrors');

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

exports.login = authBuilder.login(Organization);
exports.protectRoutes = authBuilder.protectRoutes(Organization);
exports.forgotPassword = authBuilder.forgotPassword(Organization);

exports.editPassword = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
exports.resetPassword = authBuilder.resetPassword(Organization);
