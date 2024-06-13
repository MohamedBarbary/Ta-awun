const Post = require('../models/postModel');
const controllersBuilder = require('./builders/controllersBuilder.js');
const Comment = require('../models/commentModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');
const User = require('../models/userModel.js');
const popOptions = { path: 'userID', select: 'userName photoLink' };

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  const newDocument = await User.create(req.body);
  let populatedDocument = newDocument;
  if (popOptions) {
    populatedDocument = await newDocument.populate(popOptions);
  }
  res.status(201).json({
    status: 'success',
    data: {
      document: populatedDocument,
    },
  });
});
exports.getAllPosts = controllersBuilder.getAll(Post, popOptions);
exports.getPost = controllersBuilder.getOne(Post, popOptions);

exports.updatePost = controllersBuilder.updateOne(Post, popOptions);
exports.deletePost = controllersBuilder.deleteOne(Post);

exports.uploadPostPhotos = controllersBuilder.uploadPhoto('postPhotos', 'post');
exports.updatePostPhotos = controllersBuilder.addPhotosInfo(Post, popOptions);

exports.deleteUserPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    next(new AppError('no document found with this data'));
  }
  await Comment.deleteMany({ postID: req.params.id });
  await Donation_Request.deleteMany({ postID: req.params.id });
  res.status(200).json({
    status: 'success',
    post,
  });
});

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
