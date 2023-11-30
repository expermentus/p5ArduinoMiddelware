var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var env = require('dotenv');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const connectionManager = require('./connectionManager');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');


global.arduinos = [];
global.insertedData = null;

var app = express();
app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')))
app.use(bodyParser.text());
app.use(morgan('combined'));

const mqtt = require('mqtt');

var options = {
  port: 1884,
  host: '13.53.38.141',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'mqtt',
  password: 'idiot',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
};
// Create an MQTT client
global.mqttClient = mqtt.connect('mqtt://13.53.38.141', options);

// Define the MQTT broker and port
const topics = ['/sensor/#', '/switch/#'] // Topics to subscribe to

global.mes = "Not defined yet";
global.mes2 = "Not defined yet";

global.listMes = ["1", "2", "3", "1", "2", "3", "3", "1", "2", "3"];
global.listMes2 = ["1", "2", "3", "1", "2", "3", "3", "1", "2", "3"];

const pool = connectionManager.getConnection();

// Callback function to handle incoming messages
mqttClient.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);

  // Extract device name from topic
  const topicParts = topic.split('/');


  const deviceName = topicParts[2];
  const dataName = topicParts[3]; // Assuming the data type is the last part of the topic


  // Query the device_id from the devices table using the deviceName
  const selectDeviceQuery = 'SELECT id FROM devices WHERE topic = ?';
  pool.query(selectDeviceQuery, [deviceName], (error, deviceRows) => {
    if (error) {
      console.error('Error querying device:', error);
      return;
    }

    if (deviceRows.length === 0) {
      console.error('Device not found:', deviceName);
      return;
    }

    if (topicParts[1] === 'sensor') {
      let deviceId = deviceRows[0].id;
      let reading = parseFloat(message.toString()); // Convert the message to a number
      insertSensorData(deviceId, dataName, reading);
    } else if (topicParts[1] === 'switch') {
      let deviceId = deviceRows[0].id;
      let reading = message.toString().split(','); // Convert the message to a number
      insertSwitchData(deviceId, dataName, reading[0].trim(), reading[1].trim());
    }



    // Insert data into sensor_data table

  });
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
// Function to insert data into sensor_data table
function insertSensorData(deviceId, dataName, reading) {
  const query = 'INSERT INTO sensor_data (device_id, data_name, reading) VALUES (?, ?, ?)';
  const values = [deviceId, dataName, reading];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error inserting into sensor_data:', error);
    } else {
      console.log('Inserted into sensor_data:', result.insertId);
    }
  });
}

function insertSwitchData(deviceId, dataName, reading, data_type) {
  const query = 'INSERT INTO switch_data (device_id, switch_name, reading, data_type) VALUES (?, ?, ?, ?)';
  const values = [deviceId, dataName, reading, data_type];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error inserting into switch_data:', error);
    } else {
      console.log('Inserted into switch_data:', result.insertId);
    }
  });
}
module.exports = app;
