const Following = require('../models/followingModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const controllersBuilder = require('./builders/controllersBuilder');
const popOptions = [
  {
    path: 'followingID',
    select: 'userName photoLink',
  },
  {
    path: 'userID',
    select: 'userName photoLink',
  },
];

exports.createFollowing = controllersBuilder.createOne(Following, popOptions);
exports.getAllFollowings = controllersBuilder.getAll(Following, popOptions);
exports.getFollowing = controllersBuilder.getOne(Following, popOptions);
exports.updateFollowing = controllersBuilder.updateOne(Following, popOptions);
exports.deleteFollowing = controllersBuilder.deleteOne(Following);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const following = await Following.findById(req.params.id);
  if (!following)
    return next(new AppError('no found following with this id'), 404);
  if (req.model.id !== following.userID.toString())
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});
