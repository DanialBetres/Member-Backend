const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Org {
        _id: ID!
        name: String!
        tiers: [String!]!
        creator: User!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        createdOrgs: [Org!]
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
`)