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
exports.login = (Model) => {
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new AppError('please enter email and password', 400));
    }
    const currentModel = await Model.findOne({ email }).select('+password');
    if (
      !currentModel ||
      !(await currentModel.compareBcryptHashedCodes(
        password,
        currentUser.password
      ))
    ) {
      next(new AppError('invalid email or password', 400));
    }
    if (!currentUser.verified) {
      next(new AppError('please verify your email', 400));
    }
    createSendToken(currentModel, 200, res);
  });
};

exports.protectRoutes = (Model, model) => {
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
      return next(new AppError('Model not exist please try again ', 404));
    }
    req.model = currentModel;
    next();
  });
};
