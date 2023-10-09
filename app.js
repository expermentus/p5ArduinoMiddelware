var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var env = require('dotenv');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

const mqtt = require('mqtt');

// Define the MQTT broker and port
const brokerAddress = 'mqtt://test.mosquitto.org';
const topic = 'real_unique_topic';




// Create an MQTT client
const client = mqtt.connect(brokerAddress);

// Callback function to handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
  global.mes = message.toString();
});

// Connect to the MQTT broker
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic);
});

// Handle errors
client.on('error', (error) => {
  console.error(`Error: ${error}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//const connectionManager = require('./connectionManager');
const fs = require("fs"); // Replace with the actual path to your ConnectionManager module

//const connection = connectionManager.getConnection();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
