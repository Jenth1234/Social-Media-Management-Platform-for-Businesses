const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const cors = require("cors");
const dbConnect = require("./config/dbconnect");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { BlobServiceClient } = require("@azure/storage-blob");
const route = require("./router");
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable passing of cookies and HTTP credentials
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type,authorization,organization_id",
  })
);


const { blobServiceClient } = require('./config/configAzure')
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

route(app);
dbConnect();


app.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port} `);
});
