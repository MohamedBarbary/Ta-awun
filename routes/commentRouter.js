const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const commentController = require('../controller/commentController');

router
  .route('/')
  .post(authController.protectRoutes, commentController.createComment)
  .get(authController.protectRoutes, commentController.getAllComments);
router
  .route('/:id')
  .get(authController.protectRoutes, commentController.getComment)
  .patch(authController.protectRoutes, commentController.updateComment)
  .delete(authController.protectRoutes, commentController.deleteComment);

module.exports = router;
