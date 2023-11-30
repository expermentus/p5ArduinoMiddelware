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

router.post('/deviceSetup', async (req, res) => {
  try {
    const connection = connectionManager.getConnection();
    const { name, ssid, ssid_pass, serial } = req.body;
    const status = "Configured";
    let countSameName = 0;
    let topic;

    // Update existing device status to 'outdated' based on serial
    const updatesql = `UPDATE devices SET status = 'outdated' WHERE serial = '${serial}'`;
    const outdate = new Promise((resolve, reject) => {
      connection.query(updatesql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Wait for the outdate promise to complete before proceeding
    await outdate;

    // Check for devices with the same name
    const selectSql = `SELECT * FROM devices WHERE name = '${name}'`;
    const selectResults = await new Promise((resolve, reject) => {
      connection.query(selectSql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Count devices with the same name
    countSameName = selectResults.length;

    // Generate a unique topic based on the name and count
    topic = name + countSameName;
    topic = topic.replace(/[^a-zA-Z0-9]/g, '');

    // Insert data into the database
    const insertSql = 'INSERT INTO devices (name, ssid, topic, serial, status) VALUES (?, ?, ?, ?, ?)';
    const insertValues = [name, ssid, topic, serial, status];

    connection.query(insertSql, insertValues, (err, result) => {
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
      res.render('deviceSetup', { title: 'Device Setup Page', alert: 'Data stored successfully' });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


function queryPromise(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = router;
