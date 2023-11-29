var express = require('express');
var router = express.Router();
const mqtt = require('mqtt');
const connectionManager = require('../connectionManager');


router.get('/', async function(req, res, next) {
  const connection = connectionManager.getConnection();
  // Query to select all devices from the 'devices' table
  const devicesQuery = 'SELECT * FROM devices';
  // Query to select data from the 'sensor_data' table joined with 'devices'
  const sensorDataQuery = 'SELECT devices.name AS device_name, sensor_data.data_name, sensor_data.reading FROM devices RIGHT JOIN sensor_data ON devices.id = sensor_data.device_id';
  try {
    // Execute both queries using Promise.all
    const [devicesResults, sensorDataResults] = await Promise.all([
      queryPromise(connection, devicesQuery),
      queryPromise(connection, sensorDataQuery)
    ]);
    // Render the view with the obtained results
    res.render('heartBeat', { devices: devicesResults, sensorData: sensorDataResults });
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).send('Error loading data');
  } finally {
    // Release the connection when done
    connection.close();
  }
});

// Function to execute a query and return a promise
async function queryPromise(connection, query) {
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