const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    accountType: { 
        type: String, 
        required: true, 
        enum: ['student', 'savings', 'current'] 
    },
    balance: { type: Number, required: true, default: 0 },
    dailyLimit: { type: Number, required: true },
    accountNumber: { type: String, unique: true, required: true }, // New field
    createdAt: { type: Date, default: Date.now },
});

const accountModel = mongoose.model('Account', AccountSchema);

module.exports = accountModel;