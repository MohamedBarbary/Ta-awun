const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Donation_Request = mongoose.model('Donation_Request', donationRequestSchema);

module.exports = Donation_Request;
