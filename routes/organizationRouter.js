const express = require('express');
const router = express.Router();
const organizationAuthController = require('../controller/authControllers/organizationAuthController');
const organizationController = require('../controller/organizationController');

router.post('/signUp', organizationAuthController.signUp);
router.post('/login', organizationAuthController.login);
router.post('/forgotPassword', organizationAuthController.forgotPassword);
router.get('/editPassword/:token', organizationAuthController.editPassword);
router.post('/resetPassword/:token', organizationAuthController.resetPassword);
router.use(organizationAuthController.protectRoutes);
router.get(
  '/getMyOrganization',
  organizationController.getMyOrganization,
  organizationController.getOrganization
);
router.delete(
  '/deleteMyOrganization',
  organizationController.deleteMyOrganization
);
router.patch(
  '/updateMyOrganization',
  organizationController.uploadMyOrganizationPhoto,
  organizationController.updateMyOrganization
);
module.exports = router;
