const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter your id'],
    },
    followerID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter your id'],
    },
  },
  {
    timestamps: true,
  }
);
followerSchema.index(
  { userID: 1, followerID: 1 },
  { unique: true, message: 'This user is already exist' }
);
const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;
