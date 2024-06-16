const Account = require('../models/account');
const Transaction = require('../models/transaction');

const getAllAccounts = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
};

const createAccount = async (req, res) => {
    const newAccount = new Account(req.body);
    const account = await newAccount.save();
    res.status(201).json(account);
};

const getAccount = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
};

const deleteAccount = async (req, res) => {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json({ message: 'Account deleted' });
};

const updateAccount = async (req, res) => {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
};

const getAccountTransactions = async (req, res) => {
    const transactions = await Transaction.find({ accountId: req.params.id });
    res.json(transactions);
};

const withdraw = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    const amount = req.body.amount;
    if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    account.balance -= amount;
    await account.save();
    const transaction = new Transaction({ accountId: account._id, type: 'withdrawal', amount });
    await transaction.save();
    res.json(account);
};

const deposit = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    const amount = req.body.amount;
    account.balance += amount;
    await account.save();
    const transaction = new Transaction({ accountId: account._id, type: 'deposit', amount });
    await transaction.save();
    res.json(account);
};

const transfer = async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;
    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);
    if (!fromAccount || !toAccount) return res.status(404).json({ message: 'Account not found' });
    if (fromAccount.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    await fromAccount.save();
    await toAccount.save();
    const transaction = new Transaction({ accountId: fromAccount._id, type: 'transfer-out', amount });
    await transaction.save();
    const transactionIn = new Transaction({ accountId: toAccount._id, type: 'transfer-in', amount });
    await transactionIn.save();
    res.json({ fromAccount, toAccount });
};

module.exports = {
    getAllAccounts,
    createAccount,
    getAccount,
    deleteAccount,
    updateAccount,
    getAccountTransactions,
    withdraw,
    deposit,
    transfer
};