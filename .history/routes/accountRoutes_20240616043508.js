const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const fetchAccountMiddleware = require('../middlewares/fetchAccountMiddleware');
const dailyLimitMiddleware = require('../middlewares/dailyLimitMiddleware');
router.get('/', accountController.getAllAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccount);
router.delete('/:id', accountController.deleteAccount);
router.put('/:id', accountController.updateAccount);
router.get('/:id/transactions', accountController.getAccountTransactions);
router.post('/:id/withdraw', fetchAccountMiddleware, dailyLimitMiddleware, accountController.withdraw);
router.post('/:id/deposit', accountController.deposit);
router.post('/transfer', accountController.transfer);

module.exports = router;