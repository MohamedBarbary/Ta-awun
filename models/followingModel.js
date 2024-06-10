const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new mongoose.Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter your id '],
    },
    followingID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'enter your id '],
    },
  },
  {
    timestamps: true,
  }
);
followingSchema.index(
  { userID: 1, followingID: 1 },
  { unique: true, message: 'This user is already exist' }
);
const Following = mongoose.model('Following', followingSchema);
module.exports = Following;
