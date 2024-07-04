const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const dbConnect = require("./config/dbconnect");

const route = require("./router");

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://172.16.125.56:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Thêm 'Authorization' vào đây
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Cấu hình body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

dbConnect();

// Sử dụng router
route(app);

app.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
