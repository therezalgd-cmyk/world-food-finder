const mongoose = require('mongoose');

const OAuthAccountSchema = new mongoose.Schema({
    tokens: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OAuthAccount', OAuthAccountSchema);
