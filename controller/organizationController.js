const catchAsyncError = require('../utils/catchAsyncErrors');
const Organization = require('./../models/organizationModel');
const controllersBuilder = require('../controller/controllersBuilder');
const cloudinary = require('cloudinary').v2;

const getImage = (imageName) => {
  const imageUrl = cloudinary.url(imageName, {
    width: 200,
    height: 200,
    crop: 'fill',
  });
  return imageUrl;
};

const filterObj = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getMyOrganization = (req, res, next) => {
  req.params.id = req.organization.id;
  next();
};
exports.updateMyOrganization = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('You are not allowed to change password here', 400)
    );
  }
  const filteredBody = filterObj(req.body, 'organizationName');
  if (req.file) {
    filteredBody.photo = req.file.filename;
    filteredBody.photoLink = getImage(req.file.filename);
  }
  const updatedOrganization = await Organization.findByIdAndUpdate(
    req.organization.id,
    filteredBody,
    {
      new: true,
      runValidator: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      organization: updatedOrganization,
    },
  });
});
exports.deleteMyOrganization = catchAsyncError(async (req, res, next) => {
  await Organization.findByIdAndUpdate(req.organization.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
  next();
});
exports.createOrganization = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Please use sign up to create a new organization ',
  });
};
exports.uploadMyOrganizationPhoto = controllersBuilder.uploadPhotoOrg(
  'organizationPhotos',
  'organization'
);

exports.getAllOrganizations = controllersBuilder.getAll(Organization);
exports.getOrganization = controllersBuilder.getOne(Organization);
exports.updateOrganization = controllersBuilder.updateOne(Organization);
exports.deleteOrganization = controllersBuilder.deleteOne(Organization);
