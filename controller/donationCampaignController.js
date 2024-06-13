const DonationCampaign = require('../models/donationCampaignModel.js');
const controllersBuilder = require('./builders/controllersBuilder');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');

const popOptions = {
  path: 'userID',
  select: 'userName photoLink',
};
exports.createDonationCampaign = controllersBuilder.createOne(
  DonationCampaign,
  popOptions
);
exports.getAllDonationCampaigns = controllersBuilder.getAll(
  DonationCampaign,
  popOptions
);
exports.getDonationCampaign = controllersBuilder.getOne(
  DonationCampaign,
  popOptions
);
exports.updateDonationCampaign = controllersBuilder.updateOne(
  DonationCampaign,
  popOptions
);
exports.deleteDonationCampaign = controllersBuilder.deleteOne(DonationCampaign);
exports.uploadCampaignPhotos = controllersBuilder.uploadPhoto(
  'campaignPhotos',
  'campaign'
);
exports.updateCampaignPhotos = controllersBuilder.addPhotosInfo(
  DonationCampaign,
  popOptions
);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const donationCampaign = await DonationCampaign.findById(req.params.id);
  if (!donationCampaign)
    return next(new AppError('no DonationCampaign found with this id'), 404);

  if (req.model.id === donationCampaign.userID.toString()) {
    return next();
  } else
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
});
