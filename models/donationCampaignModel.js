const mongoose = require('mongoose');

const donationCampaignSchema = new mongoose.Schema(
  {
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Enter the ID of the User'],
    },
    title: {
      type: String,
      required: [true, 'Enter campaign title'],
    },
    titleDescription: {
      type: String,
      required: [true, 'Enter campaign titleDescription'],
      maxLength: 80,
    },
    aboutCampaign: {
      type: String,
      required: [true, 'Enter about the campaign data '],
    },
    beneficiaries: {
      type: Number,
      required: [true, 'Enter beneficiaries'],
    },
    category: String,
    photos: {
      type: [String],
    },
    photosLink: {
      type: [String],
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

donationCampaignSchema.pre('save', function (next) {
  if (this.isNew) this.remainingAmount = this.totalAmount;
  next();
});
const DonationCampaign = mongoose.model(
  'DonationCampaign',
  donationCampaignSchema
);

module.exports = DonationCampaign;
