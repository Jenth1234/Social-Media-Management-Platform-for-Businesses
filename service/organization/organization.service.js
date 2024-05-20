const Organization = require('../../models/organization/organization.model');
class ORGANIZATION_SERVICE {
    reateOrganization = async (payload) => {
    try {
        // Create a new organization
        const newOrganization = new Organization(payload);
        // Save to the database
        await newOrganization.save();
        return newOrganization;
    } catch (error) {
        throw new Error('Unable to create organization: ' + error.message);
    }
};
}

module.exports = new ORGANIZATION_SERVICE_SERVICE();
