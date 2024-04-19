const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');
const userController = require('../controller/userController');
router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/editPassword/:token', authController.editPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.use(authController.protectRoutes);
router.get('/getMe', userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch(
  '/updateMe',
  userController.uploadMyPhoto,
  userController.updateMe
);
module.exports = router;
