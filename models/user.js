const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    passwordHash: String,
    memberships: [
        {
            orgName: String,
            ordId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Org'
            },
            tierIndex: Number,
            tierName: String,
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;