const Org = require("../../models/org")
const Membership = require("../../models/membership");

const { transformOrg, transformMembership } = require('./merge')

module.exports = {
    memberships: async () => {
        try {
            const memberships = await Membership.find();

            return memberships.map((membership) => transformMembership(membership));
        } catch (err) {
            throw err;
        }
    },

    addMembership: async (args) => {
        try {
            const fetchedOrg = await Org.findOne({ _id: args.membershipInput.orgId });

            if (!fetchedOrg) {
                throw new Error("Org does not exist");
            }

            const membership = new Membership({
                org: fetchedOrg,
                user: "6356468826e36f3e53ad6a00",
                tierIndex: args.membershipInput.tierIndex
            });

            const result = await membership.save();

            return transformMembership(result);
        } catch (err) {
            throw err;
        }
    },

    removeMembership: async (args) => {
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