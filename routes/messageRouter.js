const express = require('express');
const { sendMessage, getMessages } = require('../controller/messageController');
const {
  protectRoutes,
} = require('../controller/authControllers/userAuthController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

const router = express.Router();
router.use(checkBlacklistTokens, protectRoutes);
router.get('/:id', getMessages);
router.post('/send/:id', sendMessage);

module.exports = router;
