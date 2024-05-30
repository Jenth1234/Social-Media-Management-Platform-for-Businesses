const MetadataCmtProduct = require('../../models/metadatacmtproduct/metadatacmtproduct.model');
const MetadataCmtProduct_Service = require('../../service/metadatacmtproduct/metadatacmtproduct.service');

class MetadataCmtProduct_Controller {
    updateCommentCountController = async (req, res) => {
        try {
            const { PRODUCT_ID, ORGANIZATION_ID, count } = req.body;
            const result = await MetadataCmtProduct_Service.updateCmtCount(PRODUCT_ID, ORGANIZATION_ID, count);
            res.status(200).json({ message: 'Comment count updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}

module.exports = new MetadataCmtProduct_Controller();