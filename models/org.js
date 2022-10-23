const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orgSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tiers: {
        type: [{
            type: String
        }],
        require: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Org', orgSchema);