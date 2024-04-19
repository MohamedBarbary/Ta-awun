const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const commentController = require('../controller/commentController');

router.use(authController.protectRoutes);

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
