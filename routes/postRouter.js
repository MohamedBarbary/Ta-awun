const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const postController = require('../controller/postController');

router.use(userAuthController.protectRoutes);
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
