const Account = require('../models/account');
const Transaction = require('../models/transaction');

const getAllAccounts = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
};

const crypto = require('crypto');


// Function to generate a 10-digit random account number
const generateAccountNumber = async () => {
    let accountNumber;
    let accountExists = true;

    while (accountExists) {
        accountNumber = crypto.randomInt(1000000000, 9999999999).toString();
        accountExists = await Account.exists({ accountNumber });
    }

    return accountNumber;
};

const createAccount = async (req, res) => {
    const { firstName, lastName, age, accountType } = req.body;

    // Validate account type and set daily limit
    let dailyLimit;
    switch(accountType) {
        case 'student':
            dailyLimit = 50000;
            break;
        case 'savings':
            dailyLimit = 50000;
            break;
        case 'current':
            dailyLimit = 100000;
            break;
        default:
            return res.status(400).json({ message: 'Invalid account type' });
    }

    // Generate a unique account number
    const accountNumber = await generateAccountNumber();

    // Create new account with initial balance set to 0
    const newAccount = new Account({
        firstName,
        lastName,
        age,
        accountType,
        balance: 0, // Initial balance set to zero
        dailyLimit,
        accountNumber
    });

    try {
        const account = await newAccount.save();
        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: 'Error creating account', error });
    }
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