const Post = require('../models/postModel');
const controllersBuilder = require('./controllersBuilder');
const Comment = require('../models/commentModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');
const Donation_Request = require('../models/donation_requestModel');

exports.createPost = controllersBuilder.createOne(Post);
exports.getAllPosts = controllersBuilder.getAll(Post);
exports.getPost = controllersBuilder.getOne(Post);
exports.updatePost = controllersBuilder.updateOne(Post);
exports.deletePost = controllersBuilder.deleteOne(Post);
exports.uploadPostPhotos = controllersBuilder.uploadPhoto('postPhotos', 'post');
exports.updatePostPhotos = controllersBuilder.addPhotosInfo(Post);
exports.deleteUserPost = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    new AppError('no document found with this data');
  }
  await Comment.deleteMany({ postID: req.params.id });
  await Donation_Request.deleteMany({ postID: req.params.id });
  res.status(200).json({
    status: 'success',
    post,
  });
});
