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

    type Membership {
        _id: ID!
        org: Org!
        user: User!
        tierIndex: Int!
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
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

    input MembershipInput {
        orgId: ID!
        tierIndex: Int!
    }

    type RootQuery {
        orgs: [Org!]!
        orgById(orgId: ID!): Org
        users: [User!]!
        userById(userId: ID!): User
        memberships: [Membership!]!
        membershipByOrgId(orgId: ID!): Membership
        membershipByUserId(userId: ID!): Membership
        membershipById(membershipId: ID!): Membership
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createOrg(orgInput: OrgInput!): Org
        updateOrg(orgId: ID!, orgInput: OrgInput!): Org
        deleteOrg(orgId: ID!): Org!
        createUser(userInput: UserInput!): User
        deleteUser(userId: ID!): User!
        addMembership(membershipInput: MembershipInput!): Membership!
        removeMembership(membershipId: ID!): Org!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);