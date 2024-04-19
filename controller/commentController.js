const Comment = require('../models/commentModel');
const controllersBuilder = require('./builders/controllersBuilder');
exports.createComment = controllersBuilder.createOne(Comment);
exports.getAllComments = controllersBuilder.getAll(Comment);
exports.getComment = controllersBuilder.getOne(Comment);
exports.updateComment = controllersBuilder.updateOne(Comment);
exports.deleteComment = controllersBuilder.deleteOne(Comment);
exports.uploadCommentPhotos = controllersBuilder.uploadPhoto(
  'commentPhotos',
  'comment'
);
exports.updateCommentPhotos = controllersBuilder.addPhotosInfo(Comment);
