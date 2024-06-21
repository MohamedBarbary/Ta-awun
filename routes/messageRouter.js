const express = require('express');
const {
  sendMessage,
  // getMessages,
  getAllConversations,
} = require('../controller/messageController');
const { protectRoutes } = require('../controller/userAuthController');

const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

const router = express.Router();
router.use(checkBlacklistTokens, protectRoutes);

// router.get('/:id', getMessages);
router.post('/send/:id', sendMessage);
router.get('/all', getAllConversations);

module.exports = router;
