const Account = require('../models/account');

module.exports = async (req, res, next) => {
    const { id } = req.params;
    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        req.account = account;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error fetching account', error });
    }
};