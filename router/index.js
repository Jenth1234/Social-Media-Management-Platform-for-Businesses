const userRouter = require('./user');
const commentRouter = require('./comment');
const organizationRouter = require('./organization');
const azureRouter = require('./azure');

function route(app) {
    app.use('/user', userRouter);
    app.use('/comment', commentRouter);
    app.use('/organization', organizationRouter);
    app.use('/azure',azureRouter );
}
module.exports = route;
