var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const env = require('dotenv');
const {getConnection} = require("../connectionManager");
const connectionManager = require("../connectionManager");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Arduino middelware' });
});

router.get('/update', function(req, res, next) {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  console.log(urlParams)
  const topic = urlParams.get('topic');
  console.log(topic);
  res.render('updateDeviceSoftware', { title: 'Arduino middleware', device_topic: topic });
});


router.get('/deviceSetup', function(req, res, next) {
  res.render('deviceSetup', { title: 'Device Setup Page', status: 'Discovered'});
  console.log(arduinos)
});

router.post('/deviceSetup', async(req, res) => {
  const connection = connectionManager.getConnection();
  const query = 'SELECT name FROM devices';
  const { name, ssid, ssid_pass, serial} = req.body;
  const status = "Configured"
  var countSameName = 0;
  var topic;

  connection.query(query, (error, results)=> {
    if (error) {
      console.error('Error loading devices:', error);
      res.status(500).send('Error loading devices');
      return;
    }

    const updatesql = `UPDATE devices SET status = 'outdated' WHERE serial = '${serial}'`;

    getConnection().query(updatesql, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).json({message: 'Error inserting data into the database'});
        return;
      }
      console.log('Data inserted into the database');
    })
  })

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error loading devices:', error);
      res.status(500).send('Error loading devices');
      return;
    }

    for (let i = 0; i < results.length; i++) {
      if (name === results[i].name) {
        countSameName += 1;
      }
    }
    topic = name + countSameName;
    topic = topic.replace(/[^a-zA-Z0-9]/g, '');

    // Insert data into the database
    const sql = 'INSERT INTO devices (name, ssid, topic, serial, status) VALUES (?, ?, ?, ?, ?)';
    const values = [name, ssid, topic, serial, status];

    getConnection().query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).json({ message: 'Error inserting data into the database' });
        return;
      }

      console.log('Data inserted into the database');
      insertedData = {
        choice: '1',
        ssid: ssid,
        password: ssid_pass,
        stopic: topic,
        serial: serial,
      };
      res.render('deviceSetup', { title: 'Device Setup Page', alert: 'data stored succesfully' });
    });
  });
});

module.exports = router;
