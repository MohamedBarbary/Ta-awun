const jwt = require('jsonwebtoken');
const emailSender = require('../../utils/email');
const crypto = require('crypto');
const { createMailData } = require('../../utils/createMailData');
const BlacklistToken = require('../../models/blacklistTokenModel');
const { promisify } = require('util');
const catchAsyncError = require('../../utils/catchAsyncErrors');
const AppError = require('../../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const createSendToken = (model, statusCode, res) => {
  const token = signToken(model._id);
  model.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      model,
    },
  });
};

const prepareAndSendResetPasswordEmail = catchAsyncError(async (model, req) => {
  const resetToken = model.createPasswordResetToken();
  await model.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/models/editPassword/${resetToken}`;
  const mailHtml = `Click <a href=${url}>here</a> to reset your password.`;

  const mailData = createMailData(
    process.env.TaawunMail,
    model.email,
    'We send this mail to you to change your password.',
    mailHtml,
    'Change Your Password'
  );

  await emailSender.sendMail(mailData);
});
exports.login = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('please enter email and password', 400));
    }
    const currentModel = await Model.findOne({ email }).select('+password');
    if (
      !currentModel ||
      !(await currentModel.compareBcryptHashedCodes(
        password,
        currentModel.password
      ))
    ) {
      next(new AppError('invalid email or password', 400));
    }
    if (!currentModel.verified) {
      return next(new AppError('please verify your email', 400));
    }
    createSendToken(currentModel, 200, res);
  });

exports.checkBlacklistTokens = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('No token provided!'));
  }

  const blacklistedToken = await BlacklistToken.findOne({ token: token });

  if (blacklistedToken) {
    return next(
      new AppError('Token has been blacklisted. Please log in again.')
    );
  }

  next();
});

exports.protectRoutes = (Model) =>
  catchAsyncError(async (req, res, next) => {
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
    const currentModel = await Model.findById(decodedData.id);
    if (!currentModel) {
      return next(new AppError('Model not exist please try again', 404));
    }
    req.model = currentModel;
    next();
  });

exports.forgotPassword = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const model = await Model.findOne({ email: req.body.email });
    if (!model) {
      next(new AppError('no model found invalid mail', 404));
    }
    if (!model.verified) {
      return next(new AppError('please verify your email', 400));
    }
    await prepareAndSendResetPasswordEmail(model, req);
    res.status(200).json({
      status: 'success',
      message: 'we send mail for you to change your password',
    });
  });

exports.editPassword = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
exports.resetPassword = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const model = await Model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!model) {
      res.status(404).render('404');
    }
    model.password = req.body.password;
    model.passwordConfirm = req.body.passwordConfirm;
    model.passwordResetToken = undefined;
    model.passwordResetExpires = undefined;
    await model.save();
    res.status(200).json({
      status: 'success',
    });
  });

exports.logout = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('No token provided!'));
  }

  await BlacklistToken.create({
    token: token,
  });

  res.status(200).json({
    status: 'success',
    message: 'You have successfully logged out.',
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.model.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
