const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const likeController = require('../controller/likeController');

router.use(userAuthController.protectRoutes);

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
