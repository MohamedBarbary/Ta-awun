const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const userController = require('../controller/userController');
const authController = require('../controller/builders/authBuilderController');
router.post('/signUp', userAuthController.signUp);
router.post('/login', userAuthController.login);
router.get('/verify/:token', userAuthController.verify);
router.post('/forgotPassword', userAuthController.forgotPassword);
router.get('/editPassword/:token', userAuthController.editPassword);
router.post('/resetPassword/:token', userAuthController.resetPassword);
router.get('/logout', authController.logout);
router.use(userAuthController.protectRoutes);
router.get('/getMe', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch(
  '/updateMe',
  userController.uploadMyPhoto,
  userController.updateMe
);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
