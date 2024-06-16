const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    dailyLimit: { type: Number, required: true, default: 5000 },
});
const= mongoose.model('Account', AccountSchema);