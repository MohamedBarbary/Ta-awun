const Like = require('../models/likeModel.js');
const controllersBuilder = require('./builders/controllersBuilder');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');
exports.createLike = controllersBuilder.createOne(Like);
exports.getAllLikes = controllersBuilder.getAll(Like);
exports.getLike = controllersBuilder.getOne(Like);
exports.updateLike = controllersBuilder.updateOne(Like);
exports.deleteLike = controllersBuilder.deleteOne(Like);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('no post found with this id'), 404);

  if (req.model.id === post.userID.toString()) {
    return next();
  } else
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
});
