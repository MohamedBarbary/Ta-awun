const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Please tell us your name!'],
      minLength: 8,
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
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'ذكر', 'أنثى'],
    },
    photo: {
      type: String,
    },
    photoLink: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    age: Number,
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  this.active = true;
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.userID = undefined;
  next();
});
userSchema.pre(/^find/, async function (next) {
  this.find({ active: true });
  next;
});
userSchema.methods.compareBcryptHashedCodes = async function (
  code,
  hashedCode
) {
  return await bcrypt.compare(code, hashedCode);
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
};
userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: 1 * 60 * 60 }
  );
  return verificationToken;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
