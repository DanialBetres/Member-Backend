const Org = require("../../models/org")
const User = require("../../models/user")
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

    membershipByOrgId: async (args) => {
        try {
            const org = await Org.findById(args.orgId);

            if (!org) {
                throw new Error("Org does not exist.");
            }

            const fetchedMemberships = await Membership.find({ org: args.orgId });

            return fetchedMemberships.map((membership) => transformMembership(membership));
        } catch (err) {
            throw err;
        }
    },

    membershipByUserId: async (args) => {
        try {
            const user = await User.findById(args.userId);

            if (!user) {
                throw new Error("User does not exist.");
            }

            const fetchedMemberships = await Membership.find({ user: args.userId });

            return fetchedMemberships.map((membership) => transformMembership(membership));
        } catch (err) {
            throw err;
        }
    },

    membershipById: async (args) => {
        try {
            const fetchedMembership = await Membership.findOne({ _id: args.membershipId });

            if (!fetchedMembership) {
                throw new Error("Membership does not exist.");
            }

            return transformMembership(fetchedMembership);
        } catch (err) {
            throw err;
        }
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