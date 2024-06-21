
    const express = require('express');
    const axios = require('axios');
    const app = express();
    const cors = require('cors');
    app.use(cors({
        origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // enable passing of cookies and HTTP credentials
        optionsSuccessStatus: 204,
        allowedHeaders: 'Content-Type,authorization',
    }));
    const bodyParser = require('body-parser');
    const dbConnect = require('./config/dbconnect');
    const multer = require('multer');
 
    app.use(bodyParser.urlencoded({ extended: true }));
    const route  = require('./router');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const upload = multer();
    route(app);
    dbConnect();
    const port = process.env.PORT || 3000;
    app.listen(port,() => {
        console.log(`Máy chủ đang chạy trên cổng ${port} `);
    });

