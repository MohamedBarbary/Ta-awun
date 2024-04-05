const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter name of user who writes the post'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description!'],
      minLength: 15,
    },
    likes: Number,
    comments: Array,
    images: [String],
    category: String,
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model('post', postSchema);
module.exports = Post;
