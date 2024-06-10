const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const followingController = require('../controller/followingController');

router.use(userAuthController.protectRoutes);

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
