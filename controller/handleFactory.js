const catchAsyncErrors = require('./../utils/catchAsyncErrors.js');
const AppError = require('./../utils/appError');
const apiFeatures = require('./../utils/apiFeatures.js');
const cloudinary = require('cloudinary').v2;
const { storage } = require('../utils/imagesHandler');
const multer = require('multer');

const getImage = (imageName) => {
  const imageUrl = cloudinary.url(imageName, {
    width: 200,
    height: 200,
    crop: 'fill',
  });
  return imageUrl;
};

exports.uploadphoto = (folderName) => {
  return (req, res, next) => {
    const fileName = `user-${req.user.id}-${Date.now()}`;
    const multerStorage = storage(fileName, folderName);
    const upload = multer({ storage: multerStorage }).single('photo');
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to upload photo.' });
      }
      next();
    });
  };
};

exports.getAll = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const features = new apiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limit()
      .pagination();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
exports.deleteOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      new AppError('no document found with this data');
    }
    res.status(204).json({
      status: 'success',
      document,
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('no doc found with this id'), 404);
    }
    if (doc.photo) {
      doc.photoLink = getImage(doc.photo);
      await doc.save({ validateBeforeSave: false });
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        document: newDocument,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('no found document with this id'), 404);
    }
    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  });
