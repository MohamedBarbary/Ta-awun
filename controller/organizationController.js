const Organization = require('./../models/organizationModel');
const controllersBuilder = require('./builders/controllersBuilder');
const clientControllerBuilder = require('./builders/clientControllerBuilder');
exports.getMyOrganization = (req, res, next) => {
  req.params.id = req.organization.id;
  next();
};

exports.createOrganization = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Please use sign up to create a new organization ',
  });
};
exports.uploadMyOrganizationPhoto = controllersBuilder.uploadPhoto(
  'organizationPhotos',
  'organization'
);
exports.updateMyOrg = clientControllerBuilder.updateMe(Organization);
exports.deleteMyOrg = clientControllerBuilder.deleteMe(Organization);
exports.getAllOrganizations = controllersBuilder.getAll(Organization);
exports.getOrganization = controllersBuilder.getOne(Organization);
exports.updateOrganization = controllersBuilder.updateOne(Organization);
exports.deleteOrganization = controllersBuilder.deleteOne(Organization);
