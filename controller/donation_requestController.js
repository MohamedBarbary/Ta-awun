const Donation_Request = require('../models/donation_requestModel');
const controllersBuilder = require('./builders/controllersBuilder');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const AppError = require('../utils/appError.js');

const popOptions = { path: 'userID', select: 'userName photoLink' };
exports.createDonation_Request = controllersBuilder.createOne(Donation_Request);
exports.getAllDonation_Requests = controllersBuilder.getAll(
  Donation_Request,
  popOptions
);
exports.getDonation_Request = controllersBuilder.getOne(
  Donation_Request,
  popOptions
);
exports.updateDonation_Request = controllersBuilder.updateOne(Donation_Request);
exports.deleteDonation_Request = controllersBuilder.deleteOne(Donation_Request);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const donationRequest = await Donation_Request.findById(req.params.id);
  if (!donationRequest)
    return next(new AppError('no Donation_Request found with this id'), 404);

  if (req.model.id === donationRequest.userID.toString()) {
    return next();
  } else
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
});
