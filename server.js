const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const likeRouter = require('./routes/likeRouter');
const donationCampaignRouter = require('./routes/donationCampaignRouter');
const followingRouter = require('./routes/followingRouter');
const followerRouter = require('./routes/followerRouter');
const messageRoutes = require('./routes/messageRouter');
const AppError = require('./utils/appError');
const connectDB = require('./utils/connectDB');
const { app, server } = require('./socket/socket');

const PORT = process.env.PORT || 4003;
dotenv.config();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/donationCampaigns', donationCampaignRouter);
app.use('/api/followings', followingRouter);
app.use('/api/followers', followerRouter);
app.use('/api/messages', messageRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(globalErrorHandler);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`);
});
