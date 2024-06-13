const Joi = require('joi');

// Define Joi schema for your data
const schema = Joi.object({
    PACKAGE_ID: Joi.string().required(),
    
});


const data = {
    ORGANIZATION_ID: 'your_organization_id',
    PACKAGE_ID: 'your_package_id'
};

// Validate the data against the schema
const validationResult = schema.validate(data);

// Check if there are any validation errors
if (validationResult.error) {
    console.error(validationResult.error.details[0].message);
} else {
    console.log("Data is valid.");
}
