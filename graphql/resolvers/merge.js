const Org = require("../../models/org");
const User = require("../../models/user");

const { dateToString } = require('../../utils/date');

const transformOrg = (org) => {
    return {
        ...org._doc,
        _id: org.id,
        creator: user.bind(this, org.creator)
    };
}

const transformMembership = (membership) => {
    return { 
        ...membership._doc, 
        _id: membership.id,
        user: user.bind(this, membership._doc.user),
        org: singleOrg.bind(this, membership._doc.org),
        createdAt: dateToString(membership._doc.createdAt),
        updatedAt: dateToString(membership._doc.updatedAt),
        expiry: dateToString(membership._doc.expiry)
    };
}

const orgs = async (orgIds) => {
    try {
        const orgs = await Org.find({ _id: { $in: orgIds } });

        return orgs.map((org) => transformOrg(org));
    } catch (err) {
        throw err;
    }
}

const singleOrg = async (orgId) => {
    try {
        const org = await Org.findById(orgId);

        return transformOrg(org);
    } catch (err) {
        throw err;
    }
}

const user = async (userId) => {
    try {
        const user = await User.findById(userId);

        return { 
            ...user._doc, 
            _id: user.id,
            createdOrgs: orgs.bind(this, user._doc.createdOrgs)
        };
    } catch (err) {
        throw err;
    }
}

// exports.orgs = orgs
// exports.singleOrg = singleOrg
exports.user = user
exports.transformOrg = transformOrg;
exports.transformMembership = transformMembership;