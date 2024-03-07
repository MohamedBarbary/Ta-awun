const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const postController = require('../controller/postController');

router
  .route('/')
  .post(authController.protectRoutes, postController.createPost)
  .get(authController.protectRoutes, postController.getAllPosts);
router
  .route('/:id')
  .get(authController.protectRoutes, postController.getPost)
  .patch(authController.protectRoutes, postController.updatePost)
  .delete(authController.protectRoutes, postController.deletePost);
module.exports = router;
