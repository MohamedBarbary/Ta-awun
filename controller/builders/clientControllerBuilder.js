const catchAsyncError = require('../../utils/catchAsyncErrors');
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
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};

exports.updateMe = (Model) =>
  catchAsyncError(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('you not allowed to change password here', 400));
    }
    const filteredBody = filterObj(req.body, 'userName');
    if (req.file) {
      filteredBody.photo = req.file.filename;
      filteredBody.photoLink = getImage(req.file.filename);
    }
    const updatedModel = await Model.findByIdAndUpdate(
      req.model.id,
      filteredBody,
      {
        new: true,
        runValidator: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        model: updatedModel,
      },
    });
  });

exports.deleteMe = (Model) =>
  catchAsyncError(async (req, res, next) => {
    await Model.findByIdAndUpdate(req.model.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
    next();
  });
