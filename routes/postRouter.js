const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const postController = require('../controller/postController');
const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);

router.route('/').get(postController.getAllPosts);
router.route('/:id').get(postController.getPost);

router
  .route('/')
  .post(postController.isUserAuthorized, postController.createPost);
router
  .route('/:id')
  .patch(postController.isUserAuthorized, postController.updatePost)
  .delete(postController.isUserAuthorized, postController.deletePost);

router.delete(
  '/deleteMyPost/:id',
  postController.isUserAuthorized,
  postController.deleteUserPost
);
router.patch(
  '/uploadPostPhoto/:id',
  postController.isUserAuthorized,
  postController.uploadPostPhotos,
  postController.updatePostPhotos
);

module.exports = router;

// remove authorization from controller builder
// implement getMy posts
// implement admin endpoints
