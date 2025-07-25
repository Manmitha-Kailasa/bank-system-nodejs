const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/lend', loanController.createLoan);
router.post('/payment/:loanId', loanController.makePayment);
router.get('/ledger/:loanId', loanController.getLedger);
router.get('/overview/:customerId', loanController.getAccountOverview);

module.exports = router;
