const Org = require("../../models/org")
const User = require("../../models/user")
const Membership = require("../../models/membership");

const { transformOrg, transformMembership } = require('./merge')
const { dateStringToDate } = require('../../utils/date');

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

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

        const jwtPayload = parseJWT(token);

        try {
            const fetchedOrg = await Org.findOne({ _id: args.membershipInput.orgId });

            if (!fetchedOrg) {
                throw new Error("Org does not exist");
            }

            const fetchedUser = await Org.findOne({ _id: args.membershipInput.userId });

            if (!fetchedUser) {
                throw new Error("User does not exist");
            }

            // Making sure that a request is being sent from authorized user
            const isCreator = (fetchedOrg.creator._id.toString() === jwtPayload.userId);
            const isAdmin = await Membership.findOne({ org: args.orgId, isAdmin: true, user: jwtPayload.userId});
            
            if (!(isCreator || isAdmin)) {
                throw new Error("Permission invalid.");
            }

            // Execute request
            const membership = new Membership({
                org: fetchedOrg,
                user: fetchedUser,
                tierIndex: args.membershipInput.tierIndex,
                isAdmin: args.membershipInput.isAdmin,
                expiry: dateStringToDate(args.membershipInput.expiry)
            });

            const result = await membership.save();

            return transformMembership(result);
        } catch (err) {
            throw err;
        }
    },

    updateMembership: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        try {
            const curMembership = await Org.findById(args.orgId);

            if (!curMembership) {
                throw new Error("Membership does not exist");
            }

            const orgUpdateRes = 
                await Org.findByIdAndUpdate(
                    args.orgId, 
                    { 
                        tierIndex: args.membershipInput.tierIndex,
                        isAdmin: args.membershipInput.isAdmin,
                        expiry: dateStringToDate(args.membershipInput.expiry)
                    },
                    { new: true }
                )
            
            return transformMembership(orgUpdateRes);
        } catch (err) {
            throw err
        }
    },

    removeMembership: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

        const jwtPayload = parseJWT(token);

        try {
            const membership = await Membership.findById(args.membershipId).populate('org');
            
            if (!membership) {
                throw new Error("Membership does not exist");
            }

            // Making sure that a request is being sent from authorized user
            const isCreator = (Org.findById(membership.org).creator._id.toString() === jwtPayload.userId);
            const isAdmin = await Membership.findOne({ org: args.orgId, isAdmin: true, user: jwtPayload.userId});
            
            if (!(isCreator || isAdmin)) {
                throw new Error("Permission invalid.");
            }

            // Execute request
            const org = transformOrg(membership.org);

            await Membership.deleteOne({ _id: args.membershipId });

            return org;
        } catch (err) {
            throw err;
        }
    }
}