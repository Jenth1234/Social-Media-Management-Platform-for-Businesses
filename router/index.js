const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const organizationRouter = require('./organization');


const categoryRouter = require('./category');

const metadatacmtproductRouter = require('./metadata_cmt_product');


function route(app) {
    app.use('/user', userRouter);
    app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
    app.use('/metadatacmtproduct', metadatacmtproductRouter);
    app.use('/category', categoryRouter);
}

module.exports = route;
