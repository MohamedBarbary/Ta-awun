const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const commentController = require('../controller/commentController');

router.use(userAuthController.protectRoutes);

router
  .route('/')
  .post(commentController.createComment)
  .get(commentController.getAllComments);

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

router.patch(
  '/uploadCommentPhoto/:id',
  commentController.uploadCommentPhotos,
  commentController.updateCommentPhotos
);

module.exports = router;
