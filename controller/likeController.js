const Like = require('../models/likeModel.js');
const controllersBuilder = require('./builders/controllersBuilder');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');

const popOptions = { path: 'userID', select: 'userName photoLink' };
exports.createLike = controllersBuilder.createOne(Like, popOptions);
exports.getAllLikes = controllersBuilder.getAll(Like, popOptions);
exports.getLike = controllersBuilder.getOne(Like, popOptions);
exports.updateLike = controllersBuilder.updateOne(Like, popOptions);
exports.deleteLike = controllersBuilder.deleteOne(Like);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const like = await Like.findById(req.params.id);
  if (!like) return next(new AppError('no like found with this id'), 404);

  if (req.model.id === like.userID.toString()) {
    return next();
  } else
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
});
