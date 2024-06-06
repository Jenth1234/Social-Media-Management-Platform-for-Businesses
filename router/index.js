const userRouter = require('./user');
// const commentRouter = require('./comment');
const organizationRouter = require('./organization');
const azureRouter = require('./azure');
const adminRouter = require('./admin');
const invoiceRouter = require('./invoice');
const paymentRouter = require('./payment');
const categoryRouter = require('./category');
const metadatacmtproductRouter = require('./metadata_cmt_product');

function route(app) {
    app.use('/user', userRouter);
    // app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
    app.use('/azure', azureRouter);
    app.use('/admin', adminRouter);
    app.use('/invoice', invoiceRouter);
    app.use('/payment', paymentRouter);
    app.use('/metadatacmtproduct', metadatacmtproductRouter);
    app.use('/category', categoryRouter);
}

module.exports = route;
