const MetadataCmtProduct = require('../../models/metadata_cmt_product/metadatacmtproduct.model');
const MetadataCmtProduct_Service = require('../../service/metadata_cmt_product/metadatacmtproduct.service');

class MetadataCmtProduct_Controller {
    updateCommentCountController = async (req, res) => {
        try {
            const { PRODUCT_ID, ORGANIZATION_ID, count } = req.body;
            await MetadataCmtProduct_Service.updateCmtCount(PRODUCT_ID, ORGANIZATION_ID, count);
            res.status(200).json({ message: 'Comment count updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new MetadataCmtProduct_Controller();