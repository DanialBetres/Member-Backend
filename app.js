const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const config = require('./utils/config')

const isAuth = require('./middleware/is-auth');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB. App running on port: ' + config.PORT + ".")
        app.listen(config.PORT)
    })
    .catch((err) => {
        console.log(err)
    })