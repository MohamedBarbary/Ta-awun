const Comment = require('../models/commentModel');
const Factory = require('./handleFactory');
exports.createComment = Factory.createOne(Comment);
exports.getAllComments = Factory.getAll(Comment);
exports.getComment = Factory.getOne(Comment);
exports.updateComment = Factory.updateOne(Comment);
exports.deleteComment = Factory.deleteOne(Comment);
