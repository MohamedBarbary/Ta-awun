const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/userAuthController');
const followingController = require('../controller/followingController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);
router.route('/').get(followingController.getAllFollowings);
router.route('/:id').get(followingController.getFollowing);

router
  .route('/')
  .post(
    followingController.isUserAuthorized,
    followingController.createFollowing
  );

router
  .route('/:id')
  .delete(
    followingController.isUserAuthorized,
    followingController.deleteFollowing
  );
module.exports = router;
