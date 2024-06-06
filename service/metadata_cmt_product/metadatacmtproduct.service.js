const MetadataCmtProduct = require('../../models/metadata_cmt_product/metadatacmtproduct.model');

class METADATA_CMT_PRODUCT_SERVICE {
    updateCmtCount = async (PRODUCT_ID, ORGANIZATION_ID, count) => {
        const comment_count = await MetadataCmtProduct.updateOne(
            { PRODUCT_ID, ORGANIZATION_ID },
            { $inc: { COMMENT_COUNT: count } },
            { upsert: true }
        );
        return comment_count;
    }
}

module.exports = new METADATA_CMT_PRODUCT_SERVICE();