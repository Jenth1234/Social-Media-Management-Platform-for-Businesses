const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const organizationRouter = require('./organization');

console.log('userRouter:', userRouter);
console.log('commentRouter:', commentRouter);
console.log('organizationRouter:', organizationRouter);

function route(app) {
    app.use('/user', userRouter);
    app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
}

module.exports = route;
