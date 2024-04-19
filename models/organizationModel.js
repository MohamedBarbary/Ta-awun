const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, 'Please tell us your name!'],
      minLength: 5,
      maxLength: 25,
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email!'],
      maxLength: 30,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please Enter your password!'],
      require: true,
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    verified: {
      type: Boolean,
      default: true,
    },
    websiteLink: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    photo: {
      type: String,
    },
    photoLink: {
      type: String,
      default: '',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

organizationSchema.pre('save', function (next) {
  this.active = true;
  next();
});

organizationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.userID = undefined;
  next();
});

organizationSchema.pre(/^find/, async function (next) {
  this.find({ active: true });
  next;
});

organizationSchema.methods.compareBcryptHashedCodes = async function (
  code,
  hashedCode
) {
  return await bcrypt.compare(code, hashedCode);
};

organizationSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
};

organizationSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
