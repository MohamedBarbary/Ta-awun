const DonationCampaign = require('../models/donationCampaignModel.js');
const controllersBuilder = require('./builders/controllersBuilder');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');

const popOptions = {
  path: 'organizationID',
  select: 'organizationName photoLink',
};
exports.createDonationCampaign = controllersBuilder.createOne(DonationCampaign);
exports.getAllDonationCampaigns = controllersBuilder.getAll(
  DonationCampaign,
  popOptions
);
exports.getDonationCampaign = controllersBuilder.getOne(DonationCampaign);
exports.updateDonationCampaign = controllersBuilder.updateOne(DonationCampaign);
exports.deleteDonationCampaign = controllersBuilder.deleteOne(DonationCampaign);
exports.uploadCampaignPhotos = controllersBuilder.uploadPhoto(
  'campaignPhotos',
  'campaign'
);
exports.updateCampaignPhotos =
  controllersBuilder.addPhotosInfo(DonationCampaign);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const deleteDonationCampaign = await DonationCampaign.findById(req.params.id);
  if (!deleteDonationCampaign)
    return next(new AppError('no DonationCampaign found with this id'), 404);

  if (req.model.id === deleteDonationCampaign.userID.toString()) {
    return next();
  } else
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
});
