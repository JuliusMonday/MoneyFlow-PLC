const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
CONST = mongoose.model('Transaction', TransactionSchema);