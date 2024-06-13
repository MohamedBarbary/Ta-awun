const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/userAuthController');
const followerController = require('../controller/followerController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);
router.route('/').get(followerController.getAllFollowers);
router.route('/:id').get(followerController.getFollower);

router
  .route('/')
  .post(followerController.isUserAuthorized, followerController.createFollower);

router
  .route('/:id')
  .delete(
    followerController.isUserAuthorized,
    followerController.deleteFollower
  );
module.exports = router;
