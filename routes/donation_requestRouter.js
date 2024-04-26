const express = require('express');
const router = express.Router();
const userAuthController = require('../controller/authControllers/userAuthController');
const donation_requestController = require('../controller/donation_requestController');

router.use(userAuthController.protectRoutes);
router
  .route('/')
  .post(donation_requestController.createDonation_Request)
  .get(donation_requestController.getAllDonation_Requests);
router
  .route('/:id')
  .get(donation_requestController.getDonation_Request)
  .patch(donation_requestController.updateDonation_Request)
  .delete(donation_requestController.deleteDonation_Request);

module.exports = router;