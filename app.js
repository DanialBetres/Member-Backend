const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            orgs: [String!]!
        }

        type RootMutation {
            createOrg(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        orgs: () => {
            return ['List', "Of", "Orgs"]
        },

        createOrg: (args) => {
            return args.name
        }
    },
    graphiql: true
}));

app.listen(3000);