const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const membershipSchema = new Schema({
    org: {
        type: Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tierIndex: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Membership', membershipSchema)