const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
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