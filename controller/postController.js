const Post = require('../models/postModel');
const Factory = require('./handleFactory');

exports.createPost = Factory.createOne(Post);
exports.getAllPosts = Factory.getAll(Post);
exports.getPost = Factory.getOne(Post);
exports.updatePost = Factory.updateOne(Post);
exports.deletePost = Factory.deleteOne(Post);
