var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var env = require('dotenv');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');


global.arduinos = [];
global.insertedData = null;

var app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.text());


const mqtt = require('mqtt');

var options = {
  port: 1884,
  host: 'test.mosquitto.org',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'rw',
  password: 'readwrite',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
};
// Create an MQTT client
global.mqttClient = mqtt.connect('mqtt://test.mosquitto.org', options);

// Define the MQTT broker and port
const topics = ['middelware_temperature_topic', 'middelware_humidity_topic']; // Topics to subscribe to



global.mes = "Not defined yet";
global.mes2 = "Not defined yet";

global.listMes = ["1", "2", "3", "1", "2", "3", "3", "1", "2", "3"];
global.listMes2 = ["1", "2", "3", "1", "2", "3", "3", "1", "2", "3"];



// Callback function to handle incoming messages
mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
  if (topic.toString() === 'middelware_temperature_topic'){
    global.mes =  message.toString();
    listMes.push(mes)
    if (listMes.length > 10) {
      listMes.shift(); // Remove the oldest item
    }
  } else {
    global.mes2 = message.toString();
    listMes2.push(mes2)
    if (listMes2.length > 10) {
      listMes2.shift(); // Remove the oldest item
    }
  }

});


// Connect to the MQTT broker
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to the specified topics
  topics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${topic}`);
      } else {
        console.error(`Failed to subscribe to topic ${topic}: ${err}`);
      }
    });
  });
});

// Handle errors
mqttClient.on('error', (error) => {
  console.error(`Error connecting to MQTT broker: ${error}`);
});

// Handle errors
mqttClient.on('error', (error) => {
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
app.use('/api', apiRouter);

const connectionManager = require('./connectionManager');
const fs = require("fs"); // Replace with the actual path to your ConnectionManager module

const connection = connectionManager.getConnection();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/listMes', function(req, res, next) {
  res.json(listMes);
});

app.get('/listMes2', function(req, res, next) {
  res.json(listMes2);
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
