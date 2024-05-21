const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const organizationRouter = require('./organization');

function route(app) {
    app.use('/user', userRouter);
    app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
}

module.exports = route;
