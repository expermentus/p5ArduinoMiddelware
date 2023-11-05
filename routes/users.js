var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');
const connectionManager = require('../connectionManager');

// Define the MQTT broker and port
const brokerAddress = 'mqtt://test.mosquitto.org';
const topic = 'real_unique_topic';

// Create an MQTT client
const client = mqtt.connect(brokerAddress);


/* GET users listing. */
router.get('/', function(req, res, next) {
  const connection = connectionManager.getConnection();

  // Query to select all devices from the 'devices' table
  const query = 'SELECT * FROM devices';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error loading devices:', error);
      res.status(500).send('Error loading devices');
    } else {
      // Do something with the retrieved devices (e.g., display them)
      res.render('heartBeat', { results: results });
    }
  });
});

module.exports = router;