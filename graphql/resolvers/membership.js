const Org = require("../../models/org")
const Membership = require("../../models/membership");

const { transformOrg, transformMembership } = require('./merge')

module.exports = {
    memberships: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const memberships = await Membership.find();

            return memberships.map((membership) => transformMembership(membership));
        } catch (err) {
            throw err;
        }
    },

    /*
        membershipByOrgId(orgId: ID!): Membership
        membershipByUserId(userId: ID!): Membership
        membershipById(membershipId: ID!): Membership
    */

    membershipByOrgId: async (args) => {
        throw new Error("Implement")
        // Paused Because the above query for all memberships only displays memberships if user is authenticated. 
        // Decide new Behavior and then implement
    },

    membershipByUserId: async (args) => {
        throw new Error("Implement")
    },

    membershipById: async (args) => {
        throw new Error("Implement")
    },

    addMembership: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const fetchedOrg = await Org.findOne({ _id: args.membershipInput.orgId });

            if (!fetchedOrg) {
                throw new Error("Org does not exist");
            }

            const membership = new Membership({
                org: fetchedOrg,
                user: req.userId,
                tierIndex: args.membershipInput.tierIndex
            });

            const result = await membership.save();

            return transformMembership(result);
        } catch (err) {
            throw err;
        }
    },

    removeMembership: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const membership = await Membership.findById(args.membershipId).populate('org');
            
            if (!membership) {
                throw new Error("Membership does not exist");
            }

            const org = transformOrg(membership.org);

            await Membership.deleteOne({ _id: args.membershipId });

            return org;
        } catch (err) {
            throw err;
        }
    }
}