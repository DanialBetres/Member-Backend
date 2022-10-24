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

    createOrg: async (args) => {
        const org = new Org({
            name: args.orgInput.name,
            tiers: args.orgInput.tiers,
            creator: "6356468826e36f3e53ad6a00"
        });

        try {
            const orgSaveRes = await org.save();
    
            const createdOrg = transformOrg(orgSaveRes);
    
            const curUser = await User.findById('6356468826e36f3e53ad6a00');
    
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