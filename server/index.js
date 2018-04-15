//Main starting point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

//db setup 
mongoose.connect('mongodb://localhost/auth')

//app setup
const app = express();
app.use(morgan('combined')); //registering logging framework
app.use(bodyParser.json({type: '*/*'})); //registering body parser middleware, any request will be parsed to json
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port ', port);