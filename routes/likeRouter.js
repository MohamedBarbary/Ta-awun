const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/userAuthController');
const likeController = require('../controller/likeController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);

router.route('/').get(likeController.getAllLikes);
router.route('/:id').get(likeController.getLike);

router
  .route('/')
  .post(likeController.isUserAuthorized, likeController.createLike);
router
  .route('/:id')
  .patch(likeController.isUserAuthorized, likeController.updateLike)
  .delete(likeController.isUserAuthorized, likeController.deleteLike);
module.exports = router;
