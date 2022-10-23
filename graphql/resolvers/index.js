const bcrypt = require("bcryptjs");

const Org = require('../../models/org')
const User = require('../../models/user')

const orgs = async (orgIds) => {
    try {
        const orgs = await Org.find({ _id: { $in: orgIds } });

        return orgs.map((org) => {
            return {
                ...org._doc,
                _id: org.id,
                creator: user.bind(this, org.creator)
            }
        })
    } catch (err) {
        throw err;
    }
}

const user = async (userId) => {
    try {
        const user = await User.findById(userId);

        return { 
            ...user._doc, 
            _id: user.id,
            createdOrgs: orgs.bind(this, user._doc.createdOrgs)
        };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    orgs: async () => {
        try {
            const orgs = await Org.find();

            return orgs.map((org) => {
                return {
                    ...org._doc,
                    _id: org.id,
                    creator: user.bind(this, org._doc.creator)
                };
            })
        } catch (err) {
            throw err
        }
    },

    createOrg: async (args) => {
        const org = new Org({
            name: args.orgInput.name,
            tiers: args.orgInput.tiers,
            creator: "6354f5f6d9fde355cc39e9c6"
        });

        try {
            const orgSaveRes = await org.save();
    
            const createdOrg = {
                ...orgSaveRes._doc,
                _id: orgSaveRes._doc._id.toString(),
                creator: user.bind(this, orgSaveRes._doc.creator)
            };
    
            const curUser = await User.findById('6354f5f6d9fde355cc39e9c6');
    
            if (!curUser) {
                throw new Error("User doesn't exist"); 
            }
    
            curUser.createdOrgs.push(org);
            await curUser.save();
    
            return createdOrg;
        } catch (err) {
            throw err;
        }
    },

    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error("User exists already.")
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const newUser = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashedPassword
            })

            const userSaveRes = await newUser.save()

            return {
                ...userSaveRes._doc,
                password: null,
                _id: userSaveRes.id
            }

        } catch (err) {
            throw err;
        }
    }
}