const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const commentController = require('../controller/commentController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);

router.route('/').get(commentController.getAllComments);
router.route('/:id').get(commentController.getComment);

router
  .route('/')
  .post(commentController.isUserAuthorized, commentController.createComment);

router
  .route('/:id')
  .patch(commentController.isUserAuthorized, commentController.updateComment)
  .delete(commentController.isUserAuthorized, commentController.deleteComment);

router.patch(
  '/uploadCommentPhoto/:id',
  commentController.isUserAuthorized,
  commentController.uploadCommentPhotos,
  commentController.updateCommentPhotos
);

module.exports = router;

// remove authorization from controller builder
// implement admin endpoints
// get comments of post
