const Donation_Request = require('../models/donation_requestModel');
const controllersBuilder = require('./controllersBuilder');

exports.createDonation_Request = controllersBuilder.createOne(Donation_Request);
exports.getAllDonation_Requests = controllersBuilder.getAll(Donation_Request);
exports.getDonation_Request = controllersBuilder.getOne(Donation_Request);
exports.updateDonation_Request = controllersBuilder.updateOne(Donation_Request);
exports.deleteDonation_Request = controllersBuilder.deleteOne(Donation_Request);
