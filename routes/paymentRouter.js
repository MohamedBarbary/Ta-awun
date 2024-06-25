const express = require('express');
const { processPayment } = require('../controller/paymentController');
const { protectRoutes } = require('../controller/userAuthController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

const router = express.Router();
router.use(checkBlacklistTokens, protectRoutes);

router.post('/payment', processPayment);

module.exports = router;
