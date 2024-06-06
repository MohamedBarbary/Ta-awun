const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  organizationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Enter the ID of the post'],
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Enter the ID of the user'],
  },
  content: {
    type: String,
    required: true,
  },
});
donationRequestSchema.index(
  { userID: 1, postID: 1 },
  { unique: true, message: 'This user has already liked this post.' }
);

const Donation_Request = mongoose.model(
  'Donation_Request',
  donationRequestSchema
);

module.exports = Donation_Request;
