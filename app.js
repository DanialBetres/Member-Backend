const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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