const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Org = require('../../models/org');
const Membership = require('../../models/membership')

const { transformOrg } = require('./merge');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();

            return users.map((user) => ({ ...user._doc, password: null, _id: user.id }));
        } catch (err) {
            throw err
        }
    }, 

    userById: async (args) => {
        try {
            const user = await User.findById(args.userId);

            if (!user) {
                return null;
            }

            return { ...user._doc, password: null, _id: user.id };
        } catch (err) {
            throw err
        }
    },

    userAdminOrgs: async (args) => {
        try {
            const user = await User.findById(args.userId);

            if (!user) {
                throw new Error('User does not exist.')
            }

            const fetchedMemberships = await Membership.find({ user: args.userId, isAdmin: true });

            const orgIds = fetchedMemberships.map((membership) => membership.org._id.toString());
            const uniqueOrgIds = [...new Set(orgIds)]

            return uniqueOrgIds.map(async (orgId) => {
                const org = await Org.findById(orgId);
                
                if (!org) {
                    throw new Error('Org does not exist.')
                }

                return transformOrg(org);
            });
        } catch (err) {
            throw err
        }
    },

    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error("User exists already.");
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const newUser = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashedPassword
            });

            const userSaveRes = await newUser.save();

            return {
                ...userSaveRes._doc,
                password: null,
                _id: userSaveRes.id
            };
        } catch (err) {
            throw err;
        }
    },

    deleteUser: async (args, req) => {
        try {
            const user = await User.findById(args.userId).populate('createdOrgs');

            if (!user) {
                throw new Error("User does not exist");
            }

            // Delete all Orgs that the user created
            await Org.deleteMany({ creator: { _id: args.userId } });

            // Delete all the user's Memberships
            await Membership.deleteMany({ user: { _id: args.userId } });

            // Delete User
            await user.deleteOne({ _id: args.userId })

            return {
                ...user._doc,
                password: null,
                _id: user.id
            };
        } catch (err) {
            throw err;
        }
    },

    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new Error("Login Unsuccesfull: User not found")
            }

            const passwordMatched = await bcrypt.compare(password, user.password);

            if (!passwordMatched) {
                throw new Error("Login Unsuccesfull: Wrong Password")
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, 'someSuperSecretKey', {
                expiresIn: '1h'
            });

            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }
        } catch (err) {
            throw err;
        }
    }
}