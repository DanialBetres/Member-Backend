const mongoose = require('mongoose')

const orgSchema = new mongoose.Schema({
    orgName: String,
    orgId: String,
    tiers: [ String ],
    members: [
        {
            firstname: String,
            lastname: String,
            userId:  {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            tierIndex: Number
        }
    ]
    
})

orgSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Org = mongoose.model('Note', orgSchema);

module.exports = Org