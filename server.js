const express = require('express');
const bodyParser = require('body-parser');
const route = require('./router');
require('dotenv').config();
const morgan = require('morgan');
const db = require('./config/dbconnect');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('combined'));

route(app);
db();
app.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port}`);
});
