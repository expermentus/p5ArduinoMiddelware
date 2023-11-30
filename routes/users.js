var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');
const connectionManager = require('../connectionManager');


router.get('/', function(req, res, next) {
  const connection = connectionManager.getConnection();

  // Query to select all devices from the 'devices' table
  const devicesQuery = 'SELECT * FROM devices';

  // Query to select data from the 'sensor_data' table joined with 'devices'
  const sensorDataQuery = 'SELECT devices.name AS device_name, sensor_data.data_name, sensor_data.reading FROM devices RIGHT JOIN sensor_data ON devices.id = sensor_data.device_id';

  // Query to select data from the 'sensor_data' table joined with 'devices'
  const switchQuery = 'SELECT * FROM switch_data';


  // Execute both queries using Promise.all
  Promise.all([
    queryPromise(connection, devicesQuery),
    queryPromise(connection, sensorDataQuery),
    queryPromise(connection, switchQuery)
  ])
      .then(([devicesResults, sensorDataResults, switchResults]) => {
        res.render('dataInput', { devices: devicesResults, sensorData: sensorDataResults, switchData: switchResults });
      })
      .catch(error => {
        console.error('Error loading data:', error);
        res.status(500).send('Error loading data');
      });
});

// Function to execute a query and return a promise
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