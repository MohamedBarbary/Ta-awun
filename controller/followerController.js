const Follower = require('../models/followerModel');
const catchAsyncErrors = require('../utils/catchAsyncErrors.js');
const controllersBuilder = require('./builders/controllersBuilder');
const popOptions = { path: 'followingID', select: 'userName photoLink' };

exports.createFollower = controllersBuilder.createOne(Follower,popOptions);
exports.getAllFollowers = controllersBuilder.getAll(Follower,popOptions);
exports.getFollower = controllersBuilder.getOne(Follower, popOptions);
exports.updateFollower = controllersBuilder.updateOne(Follower);
exports.deleteFollower = controllersBuilder.deleteOne(Follower);

exports.isUserAuthorized = catchAsyncErrors(async (req, res, next) => {
  if (req.model.role === 'admin') return next();

  if (req.method === 'POST' && req.model.id === req.body.userID) return next();
  else if (req.method === 'POST' && req.model.id !== req.body.userID)
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  const follower = await Follower.findById(req.params.id);
  if (!follower)
    return next(new AppError('no found follower with this id'), 404);
  if (req.model.id !== follower.userID.toString())
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );

  next();
});
