const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const userController = require('../controller/userController');
router.post('/signUp', userAuthController.signUp);
router.post('/login', userAuthController.login);
router.get('/verify/:token', userAuthController.verify);
router.post('/forgotPassword', userAuthController.forgotPassword);
router.get('/editPassword/:token', userAuthController.editPassword);
router.post('/resetPassword/:token', userAuthController.resetPassword);
router.use(userAuthController.protectRoutes);
router.get('/getMe', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch(
  '/updateMe',
  userController.uploadMyPhoto,
  userController.updateMe
);
module.exports = router;
