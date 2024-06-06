const Comment = require('../models/commentModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const controllersBuilder = require('./builders/controllersBuilder');
const popOptions = { path: 'userID', select: 'userName photoLink' };

exports.createComment = controllersBuilder.createOne(Comment);
exports.getAllComments = controllersBuilder.getAll(Comment);
exports.getComment = controllersBuilder.getOne(Comment, popOptions);
exports.updateComment = controllersBuilder.updateOne(Comment);
exports.deleteComment = controllersBuilder.deleteOne(Comment);
exports.uploadCommentPhotos = controllersBuilder.uploadPhoto(
  'commentPhotos',
  'comment'
);
exports.updateCommentPhotos = controllersBuilder.addPhotosInfo(Comment);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new AppError('no found comment with this id'), 404);
  if (req.model.id !== comment.userID.toString())
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});
