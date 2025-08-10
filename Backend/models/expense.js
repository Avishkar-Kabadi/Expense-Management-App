const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        enum: ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'],
        default: 'Other'
    },

    date: {
        type: Date,
        required: true
    },

    note: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
