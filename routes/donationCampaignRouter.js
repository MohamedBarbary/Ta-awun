const express = require('express');
const router = express.Router();
const organizationAuthController = require('../controller/authControllers/organizationAuthController');
const donationCampaignController = require('../controller/donationCampaignController');

router.use(organizationAuthController.protectRoutes);

router.route('/').get(donationCampaignController.getAllDonationCampaigns);
router.route('/:id').get(donationCampaignController.getDonationCampaign);
router
  .route('/')
  .post(
    donationCampaignController.isUserAuthorized,
    donationCampaignController.createDonationCampaign
  );
router
  .route('/:id')
  .patch(
    donationCampaignController.isUserAuthorized,
    donationCampaignController.updateDonationCampaign
  )
  .delete(
    donationCampaignController.isUserAuthorized,
    donationCampaignController.deleteDonationCampaign
  );
router.patch(
  '/uploadPostPhoto/:id',
  donationCampaignController.isUserAuthorized,
  donationCampaignController.uploadCampaignPhotos,
  donationCampaignController.updateCampaignPhotos
);

module.exports = router;
