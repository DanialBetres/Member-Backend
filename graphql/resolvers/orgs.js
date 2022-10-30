const Org = require('../../models/org');
const User = require("../../models/user");

const { transformOrg } = require('./merge');

module.exports = {
    orgs: async () => {
        try {
            const orgs = await Org.find();

            return orgs.map((org) => transformOrg(org));
        } catch (err) {
            throw err
        }
    },

    createOrg: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }



        const org = new Org({
            name: args.orgInput.name,
            tiers: args.orgInput.tiers,
            creator: req.userId
        });

        try {
            const orgSaveRes = await org.save();
    
            const createdOrg = transformOrg(orgSaveRes);
    
            const curUser = await User.findById(req.userId);
    
            if (!curUser) {
                throw new Error("User doesn't exist"); 
            }
    
            curUser.createdOrgs.push(org);
            await curUser.save();
    
            return createdOrg;
        } catch (err) {
            throw err;
        }
    }
}