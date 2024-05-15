const express = require('express');
const bodyParser = require('body-parser');

const dbConnect = require('./config/dbconnect');

require('dotenv').config();
 
const route = require('./router');
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());


dbConnect();



route(app);

app.listen(port, () => {
  console.log(`The server is running on the port${port}`);
});
