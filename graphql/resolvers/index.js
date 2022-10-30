const orgResolver = require('./orgs');
const userResolver = require('./user');
const membershipResolver = require('./membership');

const rootResolver = {
    ...orgResolver,
    ...userResolver,
    ...membershipResolver
};

module.exports = rootResolver;