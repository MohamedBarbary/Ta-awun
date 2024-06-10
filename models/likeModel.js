const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter name of user who add like'],
    },
    postID: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'like should be for certain post'],
    },
  },
  {
    timestamps: true,
  }
);
likeSchema.index(
  { userID: 1, postID: 1 },
  { unique: true, message: 'This user has already liked this post' }
);

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
