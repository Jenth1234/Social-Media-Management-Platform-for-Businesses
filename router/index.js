const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const organizationRouter = require('./organization');
const metadatacmtproductRouter = require('./metadatacmtproduct');
const categoryRouter = require('./category');

function route(app) {
    app.use('/user', userRouter);
    app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
    app.use('/metadatacmtproduct', metadatacmtproductRouter);
    app.use('/category', categoryRouter);
}

module.exports = route;
