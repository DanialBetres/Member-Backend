const bcrypt = require("bcryptjs");

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
    }
}