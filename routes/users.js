var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');

// Define the MQTT broker and port
const brokerAddress = 'mqtt://test.mosquitto.org';
const topic = 'real_unique_topic';

// Create an MQTT client
const client = mqtt.connect(brokerAddress);


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(mes)
  res.render('heartBeat', { title: 'HB' });
});

module.exports = router;
