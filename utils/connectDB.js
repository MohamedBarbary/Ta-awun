const mongoose = require('mongoose');
const dotenv = require('dotenv');
const catchAsyncErrors = require('./catchAsyncErrors');
mongoose.set('strictQuery', false);
dotenv.config();

const connectDB = catchAsyncErrors(async (req, res, next) => {
  let connectDBLink;
  if (process.env.NODE_ENV === 'development') {
    connectDBLink = await mongoose.connect(process.env.Mongo_Atlas);
  } else if (process.env.NODE_ENV === 'production') {
    connectDBLink = await mongoose.connect(process.env.Mongo_Atlas);
  }
  // connectDBLink = await mongoose.connect(process.env.Mongo_Atlas);

  console.log(`db okay ${connectDBLink.connection.host}`);
});

module.exports = connectDB;
