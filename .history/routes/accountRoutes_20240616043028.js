const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

const accountController = require('../controllers/accountController');
const fetchAccountMiddleware = require('../middlewares/fetchAccountMiddleware');

router.get('/', accountController.getAllAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccount);
router.delete('/:id', accountController.deleteAccount);
router.put('/:id', accountController.updateAccount);
router.get('/:id/transactions', accountController.getAccountTransactions);
router.post('/:id/withdraw', dailyLimitMiddleware, accountController.withdraw);
router.post('/:id/deposit', accountController.deposit);
router.post('/transfer', accountController.transfer);

module.exports = router;