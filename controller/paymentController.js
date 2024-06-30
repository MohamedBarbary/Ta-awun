const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const DonationCampaign = require('../models/donationCampaignModel');
const Donation = require('../models/donationModel');
const User = require('../models/userModel');

exports.processPayment = async (req, res) => {
  const { campaignId, amount, token } = req.body;
  const userId = req.model._id;

  try {
    const campaign = await DonationCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe works in cents
      currency: 'usd',
      source: token,
      description: `Donation for campaign: ${campaign.title}`,
    });

    campaign.remainingAmount -= amount;

    const donation = new Donation({
      userId,
      campaignId,
      amount,
    });

    await donation.save();
    campaign.donations.push(donation);
    await campaign.save();

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.paymentPage = catchAsyncError(async (req, res, next) => {
  res.status(200).render('resetPassword');
});
