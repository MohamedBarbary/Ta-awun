const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const postController = require('../controller/postController');
const controllersBuilder = require('../controller/controllersBuilder');

router.use(authController.protectRoutes);
router
  .route('/')
  .post(postController.createPost)
  .get(postController.getAllPosts);
router
  .route('/:id')
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

router.delete('/deleteMyPost/:id', postController.deleteUserPost);
router.patch(
  '/uploadPostPhoto/:id',
  postController.uploadPostPhotos,
  postController.updatePostPhotos
);
module.exports = router;
