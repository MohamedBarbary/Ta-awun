const express = require('express');
const router = express.Router();
const organizationAuthController = require('../controller/authControllers/organizationAuthController');
const organizationController = require('../controller/organizationController');
const authController = require('../controller/builders/authBuilderController');

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
router.delete('/deleteMyOrg', organizationController.deleteMyOrg);
router.patch(
  '/updateMyOrg',
  organizationController.uploadMyOrganizationPhoto,
  organizationController.updateMyOrg
);
router.use(authController.restrictTo('admin'));
router.route('/').get(organizationController.getAllOrganizations);
router
  .route('/:id')
  .get(organizationController.getOrganization)
  .patch(organizationController.updateOrganization)
  .delete(organizationController.deleteOrganization);
module.exports = router;
