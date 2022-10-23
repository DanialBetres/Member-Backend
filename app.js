const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const Org = require('./models/org')

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Org {
            _id: ID!
            name: String!
            tiers: [String!]!
        }

        input OrgInput {
            name: String!
            tiers: [String!]!
        }

        type RootQuery {
            orgs: [Org!]!
        }

        type RootMutation {
            createOrg(orgInput: OrgInput): Org
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
                tiers: args.orgInput.tiers
            })

            return org.save()
                .then((result) => {
                    return {
                        ...result._doc,
                        _id: result.id
                    }
                })
                .catch((err) => {
                    console.log(err);
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