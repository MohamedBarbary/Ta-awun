const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter name of user who writes the post'],
    },
    content: {
      type: String,
      required: [true, 'Please add a content!'],
      minLength: 15,
    },
    photos: {
      type: [String],
    },
    photosLink: {
      type: [String],
    },
    category: String,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
