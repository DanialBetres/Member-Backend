const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const Org = require('./models/org')
const User = require('./models/user')

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Org {
            _id: ID!
            name: String!
            tiers: [String!]!
        }

        type User {
            _id: ID!
            name: String!
            email: String!
            password: String
        }

        input OrgInput {
            name: String!
            tiers: [String!]!
        }

        input UserInput {
            name: String!
            email: String!
            password: String!
        }

        type RootQuery {
            orgs: [Org!]!
        }

        type RootMutation {
            createOrg(orgInput: OrgInput): Org
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        orgs: () => {
            return Org.find()
                .then((orgs) => {
                    return orgs.map((org) => {
                        return {
                            ...org._doc,
                            _id: org.id
                        };
                    })
                })
                .catch((err) => {
                    throw err
                })
        },

        createOrg: (args) => {
            const org = new Org({
                name: args.orgInput.name,
                tiers: args.orgInput.tiers,
                creator: "6354f5f6d9fde355cc39e9c6"
            })

            let createdOrg

            return org.save()
                .then((result) => {
                    createdOrg = {
                        ...result._doc,
                        _id: result.id
                    }

                    return User.findById('6354f5f6d9fde355cc39e9c6')
                })
                .then((user) => {
                    if (!user) {
                        throw new Error("User doesn't exist");
                    }

                    user.createdOrgs.push(org)
                    return user.save()
                })
                .then(() => {
                    return createdOrg
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                })
        },

        createUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then((user) => {
                    if (user) {
                        throw new Error("User exists already.")
                    }

                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then((hashedPassword) => {
                    const user = new User({
                        name: args.userInput.name,
                        email: args.userInput.email,
                        password: hashedPassword
                    })

                    return user.save()
                })
                .then((result) => {
                    return {
                        ...result._doc,
                        password: null,
                        _id: result.id
                    }
                })
                .catch((err) => {
                    throw err;
                })
        }
    },
    graphiql: true
}));

const DB_NAME = "member-dev"
mongoose
    .connect(`mongodb+srv://Member:HrC6UODWUzGYLClv@cluster0.dbjv1kp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to MongoDB. App running on port 3000.')
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
    })