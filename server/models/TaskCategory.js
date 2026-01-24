const mongoose = require('mongoose');

const TaskCategorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'blue'
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    lastCompletedDate: {
        type: Date,
        default: null
    },
    history: [{
        type: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique category name per user
TaskCategorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('TaskCategory', TaskCategorySchema);
