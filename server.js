const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const likeRouter = require('./routes/likeRouter');
const donationCampaignRouter = require('./routes/donationCampaignRouter');
const followingRouter = require('./routes/followingRouter');
const followerRouter = require('./routes/followerRouter');
const messageRouter = require('./routes/messageRouter');
const paymentRouter = require('./routes/paymentRouter');
const AppError = require('./utils/appError');
const connectDB = require('./utils/connectDB');
const { app, server } = require('./socket/socket');
const { protectRoutes } = require('../controller/userAuthController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

dotenv.config();
const PORT = process.env.PORT || 4003;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://api.stripe.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
      },
    },
  })
);

const limiter = rateLimit({
  max: 400,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from same IP , please try after a hour',
});
app.use('/api', limiter);
app.use(mongoSanitize());
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
app.use('/api/messages', messageRouter);
app.use('/api/payments', paymentRouter);
app.get('/donation-form', protectRoutes, checkBlacklistTokens, (req, res) => {
  res.render('index');
});
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(globalErrorHandler);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`);
});
