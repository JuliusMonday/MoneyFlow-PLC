const Account = require('../models/account');
const Transaction = require('../models/transaction');
const crypto = require('crypto');

const getAllAccounts = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
};

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

// Function to check balance by account ID
const checkBalanceById = async (accountId) => {
    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return { success: false, message: 'Account not found' };
        }
        return { success: true, balance: account.balance };
    } catch (error) {
        return { success: false, message: 'Error retrieving balance', error };
    }
};

// Function to check balance by account number
const checkBalanceByNumber = async (accountNumber) => {
    try {
        const account = await Account.findOne({ accountNumber });
        if (!account) {
            return { success: false, message: 'Account not found' };
        }
        return { success: true, balance: account.balance };
    } catch (error) {
        return { success: false, message: 'Error retrieving balance', error };
    }
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
    const account = req.account;
    const amount = req.body.amount;

    try {
        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        account.balance -= amount;
        await account.save();

        const transaction = new Transaction({ accountId: account._id, type: 'withdrawal', amount });
        await transaction.save();

        res.json(`Total amount of ₦${amount} was debited from the account; then total balance: ₦${account.balance}`);
    } catch (error) {
        res.status(500).json({ message: 'Error processing withdrawal', error });
    }
};

const deposit = async (req, res) => {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    const amount = req.body.amount;
    account.balance += amount;
    await account.save();
    const transaction = new Transaction({ accountId: account._id, type: 'deposit', amount });
    await transaction.save();
    res.json(`You deposited the sum of ₦${amount} to your account!!. Therefore your total money is ₦${account.balance}`);
};

const transfer = async (req, res) => {
    const { fromAccountId, toAccountNumber, amount } = req.body;

    try {
        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

        if (!fromAccount) {
            return res.status(404).json({ message: 'From account not found' });
        }
        
        if (!toAccount) {
            return res.status(404).json({ message: 'To account not found' });
        }

        if (fromAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save();
        await toAccount.save();

        const transactionOut = new Transaction({ accountId: fromAccount._id, type: 'transfer-out', amount });
        await transactionOut.save();

        const transactionIn = new Transaction({ accountId: toAccount._id, type: 'transfer-in', amount });
        await transactionIn.save();

        res.json(`The total amount of ₦${amount} was transferred from ${fromAccount.lastName} ${fromAccount.firstName} to ${toAccount.lastName} ${toAccount.firstName}.
        
        Total balance::: ₦${fromAccount.balance}.00`);
    } catch (error) {
        res.status(500).json({ message: 'Error processing transfer', error });
    }
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