const Transaction = require('../models/transaction');

module.exports = async (req, res, next) => {
    const { id } = req.params;
    const amount = req.body.amount;
    const transactions = await Transaction.find({
        accountId: id,
        type: 'withdrawal',
        date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const totalWithdrawals = transactions.reduce((sum, t) => sum + t.amount, 0);
    if (totalWithdrawals + amount > req.account.dailyLimit) {
        return res.status(400).json({ message: 'Daily withdrawal limit exceeded' });
    }
    next();
};