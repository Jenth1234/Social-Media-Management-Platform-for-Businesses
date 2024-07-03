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
app.use(cors({
  origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
  // origin: ["http://192.168.56.1:3001", "http://127.0.0.1:3001"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,authorization",
}));

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
