    const express = require('express');
    const axios = require('axios');
    const app = express();
    const bodyParser = require('body-parser');
    const dbConnect = require('./config/dbconnect');
    const multer = require('multer');
    app.use(bodyParser.urlencoded({ extended: true }));
    const route = require('./router');
    route(app);
    dbConnect();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Máy chủ đang chạy trên cổng ${port}`);
    });
