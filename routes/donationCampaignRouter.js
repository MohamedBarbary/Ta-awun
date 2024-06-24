const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/userAuthController');
const donationCampaignController = require('../controller/donationCampaignController');
const authController = require('../controller/builders/authBuilderController');

const {
  checkBlacklistTokens,
} = require('../controller/builders/authBuilderController');

router.use(checkBlacklistTokens, userAuthController.protectRoutes);

router.route('/').get(donationCampaignController.getAllDonationCampaigns);
router.route('/:id').get(donationCampaignController.getDonationCampaign);

router.use(authController.restrictToUserTypes('organization'));
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
  '/uploadtDonationCampaignPhoto/:id',
  donationCampaignController.isUserAuthorized,
  donationCampaignController.uploadCampaignPhotos,
  donationCampaignController.updateCampaignPhotos
);

module.exports = router;
