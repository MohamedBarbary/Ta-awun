const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter name of user who writes the comment'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'comment should be for certain post'],
    },
    content: {
      type: String,
      required: true,
      minLength: 1,
    },
    replies: [this],
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
