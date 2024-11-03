const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    optionA: {
        type: String,
        required: true,
    },
    optionB: {
        type: String,
        required: true,
    },
    votesA: {
        type: Number,
        default: 0,
    },
    votesB: {
        type: Number,
        default: 0,
    },
    userId: {
        type: String,
        required: true, // Ensure a user is associated with the vote
    }
});

module.exports = mongoose.model('Vote', voteSchema);
